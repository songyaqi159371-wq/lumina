
import React, { useState, useEffect, useMemo } from 'react';
import { tarotDeck } from '../constants';
import CardFlip from '../components/CardFlip';
import { RefreshCw, BookOpen, Brain, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { TarotCard } from '../types';

const Practice: React.FC = () => {
  const [mode, setMode] = useState<'flashcard' | 'keyword'>('flashcard');
  const [currentCard, setCurrentCard] = useState<TarotCard | null>(null);
  
  // Flashcard State
  const [flashcardStep, setFlashcardStep] = useState<0 | 1 | 2>(0);
  
  // Keyword Challenge State
  const [options, setOptions] = useState<string[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const startNewRound = () => {
    setFlashcardStep(0);
    setSelectedAnswers([]);
    setIsSubmitted(false);

    const random = tarotDeck[Math.floor(Math.random() * tarotDeck.length)];
    setCurrentCard(random);

    if (mode === 'keyword') {
      // Prepare quiz options: 3 correct, 3 wrong
      const correct = [...random.keywords];
      const allOtherKeywords = tarotDeck
        .filter(c => c.id !== random.id)
        .flatMap(c => c.keywords);
      
      const wrong: string[] = [];
      while (wrong.length < 3) {
        const rk = allOtherKeywords[Math.floor(Math.random() * allOtherKeywords.length)];
        if (!correct.includes(rk) && !wrong.includes(rk)) {
          wrong.push(rk);
        }
      }
      setOptions([...correct, ...wrong].sort(() => Math.random() - 0.5));
    }
  };

  useEffect(() => {
    startNewRound();
  }, [mode]);

  const toggleAnswer = (kw: string) => {
    if (isSubmitted) return;
    if (selectedAnswers.includes(kw)) {
      setSelectedAnswers(selectedAnswers.filter(a => a !== kw));
    } else if (selectedAnswers.length < 3) {
      setSelectedAnswers([...selectedAnswers, kw]);
    }
  };

  const handleFlashcardClick = () => {
    if (flashcardStep === 0) setFlashcardStep(1);
    else if (flashcardStep === 1) setFlashcardStep(2);
  };

  if (!currentCard) return null;

  const correctCount = selectedAnswers.filter(a => currentCard.keywords.includes(a)).length;

  return (
    <div className="max-w-5xl mx-auto py-4">
      {/* Mode Switcher */}
      <div className="flex justify-center gap-4 mb-12">
        <button 
            onClick={() => setMode('flashcard')}
            className={`px-6 py-3 rounded-2xl text-sm transition-all duration-500 flex items-center gap-3 border ${
                mode === 'flashcard' 
                ? 'bg-mystic-gold text-mystic-950 border-mystic-gold shadow-[0_0_20px_rgba(251,191,36,0.3)] font-bold' 
                : 'text-slate-400 border-white/5 hover:border-white/20 hover:bg-white/5'
            }`}
        >
            <BookOpen size={18} /> 闪卡记忆
        </button>
        <button 
             onClick={() => setMode('keyword')}
             className={`px-6 py-3 rounded-2xl text-sm transition-all duration-500 flex items-center gap-3 border ${
                mode === 'keyword' 
                ? 'bg-mystic-gold text-mystic-950 border-mystic-gold shadow-[0_0_20px_rgba(251,191,36,0.3)] font-bold' 
                : 'text-slate-400 border-white/5 hover:border-white/20 hover:bg-white/5'
            }`}
        >
            <Brain size={18} /> 关键词挑战
        </button>
      </div>

      <div className="flex flex-col items-center">
        {mode === 'flashcard' ? (
          <div className="w-full flex flex-col lg:flex-row items-start justify-center gap-12 animate-flip-in">
             <div className="relative group sticky top-4">
                <CardFlip 
                    card={currentCard} 
                    isRevealed={flashcardStep > 0} 
                    showLabel={flashcardStep >= 1} 
                    onClick={handleFlashcardClick}
                    width="w-64"
                    height="h-[26rem]"
                />
                <div className="mt-6 text-center">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-mystic-gold/50 animate-pulse">
                        {flashcardStep === 0 ? "点击翻开牌面" : flashcardStep === 1 ? "再次点击查看释义" : "已揭示"}
                    </p>
                </div>
             </div>

             <div className="flex-1 w-full max-w-lg">
                <div className={`transition-all duration-700 transform ${flashcardStep === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                   <div className="glass-card p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-5"><Sparkles size={60}/></div>
                      <h3 className="text-3xl font-serif text-white mb-2">{currentCard.nameCn}</h3>
                      <p className="text-mystic-gold font-serif text-xs tracking-widest uppercase mb-8">{currentCard.nameEn}</p>
                      
                      <div className="space-y-8">
                        <div>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-3 font-bold">核心关键词</span>
                            <div className="flex flex-wrap gap-2">
                                {currentCard.keywords.map(k => (
                                    <span key={k} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-300">{k}</span>
                                ))}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                            <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                                <span className="text-[10px] text-indigo-400 uppercase tracking-widest block mb-1 font-bold">正位</span>
                                <p className="text-sm text-slate-300 leading-relaxed">{currentCard.meaningUp}</p>
                            </div>
                            <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                                <span className="text-[10px] text-red-400 uppercase tracking-widest block mb-1 font-bold">逆位</span>
                                <p className="text-sm text-slate-300 leading-relaxed">{currentCard.meaningDown}</p>
                            </div>
                        </div>

                        {/* 新增画面象征部分 */}
                        <div className="pt-4 border-t border-white/5">
                            <span className="text-[10px] text-blue-400 uppercase tracking-widest block mb-3 font-bold">画面象征</span>
                            <p className="text-sm text-slate-400 leading-relaxed italic">{currentCard.description}</p>
                        </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        ) : (
          <div className="w-full max-w-4xl animate-flip-in">
             <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col items-center">
                    <div className="mb-8 text-center">
                        <h3 className="text-xl font-serif text-white mb-2 tracking-widest">请选择 3 个正确的关键词</h3>
                        <p className="text-slate-500 text-xs">考察你对该牌核心象征意义的掌握程度</p>
                    </div>
                    <CardFlip card={currentCard} isRevealed={true} showLabel={isSubmitted} width="w-56" height="h-[22rem]" />
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        {options.map((kw) => {
                            const isSelected = selectedAnswers.includes(kw);
                            const isCorrect = currentCard.keywords.includes(kw);
                            let style = "border-white/10 text-slate-400 bg-white/5";
                            
                            if (isSubmitted) {
                                if (isCorrect) style = "border-emerald-500/50 text-emerald-400 bg-emerald-500/10";
                                else if (isSelected && !isCorrect) style = "border-red-500/50 text-red-400 bg-red-500/10";
                                else style = "border-white/5 text-slate-600 bg-transparent opacity-50";
                            } else if (isSelected) {
                                style = "border-mystic-gold text-mystic-gold bg-mystic-gold/10";
                            }

                            return (
                                <button
                                    key={kw}
                                    onClick={() => toggleAnswer(kw)}
                                    disabled={isSubmitted}
                                    className={`p-5 rounded-2xl border transition-all duration-300 text-sm font-medium ${style} ${!isSubmitted && 'hover:border-white/30 hover:scale-[1.02] active:scale-95'}`}
                                >
                                    <div className="flex justify-between items-center">
                                        {kw}
                                        {isSubmitted && isCorrect && <CheckCircle2 size={16} />}
                                        {isSubmitted && isSelected && !isCorrect && <XCircle size={16} />}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {!isSubmitted ? (
                        <button
                            disabled={selectedAnswers.length < 3}
                            onClick={() => setIsSubmitted(true)}
                            className="w-full py-4 bg-white text-mystic-950 rounded-2xl font-bold tracking-widest uppercase text-xs disabled:opacity-20 transition-all hover:bg-mystic-gold active:scale-95"
                        >
                            提交答案
                        </button>
                    ) : (
                        <div className="glass-card p-6 rounded-2xl border border-white/5 animate-flip-in text-center">
                            <h4 className="text-2xl font-serif text-white mb-2">
                                {correctCount === 3 ? "完美！能量共鸣" : correctCount >= 1 ? "有所斩获" : "仍需修行"}
                            </h4>
                            <p className="text-slate-400 text-xs mb-4">你答对了 {correctCount} / 3 个关键词</p>
                            <button 
                                onClick={startNewRound}
                                className="px-8 py-2 bg-mystic-gold/10 text-mystic-gold border border-mystic-gold/20 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-mystic-gold hover:text-mystic-950 transition-all"
                            >
                                下一关
                            </button>
                        </div>
                    )}
                </div>
             </div>
          </div>
        )}

        {/* Refresh Action */}
        <div className="mt-16 flex gap-4">
             <button 
                onClick={startNewRound}
                className="flex items-center gap-3 px-8 py-3 bg-white/5 border border-white/10 hover:border-white/20 text-white rounded-full transition-all hover:-translate-y-1 font-bold tracking-widest text-[10px] uppercase"
            >
                <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700" /> 
                切换卡牌
            </button>
        </div>
      </div>
    </div>
  );
};

export default Practice;
