
import React, { useState } from 'react';
import { 
  QrCode, 
  CheckCircle2, 
  Search, 
  History, 
  UserCheck 
} from 'lucide-react';
import { useAppContext } from '../AppContext';

const Attendance: React.FC = () => {
  const { students, addAttendance, attendance } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showQR, setShowQR] = useState(false);

  const filteredStudents = students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Check-in de Aula</h2>
        <button 
          onClick={() => setShowQR(!showQR)}
          className="flex items-center space-x-2 px-4 py-2 bg-slate-800 text-white rounded-xl font-bold text-sm"
        >
          <QrCode size={18} />
          <span>{showQR ? 'Ocultar QR' : 'Modo Totem (QR)'}</span>
        </button>
      </div>

      {showQR ? (
        <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center space-y-6 animate-in zoom-in-95">
          <div className="p-8 bg-slate-50 rounded-[2rem] shadow-inner">
             <div className="w-48 h-48 bg-white border-8 border-slate-900 rounded-lg flex items-center justify-center p-4">
                {/* Mock QR */}
                <div className="grid grid-cols-4 gap-1 w-full h-full opacity-80">
                   {Array.from({length: 16}).map((_, i) => (
                      <div key={i} className={`rounded-sm ${Math.random() > 0.5 ? 'bg-slate-900' : 'bg-transparent'}`}></div>
                   ))}
                </div>
             </div>
          </div>
          <div>
            <h3 className="text-2xl font-extrabold text-slate-800">Aponte a Câmera</h3>
            <p className="text-slate-500 max-w-xs mt-2">Os alunos podem fazer o check-in rápido aproximando o QR Code do sistema no celular deles.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Pesquisar aluno para check-in..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {filteredStudents.map(student => (
                  <div key={student.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                    <div className="flex items-center space-x-3">
                      <img src={student.photoUrl} className="w-10 h-10 rounded-xl" />
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{student.name}</p>
                        <p className="text-xs text-slate-500">{student.belt} • {student.attendanceCount} aulas</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => addAttendance(student.id)}
                      className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                      title="Registrar Presença"
                    >
                      <UserCheck size={22} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center space-x-2 mb-6">
                <History className="text-slate-400" size={20} />
                <h3 className="font-bold text-slate-800">Aula Atual</h3>
              </div>
              
              <div className="space-y-4">
                {attendance.length > 0 ? attendance.slice(0, 8).map((a, idx) => (
                  <div key={idx} className="flex items-center space-x-3 animate-in slide-in-from-right duration-300">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <CheckCircle2 size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">{a.studentName}</p>
                      <p className="text-[10px] text-slate-400 font-medium uppercase">{a.time}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-slate-400 italic">Nenhum aluno registrou presença ainda.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
