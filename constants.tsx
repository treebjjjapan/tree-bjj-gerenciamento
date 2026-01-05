
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

// Começando com lista de alunos vazia para uso real
export const INITIAL_STUDENTS: Student[] = [];

// Começando com financeiro vazio para uso real
export const INITIAL_FINANCIAL: FinancialRecord[] = [];

// Mantendo apenas os produtos básicos da loja
export const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Kimono Tree BJJ Pro', price: 450, category: 'Uniforme', stock: 10, imageUrl: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?q=80&w=500&auto=format&fit=crop' },
  { id: 'p2', name: 'Rashguard Elite', price: 180, category: 'Uniforme', stock: 15, imageUrl: 'https://images.unsplash.com/photo-1614975058789-41316d0e2e9c?q=80&w=500&auto=format&fit=crop' },
  { id: 'p3', name: 'Faixa Premium', price: 80, category: 'Acessório', stock: 30, imageUrl: 'https://images.unsplash.com/photo-1552072805-2a9039d00e57?q=80&w=500&auto=format&fit=crop' }
];
