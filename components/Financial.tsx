
import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  X,
  Trash2,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAppContext } from '../AppContext';
import { PaymentStatus } from '../types';

const Financial: React.FC = () => {
  const { financials, addFinancial, deleteFinancial } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');
  
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Gerar anos de 2023 até 2035
  const years = Array.from({ length: 13 }, (_, i) => 2023 + i);

  const filteredFinancials = financials.filter(f => {
    const fDate = new Date(f.date);
    if (viewMode === 'monthly') {
      return fDate.getMonth() === selectedMonth && fDate.getFullYear() === selectedYear;
    }
    return fDate.getFullYear() === selectedYear;
  });

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'INCOME' as 'INCOME' | 'EXPENSE',
    category: 'Mensalidade',
    status: PaymentStatus.PAID,
    studentId: '',
    date: new Date().toISOString().split('T')[0]
  });

  const income = filteredFinancials.filter(f => f.type === 'INCOME').reduce((s, f) => s + f.amount, 0);
  const expense = filteredFinancials.filter(f => f.type === 'EXPENSE').reduce((s, f) => s + f.amount, 0);
  const balance = income - expense;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;
    
    addFinancial({
      ...formData,
      amount: parseFloat(formData.amount),
      studentId: formData.studentId || undefined
    });
    
    setShowModal(false);
    setFormData({ 
      description: '', 
      amount: '', 
      type: 'INCOME', 
      category: 'Mensalidade', 
      status: PaymentStatus.PAID, 
      studentId: '', 
      date: new Date().toISOString().split('T')[0] 
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Deseja realmente excluir este lançamento?")) {
      deleteFinancial(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header com Abas e Seletores */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm w-fit">
          <button 
            onClick={() => setViewMode('monthly')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'monthly' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/10' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Controle Mensal
          </button>
          <button 
            onClick={() => setViewMode('yearly')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === 'yearly' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/10' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Controle Geral (Ano)
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {viewMode === 'monthly' && (
            <div className="flex items-center bg-white border border-slate-100 rounded-xl shadow-sm overflow-hidden">
              <button 
                onClick={() => setSelectedMonth(prev => prev === 0 ? 11 : prev - 1)}
                className="p-2 hover:bg-slate-50 text-slate-400"
              >
                <ChevronLeft size={18} />
              </button>
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="px-2 py-2 bg-transparent border-none text-sm font-bold text-slate-700 focus:ring-0 cursor-pointer"
              >
                {months.map((m, idx) => <option key={idx} value={idx}>{m}</option>)}
              </select>
              <button 
                onClick={() => setSelectedMonth(prev => prev === 11 ? 0 : prev + 1)}
                className="p-2 hover:bg-slate-50 text-slate-400"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
          
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-4 py-2 bg-white border border-slate-100 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all ml-auto md:ml-0"
          >
            <Plus size={18} />
            <span>Novo Lançamento</span>
          </button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Saldo Líquido</p>
          <div className="flex items-center justify-between">
            <h2 className={`text-3xl font-black ${balance >= 0 ? 'text-slate-800' : 'text-rose-500'}`}>
              ¥ {balance.toLocaleString('ja-JP')}
            </h2>
            <div className={`p-2 rounded-xl ${balance >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
              <Layers size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Entradas</p>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-emerald-600">¥ {income.toLocaleString('ja-JP')}</h2>
            <div className="bg-emerald-50 p-2 rounded-xl text-emerald-600">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Saídas</p>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-rose-500">¥ {expense.toLocaleString('ja-JP')}</h2>
            <div className="bg-rose-50 p-2 rounded-xl text-rose-500">
              <TrendingDown size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Lançamentos */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs flex items-center gap-2">
            <Calendar size={16} className="text-emerald-600" />
            {viewMode === 'monthly' ? `Transações de ${months[selectedMonth]} / ${selectedYear}` : `Histórico Geral de ${selectedYear}`}
          </h3>
          <span className="text-[10px] font-bold text-slate-400 uppercase">{filteredFinancials.length} Registros</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Data</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Valor</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredFinancials.length > 0 ? filteredFinancials.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(f => (
                <tr key={f.id} className="hover:bg-slate-50/40 transition-colors group">
                  <td className="px-6 py-4 text-xs font-bold text-slate-500">
                    {new Date(f.date).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-slate-800">{f.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-lg uppercase tracking-tight">
                      {f.category}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-sm font-black text-right ${f.type === 'INCOME' ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {f.type === 'INCOME' ? '+' : '-'} ¥ {f.amount.toLocaleString('ja-JP')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleDelete(f.id)}
                      className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all md:opacity-0 group-hover:opacity-100"
                      title="Excluir lançamento"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center opacity-20">
                      <DollarSign size={48} className="mb-2" />
                      <p className="text-sm font-bold uppercase tracking-widest">Nenhum dado neste período</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Lançamento */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Novo Lançamento</h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Tree BJJ Japan Financial</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 bg-slate-100 rounded-xl text-slate-400 hover:text-rose-500 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-1.5 rounded-2xl">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: 'INCOME'})}
                  className={`py-3 rounded-[1.25rem] font-black text-xs uppercase tracking-widest transition-all ${formData.type === 'INCOME' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Entrada (+)
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, type: 'EXPENSE'})}
                  className={`py-3 rounded-[1.25rem] font-black text-xs uppercase tracking-widest transition-all ${formData.type === 'EXPENSE' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Saída (-)
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Data do Registro</label>
                  <input 
                    required
                    type="date" 
                    className="w-full mt-1 px-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700" 
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Descrição / Identificação</label>
                  <input 
                    required
                    type="text" 
                    className="w-full mt-1 px-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700" 
                    placeholder="Ex: Mensalidade Tanaka-san" 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Valor (¥)</label>
                    <input 
                      required
                      type="number" 
                      className="w-full mt-1 px-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-black text-slate-800" 
                      placeholder="0" 
                      value={formData.amount}
                      onChange={e => setFormData({...formData, amount: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Categoria</label>
                    <select 
                      className="w-full mt-1 px-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      <option>Mensalidade</option>
                      <option>Venda Loja</option>
                      <option>Aluguel</option>
                      <option>Energia/Água</option>
                      <option>Limpeza</option>
                      <option>Marketing</option>
                      <option>Manutenção</option>
                      <option>Outros</option>
                    </select>
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black shadow-xl shadow-slate-900/30 mt-6 hover:bg-emerald-600 transition-all uppercase tracking-[0.2em] text-xs">
                Confirmar Lançamento
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Financial;
