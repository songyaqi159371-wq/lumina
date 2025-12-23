import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Home, Menu, X, Feather, Sparkle, Eye, Lightbulb } from 'lucide-react';

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
    { path: '/practice', label: '练习', icon: Lightbulb },
  ];

  return (
    <div className="min-h-screen bg-mystic-950 text-slate-200 font-sans selection:bg-mystic-500 selection:text-white">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 glass border-b border-mystic-800 sticky top-0 z-50">
        <div className="flex items-center gap-2">
            <Feather className="text-mystic-gold w-6 h-6" />
            <h1 className="text-xl font-serif text-mystic-gold font-bold tracking-widest">Lumina</h1>
        </div>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 text-white">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={`
            fixed lg:static inset-y-0 left-0 z-40 w-64 bg-mystic-950 border-r border-mystic-800/50
            transform transition-transform duration-500 ease-in-out lg:transform-none
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="p-8 hidden lg:flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-mystic-600 to-mystic-800 flex items-center justify-center shadow-lg shadow-mystic-900">
                <Feather className="text-mystic-gold w-6 h-6" />
            </div>
            <h1 className="text-2xl font-serif text-mystic-gold font-bold tracking-tighter">Lumina</h1>
          </div>

          <nav className="mt-4 px-4 space-y-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300
                    ${isActive 
                      ? 'bg-mystic-800/60 text-mystic-gold shadow-xl border border-mystic-700/50 translate-x-1' 
                      : 'text-slate-400 hover:bg-mystic-800/30 hover:text-mystic-300 hover:translate-x-1'}
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-mystic-gold' : 'text-slate-500'}`} />
                  <span className="font-serif tracking-wide text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>

           <div className="absolute bottom-8 w-full px-8 text-[10px] text-slate-600 font-serif tracking-widest leading-relaxed">
               LUMINA TAROT SYSTEM<br/>
               <span className="opacity-50 uppercase">Rider-Waite-Smith Era</span>
           </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto relative bg-[radial-gradient(circle_at_50%_0%,_#1e1b4b_0%,_#020617_70%)]">
          <div className="p-4 lg:p-10 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;