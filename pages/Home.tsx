import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    Star, Activity, Sparkle, BookOpen, ChevronRight, 
    Eye, Lightbulb, Compass, Award, ScrollText, PlayCircle 
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
  const percent = Math.round((progress.learnedCards.length / tarotDeck.length) * 100);

  return (
    <div className="space-y-12 animate-flip-in pb-20">
      {/* Hero Header */}
      <header className="relative py-8">
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-mystic-600/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
                <Compass className="text-mystic-gold w-5 h-5 animate-spin-slow" />
                <span className="text-xs font-serif text-mystic-400 tracking-[0.4em] uppercase">The Inner Temple</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-serif text-white mb-4 leading-tight">
                欢迎开启 <span className="shimmer-text">Lumina</span><br/>
                <span className="text-mystic-gold opacity-90">智慧探索之旅</span>
            </h1>
            <p className="text-slate-400 max-w-xl text-lg font-light leading-relaxed">
                在 78 张牌的象征世界中，追寻理性的深度与灵性的直觉。每一张牌都是开启潜意识之门的钥匙。
            </p>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Daily Insight Section (Main Center) */}
        <div className="lg:col-span-8 group">
            <div className="h-full glass-card p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden transition-all duration-500 hover:shadow-[0_0_50px_rgba(109,40,217,0.15)]">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                    <Star className="w-64 h-64 rotate-12" />
                </div>
                
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="relative flex-shrink-0">
                        <div className="absolute -inset-4 bg-mystic-gold/10 rounded-full blur-2xl animate-pulse-slow"></div>
                        <CardFlip 
                            card={dailyCard || null} 
                            isReversed={progress.dailyDraw.isReversed} 
                            isRevealed={isRevealed} 
                            onClick={handleDailyDraw}
                            width="w-56 md:w-64"
                            height="h-80 md:h-96"
                        />
                    </div>

                    <div className="flex-1 space-y-6 text-center md:text-left">
                        <div className="space-y-2">
                            <h2 className="text-xs font-serif text-mystic-gold tracking-[0.3em] uppercase">Insight of the Day</h2>
                            <h3 className="text-4xl font-serif text-white tracking-wide">每日启示</h3>
                        </div>

                        {!isRevealed ? (
                            <div className="space-y-6">
                                <p className="text-slate-400 font-light text-lg">点击左侧卡片，接收今日专属的共时性讯息。</p>
                                <button 
                                    onClick={handleDailyDraw}
                                    className="px-8 py-3 bg-mystic-600 hover:bg-mystic-500 text-white rounded-2xl transition-all shadow-lg shadow-mystic-900/50 font-bold active:scale-95 flex items-center gap-3 mx-auto md:mx-0"
                                >
                                    <PlayCircle size={20}/> 开启神圣链接
                                </button>
                            </div>
                        ) : dailyCard && (
                            <div className="space-y-4 animate-flip-in">
                                <div className="inline-flex items-center gap-3 px-4 py-1 bg-mystic-900/50 border border-mystic-700/50 rounded-full">
                                    <span className="w-2 h-2 rounded-full bg-mystic-gold"></span>
                                    <p className="text-mystic-gold font-serif text-sm tracking-widest">{dailyCard.nameEn}</p>
                                </div>
                                <h4 className="text-3xl font-bold text-white">{dailyCard.nameCn} {progress.dailyDraw.isReversed && <span className="text-red-400 text-lg">(逆位)</span>}</h4>
                                <p className="text-slate-300 leading-relaxed font-light text-base bg-mystic-900/40 p-5 rounded-2xl border border-mystic-800">
                                    {progress.dailyDraw.isReversed ? dailyCard.meaningDown : dailyCard.meaningUp}
                                </p>
                                <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
                                    <Link to={`/learn?id=${dailyCard.id}`} className="flex items-center gap-2 text-mystic-gold hover:text-white transition group text-sm font-bold">
                                        深入研读图鉴 <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                                    </Link>
                                    <Link to="/divine" className="flex items-center gap-2 text-indigo-400 hover:text-white transition group text-sm font-bold">
                                        以此进行占卜 <Eye size={16} className="group-hover:scale-110 transition-transform"/>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* Action Sidebar Area */}
        <div className="lg:col-span-4 space-y-8">
            {/* Quick Stats */}
            <div className="glass-card p-6 rounded-[2rem] border border-mystic-800 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                        <Award className="w-4 h-4 text-mystic-gold" /> 修行进度
                    </h2>
                    <span className="text-[10px] text-slate-500 font-serif">78 Cards Total</span>
                </div>
                
                <div className="space-y-4">
                    <div className="flex justify-between items-end">
                        <span className="text-2xl font-serif text-mystic-gold font-bold">{progress.learnedCards.length}</span>
                        <span className="text-[10px] text-slate-500 mb-1">已激活牌灵</span>
                    </div>
                    <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
                        <div 
                            className="bg-gradient-to-r from-mystic-700 to-mystic-400 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(139,92,246,0.5)]" 
                            style={{ width: `${percent}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 italic">
                        <span>新手路标</span>
                        <span>{percent}% 完成度</span>
                    </div>
                </div>
            </div>

            {/* Divination Entry (Special Design) */}
            <Link to="/divine" className="block relative group overflow-hidden rounded-[2rem] shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-mystic-950 transition-all duration-500 group-hover:scale-110"></div>
                <div className="absolute inset-0 border-2 border-mystic-gold/20 group-hover:border-mystic-gold/50 rounded-[2rem] transition-colors"></div>
                
                <div className="relative p-8 flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-black/40 flex items-center justify-center border border-mystic-gold/30 shadow-inner group-hover:shadow-[0_0_20px_rgba(251,191,36,0.2)] transition-all">
                        <Eye className="text-mystic-gold w-8 h-8 group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                        <h3 className="text-xl font-serif text-white font-bold tracking-widest mb-2 group-hover:text-mystic-gold transition-colors">占卜</h3>
                        <p className="text-slate-400 text-xs font-light leading-relaxed">
                            针对你的现状提供深度象征学解析。
                        </p>
                    </div>
                    <div className="px-6 py-2 bg-mystic-gold text-mystic-950 rounded-full text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                        Enter Sanctum
                    </div>
                </div>
            </Link>
        </div>
      </div>

      {/* Feature Navigation Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <FeatureCard 
            to="/learn" 
            icon={<BookOpen size={24}/>} 
            title="图鉴" 
            desc="78 张牌全解析" 
            color="text-blue-400"
          />
          <FeatureCard 
            to="/symbols" 
            icon={<Sparkle size={24}/>} 
            title="象征" 
            desc="秘密视觉语法" 
            color="text-mystic-gold"
          />
          <FeatureCard 
            to="/practice" 
            icon={<Lightbulb size={24}/>} 
            title="练习" 
            desc="案例解读" 
            color="text-emerald-400"
          />
          <FeatureCard 
            to="/divine" 
            icon={<ScrollText size={24}/>} 
            title="占卜" 
            desc="14 种神圣布局" 
            color="text-indigo-400"
          />
      </section>
    </div>
  );
};

interface FeatureCardProps {
    to: string;
    icon: React.ReactNode;
    title: string;
    desc: string;
    color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ to, icon, title, desc, color }) => (
    <Link to={to} className="glass-card p-6 rounded-3xl border border-mystic-800 hover:border-mystic-700/50 transition-all hover:-translate-y-1 group">
        <div className={`${color} mb-4 transition-transform group-hover:scale-110 duration-500`}>{icon}</div>
        <h3 className="text-white font-serif font-bold text-sm mb-1 group-hover:text-mystic-gold transition-colors">{title}</h3>
        <p className="text-[10px] text-slate-500">{desc}</p>
    </Link>
);

export default Home;