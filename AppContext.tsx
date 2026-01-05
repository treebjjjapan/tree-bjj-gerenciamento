
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Student, AttendanceRecord, FinancialRecord, Product, User, UserRole, StudentStatus, BeltColor, PaymentStatus } from './types';
import { INITIAL_STUDENTS, INITIAL_FINANCIAL, INITIAL_PRODUCTS } from './constants';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  addStudent: (student: Omit<Student, 'id' | 'attendanceCount' | 'graduationHistory'>) => void;
  attendance: AttendanceRecord[];
  addAttendance: (studentId: string) => void;
  financials: FinancialRecord[];
  addFinancial: (record: Omit<FinancialRecord, 'id'>) => void;
  products: Product[];
  notifications: string[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.SetStateAction<React.ReactNode> }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('treebjj_user');
    return saved ? JSON.parse(saved) : {
      id: 'admin1',
      name: 'Anderson Marques',
      role: UserRole.ADMIN,
      email: 'mestre@treebjj.com'
    };
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

  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [notifications, setNotifications] = useState<string[]>([]);

  // Persist data
  useEffect(() => {
    localStorage.setItem('treebjj_students', JSON.stringify(students));
    localStorage.setItem('treebjj_financials', JSON.stringify(financials));
    localStorage.setItem('treebjj_attendance', JSON.stringify(attendance));
    if (currentUser) localStorage.setItem('treebjj_user', JSON.stringify(currentUser));
    else localStorage.removeItem('treebjj_user');
  }, [students, financials, attendance, currentUser]);

  const addStudent = useCallback((newStudentData: Omit<Student, 'id' | 'attendanceCount' | 'graduationHistory'>) => {
    const newStudent: Student = {
      ...newStudentData,
      id: Math.random().toString(36).substr(2, 9),
      attendanceCount: 0,
      graduationHistory: [{ date: new Date().toISOString().split('T')[0], belt: newStudentData.belt, stripes: newStudentData.stripes }]
    };
    setStudents(prev => [newStudent, ...prev]);
  }, []);

  const addAttendance = useCallback((studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const newRecord: AttendanceRecord = {
      id: Math.random().toString(36).substr(2, 9),
      studentId,
      studentName: student.name,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      method: 'MANUAL'
    };

    setAttendance(prev => [newRecord, ...prev]);
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, attendanceCount: s.attendanceCount + 1 } : s));
  }, [students]);

  const addFinancial = useCallback((record: Omit<FinancialRecord, 'id'>) => {
    const newRecord = { ...record, id: Math.random().toString(36).substr(2, 9) };
    setFinancials(prev => [newRecord, ...prev]);
  }, []);

  useEffect(() => {
    const newAlerts: string[] = [];
    students.forEach(s => {
      if (s.attendanceCount > 0 && s.attendanceCount % 50 === 0) {
        newAlerts.push(`Avaliação sugerida: ${s.name} atingiu ${s.attendanceCount} aulas.`);
      }
    });
    setNotifications(newAlerts);
  }, [students]);

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      students,
      setStudents,
      addStudent,
      attendance,
      addAttendance,
      financials,
      addFinancial,
      products,
      notifications
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
