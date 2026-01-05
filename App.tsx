
import React, { useState } from 'react';
import { AppProvider, useAppContext } from './AppContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import Attendance from './components/Attendance';
import Financial from './components/Financial';
import Store from './components/Store';
import Settings from './components/Settings';
import { UserRole } from './types';
import { Award, ChevronRight, Settings as SettingsIcon } from 'lucide-react';
import { BELT_COLORS } from './constants.tsx';

const ViewRenderer: React.FC<{ activeView: string }> = ({ activeView }) => {
  switch (activeView) {
    case 'dashboard': return <Dashboard />;
    case 'students': return <StudentList />;
    case 'attendance': return <Attendance />;
    case 'financial': return <Financial />;
    case 'store': return <Store />;
    case 'belt': return <BeltView />;
    case 'settings': return <Settings />;
    default: return <Dashboard />;
  }
};

const BeltView: React.FC = () => {
  const { students, graduationRules } = useAppContext();
  
  const isApt = (student: any) => {
    const rule = graduationRules.find(r => r.belt === student.belt);
    return rule ? student.attendanceCount >= rule.classesRequired : false;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
         <div>
            <h2 className="text-2xl font-black text-slate-800">Caminho do Guerreiro</h2>
            <p className="text-slate-500 text-sm">Alunos que atingiram o critério de aulas definido nas configurações.</p>
         </div>
         <Award size={48} className="text-amber-500 opacity-20" />
      </div>

      <div className="space-y-4">
        {students.map(s => {
          const rule = graduationRules.find(r => r.belt === s.belt);
          const progress = rule ? Math.min((s.attendanceCount / rule.classesRequired) * 100, 100) : 0;
          
          return (
            <div key={s.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-6">
              <div className="flex items-center space-x-4 flex-1">
                <img src={s.photoUrl} className="w-16 h-16 rounded-2xl object-cover" />
                <div>
                  <h3 className="font-bold text-slate-800">{s.name}</h3>
                  <div className="flex items-center mt-1 space-x-2">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${BELT_COLORS[s.belt]}`}>{s.belt}</span>
                    <span className="text-slate-400 text-xs">{s.stripes} Graus</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-8 flex-1">
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Aulas</p>
                  <p className="text-xl font-black text-slate-800">{s.attendanceCount}</p>
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Meta: {rule?.classesRequired || '--'} aulas</p>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${progress >= 100 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{width: `${progress}%`}}></div>
                  </div>
                </div>
              </div>

              {progress >= 100 && (
                <button className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-900/20">
                  <Award size={16} />
                  <span>Promover</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const LoginScreen: React.FC = () => {
  const { setCurrentUser } = useAppContext();
  
  const handleLogin = (role: UserRole) => {
    setCurrentUser({
      id: Math.random().toString(),
      name: role === UserRole.ADMIN ? 'Anderson Marques' : role === UserRole.PROFESSOR ? 'Professor Rodrigo' : 'Aluno Demo',
      role,
      email: `${role.toLowerCase()}@treebjj.com`
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-600 rounded-full blur-[120px]"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-rose-600 rounded-full blur-[120px]"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-white rounded-[3.5rem] p-10 shadow-2xl shadow-black/50 border border-white/20">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-32 h-32 bg-slate-900 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-black/30 border-4 border-white overflow-hidden p-2">
               <img src="https://raw.githubusercontent.com/lucas-labs/assets/main/tree-bjj-logo.png" alt="Tree BJJ" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Tree BJJ</h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-2 bg-slate-100 px-4 py-1 rounded-full">Sistema de Gestão</p>
          </div>
          <div className="space-y-4">
            <button onClick={() => handleLogin(UserRole.ADMIN)} className="w-full p-4 bg-slate-50 hover:bg-emerald-50 border border-slate-100 rounded-[2rem] flex items-center justify-between group transition-all">
              <div className="flex items-center space-x-4 text-left">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl shadow-md flex items-center justify-center text-white font-black border border-slate-800">A</div>
                <div>
                  <p className="font-black text-slate-800 leading-none">Administrador</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Controle Total</p>
                </div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-emerald-500 transition-colors" size={20} />
            </button>
            <button onClick={() => handleLogin(UserRole.PROFESSOR)} className="w-full p-4 bg-slate-50 hover:bg-blue-50 border border-slate-100 rounded-[2rem] flex items-center justify-between group transition-all">
              <div className="flex items-center space-x-4 text-left">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl shadow-md flex items-center justify-center text-white font-black border border-blue-500">P</div>
                <div>
                  <p className="font-black text-slate-800 leading-none">Professor</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Aulas e Graduações</p>
                </div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-blue-500 transition-colors" size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MainApp: React.FC = () => {
  const { currentUser } = useAppContext();
  const [activeView, setActiveView] = useState('dashboard');

  if (!currentUser) return <LoginScreen />;

  return (
    <Layout activeView={activeView} onViewChange={setActiveView}>
      <ViewRenderer activeView={activeView} />
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
};

export default App;
