import React, { useState, useEffect } from 'react';
import { tarotDeck } from '../constants';
import CardFlip from '../components/CardFlip';
import { RefreshCw, CheckCircle, HelpCircle, BookOpen } from 'lucide-react';
import { TarotCard } from '../types';

const Practice: React.FC = () => {
  const [currentCard, setCurrentCard] = useState<TarotCard | null>(null);
  
  // Flashcard State: 0 = Hidden (Back), 1 = Image (Front), 2 = Meaning (Text)
  const [flashcardStep, setFlashcardStep] = useState<0 | 1 | 2>(0);
  
  const [mode, setMode] = useState<'flashcard' | 'quiz'>('flashcard');
  const [options, setOptions] = useState<TarotCard[]>([]);
  const [quizResult, setQuizResult] = useState<'correct' | 'wrong' | null>(null);

  // Initialize first card on mount
  useEffect(() => {
    startNewRound();
    // eslint-disable-next-line
  }, [mode]);

  const startNewRound = () => {
    const random = tarotDeck[Math.floor(Math.random() * tarotDeck.length)];
    setCurrentCard(random);
    setFlashcardStep(0); // Reset flashcard to back
    setQuizResult(null);

    if (mode === 'quiz') {
        // Generate 3 distractors
        const distractors: TarotCard[] = [];
        const usedIds = new Set([random.id]);
        
        while(distractors.length < 3) {
            const r = tarotDeck[Math.floor(Math.random() * tarotDeck.length)];
            if (!usedIds.has(r.id)) {
                distractors.push(r);
                usedIds.add(r.id);
            }
        }
        // Shuffle options
        const opts = [random, ...distractors].sort(() => Math.random() - 0.5);
        setOptions(opts);
    }
  };

  const handleFlashcardClick = () => {
      if (flashcardStep === 0) {
          setFlashcardStep(1); // Reveal Image
      } else if (flashcardStep === 1) {
          setFlashcardStep(2); // Reveal Meaning
      }
      // If 2, user usually clicks "Next"
  };

  const handleQuizAnswer = (selectedId: number) => {
    if (!currentCard) return;
    if (selectedId === currentCard.id) {
        setQuizResult('correct');
    } else {
        setQuizResult('wrong');
    }
  };

  if (!currentCard) return <div className="p-8 text-center text-slate-400">加载中...</div>;

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      {/* Mode Switcher */}
      <div className="flex justify-center mb-8 bg-mystic-800/50 p-1 rounded-full w-fit mx-auto border border-mystic-700 backdrop-blur-sm">
        <button 
            onClick={() => setMode('flashcard')}
            className={`px-6 py-2 rounded-full text-sm transition font-medium flex items-center gap-2 ${mode === 'flashcard' ? 'bg-mystic-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
            <BookOpen size={16} /> 闪卡记忆
        </button>
        <button 
             onClick={() => setMode('quiz')}
             className={`px-6 py-2 rounded-full text-sm transition font-medium flex items-center gap-2 ${mode === 'quiz' ? 'bg-mystic-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
            <HelpCircle size={16} /> 牌义测验
        </button>
      </div>

      <div className="flex flex-col items-center">
        
        {/* --- FLASHCARD MODE --- */}
        {mode === 'flashcard' && (
            <div className="w-full flex flex-col items-center animate-flip-in">
                 <div className="mb-6 relative">
                    <CardFlip 
                        key={`flash-${currentCard.id}`} // Force re-render on new card
                        card={currentCard} 
                        isRevealed={flashcardStep > 0} 
                        showLabel={flashcardStep >= 1} // Show name only when image is revealed
                        onClick={handleFlashcardClick}
                        height="h-80 md:h-96"
                        width="w-52 md:w-64"
                    />
                    
                    {/* Prompt Overlay/Tooltip below card */}
                    <div className="mt-6 text-center h-8">
                        {flashcardStep === 0 && (
                            <span className="inline-block px-4 py-1 rounded-full bg-mystic-800 text-slate-300 text-sm animate-pulse border border-mystic-600">
                                👇 点击翻开牌面
                            </span>
                        )}
                        {flashcardStep === 1 && (
                            <span className="inline-block px-4 py-1 rounded-full bg-mystic-800 text-mystic-gold text-sm animate-pulse border border-mystic-600">
                                👇 再次点击查看详解
                            </span>
                        )}
                    </div>
                 </div>
                 
                 {/* Meaning Box */}
                 <div className={`w-full transition-all duration-500 transform ${flashcardStep === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                     {flashcardStep === 2 && (
                         <div className="bg-mystic-800/80 p-6 rounded-xl border border-mystic-600 shadow-xl backdrop-blur-md">
                             <div className="flex items-center justify-between mb-4 border-b border-mystic-700 pb-2">
                                 <h3 className="text-2xl font-serif text-mystic-gold">{currentCard.nameCn}</h3>
                                 <span className="text-xs text-slate-400 font-serif">{currentCard.nameEn}</span>
                             </div>
                             
                             <div className="flex flex-wrap gap-2 mb-4">
                                {currentCard.keywords.map(k => (
                                    <span key={k} className="text-xs bg-indigo-900/50 border border-indigo-700 px-2 py-1 rounded text-indigo-200">
                                        {k}
                                    </span>
                                ))}
                             </div>
                             <p className="text-slate-200 leading-relaxed text-sm md:text-base">
                                 {currentCard.meaningUp}
                             </p>
                         </div>
                     )}
                 </div>
            </div>
        )}

        {/* --- QUIZ MODE --- */}
        {mode === 'quiz' && (
             <div className="w-full max-w-lg animate-flip-in">
                 <div className="flex justify-center mb-8">
                    {/* Always show image in quiz mode */}
                    <CardFlip 
                        key={`quiz-${currentCard.id}`}
                        card={currentCard} 
                        isRevealed={true} 
                        showLabel={false} // Hide name label to test meaning
                        height="h-64"
                        width="w-40"
                    />
                 </div>
                 
                 <div className="text-center mb-6">
                     <p className="text-lg text-white font-serif mb-2">这张牌的含义是?</p>
                     
                     {quizResult === 'correct' && (
                        <div className="p-2 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 font-bold flex items-center justify-center gap-2 animate-bounce">
                            <CheckCircle size={18}/> 回答正确!
                        </div>
                     )}
                     
                     {quizResult === 'wrong' && (
                        <div className="p-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 font-bold flex items-center justify-center gap-2 animate-shake">
                            <HelpCircle size={18}/> 答案不正确，请重试或查看下一张
                        </div>
                     )}
                 </div>

                 <div className="space-y-3">
                     {options.map(opt => {
                         const isSelectedCorrect = quizResult === 'correct' && opt.id === currentCard.id;
                         const isSelectedWrong = quizResult === 'wrong' && opt.id !== currentCard.id; // Highlight wrong clicks logic could be complex, keeping simple
                         
                         return (
                             <button
                                key={opt.id}
                                disabled={quizResult === 'correct'}
                                onClick={() => handleQuizAnswer(opt.id)}
                                className={`w-full p-4 rounded-xl border text-left transition-all duration-300 relative overflow-hidden group
                                    ${isSelectedCorrect
                                        ? 'bg-green-900/60 border-green-500 text-green-50 shadow-[0_0_15px_rgba(34,197,94,0.3)] transform scale-[1.02]' 
                                        : 'bg-mystic-800 border-mystic-700 hover:bg-mystic-700 hover:border-mystic-500 text-slate-300 hover:text-white'}
                                `}
                             >
                                 <div className="flex items-center gap-2 mb-1">
                                    <span className={`font-bold text-sm ${isSelectedCorrect ? 'text-green-300' : 'text-mystic-gold group-hover:text-mystic-300'}`}>
                                        {opt.keywords.slice(0, 3).join(' / ')} ...
                                    </span>
                                    {isSelectedCorrect && <CheckCircle size={16} className="text-green-400 ml-auto"/>}
                                 </div>
                                 <p className={`text-xs line-clamp-2 ${isSelectedCorrect ? 'text-green-100' : 'text-slate-500 group-hover:text-slate-400'}`}>
                                     {opt.meaningUp}
                                 </p>
                             </button>
                         )
                     })}
                 </div>
             </div>
        )}

        <div className="mt-8 pb-8">
            <button 
                onClick={startNewRound}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-mystic-600 to-indigo-600 hover:from-mystic-500 hover:to-indigo-500 text-white rounded-full transition-all shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5"
            >
                <RefreshCw className={`w-4 h-4 ${quizResult === 'correct' ? 'animate-spin' : ''}`} /> 
                {mode === 'quiz' ? '下一题' : '下一张'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Practice;