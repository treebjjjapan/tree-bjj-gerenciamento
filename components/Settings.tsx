
import React, { useState } from 'react';
import { 
  DollarSign, Clock, Award, Plus, X, Save, Trash2, AlertTriangle, RefreshCcw
} from 'lucide-react';
import { useAppContext } from '../AppContext';
import { Plan, ClassSchedule, GraduationRule, BeltColor } from '../types';

const Settings: React.FC = () => {
  const { plans, setPlans, schedules, setSchedules, graduationRules, setGraduationRules } = useAppContext();
  const [activeTab, setActiveTab] = useState<'plans' | 'schedules' | 'grad' | 'system'>('plans');

  // Plan Handlers
  const addPlan = () => {
    const newPlan: Plan = { id: Math.random().toString(), name: 'Novo Plano', price: 0, durationMonths: 1 };
    setPlans([...plans, newPlan]);
  };

  const updatePlan = (id: string, field: keyof Plan, value: any) => {
    setPlans(plans.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  // Schedule Handlers
  const addSchedule = () => {
    const newClass: ClassSchedule = { id: Math.random().toString(), dayOfWeek: 'Segunda', time: '19:00', className: 'Jiu Jitsu Adulto', instructor: 'Anderson' };
    setSchedules([...schedules, newClass]);
  };

  const updateSchedule = (id: string, field: keyof ClassSchedule, value: any) => {
    setSchedules(schedules.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const resetSystem = () => {
    if (window.confirm("ATENÇÃO: Isso apagará TODOS os alunos, mensalidades e presenças permanentemente. Deseja continuar?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm w-fit">
        <button onClick={() => setActiveTab('plans')} className={`px-4 md:px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'plans' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Mensalidades</button>
        <button onClick={() => setActiveTab('schedules')} className={`px-4 md:px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'schedules' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Horários</button>
        <button onClick={() => setActiveTab('grad')} className={`px-4 md:px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'grad' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Graduação</button>
        <button onClick={() => setActiveTab('system')} className={`px-4 md:px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'system' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Sistema</button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 md:p-8">
        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-xl font-black text-slate-800">Valores de Mensalidade</h3>
               <button onClick={addPlan} className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"><Plus size={16}/><span>Adicionar Plano</span></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plans.map(plan => (
                <div key={plan.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                  <div className="flex justify-between items-center">
                     <input className="bg-transparent border-none font-black text-slate-800 focus:ring-0 p-0 w-full" value={plan.name} onChange={e => updatePlan(plan.id, 'name', e.target.value)} placeholder="Nome do Plano" />
                     <button onClick={() => setPlans(plans.filter(p => p.id !== plan.id))} className="text-slate-300 hover:text-rose-500 ml-2"><Trash2 size={16}/></button>
                  </div>
                  <div className="flex items-center space-x-4">
                     <div className="flex-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Valor Mensal (R$)</label>
                        <input type="number" className="w-full mt-1 bg-white border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500" value={plan.price} onChange={e => updatePlan(plan.id, 'price', parseFloat(e.target.value))} />
                     </div>
                     <div className="flex-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Meses</label>
                        <input type="number" className="w-full mt-1 bg-white border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500" value={plan.durationMonths} onChange={e => updatePlan(plan.id, 'durationMonths', parseInt(e.target.value))} />
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'schedules' && (
          <div className="space-y-6">
             <div className="flex items-center justify-between">
               <h3 className="text-xl font-black text-slate-800">Grade de Horários</h3>
               <button onClick={addSchedule} className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"><Plus size={16}/><span>Novo Horário</span></button>
            </div>
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase border-b border-slate-100">
                    <th className="pb-4">Dia da Semana</th>
                    <th className="pb-4">Horário</th>
                    <th className="pb-4">Nome da Aula</th>
                    <th className="pb-4">Professor</th>
                    <th className="pb-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schedules.map(item => (
                    <tr key={item.id}>
                      <td className="py-4">
                        <select className="bg-transparent border-none text-sm font-bold p-0 focus:ring-0" value={item.dayOfWeek} onChange={e => updateSchedule(item.id, 'dayOfWeek', e.target.value)}>
                          {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map(d => <option key={d}>{d}</option>)}
                        </select>
                      </td>
                      <td className="py-4">
                        <input type="time" className="bg-transparent border-none text-sm font-bold p-0 focus:ring-0" value={item.time} onChange={e => updateSchedule(item.id, 'time', e.target.value)} />
                      </td>
                      <td className="py-4">
                        <input className="bg-transparent border-none text-sm font-bold p-0 focus:ring-0" value={item.className} onChange={e => updateSchedule(item.id, 'className', e.target.value)} placeholder="Ex: Jiu Jitsu Kids" />
                      </td>
                      <td className="py-4">
                        <input className="bg-transparent border-none text-sm font-bold p-0 focus:ring-0" value={item.instructor} onChange={e => updateSchedule(item.id, 'instructor', e.target.value)} placeholder="Mestre" />
                      </td>
                      <td className="py-4 text-right">
                        <button onClick={() => setSchedules(schedules.filter(s => s.id !== item.id))} className="text-slate-300 hover:text-rose-500"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {schedules.length === 0 && (
                <div className="py-12 text-center text-slate-400">
                  <Clock size={40} className="mx-auto mb-2 opacity-20" />
                  <p>Nenhum horário cadastrado.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'grad' && (
          <div className="space-y-6">
             <h3 className="text-xl font-black text-slate-800">Critérios de Graduação</h3>
             <p className="text-slate-500 text-sm">Defina quantas aulas e meses de carência são necessários para que o sistema recomende a promoção de faixa.</p>
             <div className="grid grid-cols-1 gap-3">
               {graduationRules.map(rule => (
                 <div key={rule.belt} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 gap-4">
                   <div className="flex items-center space-x-3">
                     <div className={`w-4 h-8 rounded-sm ${rule.belt === BeltColor.WHITE ? 'bg-white border' : rule.belt === BeltColor.BLUE ? 'bg-blue-600' : rule.belt === BeltColor.PURPLE ? 'bg-purple-700' : rule.belt === BeltColor.BROWN ? 'bg-amber-900' : 'bg-black'}`}></div>
                     <span className="font-black text-slate-800">{rule.belt}</span>
                   </div>
                   <div className="flex items-center space-x-6">
                     <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Aulas Mín.</span>
                        <input type="number" className="w-20 bg-white border-none rounded-lg text-sm font-bold focus:ring-2 focus:ring-emerald-500" value={rule.classesRequired} onChange={e => setGraduationRules(graduationRules.map(r => r.belt === rule.belt ? {...r, classesRequired: parseInt(e.target.value)} : r))} />
                     </div>
                     <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase">Carência (Meses)</span>
                        <input type="number" className="w-20 bg-white border-none rounded-lg text-sm font-bold focus:ring-2 focus:ring-emerald-500" value={rule.monthsRequired} onChange={e => setGraduationRules(graduationRules.map(r => r.belt === rule.belt ? {...r, monthsRequired: parseInt(e.target.value)} : r))} />
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-8 py-4">
             <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
                    <AlertTriangle size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-black text-rose-900 leading-tight">Limpeza Total do Sistema</h4>
                    <p className="text-rose-700 text-sm mt-1">Isso apagará todos os dados armazenados neste navegador (Alunos, Transações, Presenças e Configurações).</p>
                    <button 
                      onClick={resetSystem}
                      className="mt-6 flex items-center space-x-2 px-6 py-3 bg-rose-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-rose-900/20 hover:bg-rose-700 transition-all"
                    >
                      <RefreshCcw size={18} />
                      <span>Limpar Tudo e Recomeçar</span>
                    </button>
                  </div>
                </div>
             </div>
             
             <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
               <h4 className="font-black text-slate-800">Dica de Uso</h4>
               <p className="text-slate-500 text-sm mt-2">Este sistema funciona offline e salva os dados localmente no seu dispositivo. Certifique-se de não limpar os dados de navegação para não perder suas informações.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
