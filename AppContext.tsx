
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Student, AttendanceRecord, FinancialRecord, Product, User, UserRole, StudentStatus, BeltColor, PaymentStatus } from './types';
import { INITIAL_STUDENTS, INITIAL_FINANCIAL, INITIAL_PRODUCTS } from './constants';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  attendance: AttendanceRecord[];
  addAttendance: (studentId: string) => void;
  financials: FinancialRecord[];
  addFinancial: (record: Omit<FinancialRecord, 'id'>) => void;
  products: Product[];
  notifications: string[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'admin1',
    name: 'Anderson Marques',
    role: UserRole.ADMIN,
    email: 'mestre@treebjj.com'
  });

  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [financials, setFinancials] = useState<FinancialRecord[]>(INITIAL_FINANCIAL);
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [notifications, setNotifications] = useState<string[]>([]);

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

  // Check for belt promotion notifications or payment alerts
  useEffect(() => {
    const newAlerts: string[] = [];
    students.forEach(s => {
      if (s.attendanceCount % 50 === 0 && s.attendanceCount > 0) {
        newAlerts.push(`Avaliação de faixa sugerida para: ${s.name}`);
      }
    });
    financials.forEach(f => {
      if (f.status === PaymentStatus.OVERDUE) {
        newAlerts.push(`Pagamento atrasado: ${f.description}`);
      }
    });
    setNotifications(newAlerts);
  }, [students, financials]);

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      students,
      setStudents,
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
