import React, { useState } from 'react';
import { spreads, tarotDeck } from '../constants';
import { Spread, DivinationResult } from '../types';
import CardFlip from '../components/CardFlip';
import { saveHistory } from '../services/storage';
import { interpretReading } from '../services/geminiService';
import { Sparkles, BrainCircuit, RefreshCw, Save } from 'lucide-react';

const Divination: React.FC = () => {
  const [step, setStep] = useState<'select' | 'input' | 'shuffle' | 'result'>('select');
  const [selectedSpread, setSelectedSpread] = useState<Spread | null>(null);
  const [question, setQuestion] = useState('');
  const [drawnCards, setDrawnCards] = useState<{cardId: number, isReversed: boolean, positionId: number}[]>([]);
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
  const [aiInterpretation, setAiInterpretation] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Animation state for shuffling
  const [isShuffling, setIsShuffling] = useState(false);

  const handleSpreadSelect = (spread: Spread) => {
    setSelectedSpread(spread);
    setStep('input');
  };

  const startReading = () => {
    if (!question.trim()) return;
    setStep('shuffle');
    setIsShuffling(true);
    
    // Simulate shuffle delay
    setTimeout(() => {
        setIsShuffling(false);
        performDraw();
        setStep('result');
    }, 2000);
  };

  const performDraw = () => {
    if (!selectedSpread) return;
    
    // Simple Fisher-Yates shuffle logic
    const deck = [...tarotDeck];
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    const result = selectedSpread.positions.map((pos, index) => ({
        positionId: pos.id,
        cardId: deck[index].id,
        isReversed: Math.random() > 0.3 // 30% chance of reversal
    }));

    setDrawnCards(result);
    setRevealedIndices([]); // Reset revealed
    
    // Auto save to history
    saveHistory({
        id: Date.now().toString(),
        date: new Date().toISOString(),
        question,
        spreadId: selectedSpread.id,
        cards: result
    });
  };

  const handleCardClick = (index: number) => {
    if (!revealedIndices.includes(index)) {
        setRevealedIndices([...revealedIndices, index]);
    }
  };

  const handleAIRequest = async () => {
    if (!selectedSpread) return;
    setIsLoadingAI(true);
    
    const cardsForAI = drawnCards.map(d => ({
        card: tarotDeck.find(c => c.id === d.cardId)!,
        isReversed: d.isReversed,
        positionName: selectedSpread.positions.find(p => p.id === d.positionId)?.name || '未知位置'
    }));

    const result = await interpretReading(question, selectedSpread, cardsForAI);
    setAiInterpretation(result);
    setIsLoadingAI(false);
  };

  const reset = () => {
    setStep('select');
    setQuestion('');
    setDrawnCards([]);
    setRevealedIndices([]);
    setAiInterpretation('');
  };

  return (
    <div className="max-w-4xl mx-auto min-h-[80vh]">
      
      {/* STEP 1: Select Spread */}
      {step === 'select' && (
        <div className="animate-flip-in">
          <h2 className="text-2xl font-serif text-mystic-gold mb-6 text-center">选择你的牌阵</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {spreads.map(spread => (
                <div 
                    key={spread.id}
                    onClick={() => handleSpreadSelect(spread)}
                    className="bg-mystic-800 border border-mystic-700 hover:border-mystic-500 p-6 rounded-xl cursor-pointer transition hover:-translate-y-1 group"
                >
                    <div className="w-12 h-12 bg-mystic-700 rounded-full flex items-center justify-center mb-4 group-hover:bg-mystic-600">
                        <Sparkles className="text-mystic-gold" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{spread.name}</h3>
                    <p className="text-slate-400 text-sm">{spread.description}</p>
                    <div className="mt-4 flex gap-1">
                        {spread.positions.map((_, i) => (
                            <div key={i} className="w-2 h-3 bg-mystic-600 rounded-sm"></div>
                        ))}
                    </div>
                </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Question Input */}
      {step === 'input' && (
        <div className="max-w-lg mx-auto text-center animate-flip-in">
            <h2 className="text-2xl font-serif text-mystic-gold mb-2">心中默念你的问题</h2>
            <p className="text-slate-400 mb-8">保持专注，当你准备好时，点击开始。</p>
            
            <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="例如：我未来的事业发展如何？"
                className="w-full bg-mystic-900 border border-mystic-600 p-4 rounded-xl text-white focus:outline-none focus:border-mystic-400 min-h-[120px] mb-8"
            />
            
            <button 
                onClick={startReading}
                disabled={!question.trim()}
                className="px-8 py-3 bg-gradient-to-r from-mystic-600 to-indigo-600 text-white rounded-full font-bold shadow-lg shadow-indigo-500/30 disabled:opacity-50 hover:scale-105 transition transform"
            >
                开始洗牌
            </button>
            <button onClick={() => setStep('select')} className="block mx-auto mt-4 text-slate-500 hover:text-slate-300">返回</button>
        </div>
      )}

      {/* STEP 3: Shuffle Animation */}
      {step === 'shuffle' && (
          <div className="flex flex-col items-center justify-center h-[50vh]">
              <div className="relative w-48 h-80">
                 {/* Stack of cards animating */}
                 <div className="absolute inset-0 bg-mystic-800 rounded-xl border-2 border-mystic-600 animate-pulse transform rotate-3"></div>
                 <div className="absolute inset-0 bg-mystic-800 rounded-xl border-2 border-mystic-600 animate-pulse transform -rotate-2"></div>
                 <div className="absolute inset-0 bg-mystic-800 rounded-xl border-2 border-mystic-600 flex items-center justify-center animate-bounce">
                    <span className="text-mystic-gold text-4xl">✦</span>
                 </div>
              </div>
              <p className="mt-8 text-mystic-gold font-serif text-lg animate-pulse">正在连接宇宙能量...</p>
          </div>
      )}

      {/* STEP 4: Results */}
      {step === 'result' && selectedSpread && (
          <div className="animate-flip-in">
              <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-white">占卜结果</h2>
                    <p className="text-slate-400 text-sm">问题: {question}</p>
                  </div>
                  <button onClick={reset} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white">
                      <RefreshCw size={16}/> 新的占卜
                  </button>
              </div>

              {/* Spread Layout Display - Simple Flex Row for now, could be grid based on positions */}
              <div className="flex flex-wrap justify-center gap-6 mb-12">
                  {drawnCards.map((draw, index) => {
                      const card = tarotDeck.find(c => c.id === draw.cardId);
                      const position = selectedSpread.positions.find(p => p.id === draw.positionId);
                      const isRevealed = revealedIndices.includes(index);

                      return (
                          <div key={index} className="flex flex-col items-center">
                              <p className="text-mystic-gold text-sm font-serif mb-2">{position?.name}</p>
                              <CardFlip 
                                card={card || null} 
                                isRevealed={isRevealed} 
                                isReversed={draw.isReversed}
                                onClick={() => handleCardClick(index)}
                                width="w-32 md:w-40"
                                height="h-52 md:h-64"
                              />
                              <div className={`mt-3 text-center transition-opacity duration-500 ${isRevealed ? 'opacity-100' : 'opacity-0'}`}>
                                  <p className="text-white font-bold text-sm">{card?.nameCn}</p>
                                  <p className="text-xs text-slate-400 max-w-[150px]">{position?.description}</p>
                              </div>
                          </div>
                      );
                  })}
              </div>

              {/* AI Interpretation Section */}
              <div className="bg-mystic-900 border border-mystic-700 rounded-2xl p-6 md:p-8">
                  <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <BrainCircuit className="text-purple-400"/> 牌面解读
                      </h3>
                      {!aiInterpretation && (
                        <button 
                            onClick={handleAIRequest}
                            disabled={isLoadingAI || revealedIndices.length < drawnCards.length}
                            className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoadingAI ? '解读中...' : 'AI 深度解读'}
                            {!isLoadingAI && <Sparkles size={14}/>}
                        </button>
                      )}
                  </div>

                  {revealedIndices.length < drawnCards.length ? (
                      <p className="text-slate-500 text-center py-8">请先翻开所有牌面...</p>
                  ) : (
                      <div className="space-y-4">
                          {/* Basic Interpretation (Always shown) */}
                          {!aiInterpretation && (
                              <div className="grid gap-4">
                                  {drawnCards.map((draw, idx) => {
                                      const card = tarotDeck.find(c => c.id === draw.cardId);
                                      const pos = selectedSpread.positions.find(p => p.id === draw.positionId);
                                      return (
                                          <div key={idx} className="bg-mystic-800/50 p-4 rounded-lg">
                                              <span className="text-mystic-gold text-xs uppercase tracking-wider">{pos?.name}</span>
                                              <h4 className="font-bold text-white">{card?.nameCn} {draw.isReversed && '(逆位)'}</h4>
                                              <p className="text-slate-300 text-sm mt-1">
                                                  {draw.isReversed ? card?.meaningDown : card?.meaningUp}
                                              </p>
                                          </div>
                                      )
                                  })}
                              </div>
                          )}

                          {/* AI Response */}
                          {aiInterpretation && (
                              <div className="prose prose-invert prose-sm max-w-none animate-flip-in">
                                  <div className="whitespace-pre-wrap text-slate-200 leading-relaxed font-sans">
                                      {aiInterpretation}
                                  </div>
                              </div>
                          )}
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};

export default Divination;