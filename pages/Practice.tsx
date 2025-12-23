import React, { useState, useEffect } from 'react';
import { tarotDeck, caseStudies } from '../constants';
import CardFlip from '../components/CardFlip';
import { RefreshCw, BookOpen, Lightbulb, Sparkles, ChevronRight } from 'lucide-react';
import { TarotCard, CaseStudy } from '../types';
import { generateAICaseStudy } from '../services/geminiService';

const Practice: React.FC = () => {
  const [currentCard, setCurrentCard] = useState<TarotCard | null>(null);
  
  // Flashcard State: 0 = Hidden (Back), 1 = Image (Front), 2 = Meaning (Text)
  const [flashcardStep, setFlashcardStep] = useState<0 | 1 | 2>(0);
  
  // Simplified mode selection: only Flashcard and Case study
  const [mode, setMode] = useState<'flashcard' | 'case'>('flashcard');

  // Case Study State
  const [currentCase, setCurrentCase] = useState<CaseStudy | null>(null);
  const [caseRevealed, setCaseRevealed] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Initialize first card on mount
  useEffect(() => {
    startNewRound();
  }, [mode]);

  const startNewRound = () => {
    // Reset States
    setFlashcardStep(0);
    setCaseRevealed(false);

    if (mode === 'case') {
        const randomCase = caseStudies[Math.floor(Math.random() * caseStudies.length)];
        setCurrentCase(randomCase);
        const card = tarotDeck.find(c => c.id === randomCase.cardId) || null;
        setCurrentCard(card);
        return;
    }

    // Default Random Logic for Flashcard
    const random = tarotDeck[Math.floor(Math.random() * tarotDeck.length)];
    setCurrentCard(random);
  };

  const handleGenerateAICase = async () => {
      setIsGeneratingAI(true);
      setCaseRevealed(false);
      try {
          const aiCase = await generateAICaseStudy();
          if (aiCase) {
              setCurrentCase(aiCase);
              const card = tarotDeck.find(c => c.id === aiCase.cardId) || null;
              setCurrentCard(card);
          } else {
              alert("AI 生成失败，请稍后重试");
          }
      } catch (e) {
          console.error(e);
      } finally {
          setIsGeneratingAI(false);
      }
  };

  const handleFlashcardClick = () => {
      if (flashcardStep === 0) {
          setFlashcardStep(1); // Reveal Image
      } else if (flashcardStep === 1) {
          setFlashcardStep(2); // Reveal Meaning
      }
  };

  if (!currentCard && mode !== 'case') return <div className="p-8 text-center text-slate-400">加载中...</div>;

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      {/* Mode Switcher */}
      <div className="flex flex-wrap justify-center gap-2 mb-10 bg-mystic-800/50 p-2 rounded-2xl w-fit mx-auto border border-mystic-700 backdrop-blur-sm">
        <button 
            onClick={() => setMode('flashcard')}
            className={`px-4 py-2 rounded-xl text-sm transition font-medium flex items-center gap-2 ${mode === 'flashcard' ? 'bg-mystic-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
            <BookOpen size={16} /> 闪卡记忆
        </button>
        <button 
             onClick={() => setMode('case')}
             className={`px-4 py-2 rounded-xl text-sm transition font-medium flex items-center gap-2 ${mode === 'case' ? 'bg-mystic-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
            <Lightbulb size={16} /> 案例解读
        </button>
      </div>

      <div className="flex flex-col items-center w-full">
        
        {/* --- 1. FLASHCARD MODE --- */}
        {mode === 'flashcard' && (
            <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-center gap-8 md:gap-12 animate-flip-in">
                 
                 {/* Left Column: Card & Navigation */}
                 <div className="flex flex-row md:flex-col items-center gap-4 md:gap-6 flex-shrink-0">
                    <div className="relative">
                        <CardFlip 
                            key={`flash-${currentCard!.id}`} 
                            card={currentCard} 
                            isRevealed={flashcardStep > 0} 
                            showLabel={flashcardStep >= 1} 
                            onClick={handleFlashcardClick}
                            height="h-80 md:h-96"
                            width="w-52 md:w-64"
                        />
                        <div className="mt-4 text-center h-6">
                            {flashcardStep === 0 && (
                                <span className="text-slate-400 text-xs animate-pulse bg-mystic-900/50 px-3 py-1 rounded-full border border-mystic-700">
                                    👆 点击翻牌
                                </span>
                            )}
                            {flashcardStep === 1 && (
                                <span className="text-mystic-gold text-xs animate-pulse bg-mystic-900/50 px-3 py-1 rounded-full border border-mystic-700">
                                    👆 再次点击看详解
                                </span>
                            )}
                        </div>
                    </div>
                    
                    <button 
                        onClick={startNewRound}
                        className="p-3 md:w-full md:py-3 md:rounded-xl bg-mystic-800 hover:bg-mystic-600 border border-mystic-600 rounded-full text-white shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                        title="下一张"
                    >
                        <span className="hidden md:inline font-medium">下一张</span>
                        <ChevronRight size={24} />
                    </button>
                 </div>
                 
                 {/* Right Column: Meaning Box */}
                 <div className="w-full md:max-w-lg flex-1 min-h-[300px]">
                     <div className={`transition-all duration-500 transform w-full h-full ${flashcardStep === 2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-y-4 md:translate-y-0 md:translate-x-4 pointer-events-none'}`}>
                         {flashcardStep === 2 ? (
                             <div className="bg-mystic-800/80 p-6 md:p-8 rounded-2xl border border-mystic-600 shadow-2xl backdrop-blur-md h-full relative overflow-hidden">
                                 <div className="absolute -top-10 -right-10 w-32 h-32 bg-mystic-500/10 rounded-full blur-2xl"></div>
                                 <div className="relative z-10">
                                     <div className="flex items-center justify-between mb-6 border-b border-mystic-700 pb-4">
                                         <div>
                                            <h3 className="text-3xl font-serif text-mystic-gold mb-1">{currentCard!.nameCn}</h3>
                                            <span className="text-sm text-slate-400 font-serif italic">{currentCard!.nameEn}</span>
                                         </div>
                                         <div className="text-center">
                                            <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-600 block mb-1">
                                                {currentCard!.suit}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                #{currentCard!.id}
                                            </span>
                                         </div>
                                     </div>
                                     
                                     <div className="flex flex-wrap gap-2 mb-8">
                                        {currentCard!.keywords.map(k => (
                                            <span key={k} className="text-xs font-bold bg-indigo-900/60 border border-indigo-500/30 px-3 py-1.5 rounded-lg text-indigo-200 shadow-sm">
                                                {k}
                                            </span>
                                        ))}
                                     </div>

                                     <div className="space-y-6">
                                        <div className="bg-mystic-900/40 p-4 rounded-xl border border-mystic-700/50">
                                            <h4 className="text-sm font-bold text-violet-400 mb-2 flex items-center gap-2 uppercase tracking-wide">
                                                <span className="w-2 h-2 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]"></span> 正位含义
                                            </h4>
                                            <p className="text-slate-200 leading-relaxed text-sm">
                                                {currentCard!.meaningUp}
                                            </p>
                                        </div>

                                        <div className="bg-mystic-900/40 p-4 rounded-xl border border-mystic-700/50">
                                            <h4 className="text-sm font-bold text-red-400 mb-2 flex items-center gap-2 uppercase tracking-wide">
                                                <span className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]"></span> 逆位含义
                                            </h4>
                                            <p className="text-slate-200 leading-relaxed text-sm">
                                                {currentCard!.meaningDown}
                                            </p>
                                        </div>

                                        <div className="pl-2 border-l-2 border-mystic-700">
                                            <h4 className="text-xs font-bold text-blue-400 mb-1 uppercase tracking-wide">
                                                画面描述
                                            </h4>
                                            <p className="text-slate-400 leading-relaxed text-xs italic">
                                                {currentCard!.description}
                                            </p>
                                        </div>
                                     </div>
                                 </div>
                             </div>
                         ) : (
                             <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-mystic-800 rounded-2xl bg-mystic-900/30 text-slate-600">
                                 <BookOpen size={48} className="mb-4 opacity-50" />
                                 <p>思考这张牌的含义...</p>
                                 <p className="text-sm mt-2">再次点击卡片查看答案</p>
                             </div>
                         )}
                     </div>
                 </div>
            </div>
        )}

        {/* --- 2. CASE STUDY MODE --- */}
        {mode === 'case' && currentCase && currentCard && (
             <div className="w-full max-w-4xl animate-flip-in grid md:grid-cols-2 gap-8 items-start">
                 <div className="flex flex-col items-center">
                     <div className="bg-mystic-800/80 p-6 rounded-2xl border border-mystic-600 w-full mb-6 relative overflow-hidden shadow-lg">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-mystic-gold to-orange-500"></div>
                        <span className="text-xs font-bold uppercase tracking-widest text-mystic-400 mb-2 block">
                            情境: {currentCase.category}
                        </span>
                        <h3 className="text-xl font-bold text-white mb-3 leading-snug">{currentCase.question}</h3>
                        <p className="text-slate-300 text-sm italic bg-black/20 p-3 rounded-lg border border-white/5">
                            “{currentCase.context}”
                        </p>
                     </div>

                     <div className="relative">
                        <CardFlip 
                            key={`case-${currentCard.id}`}
                            card={currentCard} 
                            isRevealed={true} 
                            isReversed={currentCase.isReversed}
                            showLabel={true}
                            height="h-72"
                            width="w-48"
                        />
                        <div className={`mt-6 text-center transition-opacity duration-300 ${caseRevealed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
                             <p className="text-sm text-mystic-300 font-bold mb-2 flex items-center justify-center gap-2">
                                <span className="animate-bounce">🤔</span> 你的解读是？
                             </p>
                             <p className="text-xs text-slate-400 max-w-[220px] mx-auto bg-mystic-900/50 px-3 py-2 rounded-lg">
                                 结合这张牌的 <span className={currentCase.isReversed ? 'text-red-400 font-bold' : 'text-green-400 font-bold'}>{currentCase.isReversed ? '逆位' : '正位'}</span> 含义，你会如何回答？
                             </p>
                        </div>
                     </div>
                 </div>

                 <div className="flex flex-col h-full justify-center">
                     {isGeneratingAI ? (
                         <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-mystic-900/50 rounded-2xl border border-dashed border-purple-500/30 p-8 text-center animate-pulse">
                             <Sparkles className="w-16 h-16 text-purple-400 mb-6 animate-spin" />
                             <h4 className="text-lg text-purple-300 font-bold mb-2">正在连接宇宙能量...</h4>
                             <p className="text-slate-500 text-sm">AI 正在为你生成专属练习案例</p>
                         </div>
                     ) : (
                        !caseRevealed ? (
                            <div className="flex flex-col items-center justify-center h-full min-h-[300px] bg-mystic-900/50 rounded-2xl border-2 border-dashed border-mystic-700 p-8 text-center gap-6 group hover:border-mystic-500 transition-colors">
                                <div className="w-20 h-20 bg-mystic-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Lightbulb className="w-10 h-10 text-mystic-gold" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-lg mb-1">准备好查看答案了吗？</h4>
                                    <p className="text-slate-400 text-sm">先在心里构思一下，再看参考解读</p>
                                </div>
                                <button 
                                    onClick={() => setCaseRevealed(true)}
                                    className="px-8 py-3 bg-mystic-600 hover:bg-mystic-500 text-white rounded-full transition shadow-lg shadow-mystic-600/30 font-bold"
                                >
                                    揭晓参考解读
                                </button>
                            </div>
                        ) : (
                            <div className="bg-gradient-to-br from-mystic-800 to-indigo-900/40 p-6 md:p-8 rounded-2xl border border-mystic-500 shadow-2xl animate-flip-in relative">
                                <div className="absolute top-4 right-4 text-mystic-700">
                                    <Lightbulb size={24} />
                                </div>
                                <h4 className="text-mystic-gold font-bold text-lg mb-6 border-b border-mystic-700 pb-3">
                                    参考解读思路
                                </h4>
                                <div className="prose prose-invert prose-sm max-w-none">
                                    <p className="text-slate-200 leading-relaxed text-sm md:text-base mb-6 whitespace-pre-wrap">
                                        {currentCase.interpretation}
                                    </p>
                                </div>
                                
                                <div className="bg-black/20 rounded-xl p-4">
                                    <span className="text-xs text-slate-500 uppercase tracking-wider block mb-3 font-bold">关键点总结</span>
                                    <div className="flex flex-wrap gap-2">
                                        {currentCase.keyPoints.map((kp, i) => (
                                            <span key={i} className="text-xs bg-mystic-700/50 text-mystic-100 px-3 py-1.5 rounded-lg border border-mystic-600">
                                                {kp}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                     )}
                 </div>
             </div>
        )}

        {/* Global Bottom Navigation */}
        <div className="mt-12 pb-8 flex gap-4">
            <button 
                onClick={startNewRound}
                disabled={isGeneratingAI}
                className="flex items-center gap-2 px-8 py-3 bg-mystic-800 border border-mystic-600 hover:bg-mystic-700 text-white rounded-full transition-all shadow-lg hover:shadow-mystic-500/30 hover:-translate-y-1 font-bold"
            >
                <RefreshCw className={`w-5 h-5`} /> 
                {mode === 'case' ? '下一个案例' : '下一张'}
            </button>
            
            {mode === 'case' && (
                 <button 
                    onClick={handleGenerateAICase}
                    disabled={isGeneratingAI}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-full transition-all shadow-lg hover:shadow-purple-500/30 hover:-translate-y-1 font-bold"
                >
                    <Sparkles className={`w-5 h-5 ${isGeneratingAI ? 'animate-spin' : ''}`} /> 
                    AI 生成新案例
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default Practice;