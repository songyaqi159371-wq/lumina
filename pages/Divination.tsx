
import React, { useState, useEffect } from 'react';
import { spreads, tarotDeck, getCardImageUrl } from '../constants';
import { Spread, TarotCard } from '../types';
import CardFlip from '../components/CardFlip';
import { interpretReading } from '../services/geminiService';
import { Sparkles, BrainCircuit, RefreshCw, Layers, ChevronRight, HelpCircle, Eye, X, BookOpen, Key } from 'lucide-react';

const Divination: React.FC = () => {
  const [step, setStep] = useState<'select' | 'input' | 'shuffle' | 'result'>('select');
  const [selectedSpread, setSelectedSpread] = useState<Spread | null>(null);
  const [question, setQuestion] = useState('');
  const [drawnCards, setDrawnCards] = useState<{cardId: number, isReversed: boolean, positionId: number}[]>([]);
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
  const [aiInterpretation, setAiInterpretation] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  
  // Card detail modal state
  const [detailedCard, setDetailedCard] = useState<TarotCard | null>(null);

  // API Key handling
  const [hasKey, setHasKey] = useState(true);

  useEffect(() => {
    const checkKey = async () => {
        if (typeof (window as any).aistudio?.hasSelectedApiKey === 'function') {
            const result = await (window as any).aistudio.hasSelectedApiKey();
            setHasKey(result);
        }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (typeof (window as any).aistudio?.openSelectKey === 'function') {
        await (window as any).aistudio.openSelectKey();
        setHasKey(true); // Proceed assuming selection success as per guidelines
    }
  };

  const handleSpreadSelect = (spread: Spread) => {
    setSelectedSpread(spread);
    setStep('input');
  };

  const startReading = () => {
    if (!question.trim()) return;
    setStep('shuffle');
    setIsShuffling(true);
    
    setTimeout(() => {
        setIsShuffling(false);
        performDraw();
        setStep('result');
    }, 2500);
  };

  const performDraw = () => {
    if (!selectedSpread) return;
    
    const deck = [...tarotDeck];
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    const result = selectedSpread.positions.map((pos, index) => ({
        positionId: pos.id,
        cardId: deck[index].id,
        isReversed: Math.random() > 0.35 // 35% chance of reversal
    }));

    setDrawnCards(result);
    setRevealedIndices([]);
  };

  const handleCardClick = (index: number) => {
    if (!revealedIndices.includes(index)) {
        setRevealedIndices([...revealedIndices, index]);
    } else {
        const drawn = drawnCards[index];
        const card = tarotDeck.find(c => c.id === drawn.cardId);
        if (card) setDetailedCard(card);
    }
  };

  const handleAIRequest = async () => {
    if (!selectedSpread) return;
    setIsLoadingAI(true);
    
    const cardsForAI = drawnCards.map(d => ({
        card: tarotDeck.find(c => c.id === d.cardId)!,
        isReversed: d.isReversed,
        positionName: selectedSpread.positions.find(p => p.id === d.positionId)?.name || '未知'
    }));

    try {
        const result = await interpretReading(question, selectedSpread, cardsForAI);
        setAiInterpretation(result);
        if (result.includes("重新选择 API 密钥")) {
            setHasKey(false);
        }
    } catch (e) {
        console.error(e);
    } finally {
        setIsLoadingAI(false);
    }
  };

  const reset = () => {
    setStep('select');
    setQuestion('');
    setDrawnCards([]);
    setRevealedIndices([]);
    setAiInterpretation('');
  };

  return (
    <div className="max-w-6xl mx-auto min-h-[80vh] pb-20">
      
      {!hasKey && (
          <div className="mb-8 p-6 glass-card rounded-2xl border border-mystic-gold/30 text-center animate-flip-in">
              <Key className="w-12 h-12 text-mystic-gold mx-auto mb-4" />
              <h3 className="text-xl font-serif text-white mb-2">需要 API 密钥</h3>
              <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
                  为了获得高质量的 AI 塔罗解读，您需要选择一个可用的 API 密钥。
                  请确保您的 API 密钥来自已开通结算的 GCP 项目。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="https://ai.google.dev/gemini-api/docs/billing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-2 text-xs text-mystic-gold hover:text-white transition"
                  >
                      查看计费文档
                  </a>
                  <button 
                    onClick={handleSelectKey}
                    className="px-8 py-2 bg-mystic-gold text-mystic-950 rounded-xl font-bold hover:scale-105 transition active:scale-95"
                  >
                      选择 API 密钥
                  </button>
              </div>
          </div>
      )}

      {/* STEP 1: Select Spread */}
      {step === 'select' && (
        <div className="animate-flip-in">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-serif text-mystic-gold mb-2">选择神圣牌阵</h1>
            <p className="text-slate-400">选择一个适合你当前困惑的布局方式。</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {spreads.map(spread => (
                <div 
                    key={spread.id}
                    onClick={() => handleSpreadSelect(spread)}
                    className="bg-mystic-800/40 border border-mystic-700 hover:border-mystic-gold/50 p-6 rounded-2xl cursor-pointer transition-all hover:bg-mystic-800 group relative overflow-hidden"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-mystic-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                            <Layers className="text-mystic-gold w-5 h-5" />
                        </div>
                        <span className="text-xs bg-mystic-900/80 px-2 py-1 rounded-md text-slate-500 font-serif">
                            {spread.positions.length} Cards
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-mystic-gold transition-colors">{spread.name}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">{spread.description}</p>
                    
                    <div className="flex flex-wrap gap-1">
                        {spread.positions.map((_, i) => (
                            <div key={i} className="w-1.5 h-2 bg-mystic-600/50 rounded-sm"></div>
                        ))}
                    </div>
                </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Input */}
      {step === 'input' && selectedSpread && (
        <div className="max-w-xl mx-auto text-center animate-flip-in pt-10">
            <div className="mb-10 p-6 bg-mystic-800/20 rounded-2xl border border-mystic-700 inline-block text-left w-full">
                <span className="text-xs text-mystic-gold uppercase tracking-widest block mb-1">当前选择:</span>
                <h2 className="text-2xl font-serif text-white">{selectedSpread.name}</h2>
                <p className="text-slate-400 text-sm mt-2">{selectedSpread.description}</p>
            </div>

            <div className="mb-10">
                <h3 className="text-xl text-white font-serif mb-4">心中默念你的困惑</h3>
                <textarea
                    autoFocus
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="例如：我未来的事业发展趋势如何？"
                    className="w-full bg-mystic-900 border-2 border-mystic-700 p-5 rounded-2xl text-white focus:outline-none focus:border-mystic-gold/50 min-h-[150px] transition-colors shadow-inner text-lg"
                />
            </div>
            
            <div className="flex gap-4 justify-center">
                <button 
                    onClick={() => setStep('select')} 
                    className="px-8 py-3 rounded-full border border-mystic-700 text-slate-400 hover:text-white transition"
                >
                    返回
                </button>
                <button 
                    onClick={startReading}
                    disabled={!question.trim()}
                    className="px-10 py-3 bg-gradient-to-r from-mystic-600 to-mystic-500 text-white rounded-full font-bold shadow-xl shadow-mystic-900/50 disabled:opacity-30 hover:scale-105 active:scale-95 transition transform flex items-center gap-2"
                >
                    开始洗牌 <ChevronRight size={18}/>
                </button>
            </div>
        </div>
      )}

      {/* STEP 3: Shuffle */}
      {step === 'shuffle' && (
          <div className="flex flex-col items-center justify-center h-[60vh] animate-pulse">
              <div className="relative w-40 h-64">
                 <div className="absolute inset-0 bg-mystic-800 rounded-xl border-2 border-mystic-600 shadow-2xl transform rotate-6 animate-float"></div>
                 <div className="absolute inset-0 bg-mystic-800 rounded-xl border-2 border-mystic-600 shadow-2xl transform -rotate-3"></div>
                 <div className="absolute inset-0 bg-mystic-800 rounded-xl border-2 border-mystic-500 flex items-center justify-center shadow-2xl">
                    <Sparkles className="text-mystic-gold w-12 h-12 animate-spin-slow" />
                 </div>
              </div>
              <h2 className="mt-12 text-2xl font-serif text-mystic-gold tracking-widest">正在连接宇宙能量...</h2>
              <p className="mt-4 text-slate-500 italic">“牌灵已觉醒，命运之轮正在转动”</p>
          </div>
      )}

      {/* STEP 4: Result */}
      {step === 'result' && selectedSpread && (
          <div className="animate-flip-in">
              <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 bg-mystic-800/30 p-8 rounded-3xl border border-mystic-700">
                  <div>
                    <h2 className="text-xs text-mystic-gold uppercase tracking-[0.3em] mb-2">占卜启示录</h2>
                    <h1 className="text-3xl font-serif text-white">{selectedSpread.name}</h1>
                    <div className="flex items-center gap-2 mt-4 text-slate-400">
                        <HelpCircle size={16} className="text-mystic-500" />
                        <span className="text-sm italic">“{question}”</span>
                    </div>
                  </div>
                  <button onClick={reset} className="flex items-center gap-2 px-4 py-2 bg-mystic-900 border border-mystic-700 rounded-lg text-sm text-slate-400 hover:text-white hover:border-mystic-500 transition">
                      <RefreshCw size={14}/> 开启新占卜
                  </button>
              </header>

              {/* Spread Display Area */}
              <div className="mb-16">
                  <div className="flex flex-wrap justify-center gap-8 md:gap-12">
                      {drawnCards.map((draw, index) => {
                          const card = tarotDeck.find(c => c.id === draw.cardId);
                          const position = selectedSpread.positions.find(p => p.id === draw.positionId);
                          const isRevealed = revealedIndices.includes(index);

                          return (
                              <div key={index} className="flex flex-col items-center space-y-4">
                                  <div className="px-3 py-1 bg-mystic-800 border border-mystic-700 rounded-full text-[10px] text-mystic-gold uppercase tracking-widest shadow-lg">
                                      {position?.name}
                                  </div>
                                  <div className="relative group">
                                    <CardFlip 
                                        card={card || null} 
                                        isRevealed={isRevealed} 
                                        isReversed={draw.isReversed}
                                        onClick={() => handleCardClick(index)}
                                        width="w-32 md:w-44"
                                        height="h-52 md:h-72"
                                    />
                                    {isRevealed && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setDetailedCard(card || null); }}
                                            className="absolute top-2 right-2 p-2 bg-mystic-950/80 rounded-full text-mystic-gold opacity-0 group-hover:opacity-100 transition-opacity border border-mystic-700 shadow-xl"
                                            title="查看图鉴"
                                        >
                                            <BookOpen size={16} />
                                        </button>
                                    )}
                                  </div>
                                  <div className={`text-center transition-all duration-700 max-w-[180px] ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                      <p className="text-white font-bold text-sm mb-1">{card?.nameCn} {draw.isReversed && <span className="text-red-500 text-xs">(逆位)</span>}</p>
                                      <button 
                                        onClick={() => setDetailedCard(card || null)}
                                        className="text-[10px] text-mystic-400 hover:text-mystic-gold transition-colors flex items-center gap-1 mx-auto"
                                      >
                                        <BookOpen size={10} /> 查看含义
                                      </button>
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              </div>

              {/* AI & Summary Section */}
              <div className="bg-mystic-950/80 rounded-3xl border-2 border-mystic-800 p-8 md:p-12 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-mystic-600/5 blur-[120px] rounded-full pointer-events-none"></div>
                  
                  <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                      <div className="flex items-center gap-3">
                          <div className="p-3 bg-purple-900/30 rounded-2xl border border-purple-500/20">
                            <BrainCircuit className="text-purple-400 w-8 h-8"/>
                          </div>
                          <div>
                            <h3 className="text-2xl font-serif text-white">深度解析</h3>
                            <p className="text-slate-500 text-xs mt-1">由 AI 结合神秘学语境生成</p>
                          </div>
                      </div>
                      
                      {!aiInterpretation && (
                        <button 
                            onClick={handleAIRequest}
                            disabled={isLoadingAI || revealedIndices.length < drawnCards.length}
                            className="group px-8 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:opacity-40 text-white rounded-xl transition-all shadow-lg shadow-purple-900/40 font-bold flex items-center gap-3 active:scale-95"
                        >
                            {isLoadingAI ? '正在生成解读...' : '生成 AI 解读'}
                            {!isLoadingAI && <Sparkles size={18} className="animate-pulse" />}
                        </button>
                      )}
                  </div>

                  {revealedIndices.length < drawnCards.length ? (
                      <div className="text-center py-16 border-2 border-dashed border-mystic-800 rounded-2xl bg-mystic-900/20">
                          <Eye size={40} className="mx-auto mb-4 text-slate-700 animate-bounce" />
                          <p className="text-slate-500 font-serif">请点击翻开所有卡牌...</p>
                      </div>
                  ) : (
                      <div className="space-y-10">
                          {isLoadingAI && (
                               <div className="text-center py-20 space-y-6">
                                    <div className="relative w-20 h-20 mx-auto">
                                        <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-t-purple-500 rounded-full animate-spin"></div>
                                        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-400 w-8 h-8" />
                                    </div>
                                    <p className="text-purple-300 font-serif text-xl animate-pulse">正在生成解读...</p>
                               </div>
                          )}

                          {aiInterpretation && (
                              <div className="prose prose-invert prose-purple max-w-none animate-flip-in">
                                  <div className="bg-black/30 p-8 md:p-10 rounded-3xl border border-mystic-700 leading-relaxed font-sans text-slate-200 whitespace-pre-wrap shadow-inner text-lg">
                                      {aiInterpretation}
                                  </div>
                              </div>
                          )}
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* Reusable Detail Modal */}
      {detailedCard && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-flip-in" onClick={() => setDetailedCard(null)}>
            <div 
                onClick={(e) => e.stopPropagation()} 
                className="relative bg-mystic-900 w-full max-w-3xl max-h-[85vh] rounded-2xl border border-mystic-600 shadow-2xl overflow-hidden flex flex-col md:flex-row z-[105]"
            >
                <button 
                    onClick={() => setDetailedCard(null)}
                    className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-red-900/80 z-20 transition-colors shadow-xl"
                >
                    <X size={20} />
                </button>

                <div className="md:w-5/12 bg-black flex-shrink-0 h-[35vh] md:h-auto border-b md:border-b-0 md:border-r border-mystic-800">
                    <div className="w-full h-full flex items-center justify-center p-6">
                        <img 
                            src={getCardImageUrl(detailedCard.id)} 
                            className="w-full h-full object-contain drop-shadow-2xl"
                            alt={detailedCard.nameEn} 
                        />
                    </div>
                </div>

                <div className="md:w-7/12 p-6 md:p-8 overflow-y-auto flex-1 bg-mystic-900 custom-scrollbar">
                    <div className="mb-6">
                        <h2 className="text-3xl font-serif text-mystic-gold">{detailedCard.nameCn}</h2>
                        <p className="text-slate-400 italic font-serif text-sm">{detailedCard.nameEn}</p>
                    </div>

                    <div className="space-y-6">
                        <div className="p-4 bg-mystic-800/30 rounded-lg border border-mystic-800">
                            <h3 className="text-sm font-bold text-violet-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                                <ChevronRight size={14} /> 正位含义
                            </h3>
                            <p className="text-slate-200 leading-relaxed text-sm">{detailedCard.meaningUp}</p>
                        </div>
                        
                        <div className="p-4 bg-mystic-800/30 rounded-lg border border-mystic-800">
                            <h3 className="text-sm font-bold text-red-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                                <ChevronRight size={14} /> 逆位含义
                            </h3>
                            <p className="text-slate-300 leading-relaxed text-sm">{detailedCard.meaningDown}</p>
                        </div>

                        <div>
                            <h3 className="text-xs font-bold text-blue-400 mb-2 uppercase tracking-wider">画面象征</h3>
                            <p className="text-slate-400 text-xs leading-relaxed italic">{detailedCard.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Divination;
