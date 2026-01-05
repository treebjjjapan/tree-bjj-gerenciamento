
import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  CheckCircle2, 
  Search, 
  History, 
  UserCheck,
  Monitor,
  ArrowLeft,
  Search as SearchIcon
} from 'lucide-react';
import { useAppContext } from '../AppContext';

const Attendance: React.FC = () => {
  const { students, addAttendance, attendance } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [mode, setMode] = useState<'admin' | 'totem'>('admin');
  const [lastCheckin, setLastCheckin] = useState<string | null>(null);

  const activeStudents = students.filter(s => s.status === 'Ativo');
  const filteredStudents = activeStudents.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckin = (studentId: string, studentName: string) => {
    addAttendance(studentId);
    setLastCheckin(studentName);
    if (mode === 'totem') {
      setSearchTerm(''); // Limpa busca no totem após check-in
      setTimeout(() => setLastCheckin(null), 3000); // Esconde mensagem após 3s
    }
  };

  if (mode === 'totem') {
    return (
      <div className="fixed inset-0 z-[200] bg-slate-900 flex flex-col p-6 animate-in fade-in duration-500">
        <div className="max-w-4xl mx-auto w-full flex flex-col h-full space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-2">
                 <img src="https://raw.githubusercontent.com/lucas-labs/assets/main/tree-bjj-logo.png" alt="Tree BJJ" className="w-full h-full object-contain" />
               </div>
               <div>
                  <h1 className="text-3xl font-black text-white leading-none">AUTO CHECK-IN</h1>
                  <p className="text-emerald-500 font-bold uppercase tracking-widest text-xs mt-1">Toque no seu nome para entrar</p>
               </div>
            </div>
            <button 
              onClick={() => setMode('admin')}
              className="p-3 bg-slate-800 text-slate-400 rounded-2xl hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
          </div>

          {lastCheckin && (
            <div className="bg-emerald-500 text-white p-6 rounded-[2rem] flex items-center justify-center space-x-4 animate-in zoom-in-95 shadow-2xl shadow-emerald-500/20">
               <CheckCircle2 size={40} />
               <div className="text-center">
                  <p className="text-2xl font-black">BEM-VINDO, {lastCheckin.toUpperCase()}!</p>
                  <p className="font-bold opacity-80 uppercase text-sm tracking-widest">Treino registrado com sucesso. OSS!</p>
               </div>
            </div>
          )}

          <div className="relative">
            <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={32} />
            <input 
              type="text" 
              placeholder="Digite seu nome..."
              className="w-full pl-20 pr-8 py-8 bg-slate-800 border-none rounded-[2.5rem] text-2xl font-black text-white focus:ring-4 focus:ring-emerald-500/50 transition-all placeholder:text-slate-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex-1 overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-4 pb-8 scrollbar-hide">
            {filteredStudents.slice(0, 12).map(student => (
              <button 
                key={student.id}
                onClick={() => handleCheckin(student.id, student.name)}
                className="bg-white rounded-[2rem] p-4 flex flex-col items-center justify-center space-y-4 hover:scale-105 active:scale-95 transition-all shadow-xl group"
              >
                <div className="relative">
                  <img src={student.photoUrl} className="w-24 h-24 rounded-[1.5rem] object-cover shadow-lg border-4 border-slate-50" />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white border-4 border-white">
                    <UserCheck size={16} />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-lg font-black text-slate-900 leading-tight">{student.name.split(' ')[0]}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{student.belt}</p>
                </div>
              </button>
            ))}
            {filteredStudents.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-600">
                <p className="text-xl font-bold italic">Aluno não encontrado ou inativo.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-800">Controle de Presença</h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => setMode('totem')}
            className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all"
          >
            <Monitor size={18} />
            <span>MODO TOTEM</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Pesquisar aluno para check-in manual..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredStudents.map(student => (
                <div key={student.id} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-50 hover:border-emerald-200 hover:shadow-md transition-all group">
                  <div className="flex items-center space-x-4">
                    <img src={student.photoUrl} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                    <div>
                      <p className="font-black text-slate-800 text-sm leading-none">{student.name}</p>
                      <div className="flex items-center mt-2 space-x-2">
                         <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase">{student.belt}</span>
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{student.attendanceCount} treinos</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleCheckin(student.id, student.name)}
                    className="p-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-sm"
                    title="Registrar Presença"
                  >
                    <UserCheck size={24} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <History className="text-slate-400" size={20} />
                <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Treinos de Hoje</h3>
              </div>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-1 rounded-lg">
                {attendance.filter(a => a.date === new Date().toISOString().split('T')[0]).length} TOTAL
              </span>
            </div>
            
            <div className="space-y-4">
              {attendance.length > 0 ? attendance.slice(0, 10).map((a, idx) => (
                <div key={idx} className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50/50 border border-transparent hover:border-slate-100 transition-all animate-in slide-in-from-right duration-300">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <CheckCircle2 size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-800 truncate">{a.studentName}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{a.time} • {a.method}</p>
                  </div>
                </div>
              )) : (
                <div className="py-12 text-center text-slate-400 flex flex-col items-center">
                  <History size={40} className="mb-2 opacity-20" />
                  <p className="text-xs font-medium italic">Nenhum check-in registrado.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
