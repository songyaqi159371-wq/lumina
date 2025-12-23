import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    Star, Sparkle, BookOpen, 
    Eye, ScrollText, PlayCircle, 
    Moon, Sun, Compass, Zap,
    Trophy, Flame
} from 'lucide-react';
import { getProgress, saveProgress } from '../services/storage';
import { tarotDeck } from '../constants';
import CardFlip from '../components/CardFlip';
import { UserProgress } from '../types';

const Home: React.FC = () => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const data = getProgress();
    const today = new Date().toISOString().split('T')[0];
    setIsRevealed(data.dailyDraw.date === today);
    setProgress(data);
  }, []);

  const handleDailyDraw = () => {
    if (!progress) return;
    const today = new Date().toISOString().split('T')[0];
    if (progress.dailyDraw.date === today && progress.dailyDraw.cardId !== null) {
        setIsRevealed(true);
        return;
    }
    const randomCard = tarotDeck[Math.floor(Math.random() * tarotDeck.length)];
    const isReversed = Math.random() > 0.5;
    const newProgress = {
        ...progress,
        dailyDraw: { date: today, cardId: randomCard.id, isReversed, note: '' },
        learnedCards: Array.from(new Set([...progress.learnedCards, randomCard.id]))
    };
    saveProgress(newProgress);
    setProgress(newProgress);
    setTimeout(() => setIsRevealed(true), 100);
  };

  if (!progress) return null;

  const dailyCard = progress.dailyDraw.cardId !== null 
    ? tarotDeck.find(c => c.id === progress.dailyDraw.cardId) 
    : null;

  return (
    <div className="relative space-y-32 animate-flip-in pb-32">
      {/* --- BACKGROUND MYSTIC ELEMENTS --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[800px] pointer-events-none -z-10">
          <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-mystic-500/10 blur-[120px] rounded-full animate-pulse-slow"></div>
          <div className="absolute top-[30%] right-[20%] w-[500px] h-[500px] bg-mystic-700/10 blur-[150px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/sacred-geometry.png')] opacity-5"></div>
      </div>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-20 text-center flex flex-col items-center">
        <div className="relative z-10 max-w-5xl px-4">
            <div className="flex items-center justify-center gap-4 mb-10 opacity-60">
                <div className="h-px w-24 bg-gradient-to-r from-transparent to-mystic-gold"></div>
                <Sun size={20} className="text-mystic-gold animate-spin-slow" />
                <div className="h-px w-24 bg-gradient-to-l from-transparent to-mystic-gold"></div>
            </div>
            
            <h1 className="text-7xl lg:text-[10rem] font-serif text-white mb-6 leading-none tracking-tighter">
                <span className="opacity-30 block text-3xl lg:text-4xl tracking-[0.8em] mb-6 font-light">ARCHIVE OF</span>
                <span className="shimmer-text block uppercase font-bold drop-shadow-[0_0_30px_rgba(251,191,36,0.2)]">Lumina</span>
            </h1>
            
            <p className="text-slate-400 max-w-3xl mx-auto text-xl lg:text-2xl font-light leading-relaxed tracking-widest opacity-70 mb-16">
                开启阿卡纳的封印，在象征的迷宫中聆听来自宇宙的低语。
            </p>

            {/* --- CRYSTAL BALL ELEMENT --- */}
            <div className="relative flex justify-center mb-10">
                <div className="w-56 h-56 relative group">
                    {/* Glowing Orbs */}
                    <div className="absolute inset-0 bg-mystic-gold/20 rounded-full blur-[60px] group-hover:bg-mystic-gold/40 transition-all duration-1000 animate-pulse"></div>
                    <div className="absolute -inset-4 border border-mystic-gold/10 rounded-full animate-spin-slow"></div>
                    <div className="absolute -inset-8 border border-white/5 rounded-full animate-reverse-spin-slow"></div>
                    
                    {/* The Ball */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-mystic-950 via-mystic-800 to-mystic-700 border border-white/10 shadow-inner overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent)]"></div>
                        <div className="relative">
                            <Sparkle size={48} className="text-mystic-gold animate-pulse drop-shadow-[0_0_15px_#fbbf24]" />
                            <div className="absolute inset-0 blur-xl bg-mystic-gold/30 rounded-full"></div>
                        </div>
                        {/* Swirling Mists */}
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/dust.png')] animate-pulse"></div>
                    </div>
                    
                    {/* Base */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-6 bg-mystic-900 border-t border-mystic-gold/30 rounded-t-full shadow-2xl"></div>
                </div>
            </div>
        </div>
      </header>

      {/* --- DAILY RITUAL (The Ritual Aspect) --- */}
      <section className="relative px-4">
        <div className="max-w-6xl mx-auto">
            <div className="glass-card rounded-[4rem] overflow-hidden border-white/5 shadow-[0_0_120px_rgba(0,0,0,0.6)] group/section">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Card Presentation */}
                    <div className="bg-black/40 p-16 lg:p-28 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.05),transparent)]"></div>
                        
                        <div className="relative z-10 animate-float">
                            <div className={`absolute -inset-24 rounded-full blur-[120px] transition-all duration-1000 ${isRevealed ? 'bg-mystic-gold/20' : 'bg-mystic-600/10'}`}></div>
                            
                            <CardFlip 
                                card={dailyCard || null} 
                                isReversed={progress.dailyDraw.isReversed} 
                                isRevealed={isRevealed} 
                                onClick={handleDailyDraw}
                                width="w-64 md:w-80"
                                height="h-[36rem]"
                            />

                            {!isRevealed && (
                                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-full text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-mystic-gold animate-ping"></div>
                                        <p className="text-xs text-mystic-gold font-serif tracking-[0.4em] uppercase">Pending Intent</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Ritual Meaning */}
                    <div className="p-16 lg:p-24 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-white/5 bg-mystic-900/20 backdrop-blur-sm">
                        <div className="absolute top-0 right-0 p-16 opacity-[0.02] pointer-events-none">
                            <Compass size={400} className="rotate-12 animate-spin-slow" />
                        </div>

                        {!isRevealed ? (
                            <div className="space-y-12 animate-flip-in">
                                <div className="space-y-4">
                                    <span className="text-xs text-mystic-gold uppercase tracking-[0.6em] block opacity-50 font-serif">Daily Communion</span>
                                    <h3 className="text-6xl font-serif text-white tracking-widest leading-tight italic">今日契约</h3>
                                </div>
                                <p className="text-slate-400 text-xl font-light leading-loose italic pl-8 border-l-2 border-mystic-gold/20">
                                    “放下杂念。这不只是抽牌，而是你与潜意识的一次共振。今天，宇宙想通过象征向你传达什么？”
                                </p>
                                <button 
                                    onClick={handleDailyDraw}
                                    className="group relative px-16 py-6 bg-gradient-to-tr from-mystic-gold to-yellow-600 text-mystic-950 rounded-2xl transition-all font-bold active:scale-95 flex items-center justify-center gap-4 shadow-2xl shadow-mystic-gold/20 hover:shadow-mystic-gold/40"
                                >
                                    <Flame size={20} className="animate-pulse" />
                                    <span className="tracking-[0.3em] uppercase text-sm">唤醒感应</span>
                                </button>
                            </div>
                        ) : dailyCard && (
                            <div className="space-y-12 animate-flip-in">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-mystic-gold mb-2">
                                        <Sparkle size={14} className="animate-spin-slow" />
                                        <span className="text-xs font-serif uppercase tracking-[0.4em] opacity-60">The Revelation</span>
                                    </div>
                                    <h4 className="text-7xl font-serif text-white tracking-tighter uppercase">
                                        {dailyCard.nameCn}
                                        {progress.dailyDraw.isReversed && (
                                            <span className="ml-4 text-red-500/60 text-3xl font-sans font-light">(Reversed)</span>
                                        )}
                                    </h4>
                                    <p className="text-mystic-gold/50 font-serif text-sm tracking-[0.3em] uppercase">{dailyCard.nameEn}</p>
                                </div>

                                <div className="relative">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-mystic-gold to-transparent opacity-30"></div>
                                    <p className="text-slate-200 leading-relaxed font-light text-2xl italic pl-8">
                                        {progress.dailyDraw.isReversed ? dailyCard.meaningDown : dailyCard.meaningUp}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-10 pt-10">
                                    <Link to={`/learn?id=${dailyCard.id}`} className="group flex items-center gap-5">
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:border-mystic-gold/40 transition-all shadow-xl">
                                            <BookOpen size={20} className="text-mystic-gold" />
                                        </div>
                                        <div className="text-left">
                                            <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Wisdom</span>
                                            <span className="block text-sm text-white group-hover:text-mystic-gold transition-colors font-serif">深入图鉴</span>
                                        </div>
                                    </Link>
                                    <Link to="/divine" className="group flex items-center gap-5">
                                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:border-indigo-400/40 transition-all shadow-xl">
                                            <Eye size={20} className="text-indigo-400" />
                                        </div>
                                        <div className="text-left">
                                            <span className="block text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Ritual</span>
                                            <span className="block text-sm text-white group-hover:text-indigo-400 transition-colors font-serif">开启全阵</span>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* --- FEATURE NAVIGATION --- */}
      <section className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
              <FeatureCard 
                to="/learn" 
                icon={<BookOpen size={36}/>} 
                title="图鉴" 
                desc="神秘学字典" 
                id="01"
              />
              <FeatureCard 
                to="/symbols" 
                icon={<Sun size={36}/>} 
                title="象征" 
                desc="视觉语法百科" 
                id="02"
              />
              <FeatureCard 
                to="/practice" 
                icon={<Zap size={36}/>} 
                title="练习" 
                desc="灵能觉醒任务" 
                id="03"
              />
              <FeatureCard 
                to="/divine" 
                icon={<ScrollText size={36}/>} 
                title="占卜" 
                desc="神圣几何排阵" 
                id="04"
              />
          </div>
      </section>

      {/* --- DECORATIVE FOOTER --- */}
      <footer className="max-w-4xl mx-auto text-center py-20 opacity-30">
          <div className="flex items-center justify-center gap-12 mb-10">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
              <div className="flex gap-6 text-white">
                  <Moon size={18} />
                  <div className="w-2 h-2 rounded-full bg-mystic-gold animate-pulse"></div>
                  <Sun size={18} />
              </div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/40 to-transparent"></div>
          </div>
          <p className="text-xs font-serif uppercase tracking-[1em] font-light">The Arcana is the Mirror of the Infinite</p>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
    to: string;
    icon: React.ReactNode;
    title: string;
    desc: string;
    id: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ to, icon, title, desc, id }) => (
    <Link to={to} className="relative group">
        <div className="glass-card p-12 rounded-[3.5rem] border-white/5 transition-all duration-700 group-hover:bg-mystic-800/40 group-hover:-translate-y-4 flex flex-col items-center text-center gap-8 overflow-hidden">
            {/* Background Id Decor */}
            <span className="absolute top-6 right-10 text-5xl font-serif font-bold text-white/[0.03] group-hover:text-mystic-gold/10 transition-colors pointer-events-none">{id}</span>
            
            <div className="text-mystic-gold/40 group-hover:text-mystic-gold transition-all duration-700 transform group-hover:scale-125 group-hover:rotate-6">
                {icon}
            </div>
            
            <div className="space-y-2">
                <h3 className="text-2xl font-serif font-bold text-white group-hover:text-mystic-gold transition-colors duration-500 tracking-widest">
                    {title}
                </h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-light italic">
                    {desc}
                </p>
            </div>

            {/* Glowing underline hover effect */}
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-mystic-gold/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center"></div>
        </div>
    </Link>
);

export default Home;
