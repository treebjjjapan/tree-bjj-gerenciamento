
import React from 'react';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  CalendarCheck,
  Plus
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../AppContext';
import { PaymentStatus } from '../types';

const Dashboard: React.FC = () => {
  const { students, financials, attendance } = useAppContext();

  const activeStudents = students.filter(s => s.status === 'Ativo').length;
  
  const revenue = financials
    .filter(f => f.type === 'INCOME' && f.status === PaymentStatus.PAID)
    .reduce((sum, f) => sum + f.amount, 0);
  
  const expenses = financials
    .filter(f => f.type === 'EXPENSE')
    .reduce((sum, f) => sum + f.amount, 0);

  const profit = revenue - expenses;

  const stats = [
    { label: 'Alunos Ativos', value: activeStudents, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Receita Total', value: `¥ ${revenue.toLocaleString('ja-JP')}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Lucro Líquido', value: `¥ ${profit.toLocaleString('ja-JP')}`, icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Check-ins (Hoje)', value: attendance.filter(a => a.date === new Date().toISOString().split('T')[0]).length, icon: CalendarCheck, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const chartData = financials.length > 0 ? [
    { name: 'Receita', valor: revenue },
    { name: 'Despesa', valor: expenses },
    { name: 'Lucro', valor: profit },
  ] : [
    { name: 'Jan', valor: 0 },
    { name: 'Fev', valor: 0 },
    { name: 'Mar', valor: 0 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <div className={`${stat.bg} ${stat.color} p-2 md:p-3 rounded-xl md:rounded-2xl`}>
                <stat.icon size={20} className="md:w-6 md:h-6" />
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] md:text-sm font-medium leading-none">{stat.label}</p>
              <h3 className="text-sm md:text-2xl font-bold text-slate-800 mt-1 truncate">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-black text-slate-800 mb-6 text-sm md:text-base uppercase tracking-widest">Fluxo de Caixa</h3>
          <div className="h-64 md:h-72 w-full flex items-center justify-center">
            {financials.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} width={40} />
                  <Tooltip 
                    formatter={(value: number) => `¥ ${value.toLocaleString('ja-JP')}`}
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                  />
                  <Area type="monotone" dataKey="valor" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-slate-400">
                <TrendingUp size={48} className="mx-auto mb-2 opacity-10" />
                <p className="text-sm">Aguardando dados...</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-black text-slate-800 mb-6 text-sm md:text-base uppercase tracking-widest">Atividade Recente</h3>
          <div className="space-y-4">
            {attendance.length > 0 ? attendance.slice(0, 5).map((a, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                    {a.studentName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-slate-800 text-xs md:text-sm truncate">{a.studentName}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{a.time} • OSS!</p>
                  </div>
                </div>
                <div className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-2 py-1 rounded-lg uppercase">
                  {a.method}
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <CalendarCheck size={48} className="mb-2 opacity-10" />
                <p className="text-xs font-medium italic">Nenhum check-in hoje.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
