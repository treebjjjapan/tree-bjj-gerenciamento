
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Student, AttendanceRecord, FinancialRecord, Product, User, UserRole, 
  StudentStatus, BeltColor, Plan, ClassSchedule, GraduationRule 
} from './types';
import { INITIAL_STUDENTS, INITIAL_FINANCIAL, INITIAL_PRODUCTS } from './constants';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  addStudent: (student: Omit<Student, 'id' | 'attendanceCount' | 'graduationHistory'>) => void;
  updateStudent: (id: string, data: Partial<Student>) => void;
  attendance: AttendanceRecord[];
  addAttendance: (studentId: string, classId?: string) => void;
  financials: FinancialRecord[];
  setFinancials: React.Dispatch<React.SetStateAction<FinancialRecord[]>>;
  addFinancial: (record: Omit<FinancialRecord, 'id'>) => void;
  deleteFinancial: (id: string) => void;
  products: Product[];
  notifications: string[];
  plans: Plan[];
  setPlans: React.Dispatch<React.SetStateAction<Plan[]>>;
  schedules: ClassSchedule[];
  setSchedules: React.Dispatch<React.SetStateAction<ClassSchedule[]>>;
  graduationRules: GraduationRule[];
  setGraduationRules: React.Dispatch<React.SetStateAction<GraduationRule[]>>;
  importAppData: (jsonString: string) => boolean;
  exportAppData: () => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_PLANS: Plan[] = [
  { id: 'p1', name: 'Mensal', price: 10000, durationMonths: 1 },
  { id: 'p2', name: 'Trimestral', price: 27000, durationMonths: 3 },
  { id: 'p3', name: 'Semestral', price: 50000, durationMonths: 6 },
  { id: 'p4', name: 'Anual', price: 90000, durationMonths: 12 },
];

const DEFAULT_GRADUATION_RULES: GraduationRule[] = [
  { belt: BeltColor.WHITE, classesRequired: 40, monthsRequired: 4 },
  { belt: BeltColor.BLUE, classesRequired: 150, monthsRequired: 24 },
  { belt: BeltColor.PURPLE, classesRequired: 200, monthsRequired: 24 },
  { belt: BeltColor.BROWN, classesRequired: 250, monthsRequired: 12 },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('treebjj_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('treebjj_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem('treebjj_attendance');
    return saved ? JSON.parse(saved) : [];
  });

  const [financials, setFinancials] = useState<FinancialRecord[]>(() => {
    const saved = localStorage.getItem('treebjj_financials');
    return saved ? JSON.parse(saved) : INITIAL_FINANCIAL;
  });

  const [plans, setPlans] = useState<Plan[]>(() => {
    const saved = localStorage.getItem('treebjj_plans');
    return saved ? JSON.parse(saved) : DEFAULT_PLANS;
  });

  const [schedules, setSchedules] = useState<ClassSchedule[]>(() => {
    const saved = localStorage.getItem('treebjj_schedules');
    return saved ? JSON.parse(saved) : [];
  });

  const [graduationRules, setGraduationRules] = useState<GraduationRule[]>(() => {
    const saved = localStorage.getItem('treebjj_grad_rules');
    return saved ? JSON.parse(saved) : DEFAULT_GRADUATION_RULES;
  });

  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem('treebjj_students', JSON.stringify(students));
    localStorage.setItem('treebjj_financials', JSON.stringify(financials));
    localStorage.setItem('treebjj_attendance', JSON.stringify(attendance));
    localStorage.setItem('treebjj_plans', JSON.stringify(plans));
    localStorage.setItem('treebjj_schedules', JSON.stringify(schedules));
    localStorage.setItem('treebjj_grad_rules', JSON.stringify(graduationRules));
    if (currentUser) localStorage.setItem('treebjj_user', JSON.stringify(currentUser));
    else localStorage.removeItem('treebjj_user');
  }, [students, financials, attendance, currentUser, plans, schedules, graduationRules]);

  const addStudent = useCallback((newStudentData: Omit<Student, 'id' | 'attendanceCount' | 'graduationHistory'>) => {
    const newStudent: Student = {
      ...newStudentData,
      id: Math.random().toString(36).substr(2, 9),
      attendanceCount: 0,
      graduationHistory: [{ date: new Date().toISOString().split('T')[0], belt: newStudentData.belt, stripes: newStudentData.stripes }]
    };
    setStudents(prev => [newStudent, ...prev]);
  }, []);

  const updateStudent = useCallback((id: string, data: Partial<Student>) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        const updatedStudent = { ...s, ...data };
        if (data.belt !== undefined || data.stripes !== undefined) {
          updatedStudent.graduationHistory = [
            ...(s.graduationHistory || []),
            { date: new Date().toISOString().split('T')[0], belt: updatedStudent.belt, stripes: updatedStudent.stripes }
          ];
        }
        return updatedStudent;
      }
      return s;
    }));
  }, []);

  const addAttendance = useCallback((studentId: string, classId?: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const newRecord: AttendanceRecord = {
      id: Math.random().toString(36).substr(2, 9),
      studentId,
      studentName: student.name,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      classId,
      method: 'TOTEM'
    };

    setAttendance(prev => [newRecord, ...prev]);
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, attendanceCount: s.attendanceCount + 1 } : s));
  }, [students]);

  const addFinancial = useCallback((record: Omit<FinancialRecord, 'id'>) => {
    const newRecord = { ...record, id: Math.random().toString(36).substr(2, 9) };
    setFinancials(prev => [newRecord, ...prev]);
  }, []);

  const deleteFinancial = useCallback((id: string) => {
    setFinancials(prev => prev.filter(f => f.id !== id));
  }, []);

  const exportAppData = () => {
    const data = {
      students,
      financials,
      attendance,
      plans,
      schedules,
      graduationRules,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data);
  };

  const importAppData = (jsonString: string) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.students) setStudents(data.students);
      if (data.financials) setFinancials(data.financials);
      if (data.attendance) setAttendance(data.attendance);
      if (data.plans) setPlans(data.plans);
      if (data.schedules) setSchedules(data.schedules);
      if (data.graduationRules) setGraduationRules(data.graduationRules);
      return true;
    } catch (e) {
      console.error("Erro na importação", e);
      return false;
    }
  };

  useEffect(() => {
    const newAlerts: string[] = [];
    students.forEach(s => {
      const rule = graduationRules.find(r => r.belt === s.belt);
      if (rule && s.attendanceCount >= rule.classesRequired) {
        newAlerts.push(`Apta Graduação: ${s.name} atingiu ${s.attendanceCount}/${rule.classesRequired} aulas.`);
      }
    });
    setNotifications(newAlerts);
  }, [students, graduationRules]);

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser, students, setStudents, addStudent, updateStudent,
      attendance, addAttendance, financials, setFinancials, addFinancial, deleteFinancial, products,
      notifications, plans, setPlans, schedules, setSchedules, graduationRules, setGraduationRules,
      exportAppData, importAppData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
