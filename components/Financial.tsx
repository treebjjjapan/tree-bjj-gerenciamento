
import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Filter,
  X
} from 'lucide-react';
import { useAppContext } from '../AppContext';
import { PaymentStatus } from '../types';

const Financial: React.FC = () => {
  const { financials, addFinancial, students } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'INCOME' as 'INCOME' | 'EXPENSE',
    category: 'Mensalidade',
    status: PaymentStatus.PAID,
    studentId: ''
  });

  const income = financials.filter(f => f.type === 'INCOME').reduce((s, f) => s + f.amount, 0);
  const expense = financials.filter(f => f.type === 'EXPENSE').reduce((s, f) => s + f.amount, 0);
  const balance = income - expense;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;
    
    addFinancial({
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date().toISOString().split('T')[0],
      studentId: formData.studentId || undefined
    });
    
    setShowModal(false);
    setFormData({ description: '', amount: '', type: 'INCOME', category: 'Mensalidade', status: PaymentStatus.PAID, studentId: '' });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-sm font-bold text-slate-400 uppercase mb-1">Saldo Total</p>
          <div className="flex items-center justify-between">
            <h2 className={`text-3xl font-black ${balance >= 0 ? 'text-slate-800' : 'text-rose-500'}`}>
              ¥ {balance.toLocaleString('ja-JP')}
            </h2>
            <div className="bg-emerald-50 p-2 rounded-xl text-emerald-600">
              <DollarSign size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-sm font-bold text-slate-400 uppercase mb-1">Entradas</p>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-emerald-600">¥ {income.toLocaleString('ja-JP')}</h2>
            <div className="bg-emerald-50 p-2 rounded-xl text-emerald-600">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-sm font-bold text-slate-400 uppercase mb-1">Saídas</p>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-rose-500">¥ {expense.toLocaleString('ja-JP')}</h2>
            <div className="bg-rose-50 p-2 rounded-xl text-rose-500">
              <TrendingDown size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Transações</h3>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm"
            >
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
                    <span className="text-[10px] font-medium text-slate-400 uppercase">{f.category}</span>
                  </td>
                  <td className={`px-6 py-4 text-sm font-black text-right ${f.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {f.type === 'INCOME' ? '+' : '-'} ¥ {f.amount.toLocaleString('ja-JP')}
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
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-800">Novo Lançamento</h2>
              <button onClick={() => setShowModal(false)} className="p-2 bg-slate-100 rounded-xl text-slate-400">
                <X size={24} />
              </button>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: 'INCOME'})}
                  className={`py-3 rounded-2xl font-bold text-sm border-2 transition-all ${formData.type === 'INCOME' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-100 text-slate-400'}`}
                >
                  Entrada
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: 'EXPENSE'})}
                  className={`py-3 rounded-2xl font-bold text-sm border-2 transition-all ${formData.type === 'EXPENSE' ? 'bg-rose-500 border-rose-500 text-white' : 'border-slate-100 text-slate-400'}`}
                >
                  Saída
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Descrição</label>
                  <input 
                    required
                    type="text" 
                    className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500" 
                    placeholder="Ex: Mensalidade Tanaka-san" 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Valor (¥)</label>
                    <input 
                      required
                      type="number" 
                      className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500" 
                      placeholder="0" 
                      value={formData.amount}
                      onChange={e => setFormData({...formData, amount: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Categoria</label>
                    <select 
                      className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      <option>Mensalidade</option>
                      <option>Venda Loja</option>
                      <option>Aluguel</option>
                      <option>Energia/Água</option>
                      <option>Limpeza</option>
                      <option>Marketing</option>
                      <option>Outros</option>
                    </select>
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-lg shadow-black/20 mt-4 hover:bg-emerald-600 transition-all">
                Salvar em Yen
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Financial;
