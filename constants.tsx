
import { BeltColor, StudentStatus, PaymentStatus, Student, FinancialRecord, Product } from './types';

export const BELT_COLORS: Record<BeltColor, string> = {
  [BeltColor.WHITE]: 'bg-white border-slate-300 text-slate-800',
  [BeltColor.GRAY]: 'bg-slate-400 text-white',
  [BeltColor.YELLOW]: 'bg-yellow-400 text-black',
  [BeltColor.ORANGE]: 'bg-orange-500 text-white',
  [BeltColor.GREEN]: 'bg-emerald-600 text-white',
  [BeltColor.BLUE]: 'bg-blue-600 text-white',
  [BeltColor.PURPLE]: 'bg-purple-700 text-white',
  [BeltColor.BROWN]: 'bg-amber-900 text-white',
  [BeltColor.BLACK]: 'bg-black text-white',
};

// Added explicit Student[] type to ensure correct inference of properties like status and belt
export const INITIAL_STUDENTS: Student[] = [
  {
    id: '1',
    name: 'Carlos Oliveira',
    birthDate: '1990-05-15',
    cpf: '123.456.789-00',
    phone: '11999999999',
    email: 'carlos@example.com',
    address: 'Rua das Flores, 123',
    plan: 'Mensal',
    enrollmentDate: '2023-01-10',
    status: StudentStatus.ACTIVE,
    photoUrl: 'https://picsum.photos/seed/carlos/200',
    belt: BeltColor.BLUE,
    stripes: 2,
    graduationHistory: [{ date: '2023-01-10', belt: BeltColor.WHITE, stripes: 0 }, { date: '2023-12-10', belt: BeltColor.BLUE, stripes: 0 }],
    attendanceCount: 45
  },
  {
    id: '2',
    name: 'Ana Silva',
    birthDate: '1995-08-22',
    cpf: '987.654.321-11',
    phone: '11888888888',
    email: 'ana@example.com',
    address: 'Av Principal, 456',
    plan: 'Semestral',
    enrollmentDate: '2023-03-15',
    status: StudentStatus.ACTIVE,
    photoUrl: 'https://picsum.photos/seed/ana/200',
    belt: BeltColor.WHITE,
    stripes: 3,
    graduationHistory: [{ date: '2023-03-15', belt: BeltColor.WHITE, stripes: 0 }],
    attendanceCount: 32
  }
];

// Added explicit FinancialRecord[] type to fix the error in AppContext.tsx where 'type' was inferred as string
export const INITIAL_FINANCIAL: FinancialRecord[] = [
  { id: 'f1', type: 'INCOME', category: 'Mensalidade', amount: 250, date: '2024-05-01', status: PaymentStatus.PAID, description: 'Carlos Oliveira - Maio', studentId: '1' },
  { id: 'f2', type: 'INCOME', category: 'Mensalidade', amount: 200, date: '2024-05-05', status: PaymentStatus.PENDING, description: 'Ana Silva - Maio', studentId: '2' },
  { id: 'e1', type: 'EXPENSE', category: 'Aluguel', amount: 3500, date: '2024-05-01', status: PaymentStatus.PAID, description: 'Aluguel do Dojô' },
  { id: 'e2', type: 'EXPENSE', category: 'Energia', amount: 450, date: '2024-05-10', status: PaymentStatus.PAID, description: 'Conta de Luz' }
];

// Added explicit Product[] type for consistency
export const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Kimono Tree BJJ Pro', price: 450, category: 'Uniforme', stock: 15, imageUrl: 'https://picsum.photos/seed/kimono/200' },
  { id: 'p2', name: 'Rashguard Elite', price: 180, category: 'Uniforme', stock: 22, imageUrl: 'https://picsum.photos/seed/rash/200' },
  { id: 'p3', name: 'Faixa Premium', price: 80, category: 'Acessório', stock: 50, imageUrl: 'https://picsum.photos/seed/belt/200' }
];
