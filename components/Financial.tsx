
import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  FileText
} from 'lucide-react';
import { useAppContext } from '../AppContext';
import { PaymentStatus } from '../types';

const Financial: React.FC = () => {
  const { financials } = useAppContext();

  const income = financials.filter(f => f.type === 'INCOME').reduce((s, f) => s + f.amount, 0);
  const expense = financials.filter(f => f.type === 'EXPENSE').reduce((s, f) => s + f.amount, 0);
  const balance = income - expense;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-sm font-bold text-slate-400 uppercase mb-1">Saldo Total</p>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-slate-800">R$ {balance.toLocaleString()}</h2>
            <div className="bg-emerald-50 p-2 rounded-xl text-emerald-600">
              <DollarSign size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-sm font-bold text-slate-400 uppercase mb-1">Entradas</p>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-emerald-600">R$ {income.toLocaleString()}</h2>
            <div className="bg-emerald-50 p-2 rounded-xl text-emerald-600">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-sm font-bold text-slate-400 uppercase mb-1">Saídas</p>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-rose-500">R$ {expense.toLocaleString()}</h2>
            <div className="bg-rose-50 p-2 rounded-xl text-rose-500">
              <TrendingDown size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Transações Recentes</h3>
          <div className="flex items-center space-x-2">
            <button className="p-2 bg-slate-50 rounded-xl text-slate-600 hover:bg-slate-100">
              <Filter size={18} />
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm">
              <Plus size={18} />
              <span>Lançar</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Data</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Descrição</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Categoria</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-right">Valor</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {financials.map(f => (
                <tr key={f.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4 text-xs font-medium text-slate-500">{f.date}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-800">{f.description}</p>
                  </td>
                  <td className="px-6 py-4">
                     <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">{f.category}</span>
                  </td>
                  <td className={`px-6 py-4 text-sm font-black text-right ${f.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {f.type === 'INCOME' ? '+' : '-'} R$ {f.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${
                      f.status === PaymentStatus.PAID ? 'bg-emerald-100 text-emerald-700' : 
                      f.status === PaymentStatus.OVERDUE ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {f.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-slate-50/50 flex items-center justify-center">
           <button className="flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-emerald-600 transition-colors">
              <FileText size={16} />
              <span>Gerar Relatório Completo (PDF)</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default Financial;
