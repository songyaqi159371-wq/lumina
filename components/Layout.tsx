import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Compass, Layers, Home, Menu, X, Feather, Sparkle } from 'lucide-react';

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
    { path: '/practice', label: '练习', icon: Layers },
    { path: '/divination', label: '占卜', icon: Compass },
  ];

  return (
    <div className="min-h-screen bg-mystic-900 text-slate-200 font-sans selection:bg-mystic-500 selection:text-white">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-mystic-800 border-b border-mystic-700 sticky top-0 z-50">
        <div className="flex items-center gap-2">
            <Feather className="text-mystic-gold w-6 h-6" />
            <h1 className="text-xl font-serif text-mystic-gold font-bold">Lumina Tarot</h1>
        </div>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 text-white">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={`
            fixed lg:static inset-y-0 left-0 z-40 w-64 bg-mystic-900 border-r border-mystic-700 
            transform transition-transform duration-300 ease-in-out lg:transform-none
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="p-6 hidden lg:flex items-center gap-3">
             <Feather className="text-mystic-gold w-8 h-8" />
            <h1 className="text-2xl font-serif text-mystic-gold font-bold">Lumina</h1>
          </div>

          <nav className="mt-6 px-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-4 px-4 py-3 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-mystic-700 text-mystic-gold shadow-lg shadow-mystic-900/50' 
                      : 'text-slate-400 hover:bg-mystic-800 hover:text-white'}
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

           <div className="absolute bottom-0 w-full p-4 border-t border-mystic-800">
              <div className="text-xs text-center text-slate-500">
                  © 2024 Lumina Tarot<br/>Symbolic Wisdom
              </div>
           </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-mystic-800 via-mystic-900 to-black">
          <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;