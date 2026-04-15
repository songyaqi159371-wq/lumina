import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Home, Menu, X, Feather, Sparkle, Eye, Lightbulb, History } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: '首页', icon: Home },
    { path: '/learn', label: '图鉴', icon: BookOpen },
    { path: '/symbols', label: '象征', icon: Sparkle },
    { path: '/divine', label: '占卜', icon: Eye },
    { path: '/history', label: '档案', icon: History },
    { path: '/practice', label: '练习', icon: Lightbulb },
  ];

  return (
    <div className="min-h-screen text-slate-200 font-sans selection:bg-mystic-500 selection:text-white">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 glass border-b border-mystic-800 sticky top-0 z-50">
        <div className="flex items-center gap-2">
            <Feather className="text-mystic-gold w-6 h-6" />
            <h1 className="text-xl font-serif text-mystic-gold font-bold tracking-widest uppercase">Lumina</h1>
        </div>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 text-white">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      <div className="flex h-screen overflow-hidden relative">
        {/* Sidebar */}
        <aside 
          className={`
            fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#020617]/40 backdrop-blur-3xl border-r border-white/5
            transform transition-all duration-500 ease-in-out lg:transform-none
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="p-10 hidden lg:flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-mystic-600 to-mystic-400 flex items-center justify-center shadow-[0_0_20px_rgba(109,40,217,0.3)]">
                <Feather className="text-mystic-gold w-6 h-6" />
            </div>
            <h1 className="text-2xl font-serif text-white font-bold tracking-tighter uppercase italic">Lumina</h1>
          </div>

          <nav className="mt-8 px-6 space-y-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-500
                    ${isActive 
                      ? 'bg-white/5 text-mystic-gold border border-white/10 shadow-[inset_0_0_15px_rgba(251,191,36,0.05)]' 
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'}
                  `}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-500 ${isActive ? 'scale-110 text-mystic-gold' : 'group-hover:scale-110'}`} />
                  <span className={`font-serif tracking-widest text-xs uppercase ${isActive ? 'font-bold' : 'font-light'}`}>{item.label}</span>
                  {isActive && <div className="ml-auto w-1 h-1 rounded-full bg-mystic-gold shadow-[0_0_8px_#fbbf24]"></div>}
                </Link>
              );
            })}
          </nav>

           <div className="absolute bottom-10 w-full px-10">
               <div className="text-[10px] text-slate-500 font-serif tracking-widest leading-relaxed uppercase opacity-40">
                   Established 2025<br/>
                   Divine Intelligence
               </div>
           </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto relative">
          <div className="p-6 lg:p-12 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;