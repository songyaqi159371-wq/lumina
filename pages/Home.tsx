
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    Star, Sparkle, BookOpen, 
    Eye, ScrollText, PlayCircle, 
    Moon, Sun, Compass, Zap,
    Flame
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
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center space-y-16 animate-flip-in pb-20 overflow-hidden">
      
      {/* --- BACKDROP DECORATION --- */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-mystic-500/5 blur-[160px] rounded-full animate-pulse-slow"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/sacred-geometry.png')] opacity-[0.03]"></div>
          <div className="absolute top-1/4 left-1/4 w-px h-64 bg-gradient-to-b from-mystic-gold/20 to-transparent"></div>
          <div className="absolute bottom-1/4 right-1/4 w-px h-64 bg-gradient-to-t from-mystic-gold/20 to-transparent"></div>
      </div>

      {/* --- MAIN RITUAL ALTAR (CONCENTRATED AREA) --- */}
      <main className="w-full max-w-6xl px-4 flex flex-col items-center">
        
        {/* Compact Title Section */}
        <div className="text-center mb-10 space-y-4">
            <div className="flex items-center justify-center gap-3 opacity-40">
                <Moon size={14} className="text-mystic-gold" />
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-mystic-gold"></div>
                <Star size={16} className="animate-spin-slow text-mystic-gold" />
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-mystic-gold"></div>
                <Sun size={14} className="text-mystic-gold" />
            </div>
            <h1 className="text-5xl lg:text-7xl font-serif font-bold text-white tracking-tighter uppercase shimmer-text">
                Lumina Tarot
            </h1>
            <p className="text-slate-500 font-light tracking-[0.4em] text-xs uppercase opacity-80">
                The Sacred Archive of Arcana
            </p>
        </div>

        {/* Central Altar Card Area */}
        <div className="relative w-full glass-card rounded-[4rem] border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.4)] overflow-hidden">
            {/* Background Crystal Orb Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none">
                <div className="absolute inset-0 bg-mystic-gold/5 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute inset-10 border border-mystic-gold/10 rounded-full animate-spin-slow"></div>
                <div className="absolute inset-20 border border-white/5 rounded-full animate-reverse-spin-slow opacity-50"></div>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
                {/* Left: Card Focal Point */}
                <div className="flex items-center justify-center p-12 lg:p-20 bg-black/20 lg:border-r border-white/5">
                    <div className="relative">
                        {/* Shadow Glow for Card */}
                        <div className={`absolute -inset-16 rounded-full blur-[80px] transition-all duration-1000 ${isRevealed ? 'bg-mystic-gold/20' : 'bg-mystic-600/10'}`}></div>
                        
                        <div className="animate-float">
                            <CardFlip 
                                card={dailyCard || null} 
                                isReversed={progress.dailyDraw.isReversed} 
                                isRevealed={isRevealed} 
                                onClick={handleDailyDraw}
                                width="w-56 md:w-72"
                                height="h-[28rem] md:h-[36rem]"
                            />
                        </div>

                        {!isRevealed && (
                            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-full text-center">
                                <span className="text-[10px] text-mystic-gold/40 font-serif tracking-[0.5em] animate-pulse uppercase">触碰以开启感应</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Revelation Info */}
                <div className="flex flex-col justify-center p-12 lg:p-20 space-y-8 bg-mystic-950/30">
                    {!isRevealed ? (
                        <div className="space-y-10 animate-flip-in">
                            <div className="space-y-4">
                                <span className="text-xs text-mystic-gold uppercase tracking-[0.5em] block font-serif opacity-60">Daily Oracle</span>
                                <h3 className="text-4xl lg:text-5xl font-serif text-white tracking-widest italic">每日灵能感应</h3>
                            </div>
                            <p className="text-slate-400 text-lg leading-relaxed italic border-l border-mystic-gold/20 pl-6 py-2">
                                “在此一刻，让思想如尘埃落定。潜意识正通过随机的必然，为你投射今日的能量基调。”
                            </p>
                            <button 
                                onClick={handleDailyDraw}
                                className="group relative px-10 py-5 bg-gradient-to-tr from-mystic-gold/80 to-yellow-600 text-mystic-950 rounded-2xl transition-all font-bold active:scale-95 flex items-center gap-4 shadow-xl shadow-mystic-gold/10 hover:shadow-mystic-gold/20"
                            >
                                <Flame size={18} className="animate-pulse" />
                                <span className="tracking-[0.2em] uppercase text-xs">唤醒牌灵</span>
                            </button>
                        </div>
                    ) : dailyCard && (
                        <div className="space-y-10 animate-flip-in">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-mystic-gold opacity-60">
                                    <Sparkle size={14} className="animate-spin-slow" />
                                    <span className="text-xs font-serif uppercase tracking-[0.4em]">{dailyCard.nameEn}</span>
                                </div>
                                <h4 className="text-5xl lg:text-6xl font-serif text-white tracking-tighter uppercase">
                                    {dailyCard.nameCn}
                                    {progress.dailyDraw.isReversed && (
                                        <span className="ml-3 text-red-500/60 text-2xl font-sans">(逆位)</span>
                                    )}
                                </h4>
                            </div>

                            <div className="relative">
                                <div className="absolute top-0 left-0 w-1 h-full bg-mystic-gold/30"></div>
                                <p className="text-slate-200 leading-relaxed font-light text-xl italic pl-8">
                                    {progress.dailyDraw.isReversed ? dailyCard.meaningDown : dailyCard.meaningUp}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-8 pt-6">
                                <Link to={`/learn?id=${dailyCard.id}`} className="flex items-center gap-4 group">
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:border-mystic-gold/40 transition-all">
                                        <BookOpen size={18} className="text-mystic-gold" />
                                    </div>
                                    <span className="text-xs text-slate-400 group-hover:text-white transition-colors tracking-widest font-serif uppercase">研读细节</span>
                                </Link>
                                <Link to="/divine" className="flex items-center gap-4 group">
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:border-indigo-400/40 transition-all">
                                        <Eye size={18} className="text-indigo-400" />
                                    </div>
                                    <span className="text-xs text-slate-400 group-hover:text-white transition-colors tracking-widest font-serif uppercase">开启占卜</span>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </main>

      {/* --- COMPACT FEATURE NAVIGATION --- */}
      <section className="w-full max-w-5xl px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          <FeatureCard 
            to="/learn" 
            icon={<BookOpen size={24}/>} 
            title="图鉴" 
            desc="阿卡纳全解" 
            id="01"
          />
          <FeatureCard 
            to="/symbols" 
            icon={<Sun size={24}/>} 
            title="象征" 
            desc="视觉语法百科" 
            id="02"
          />
          <FeatureCard 
            to="/practice" 
            icon={<Zap size={24}/>} 
            title="练习" 
            desc="灵能觉醒挑战" 
            id="03"
          />
          <FeatureCard 
            to="/divine" 
            icon={<ScrollText size={24}/>} 
            title="占卜" 
            desc="神圣几何排阵" 
            id="04"
          />
      </section>

      {/* --- MINIMAL FOOTER DECOR --- */}
      <footer className="opacity-20 flex flex-col items-center gap-4">
          <div className="flex items-center gap-8">
              <div className="h-px w-24 bg-gradient-to-r from-transparent to-white"></div>
              <Compass size={18} className="animate-spin-slow" />
              <div className="h-px w-24 bg-gradient-to-l from-transparent to-white"></div>
          </div>
          <p className="text-[10px] font-serif uppercase tracking-[1em]">The Mirror of Infinite Souls</p>
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
    <Link to={to} className="group">
        <div className="glass-card p-6 rounded-[2.5rem] border-white/5 transition-all duration-500 group-hover:bg-mystic-900/60 group-hover:-translate-y-2 flex flex-col items-center text-center gap-4 relative overflow-hidden">
            <span className="absolute top-3 right-5 text-2xl font-serif font-bold text-white/[0.03] group-hover:text-mystic-gold/10 transition-colors pointer-events-none">{id}</span>
            <div className="text-mystic-gold/50 group-hover:text-mystic-gold transition-all duration-500 transform group-hover:scale-110">
                {icon}
            </div>
            <div>
                <h3 className="text-sm font-serif font-bold text-white mb-1 group-hover:text-mystic-gold transition-colors tracking-widest">{title}</h3>
                <p className="text-[8px] text-slate-500 uppercase tracking-widest opacity-60">{desc}</p>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-mystic-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
    </Link>
);

export default Home;
