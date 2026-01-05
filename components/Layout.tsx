
import React, { useState } from 'react';
import { 
  Users, LayoutDashboard, CalendarCheck, DollarSign, ShoppingBag, 
  LogOut, Award, Settings
} from 'lucide-react';
import { useAppContext } from '../AppContext';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeView: string;
  onViewChange: (view: string) => void;
}

const Logo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <div className={`${className} bg-white rounded-full overflow-hidden border border-slate-700 flex items-center justify-center p-0.5`}>
    <img 
      src="https://raw.githubusercontent.com/lucas-labs/assets/main/tree-bjj-logo.png" 
      alt="Tree BJJ Logo" 
      className="w-full h-full object-contain"
    />
  </div>
);

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange }) => {
  const { currentUser, setCurrentUser } = useAppContext();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN] },
    { id: 'students', label: 'Alunos', icon: Users, roles: [UserRole.ADMIN] },
    { id: 'attendance', label: 'Presença', icon: CalendarCheck, roles: [UserRole.ADMIN] },
    { id: 'financial', label: 'Financeiro', icon: DollarSign, roles: [UserRole.ADMIN] },
    { id: 'belt', label: 'Graduação', icon: Award, roles: [UserRole.ADMIN] },
    { id: 'store', label: 'Loja', icon: ShoppingBag, roles: [UserRole.ADMIN, UserRole.STUDENT] },
    { id: 'settings', label: 'Ajustes', icon: Settings, roles: [UserRole.ADMIN] },
  ];

  const filteredItems = menuItems.filter(item => currentUser && item.roles.includes(currentUser.role));

  const handleNav = (id: string) => {
    onViewChange(id);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white shrink-0">
        <div className="p-6 flex items-center space-x-3">
          <Logo className="w-12 h-12 shadow-lg shadow-black/20" />
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tighter leading-none">TREE</span>
            <span className="text-[10px] font-bold tracking-widest text-emerald-500">BRAZILIAN JIU JITSU</span>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {filteredItems.map(item => (
            <button key={item.id} onClick={() => handleNav(item.id)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeView === item.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={() => setCurrentUser(null)} className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors">
            <LogOut size={18} />
            <span className="text-sm font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto p-4 md:p-8 h-screen">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="hidden md:flex items-center justify-between mb-8">
            <h1 className="text-2xl font-black text-slate-800">
              {menuItems.find(i => i.id === activeView)?.label || 'Bem-vindo'}
            </h1>
            <div className="flex items-center space-x-4">
               <div className="flex items-center space-x-3 bg-white p-1.5 pr-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-sm">{currentUser?.name.charAt(0)}</div>
                <div className="text-left">
                  <p className="text-sm font-black text-slate-800 leading-none">{currentUser?.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">ADMINISTRAÇÃO</p>
                </div>
              </div>
            </div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
