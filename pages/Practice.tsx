import React, { useState, useEffect } from 'react';
import { tarotDeck } from '../constants';
import CardFlip from '../components/CardFlip';
import { RefreshCw, CheckCircle, HelpCircle } from 'lucide-react';
import { TarotCard } from '../types';

const Practice: React.FC = () => {
  const [currentCard, setCurrentCard] = useState<TarotCard | null>(null);
  
  // Flashcard State: 0 = Hidden (Back), 1 = Image (Front), 2 = Meaning (Text)
  const [flashcardStep, setFlashcardStep] = useState<0 | 1 | 2>(0);
  
  const [mode, setMode] = useState<'flashcard' | 'quiz'>('flashcard');
  const [options, setOptions] = useState<TarotCard[]>([]);
  const [quizResult, setQuizResult] = useState<'correct' | 'wrong' | null>(null);

  const startNewRound = () => {
    const random = tarotDeck[Math.floor(Math.random() * tarotDeck.length)];
    setCurrentCard(random);
    setFlashcardStep(0); // Reset flashcard to back
    setQuizResult(null);

    if (mode === 'quiz') {
        // Generate 3 distractors
        const distractors: TarotCard[] = [];
        while(distractors.length < 3) {
            const r = tarotDeck[Math.floor(Math.random() * tarotDeck.length)];
            if (r.id !== random.id && !distractors.some(d => d.id === r.id)) {
                distractors.push(r);
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
      // If 2, do nothing or loop back? Usually stay at 2 until user clicks Next.
  };

  const handleQuizAnswer = (selectedId: number) => {
    if (!currentCard) return;
    if (selectedId === currentCard.id) {
        setQuizResult('correct');
    } else {
        setQuizResult('wrong');
    }
  };

  // Switch modes triggers new round
  useEffect(() => {
    startNewRound();
    // eslint-disable-next-line
  }, [mode]);

  if (!currentCard) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="flex justify-center mb-8 bg-mystic-800/50 p-1 rounded-full w-fit mx-auto border border-mystic-700">
        <button 
            onClick={() => setMode('flashcard')}
            className={`px-6 py-2 rounded-full text-sm transition ${mode === 'flashcard' ? 'bg-mystic-600 text-white' : 'text-slate-400 hover:text-white'}`}
        >
            闪卡模式
        </button>
        <button 
             onClick={() => setMode('quiz')}
             className={`px-6 py-2 rounded-full text-sm transition ${mode === 'quiz' ? 'bg-mystic-600 text-white' : 'text-slate-400 hover:text-white'}`}
        >
            牌义测验
        </button>
      </div>

      <div className="flex flex-col items-center">
        
        {/* --- FLASHCARD MODE --- */}
        {mode === 'flashcard' && (
            <>
                 <div className="mb-4">
                    <CardFlip 
                        card={currentCard} 
                        isRevealed={flashcardStep > 0} 
                        showLabel={flashcardStep >= 1} // Show name when image is revealed
                        onClick={handleFlashcardClick}
                    />
                    <div className="mt-4 text-center min-h-[20px]">
                        {flashcardStep === 0 && <span className="text-slate-500 text-sm animate-pulse">点击翻开牌面</span>}
                        {flashcardStep === 1 && <span className="text-mystic-400 text-sm animate-pulse font-bold">再次点击查看详解</span>}
                    </div>
                 </div>
                 
                 <div className="text-center min-h-[140px] mb-6 px-4 w-full transition-all duration-500">
                     {flashcardStep === 2 ? (
                         <div className="animate-flip-in bg-mystic-800/60 p-6 rounded-xl border border-mystic-700 shadow-lg">
                             <h3 className="text-2xl font-serif text-mystic-gold mb-2">{currentCard.nameCn}</h3>
                             <div className="flex flex-wrap justify-center gap-2 mb-4">
                                {currentCard.keywords.map(k => (
                                    <span key={k} className="text-xs bg-mystic-900 border border-mystic-600 px-2 py-1 rounded text-slate-300">{k}</span>
                                ))}
                             </div>
                             <p className="text-sm text-slate-200 leading-relaxed text-left">{currentCard.meaningUp}</p>
                         </div>
                     ) : (
                         <div className="h-full flex flex-col items-center justify-center text-slate-600 italic py-8">
                             {flashcardStep === 1 && <p>看着牌面，试着回想它的含义...</p>}
                         </div>
                     )}
                 </div>
            </>
        )}

        {/* --- QUIZ MODE --- */}
        {mode === 'quiz' && (
             <div className="w-full max-w-lg">
                 <div className="flex justify-center mb-6">
                    {/* Always show image in quiz mode */}
                    <CardFlip 
                        card={currentCard} 
                        isRevealed={true} 
                        showLabel={false} // Hide name label to test visual recognition -> meaning mapping
                    />
                 </div>
                 
                 <div className="text-center mb-6">
                     <p className="text-lg text-white font-serif mb-4">这张牌的含义是?</p>
                     {quizResult === 'correct' && <div className="text-green-400 font-bold mb-4 flex items-center justify-center gap-2 animate-bounce"><CheckCircle size={16}/> 回答正确!</div>}
                     {quizResult === 'wrong' && <div className="text-red-400 font-bold mb-4 flex items-center justify-center gap-2 animate-shake"><HelpCircle size={16}/> 答案不正确</div>}
                 </div>

                 <div className="grid grid-cols-1 gap-3">
                     {options.map(opt => (
                         <button
                            key={opt.id}
                            disabled={quizResult === 'correct'}
                            onClick={() => handleQuizAnswer(opt.id)}
                            className={`p-4 rounded-lg border text-left transition relative overflow-hidden group
                                ${quizResult === 'correct' && opt.id === currentCard.id 
                                    ? 'bg-green-900/40 border-green-500 text-green-100' 
                                    : 'bg-mystic-800 border-mystic-700 hover:bg-mystic-700 text-slate-300'}
                                ${quizResult === 'wrong' && opt.id === currentCard.id ? 'border-green-500/50' : '' /* Hint correct answer faintly if wrong? Optional */} 
                            `}
                         >
                             <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-sm text-mystic-gold">{opt.keywords.slice(0, 4).join(' · ')}</span>
                                {quizResult === 'correct' && opt.id === currentCard.id && <CheckCircle size={16} className="text-green-400"/>}
                             </div>
                             <p className="text-xs text-slate-500 line-clamp-2 group-hover:text-slate-400 transition-colors">
                                 {opt.meaningUp}
                             </p>
                         </button>
                     ))}
                 </div>
             </div>
        )}

        <button 
            onClick={startNewRound}
            className="mt-8 flex items-center gap-2 px-8 py-3 bg-mystic-600 hover:bg-mystic-500 text-white rounded-full transition shadow-lg shadow-mystic-600/30"
        >
            <RefreshCw className="w-4 h-4" /> 下一张
        </button>
      </div>
    </div>
  );
};

export default Practice;