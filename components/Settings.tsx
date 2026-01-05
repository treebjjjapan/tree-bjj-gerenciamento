
import React, { useState } from 'react';
import { 
  Plus, Trash2, AlertTriangle, RefreshCcw, Clock, DollarSign, CloudSync, Download, Upload, Share2, ShieldCheck, Link, Copy, Check
} from 'lucide-react';
import { useAppContext } from '../AppContext';
import { Plan, ClassSchedule, BeltColor } from '../types';

const JSON_BLOB_API = "https://jsonblob.com/api/jsonBlob";

const Settings: React.FC = () => {
  const { 
    plans, setPlans, schedules, setSchedules, graduationRules, setGraduationRules, 
    setFinancials, syncId, setSyncId, isSyncing, lastSync, forceSync
  } = useAppContext();
  const [activeTab, setActiveTab] = useState<'plans' | 'schedules' | 'grad' | 'sync' | 'system'>('sync');
  const [inputSyncId, setInputSyncId] = useState('');
  const [copied, setCopied] = useState(false);

  const generateNewCloudSync = async () => {
    if (!window.confirm("Isso criará um novo ID de nuvem exclusivo para sua academia. Deseja continuar?")) return;
    
    try {
      const response = await fetch(JSON_BLOB_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          academy: "Tree BJJ", 
          createdAt: new Date().toISOString(),
          students: [], attendance: [], financials: []
        })
      });
      const location = response.headers.get('Location');
      if (location) {
        const id = location.split('/').pop();
        if (id) {
          setSyncId(id);
          alert("ID de Nuvem Gerado! Use este código no smartphone para conectar.");
        }
      }
    } catch (err) {
      alert("Erro ao criar conexão de nuvem.");
    }
  };

  const connectToCloud = () => {
    if (!inputSyncId) return;
    if (window.confirm("Isso apagará os dados deste aparelho e baixará tudo da nuvem conectada. Deseja prosseguir?")) {
      setSyncId(inputSyncId);
      forceSync();
      alert("Dispositivo conectado! Os dados serão baixados agora.");
      window.location.reload();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(syncId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm w-fit">
        <button onClick={() => setActiveTab('sync')} className={`px-4 md:px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'sync' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Nuvem Real-Time</button>
        <button onClick={() => setActiveTab('plans')} className={`px-4 md:px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'plans' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Preços</button>
        <button onClick={() => setActiveTab('schedules')} className={`px-4 md:px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'schedules' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Grade</button>
        <button onClick={() => setActiveTab('system')} className={`px-4 md:px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'system' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>Sistema</button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 md:p-8">
        {activeTab === 'sync' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100">
              <div className="flex-1">
                <h3 className="text-2xl font-black text-emerald-900 leading-tight">Sincronização em Tempo Real</h3>
                <p className="text-emerald-700 text-sm font-medium mt-2">Ative esta função para que o PC e o Celular compartilhem os mesmos dados instantaneamente.</p>
                {lastSync && (
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-4 flex items-center gap-2">
                    <Check size={12} /> Última sincronização: {lastSync.toLocaleString()}
                  </p>
                )}
              </div>
              {!syncId && (
                <button 
                  onClick={generateNewCloudSync}
                  className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/20"
                >
                  Ativar Nuvem Agora
                </button>
              )}
            </div>

            {syncId ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 p-8 rounded-[2rem] text-white">
                  <div className="flex items-center space-x-3 mb-6">
                    <ShieldCheck className="text-emerald-400" size={24} />
                    <h4 className="font-black text-sm uppercase tracking-widest">Sua Chave de Acesso</h4>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/10 p-4 rounded-xl border border-white/10">
                    <code className="flex-1 font-mono text-xs text-emerald-300 break-all">{syncId}</code>
                    <button 
                      onClick={copyToClipboard}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      title="Copiar ID"
                    >
                      {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-6 leading-relaxed">
                    Instrução: Copie este código e insira na aba Ajustes do seu outro aparelho (Celular ou Tablet).
                  </p>
                </div>

                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 border-dashed flex flex-col items-center justify-center text-center">
                   <CloudSync size={48} className="text-slate-300 mb-4" />
                   <h4 className="font-black text-slate-800">Conexão Ativa</h4>
                   <p className="text-xs text-slate-500 font-medium mt-2 max-w-[200px]">Este dispositivo está salvando e puxando dados automaticamente.</p>
                   <button 
                     onClick={() => { if(window.confirm("Deseja desconectar da nuvem?")) setSyncId('') }}
                     className="mt-6 text-[10px] font-black text-rose-500 uppercase tracking-widest border-b border-rose-200"
                   >
                     Desconectar Nuvem
                   </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                <h4 className="font-black text-slate-800 mb-4">Conectar a um ID Existente</h4>
                <p className="text-sm text-slate-500 mb-6 font-medium">Se você já ativou a nuvem no PC, insira o ID aqui para puxar os dados.</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input 
                    type="text" 
                    placeholder="Cole o ID da nuvem aqui..." 
                    className="flex-1 px-4 py-4 bg-white border-none rounded-2xl text-sm font-bold shadow-sm focus:ring-2 focus:ring-emerald-500"
                    value={inputSyncId}
                    onChange={(e) => setInputSyncId(e.target.value)}
                  />
                  <button 
                    onClick={connectToCloud}
                    className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all"
                  >
                    Conectar e Sincronizar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
               <h3 className="text-xl font-black text-slate-800">Tabela de Preços (Yen)</h3>
               <button onClick={() => setPlans([...plans, { id: Math.random().toString(), name: 'Novo Plano', price: 0, durationMonths: 1 }])} className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"><Plus size={16}/><span>Criar Plano</span></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {plans.map(plan => (
                <div key={plan.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                  <div className="flex justify-between items-center">
                     <input className="bg-transparent border-none font-black text-slate-800 focus:ring-0 p-0 w-full" value={plan.name} onChange={e => setPlans(plans.map(p => p.id === plan.id ? {...p, name: e.target.value} : p))} />
                     <button onClick={() => setPlans(plans.filter(p => p.id !== plan.id))} className="text-slate-300 hover:text-rose-500"><Trash2 size={16}/></button>
                  </div>
                  <div className="flex items-center space-x-4">
                     <div className="flex-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase">Valor (¥)</label>
                        <input type="number" className="w-full mt-1 bg-white border-none rounded-xl text-sm font-bold" value={plan.price} onChange={e => setPlans(plans.map(p => p.id === plan.id ? {...p, price: parseFloat(e.target.value)} : p))} />
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-4">
            <div className="bg-rose-50 border border-rose-100 p-6 rounded-3xl">
              <h4 className="text-lg font-black text-rose-900">Limpeza Total</h4>
              <p className="text-rose-700 text-sm mt-1">Apaga todos os dados deste dispositivo.</p>
              <button 
                onClick={() => { if(window.confirm("Apagar tudo?")) { localStorage.clear(); window.location.reload(); } }}
                className="mt-6 px-6 py-3 bg-rose-600 text-white rounded-2xl font-black text-sm"
              >
                Resetar Sistema
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
