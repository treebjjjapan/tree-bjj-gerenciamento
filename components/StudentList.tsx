
import React, { useState, useRef, useCallback } from 'react';
import { 
  Plus, Search, Filter, Phone, Calendar, ChevronRight, Camera, X, RefreshCw
} from 'lucide-react';
import { useAppContext } from '../AppContext';
import { StudentStatus, BeltColor, Student } from '../types';
import { BELT_COLORS } from '../constants.tsx';

const StudentList: React.FC = () => {
  const { students, addStudent, setStudents, plans } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    birthDate: '',
    address: '',
    planId: plans[0]?.id || '',
    belt: BeltColor.WHITE,
    stripes: 0,
    status: StudentStatus.ACTIVE,
    photoUrl: ''
  });

  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Erro ao acessar a câmera", err);
      alert("Não foi possível acessar a câmera.");
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setFormData(prev => ({ ...prev, photoUrl: dataUrl }));
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

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
      photoUrl: formData.photoUrl || `https://picsum.photos/seed/${formData.name}/200`,
    });
    
    setShowAddModal(false);
    setFormData({
      name: '', email: '', phone: '', cpf: '', birthDate: '', address: '', planId: plans[0]?.id || '', belt: BeltColor.WHITE, stripes: 0, status: StudentStatus.ACTIVE, photoUrl: ''
    });
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
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-900/20 hover:bg-emerald-700 transition-all text-sm whitespace-nowrap"
        >
          <Plus size={18} />
          <span>Novo Aluno</span>
        </button>
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
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${BELT_COLORS[student.belt]}`}>{student.belt}</span>
                    <span className="text-slate-400 text-[10px] font-medium">• {student.stripes} Graus</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setStudents(prev => prev.filter(s => s.id !== student.id))} className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><X size={18} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4 py-4 border-t border-slate-50">
              <div className="flex items-center space-x-2">
                <Phone size={14} className="text-slate-400" />
                <span className="text-xs text-slate-600 truncate">{student.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={14} className="text-slate-400" />
                <span className="text-xs text-slate-600 truncate">{plans.find(p => p.id === student.planId)?.name || 'N/A'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-800">Novo Aluno</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 bg-slate-100 rounded-xl text-slate-400"><X size={24} /></button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Foto Section */}
              <div className="flex flex-col items-center justify-center mb-6">
                {isCameraActive ? (
                  <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-emerald-500 bg-black shadow-xl">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <button type="button" onClick={capturePhoto} className="absolute bottom-4 left-1/2 -translate-x-1/2 p-3 bg-emerald-500 text-white rounded-full shadow-lg"><Camera size={20}/></button>
                  </div>
                ) : (
                  <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-slate-100 bg-slate-50 shadow-inner flex items-center justify-center">
                    {formData.photoUrl ? (
                      <img src={formData.photoUrl} className="w-full h-full object-cover" />
                    ) : (
                      <Camera size={40} className="text-slate-300" />
                    )}
                    <button type="button" onClick={startCamera} className="absolute bottom-0 right-0 p-3 bg-slate-800 text-white rounded-full shadow-lg hover:bg-emerald-600 transition-all"><RefreshCw size={16} /></button>
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Nome</label>
                  <input required type="text" className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">WhatsApp</label>
                  <input required type="tel" className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase">Plano de Mensalidade</label>
                  <select className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500" value={formData.planId} onChange={e => setFormData({...formData, planId: e.target.value})}>
                    {plans.map(p => <option key={p.id} value={p.id}>{p.name} - R$ {p.price}</option>)}
                  </select>
                </div>
                <div>
                   <label className="text-xs font-bold text-slate-400 uppercase">Faixa</label>
                   <select className="w-full mt-1 px-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500" value={formData.belt} onChange={e => setFormData({...formData, belt: e.target.value as BeltColor})}>
                     {Object.values(BeltColor).map(b => <option key={b} value={b}>{b}</option>)}
                   </select>
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-lg shadow-emerald-900/20 mt-4 hover:bg-emerald-700 transition-all">Finalizar Cadastro</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;
