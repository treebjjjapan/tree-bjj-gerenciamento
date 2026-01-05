
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Phone, 
  Calendar,
  ChevronRight,
  Camera,
  X
} from 'lucide-react';
import { useAppContext } from '../AppContext';
import { StudentStatus, BeltColor, Student } from '../types';
import { BELT_COLORS } from '../constants.tsx';

const StudentList: React.FC = () => {
  const { students, addStudent, setStudents } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    birthDate: '',
    address: '',
    plan: 'Mensal',
    belt: BeltColor.WHITE,
    stripes: 0,
    status: StudentStatus.ACTIVE
  });

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return alert("Preencha ao menos Nome e Telefone");
    
    addStudent({
      ...formData,
      enrollmentDate: new Date().toISOString().split('T')[0],
      photoUrl: `https://picsum.photos/seed/${formData.name}/200`,
    });
    
    setShowAddModal(false);
    setFormData({
      name: '', email: '', phone: '', cpf: '', birthDate: '', address: '', plan: 'Mensal', belt: BeltColor.WHITE, stripes: 0, status: StudentStatus.ACTIVE
    });
  };

  const removeStudent = (id: string) => {
    if (window.confirm("Deseja realmente remover este aluno?")) {
      setStudents(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nome ou e-mail..."
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-3 bg-slate-50 rounded-2xl text-slate-600 hover:bg-slate-100 transition-colors">
            <Filter size={18} />
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 transition-all text-sm whitespace-nowrap"
          >
            <Plus size={18} />
            <span>Novo Aluno</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredStudents.map(student => (
          <div key={student.id} className="group bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img src={student.photoUrl} alt={student.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-slate-100" />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${student.status === StudentStatus.ACTIVE ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 leading-tight group-hover:text-emerald-600 transition-colors">{student.name}</h3>
                  <div className="flex items-center mt-1 space-x-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${BELT_COLORS[student.belt]}`}>
                      {student.belt}
                    </span>
                    <span className="text-slate-400 text-[10px] font-medium">• {student.stripes} Graus</span>
                  </div>
                </div>
              </div>
              <button onClick={() => removeStudent(student.id)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-50">
              <div className="flex items-center space-x-2">
                <Phone size={14} className="text-slate-400" />
                <span className="text-xs text-slate-600 truncate">{student.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={14} className="text-slate-400" />
                <span className="text-xs text-slate-600 truncate">{student.plan}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                   <div key={i} className={`w-3 h-6 ${i <= student.stripes ? 'bg-slate-800' : 'bg-slate-200'} rounded-sm border border-white shadow-sm`}></div>
                ))}
              </div>
              <button className="flex items-center text-xs font-bold text-emerald-600 hover:underline">
                {student.attendanceCount} aulas <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-800">Novo Aluno</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 bg-slate-100 rounded-xl text-slate-400">
                <X size={24} />
              </button>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nome Completo</label>
                  <input 
                    required
                    type="text" 
                    className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500" 
                    placeholder="Ex: João Silva" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">CPF</label>
                    <input 
                      type="text" 
                      className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500" 
                      placeholder="000.000.000-00" 
                      value={formData.cpf}
                      onChange={e => setFormData({...formData, cpf: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nascimento</label>
                    <input 
                      type="date" 
                      className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500" 
                      value={formData.birthDate}
                      onChange={e => setFormData({...formData, birthDate: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">WhatsApp</label>
                    <input 
                      required
                      type="tel" 
                      className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500" 
                      placeholder="(11) 9 9999-9999" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Plano</label>
                    <select 
                      className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500"
                      value={formData.plan}
                      onChange={e => setFormData({...formData, plan: e.target.value})}
                    >
                      <option>Mensal</option>
                      <option>Trimestral</option>
                      <option>Semestral</option>
                      <option>Anual</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Faixa Atual</label>
                    <select 
                      className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500"
                      value={formData.belt}
                      onChange={e => setFormData({...formData, belt: e.target.value as BeltColor})}
                    >
                      {Object.values(BeltColor).map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Graus</label>
                    <select 
                      className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500"
                      value={formData.stripes}
                      onChange={e => setFormData({...formData, stripes: parseInt(e.target.value)})}
                    >
                      {[0,1,2,3,4].map(n => <option key={n} value={n}>{n} Graus</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-900/20 mt-4 hover:bg-emerald-700 transition-all">
                Finalizar Cadastro
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
