import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Book, Star, Activity } from 'lucide-react';
import { getProgress, saveProgress } from '../services/storage';
import { tarotDeck } from '../constants';
import CardFlip from '../components/CardFlip';
import { UserProgress } from '../types';

const Home: React.FC = () => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const data = getProgress();
    // Check if daily draw is from today
    const today = new Date().toISOString().split('T')[0];
    if (data.dailyDraw.date !== today) {
        // Reset daily draw visualization state
        setIsRevealed(false);
    } else {
        setIsRevealed(true);
    }
    setProgress(data);
  }, []);

  const handleDailyDraw = () => {
    if (!progress) return;
    
    // Check if already drawn today
    const today = new Date().toISOString().split('T')[0];
    if (progress.dailyDraw.date === today && progress.dailyDraw.cardId !== null) {
        setIsRevealed(true);
        return;
    }

    // Draw new card
    const randomCard = tarotDeck[Math.floor(Math.random() * tarotDeck.length)];
    const isReversed = Math.random() > 0.5;

    const newProgress = {
        ...progress,
        dailyDraw: {
            date: today,
            cardId: randomCard.id,
            isReversed,
            note: ''
        },
        learnedCards: Array.from(new Set([...progress.learnedCards, randomCard.id]))
    };

    saveProgress(newProgress);
    setProgress(newProgress);
    setTimeout(() => setIsRevealed(true), 100);
  };

  if (!progress) return <div>Loading...</div>;

  const dailyCard = progress.dailyDraw.cardId !== null 
    ? tarotDeck.find(c => c.id === progress.dailyDraw.cardId) 
    : null;

  const learnedCount = progress.learnedCards.length;
  const totalCards = tarotDeck.length;
  const percent = Math.round((learnedCount / totalCards) * 100);

  return (
    <div className="space-y-8 animate-flip-in">
      <header className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-serif text-mystic-100 mb-2">欢迎回来, 探索者</h1>
        <p className="text-slate-400">今天的宇宙有什么启示给你？</p>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Daily Card Section */}
        <div className="lg:col-span-2 bg-mystic-800/50 p-6 rounded-2xl border border-mystic-700 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif text-mystic-gold flex items-center gap-2">
                    <Star className="w-5 h-5" /> 每日一卡
                </h2>
                <span className="text-sm text-slate-400">{new Date().toLocaleDateString('zh-CN')}</span>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
                <div className="flex-shrink-0">
                    <CardFlip 
                        card={dailyCard || null} 
                        isReversed={progress.dailyDraw.isReversed}
                        isRevealed={isRevealed}
                        onClick={handleDailyDraw}
                    />
                     {!isRevealed && (
                        <p className="text-center mt-4 text-sm text-slate-400 animate-pulse">点击抽取今日牌卡</p>
                     )}
                </div>
                
                {isRevealed && dailyCard && (
                    <div className="flex-1 space-y-4 animate-flip-in">
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-1">
                                {dailyCard.nameCn} 
                                <span className="text-sm font-normal text-slate-400 ml-2">
                                    {progress.dailyDraw.isReversed ? '(逆位)' : '(正位)'}
                                </span>
                            </h3>
                            <p className="text-mystic-400 text-sm font-serif italic">{dailyCard.nameEn}</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                            {dailyCard.keywords.map(k => (
                                <span key={k} className="px-2 py-1 bg-mystic-700 rounded text-xs text-mystic-100">{k}</span>
                            ))}
                        </div>

                        <p className="text-slate-300 leading-relaxed">
                            {progress.dailyDraw.isReversed ? dailyCard.meaningDown : dailyCard.meaningUp}
                        </p>

                        <div className="pt-4 border-t border-mystic-700">
                             <Link to={`/learn?id=${dailyCard.id}`} className="text-mystic-gold text-sm hover:underline">查看完整图鉴 &rarr;</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Right Column: Stats & Quick Actions */}
        <div className="space-y-6">
            
            {/* Progress Card */}
            <div className="bg-mystic-800/50 p-6 rounded-2xl border border-mystic-700">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-400" /> 学习进度
                </h2>
                <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-400">已收集牌灵</span>
                    <span className="text-white font-bold">{learnedCount} / {totalCards}</span>
                </div>
                <div className="w-full bg-mystic-900 rounded-full h-2.5 mb-4">
                    <div className="bg-mystic-500 h-2.5 rounded-full" style={{ width: `${percent}%` }}></div>
                </div>
                <Link to="/learn" className="block w-full text-center py-2 rounded-lg bg-mystic-700 hover:bg-mystic-600 transition text-sm">
                    去学习图鉴
                </Link>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
                <Link to="/divination" className="bg-gradient-to-br from-violet-900 to-mystic-900 p-4 rounded-xl border border-mystic-700 hover:border-mystic-500 transition group">
                    <div className="w-10 h-10 rounded-full bg-mystic-800 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                        <Play className="w-5 h-5 text-mystic-gold" />
                    </div>
                    <h3 className="font-bold text-white">开始占卜</h3>
                    <p className="text-xs text-slate-400 mt-1">虚拟牌阵指引</p>
                </Link>

                <Link to="/practice" className="bg-mystic-800 p-4 rounded-xl border border-mystic-700 hover:border-mystic-500 transition group">
                    <div className="w-10 h-10 rounded-full bg-mystic-900 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                        <Book className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="font-bold text-white">记忆练习</h3>
                    <p className="text-xs text-slate-400 mt-1">巩固牌义知识</p>
                </Link>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Home;