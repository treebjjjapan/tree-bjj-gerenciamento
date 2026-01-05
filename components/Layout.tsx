
import React, { useState } from 'react';
import { 
  Users, 
  LayoutDashboard, 
  CalendarCheck, 
  DollarSign, 
  ShoppingBag, 
  Bell, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  Award
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
      onError={(e) => {
        // Fallback if image not found - using a styled placeholder that looks like the logo
        e.currentTarget.style.display = 'none';
        e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full bg-slate-900 rounded-full flex items-center justify-center"><span class="text-[8px] font-black text-white">TREE</span></div>';
      }}
    />
  </div>
);

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange }) => {
  const { currentUser, setCurrentUser, notifications } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.PROFESSOR] },
    { id: 'students', label: 'Alunos', icon: Users, roles: [UserRole.ADMIN, UserRole.PROFESSOR] },
    { id: 'attendance', label: 'Presença', icon: CalendarCheck, roles: [UserRole.ADMIN, UserRole.PROFESSOR] },
    { id: 'financial', label: 'Financeiro', icon: DollarSign, roles: [UserRole.ADMIN] },
    { id: 'belt', label: 'Graduação', icon: Award, roles: [UserRole.ADMIN, UserRole.PROFESSOR] },
    { id: 'store', label: 'Loja', icon: ShoppingBag, roles: [UserRole.ADMIN, UserRole.PROFESSOR, UserRole.STUDENT] },
  ];

  const filteredItems = menuItems.filter(item => currentUser && item.roles.includes(currentUser.role));

  const handleNav = (id: string) => {
    onViewChange(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
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
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeView === item.id 
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold ring-2 ring-slate-800">
              {currentUser?.name.charAt(0)}
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium truncate">{currentUser?.name}</p>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-wider">{currentUser?.role}</p>
            </div>
          </div>
          <button 
            onClick={() => setCurrentUser(null)}
            className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <Logo className="w-9 h-9" />
          <span className="text-lg font-black tracking-tighter">TREE BJJ</span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="relative p-2 rounded-xl hover:bg-slate-50">
            <Bell size={20} className="text-slate-600" />
            {notifications.length > 0 && (
              <span className="absolute top-2 right-2 w-3.5 h-3.5 bg-rose-500 text-white text-[8px] flex items-center justify-center rounded-full font-bold border-2 border-white">
                {notifications.length}
              </span>
            )}
          </button>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 rounded-xl bg-slate-900 text-white">
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-slate-900 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-6 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <Logo className="w-10 h-10" />
                <span className="text-xl font-black text-white tracking-tighter">Menu</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 p-2 hover:bg-slate-800 rounded-full">
                <X size={24} />
              </button>
            </div>
            <nav className="p-4 space-y-2">
              {filteredItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                    activeView === item.id 
                      ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/40' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <item.icon size={22} />
                    <span className="text-lg font-medium">{item.label}</span>
                  </div>
                  <ChevronRight size={18} opacity={0.5} />
                </button>
              ))}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-800">
              <button 
                onClick={() => setCurrentUser(null)}
                className="w-full flex items-center justify-center space-x-2 p-4 bg-rose-500/10 text-rose-500 rounded-2xl font-bold"
              >
                <LogOut size={20} />
                <span>Encerrar Sessão</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto p-4 md:p-8 h-full">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Bar for Desktop */}
          <div className="hidden md:flex items-center justify-between mb-8">
            <h1 className="text-2xl font-black text-slate-800">
              {menuItems.find(i => i.id === activeView)?.label || 'Bem-vindo'}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                  <Bell size={20} />
                </button>
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white"></span>
                )}
              </div>
              <div className="h-10 w-px bg-slate-200"></div>
              <div className="flex items-center space-x-3 bg-white p-1.5 pr-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-sm">
                  {currentUser?.name.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-slate-800 leading-none">{currentUser?.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{currentUser?.role}</p>
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
