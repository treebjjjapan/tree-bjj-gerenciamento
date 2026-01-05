
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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
  
  // Cloud Sync Props
  syncId: string;
  setSyncId: (id: string) => void;
  isSyncing: boolean;
  lastSync: Date | null;
  forceSync: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const JSON_BLOB_API = "https://jsonblob.com/api/jsonBlob";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [syncId, setSyncId] = useState<string>(() => localStorage.getItem('treebjj_sync_id') || '');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const isInitialMount = useRef(true);
  const skipNextSync = useRef(false);

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
    return saved ? JSON.parse(saved) : [];
  });

  const [schedules, setSchedules] = useState<ClassSchedule[]>(() => {
    const saved = localStorage.getItem('treebjj_schedules');
    return saved ? JSON.parse(saved) : [];
  });

  const [graduationRules, setGraduationRules] = useState<GraduationRule[]>(() => {
    const saved = localStorage.getItem('treebjj_grad_rules');
    return saved ? JSON.parse(saved) : [];
  });

  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [notifications, setNotifications] = useState<string[]>([]);

  // Salva ID de Sync
  useEffect(() => {
    if (syncId) localStorage.setItem('treebjj_sync_id', syncId);
  }, [syncId]);

  // Função para Empurrar dados para a Nuvem
  const pushToCloud = useCallback(async () => {
    if (!syncId || isSyncing) return;
    setIsSyncing(true);
    try {
      const data = {
        students,
        attendance,
        financials,
        plans,
        schedules,
        graduationRules,
        updatedAt: new Date().toISOString()
      };
      await fetch(`${JSON_BLOB_API}/${syncId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      setLastSync(new Date());
    } catch (err) {
      console.error("Erro ao sincronizar na nuvem", err);
    } finally {
      setIsSyncing(false);
    }
  }, [syncId, students, attendance, financials, plans, schedules, graduationRules]);

  // Função para Puxar dados da Nuvem
  const pullFromCloud = useCallback(async (idToUse = syncId) => {
    if (!idToUse) return;
    setIsSyncing(true);
    try {
      const response = await fetch(`${JSON_BLOB_API}/${idToUse}`);
      if (response.ok) {
        const data = await response.json();
        skipNextSync.current = true; // Evita loop infinito
        if (data.students) setStudents(data.students);
        if (data.attendance) setAttendance(data.attendance);
        if (data.financials) setFinancials(data.financials);
        if (data.plans) setPlans(data.plans);
        if (data.schedules) setSchedules(data.schedules);
        if (data.graduationRules) setGraduationRules(data.graduationRules);
        setLastSync(new Date());
      }
    } catch (err) {
      console.error("Erro ao baixar dados da nuvem", err);
    } finally {
      setIsSyncing(false);
    }
  }, [syncId]);

  // Sincronização Automática ao alterar dados (Push)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (skipNextSync.current) {
      skipNextSync.current = false;
      return;
    }

    const timer = setTimeout(() => {
      pushToCloud();
    }, 2000); // Debounce de 2 segundos para não sobrecarregar

    // Persistência Local sempre
    localStorage.setItem('treebjj_students', JSON.stringify(students));
    localStorage.setItem('treebjj_financials', JSON.stringify(financials));
    localStorage.setItem('treebjj_attendance', JSON.stringify(attendance));
    localStorage.setItem('treebjj_plans', JSON.stringify(plans));
    localStorage.setItem('treebjj_schedules', JSON.stringify(schedules));
    localStorage.setItem('treebjj_grad_rules', JSON.stringify(graduationRules));

    return () => clearTimeout(timer);
  }, [students, financials, attendance, plans, schedules, graduationRules, pushToCloud]);

  // Polling para checar se o outro dispositivo mudou algo (Pull)
  useEffect(() => {
    if (!syncId) return;
    
    // Puxa ao iniciar
    pullFromCloud();

    // Checa a cada 15 segundos por novidades
    const interval = setInterval(() => {
      pullFromCloud();
    }, 15000);

    return () => clearInterval(interval);
  }, [syncId, pullFromCloud]);

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
    setStudents(prev => prev.map(s => s.id === id ? { ...s, ...data } : s));
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

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser, students, setStudents, addStudent, updateStudent,
      attendance, addAttendance, financials, setFinancials, addFinancial, deleteFinancial, products,
      notifications, plans, setPlans, schedules, setSchedules, graduationRules, setGraduationRules,
      syncId, setSyncId, isSyncing, lastSync, forceSync: pullFromCloud
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
