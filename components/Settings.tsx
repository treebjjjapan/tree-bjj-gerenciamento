
import React, { useState } from 'react';
import { 
  Plus, Trash2, AlertTriangle, RefreshCcw, Clock, DollarSign, CloudSync, Download, Upload, Share2, ShieldCheck
} from 'lucide-react';
import { useAppContext } from '../AppContext';
import { Plan, ClassSchedule, BeltColor } from '../types';

const Settings: React.FC = () => {
  const { 
    plans, setPlans, schedules, setSchedules, graduationRules, setGraduationRules, 
    setFinancials, exportAppData, importAppData 
  } = useAppContext();
  const [activeTab, setActiveTab] = useState<'plans' | 'schedules' | 'grad' | 'sync' | 'system'>('plans');

  const handleExport = () => {
    const dataStr = exportAppData();
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `backup-treebjj-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (window.confirm("Isso substituirá todos os dados atuais por este backup. Continuar?")) {
        const success = importAppData(content);
        if (success) {
          alert("Dados sincronizados com sucesso! O sistema irá reiniciar.");
          window.location.reload();
        } else {
          alert("Arquivo inválido. Tente novamente.");
        }
      }
    };
    reader.readAsText(file);
  };

  const addPlan = () => {
    const newPlan: Plan = { id: Math.random().toString(), name: 'Novo Plano', price: 0, durationMonths: 1 };
    setPlans([...plans, newPlan]);
  };

  const updatePlan = (id: string, field: keyof Plan, value: any) => {
    setPlans(plans.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const addSchedule = () => {
    const newClass: ClassSchedule = { id: Math.random().toString(), dayOfWeek: 'Segunda', time: '19:00', className: 'Jiu Jitsu Adulto', instructor: 'Anderson' };
    setSchedules([...schedules, newClass]);
  };

  const updateSchedule = (id: string, field: keyof ClassSchedule, value: any) => {
    setSchedules(schedules.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const resetSystem = () => {
    if (window.confirm("ATENÇÃO: Isso apagará TODOS os dados permanentemente. Deseja continuar?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const resetFinancials = () => {
    if (window.confirm("Deseja zerar todo o histórico financeiro (Entradas e Saídas)? Os alunos e presenças serão mantidos.")) {
      setFinancials([]);
      alert("Financeiro zerado com sucesso!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm w-fit">
        <button onClick={() => setActiveTab('plans')} className={`px-4 md:px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'plans' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Planos</button>
        <button onClick={() => setActiveTab('schedules')} className={`px-4 md:px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'schedules' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Grade</button>
        <button onClick={() => setActiveTab('grad')} className={`px-4 md:px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'grad' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Graduação</button>
        <button onClick={() => setActiveTab('sync')} className={`px-4 md:px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'sync' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Sincronizar</button>
        <button onClick={() => setActiveTab('system')} className={`px-4 md:px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'system' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Sistema</button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 md:p-8 min-h-[400px]">
        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-xl font-black text-slate-800">Tabela de Preços (Yen)</h3>
               <button onClick={addPlan} className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"><Plus size={16}/><span>Criar Plano</span></button>
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
                        <label className="text-[10px] font-black text-slate-400 uppercase">Valor (¥)</label>
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
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase">
                    <th className="pb-4">Dia</th>
                    <th className="pb-4">Horário</th>
                    <th className="pb-4">Aula</th>
                    <th className="pb-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {schedules.map(item => (
                    <tr key={item.id}>
                      <td className="py-4">
                        <select className="bg-transparent border-none text-sm font-bold p-0" value={item.dayOfWeek} onChange={e => updateSchedule(item.id, 'dayOfWeek', e.target.value)}>
                          {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map(d => <option key={d}>{d}</option>)}
                        </select>
                      </td>
                      <td className="py-4">
                        <input type="time" className="bg-transparent border-none text-sm font-bold p-0" value={item.time} onChange={e => updateSchedule(item.id, 'time', e.target.value)} />
                      </td>
                      <td className="py-4">
                        <input className="bg-transparent border-none text-sm font-bold p-0" value={item.className} onChange={e => updateSchedule(item.id, 'className', e.target.value)} />
                      </td>
                      <td className="py-4 text-right">
                        <button onClick={() => setSchedules(schedules.filter(s => s.id !== item.id))} className="text-slate-300 hover:text-rose-500"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'grad' && (
          <div className="space-y-6">
             <h3 className="text-xl font-black text-slate-800">Critérios de Graduação</h3>
             <div className="grid grid-cols-1 gap-3">
               {graduationRules.map(rule => (
                 <div key={rule.belt} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <span className="font-black text-slate-800">{rule.belt}</span>
                   <div className="flex items-center space-x-4">
                     <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold text-slate-400">Aulas:</span>
                        <input type="number" className="w-16 bg-white border-none rounded-lg text-sm font-bold" value={rule.classesRequired} onChange={e => setGraduationRules(graduationRules.map(r => r.belt === rule.belt ? {...r, classesRequired: parseInt(e.target.value)} : r))} />
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {activeTab === 'sync' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center space-x-4 bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100">
              <div className="p-4 bg-white rounded-2xl shadow-sm text-emerald-600">
                <CloudSync size={32} />
              </div>
              <div>
                <h3 className="text-xl font-black text-emerald-900 leading-tight">Interligar Dispositivos</h3>
                <p className="text-emerald-700 text-xs font-medium mt-1">Como seus dados são locais para sua segurança, use esta ferramenta para levar seus dados do PC para o Smartphone.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-600 mb-4">
                    <Download size={24} />
                  </div>
                  <h4 className="text-lg font-black text-slate-800">1. Exportar do PC</h4>
                  <p className="text-sm text-slate-500 mt-2 font-medium">Gere um arquivo com todos os seus dados atuais (Alunos, Financeiro e Presença).</p>
                </div>
                <button 
                  onClick={handleExport}
                  className="mt-8 w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg"
                >
                  Baixar Arquivo de Sincronia
                </button>
              </div>

              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600 mb-4">
                    <Upload size={24} />
                  </div>
                  <h4 className="text-lg font-black text-slate-800">2. Importar no Smartphone</h4>
                  <p className="text-sm text-slate-500 mt-2 font-medium">Carregue o arquivo baixado no outro dispositivo para atualizar tudo instantaneamente.</p>
                </div>
                <label className="mt-8 w-full py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest text-center cursor-pointer hover:bg-emerald-700 transition-all shadow-lg">
                  <span>Selecionar Arquivo e Sincronizar</span>
                  <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                </label>
              </div>
            </div>

            <div className="bg-slate-900 p-6 rounded-[2rem] text-white/90">
               <div className="flex items-center space-x-3 mb-4">
                 <ShieldCheck className="text-emerald-400" size={24} />
                 <h4 className="font-black text-sm uppercase tracking-widest">Dica de Segurança</h4>
               </div>
               <p className="text-xs leading-relaxed font-medium">
                 Para manter os dados sempre iguais, recomendamos exportar do seu dispositivo principal (ex: PC) e importar no seu dispositivo secundário (ex: Smartphone) sempre que fizer muitas alterações.
               </p>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-100 p-6 rounded-3xl">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl">
                  <DollarSign size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-black text-amber-900 leading-tight">Limpar Financeiro</h4>
                  <p className="text-amber-700 text-sm mt-1">Apaga apenas o histórico de transações. Alunos e horários não serão afetados.</p>
                  <button 
                    onClick={resetFinancials}
                    className="mt-6 flex items-center space-x-2 px-6 py-3 bg-amber-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-amber-900/20"
                  >
                    <RefreshCcw size={18} />
                    <span>Zerar Apenas Financeiro</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
                  <AlertTriangle size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-black text-rose-900 leading-tight">Limpeza Total</h4>
                  <p className="text-rose-700 text-sm mt-1">Apaga absolutamente todos os dados deste dispositivo.</p>
                  <button 
                    onClick={resetSystem}
                    className="mt-6 flex items-center space-x-2 px-6 py-3 bg-rose-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-rose-900/20"
                  >
                    <RefreshCcw size={18} />
                    <span>Zerar Tudo e Recomeçar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
