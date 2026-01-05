
import React from 'react';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  CalendarCheck,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useAppContext } from '../AppContext';
import { PaymentStatus } from '../types';

const Dashboard: React.FC = () => {
  const { students, financials, attendance } = useAppContext();

  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'Ativo').length;
  
  const revenue = financials
    .filter(f => f.type === 'INCOME' && f.status === PaymentStatus.PAID)
    .reduce((sum, f) => sum + f.amount, 0);
  
  const expenses = financials
    .filter(f => f.type === 'EXPENSE')
    .reduce((sum, f) => sum + f.amount, 0);

  const profit = revenue - expenses;

  const stats = [
    { label: 'Total de Alunos', value: totalStudents, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+5%' },
    { label: 'Receita (Mês)', value: `R$ ${revenue.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+12%' },
    { label: 'Lucro Líquido', value: `R$ ${profit.toLocaleString()}`, icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50', trend: '-2%' },
    { label: 'Check-ins (Hoje)', value: attendance.filter(a => a.date === new Date().toISOString().split('T')[0]).length, icon: CalendarCheck, color: 'text-purple-600', bg: 'bg-purple-50', trend: 'Estável' },
  ];

  // Dummy chart data
  const data = [
    { name: 'Jan', receita: 4000, despesa: 2400 },
    { name: 'Fev', receita: 3000, despesa: 1398 },
    { name: 'Mar', receita: 2000, despesa: 9800 },
    { name: 'Abr', receita: 2780, despesa: 3908 },
    { name: 'Mai', receita: 5890, despesa: 4800 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                {stat.trend}
                {stat.trend.startsWith('+') ? <ArrowUpRight size={12} className="ml-1" /> : <ArrowDownRight size={12} className="ml-1" />}
              </div>
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800">Fluxo de Caixa</h3>
            <select className="bg-slate-50 border-none rounded-lg text-sm font-medium px-3 py-1 focus:ring-0">
              <option>Últimos 6 meses</option>
              <option>Este ano</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                />
                <Area type="monotone" dataKey="receita" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRec)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6">Check-ins Recentes</h3>
          <div className="space-y-4">
            {attendance.length > 0 ? attendance.slice(0, 5).map((a, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                    {a.studentName.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{a.studentName}</p>
                    <p className="text-xs text-slate-500">{a.date} às {a.time}</p>
                  </div>
                </div>
                <div className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                  {a.method}
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                <CalendarCheck size={48} className="mb-2 opacity-20" />
                <p className="text-sm">Nenhum check-in registrado hoje.</p>
              </div>
            )}
          </div>
          <button className="w-full mt-6 text-emerald-600 text-sm font-bold hover:underline">Ver todos os registros</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
