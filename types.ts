
export enum UserRole {
  ADMIN = 'ADMIN',
  PROFESSOR = 'PROFESSOR',
  STUDENT = 'STUDENT'
}

export enum BeltColor {
  WHITE = 'Branca',
  GRAY = 'Cinza',
  YELLOW = 'Amarela',
  ORANGE = 'Laranja',
  GREEN = 'Verde',
  BLUE = 'Azul',
  PURPLE = 'Roxa',
  BROWN = 'Marrom',
  BLACK = 'Preta'
}

export enum PaymentStatus {
  PAID = 'Pago',
  PENDING = 'Pendente',
  OVERDUE = 'Atrasado'
}

export enum StudentStatus {
  ACTIVE = 'Ativo',
  INACTIVE = 'Inativo',
  FROZEN = 'Trancado'
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  durationMonths: number;
}

export interface ClassSchedule {
  id: string;
  dayOfWeek: string;
  time: string;
  className: string;
  instructor: string;
}

export interface GraduationRule {
  belt: BeltColor;
  classesRequired: number;
  monthsRequired: number;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export interface Student {
  id: string;
  name: string;
  birthDate: string;
  cpf: string;
  phone: string;
  email: string;
  address: string;
  planId: string;
  enrollmentDate: string;
  status: StudentStatus;
  photoUrl: string;
  belt: BeltColor;
  stripes: number; // 0 to 4
  graduationHistory: Array<{ date: string; belt: BeltColor; stripes: number }>;
  attendanceCount: number;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  date: string;
  time: string;
  classId?: string;
  method: 'MANUAL' | 'QRCODE';
}

export interface FinancialRecord {
  id: string;
  studentId?: string;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  amount: number;
  date: string;
  status: PaymentStatus;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  imageUrl: string;
}

export interface Sale {
  id: string;
  studentId: string;
  productId: string;
  amount: number;
  date: string;
}
