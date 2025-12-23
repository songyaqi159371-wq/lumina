import React, { useState, useEffect, useRef } from 'react';
import { spreads, tarotDeck, getCardImageUrl } from '../constants';
import { Spread, TarotCard } from '../types';
import CardFlip from '../components/CardFlip';
import { interpretReading } from '../services/geminiService';
import { 
    Sparkles, BrainCircuit, RefreshCw, Layers, ChevronRight, 
    HelpCircle, Eye, X, BookOpen, Key, 
    CheckCircle, Info, MousePointer2
} from 'lucide-react';

const Divination: React.FC = () => {
  const [step, setStep] = useState<'select' | 'input' | 'drawing' | 'result'>('select');
  const [selectedSpread, setSelectedSpread] = useState<Spread | null>(null);
  const [question, setQuestion] = useState('');
  
  // Selection Logic
  const [pickedIndices, setPickedIndices] = useState<{cardId: number, isReversed: boolean}[]>([]);
  const [drawnCards, setDrawnCards] = useState<{cardId: number, isReversed: boolean, positionId: number}[]>([]);
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
  
  // AI/UI State
  const [aiInterpretation, setAiInterpretation] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [detailedCard, setDetailedCard] = useState<TarotCard | null>(null);
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
        setHasKey(true);
    }
  };

  const handleSpreadSelect = (spread: Spread) => {
    setSelectedSpread(spread);
    setStep('input');
  };

  const startDrawing = () => {
    if (!question.trim()) return;
    setPickedIndices([]);
    setStep('drawing');
  };

  const handlePickCard = (deckIndex: number) => {
    if (!selectedSpread || pickedIndices.length >= selectedSpread.positions.length) return;
    
    const isAlreadyPicked = pickedIndices.some((p: any) => p.deckIndex === deckIndex);
    if (isAlreadyPicked) return;

    const cardId = deckIndex; 
    const isReversed = Math.random() > 0.35;

    const newPick = { cardId, isReversed, deckIndex };
    const newPicks = [...pickedIndices, newPick];
    setPickedIndices(newPicks);

    if (newPicks.length === selectedSpread.positions.length) {
        setTimeout(() => {
            const finalDrawn = newPicks.map((pick, i) => ({
                cardId: pick.cardId,
                isReversed: pick.isReversed,
                positionId: selectedSpread.positions[i].id
            }));
            setDrawnCards(finalDrawn);
            setStep('result');
            setRevealedIndices([]);
        }, 800);
    }
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
        if (result.includes("重新选择 API 密钥")) setHasKey(false);
    } catch (e) {
        console.error(e);
    } finally {
        setIsLoadingAI(false);
    }
  };

  const reset = () => {
    setStep('select');
    setQuestion('');
    setPickedIndices([]);
    setDrawnCards([]);
    setRevealedIndices([]);
    setAiInterpretation('');
  };

  return (
    <div className="max-w-7xl mx-auto min-h-[80vh] pb-20 px-4">
      
      {/* Step 1: Select Spread */}
      {step === 'select' && (
        <div className="animate-flip-in">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-serif text-white mb-4 tracking-widest">选择神圣牌阵</h1>
            <p className="text-slate-500 font-light">选择一个维度，开启与潜意识的对话。</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {spreads.map(spread => (
                <div 
                    key={spread.id}
                    onClick={() => handleSpreadSelect(spread)}
                    className="glass-card p-8 rounded-[2rem] cursor-pointer group hover:bg-white/[0.03]"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="p-3 bg-mystic-900 rounded-2xl border border-white/5 group-hover:border-mystic-gold/30 transition-colors">
                            <Layers className="text-mystic-gold w-6 h-6" />
                        </div>
                        <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-slate-500 font-serif uppercase tracking-widest">
                            {spread.positions.length} Cards
                        </span>
                    </div>
                    <h3 className="text-xl font-serif text-white mb-3 group-hover:text-mystic-gold transition-colors">{spread.name}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed font-light">{spread.description}</p>
                </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Input Question */}
      {step === 'input' && selectedSpread && (
        <div className="max-w-2xl mx-auto animate-flip-in pt-10">
            <div className="glass-card p-10 rounded-[3rem] border border-white/10">
                <div className="mb-10 text-center">
                    <span className="text-[10px] text-mystic-gold uppercase tracking-[0.4em] mb-4 block opacity-60">Step Two: Intent</span>
                    <h2 className="text-3xl font-serif text-white mb-2">{selectedSpread.name}</h2>
                    <p className="text-slate-500 text-sm">明确你的意图，宇宙才能给出清晰的映射。</p>
                </div>

                <div className="mb-10">
                    <textarea
                        autoFocus
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="在此输入你的困惑..."
                        className="w-full bg-black/40 border border-white/10 p-6 rounded-3xl text-white focus:outline-none focus:border-mystic-gold/50 min-h-[180px] transition-all shadow-inner text-lg font-light leading-relaxed"
                    />
                </div>
                
                <div className="flex gap-4">
                    <button onClick={() => setStep('select')} className="flex-1 py-4 rounded-2xl border border-white/10 text-slate-500 hover:text-white transition uppercase text-xs font-bold tracking-widest">返回</button>
                    <button 
                        onClick={startDrawing}
                        disabled={!question.trim()}
                        className="flex-[2] py-4 bg-mystic-gold text-mystic-950 rounded-2xl font-bold disabled:opacity-20 hover:scale-[1.02] active:scale-95 transition flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
                    >
                        前往抽取卡牌 <ChevronRight size={16}/>
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Step 3: Drawing Cards - Enlarged UI */}
      {step === 'drawing' && selectedSpread && (
        <div className="animate-flip-in flex flex-col items-center w-full max-w-screen-xl mx-auto">
            <header className="w-full mb-12 text-center">
                <h2 className="text-4xl font-serif text-white mb-4 tracking-wider">亲手开启命运</h2>
                <p className="text-slate-400 text-lg font-light">
                    请从下方的 78 张灵能矩阵中，凭直觉选出 <span className="text-mystic-gold font-bold">{selectedSpread.positions.length}</span> 张卡牌。
                </p>
            </header>

            {/* Selection Progress - More Prominent */}
            <div className="w-full max-w-2xl mb-16 space-y-6">
                <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3 text-mystic-gold font-serif uppercase tracking-[0.4em]">
                        <Sparkles size={20} className="animate-pulse" />
                        <span className="text-xl">灵能收集</span>
                    </div>
                    <span className="text-2xl font-serif text-white tracking-widest">{pickedIndices.length} / {selectedSpread.positions.length}</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                    <div 
                        className="h-full bg-gradient-to-r from-mystic-600 via-mystic-gold to-mystic-400 transition-all duration-700 ease-out shadow-[0_0_20px_#fbbf24]" 
                        style={{ width: `${(pickedIndices.length / selectedSpread.positions.length) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* The Arcana Pool: Enlarged Grid */}
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-13 gap-4 md:gap-6 p-10 md:p-16 glass-card rounded-[4rem] border-white/10 w-full mb-20 shadow-[0_0_120px_rgba(0,0,0,0.6)] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-mystic-gold/5 via-transparent to-mystic-600/5 pointer-events-none"></div>
                
                {Array.from({ length: 78 }).map((_, i) => {
                    const isPicked = pickedIndices.some((p: any) => p.deckIndex === i);
                    return (
                        <div 
                            key={i}
                            onClick={() => handlePickCard(i)}
                            className={`
                                relative aspect-[2/3] w-full rounded-xl border border-white/10 transition-all duration-700 cursor-pointer
                                ${isPicked 
                                    ? 'opacity-0 scale-50 pointer-events-none -translate-y-24 blur-sm' 
                                    : 'bg-[#0f172a] hover:border-mystic-gold/60 hover:shadow-[0_0_40px_rgba(251,191,36,0.3)] hover:-translate-y-3 hover:scale-105 active:scale-90 active:duration-150'
                                }
                            `}
                        >
                            {/* Card Back Design (Detailed for Large Scale) */}
                            <div className="absolute inset-1.5 rounded-lg border border-white/5 flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/sacred-geometry.png')] bg-opacity-10">
                                <div className="w-1.5 h-1.5 rounded-full bg-mystic-gold/20 shadow-[0_0_8px_rgba(251,191,36,0.2)]"></div>
                                <div className="absolute top-2 left-2 w-1 h-1 bg-white/5 rounded-full"></div>
                                <div className="absolute bottom-2 right-2 w-1 h-1 bg-white/5 rounded-full"></div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="flex items-center gap-4 text-slate-500 text-xs font-serif uppercase tracking-[0.3em] opacity-50 mb-10">
                <div className="h-px w-12 bg-slate-800"></div>
                <Info size={14} />
                <span>已重置 78 张阿卡纳序列，请顺应内在指引</span>
                <div className="h-px w-12 bg-slate-800"></div>
            </div>
        </div>
      )}

      {/* Step 4: Result Display */}
      {step === 'result' && selectedSpread && (
          <div className="animate-flip-in">
              <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 glass-card p-10 rounded-[3rem] border-white/10">
                  <div>
                    <h2 className="text-[10px] text-mystic-gold uppercase tracking-[0.4em] mb-3">启示录解读</h2>
                    <h1 className="text-4xl font-serif text-white mb-4">{selectedSpread.name}</h1>
                    <div className="flex items-center gap-3 px-4 py-2 bg-black/40 rounded-full border border-white/5 w-fit">
                        <HelpCircle size={14} className="text-mystic-gold" />
                        <span className="text-sm italic text-slate-300">“{question}”</span>
                    </div>
                  </div>
                  <button onClick={reset} className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition group">
                      <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700"/> 开启新占卜
                  </button>
              </header>

              {/* Spread Visualizer */}
              <div className="mb-24">
                  <div className="flex flex-wrap justify-center gap-10 md:gap-16">
                      {drawnCards.map((draw, index) => {
                          const card = tarotDeck.find(c => c.id === draw.cardId);
                          const position = selectedSpread.positions.find(p => p.id === draw.positionId);
                          const isRevealed = revealedIndices.includes(index);

                          return (
                              <div key={index} className="flex flex-col items-center space-y-6">
                                  <div className="px-4 py-1.5 bg-mystic-900 border border-white/10 rounded-full text-[9px] text-mystic-gold uppercase tracking-[0.2em] font-bold shadow-xl">
                                      {position?.name}
                                  </div>
                                  <div className="relative group">
                                    <CardFlip 
                                        card={card || null} 
                                        isRevealed={isRevealed} 
                                        isReversed={draw.isReversed}
                                        onClick={() => handleCardClick(index)}
                                        width="w-36 md:w-52"
                                        height="h-56 md:h-80"
                                    />
                                    {isRevealed && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setDetailedCard(card || null); }}
                                            className="absolute top-4 right-4 p-2 bg-black/80 rounded-full text-mystic-gold opacity-0 group-hover:opacity-100 transition-all border border-white/10 shadow-2xl scale-75 group-hover:scale-100"
                                        >
                                            <BookOpen size={16} />
                                        </button>
                                    )}
                                  </div>
                                  <div className={`text-center transition-all duration-1000 ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                      <p className="text-white font-bold text-lg mb-1">{card?.nameCn}</p>
                                      {draw.isReversed && <span className="text-red-500 text-[10px] font-bold uppercase tracking-widest">Reversed 逆位</span>}
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              </div>

              {/* AI Analysis Section */}
              <div className="glass-card rounded-[4rem] border-white/5 p-12 md:p-20 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-mystic-gold/20 to-transparent"></div>
                  
                  <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
                      <div className="flex items-center gap-6">
                          <div className="p-5 bg-purple-900/20 rounded-[2rem] border border-purple-500/10 shadow-[0_0_40px_rgba(168,85,247,0.1)]">
                            <BrainCircuit className="text-purple-400 w-10 h-10"/>
                          </div>
                          <div>
                            <h3 className="text-3xl font-serif text-white mb-2">灵能深度解析</h3>
                            <p className="text-slate-500 text-sm font-light">基于象征学背景的 AI 映射报告</p>
                          </div>
                      </div>
                      
                      {!aiInterpretation && (
                        <button 
                            onClick={handleAIRequest}
                            disabled={isLoadingAI || revealedIndices.length < drawnCards.length}
                            className="group px-10 py-5 bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-20 text-white rounded-[2rem] transition-all shadow-xl shadow-purple-900/30 font-bold flex items-center gap-4 active:scale-95"
                        >
                            {isLoadingAI ? '正在调阅宇宙档案...' : '生成 AI 深度报告'}
                            {!isLoadingAI && <Sparkles size={20} className="animate-pulse" />}
                        </button>
                      )}
                  </div>

                  {revealedIndices.length < drawnCards.length ? (
                      <div className="text-center py-20 border border-dashed border-white/10 rounded-[3rem] bg-white/[0.02] animate-pulse">
                          <Eye size={48} className="mx-auto mb-6 text-slate-700" />
                          <p className="text-slate-500 font-serif tracking-widest">请点击上方卡片翻开所有真相...</p>
                      </div>
                  ) : (
                      <div className="space-y-12">
                          {isLoadingAI && (
                               <div className="text-center py-24 space-y-8">
                                    <div className="relative w-24 h-24 mx-auto">
                                        <div className="absolute inset-0 border-2 border-purple-500/10 rounded-full"></div>
                                        <div className="absolute inset-0 border-2 border-t-purple-500 rounded-full animate-spin"></div>
                                        <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-400 w-10 h-10 animate-pulse" />
                                    </div>
                                    <p className="text-purple-300 font-serif text-2xl tracking-widest animate-pulse">正在接收共时性讯息...</p>
                               </div>
                          )}

                          {aiInterpretation && (
                              <div className="prose prose-invert prose-purple max-w-none animate-flip-in">
                                  <div className="bg-black/30 p-10 md:p-16 rounded-[3rem] border border-white/5 leading-relaxed font-sans text-slate-200 whitespace-pre-wrap shadow-inner text-lg">
                                      {aiInterpretation}
                                  </div>
                              </div>
                          )}
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* Card Detail Modal */}
      {detailedCard && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-flip-in" onClick={() => setDetailedCard(null)}>
            <div 
                onClick={(e) => e.stopPropagation()} 
                className="relative bg-mystic-900 w-full max-w-4xl max-h-[90vh] rounded-[3rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col md:flex-row"
            >
                <button 
                    onClick={() => setDetailedCard(null)}
                    className="absolute top-6 right-6 p-3 bg-black/60 rounded-full text-white hover:bg-red-900/80 z-20 transition-all shadow-xl active:scale-90"
                >
                    <X size={24} />
                </button>

                <div className="md:w-5/12 bg-black flex-shrink-0 h-[40vh] md:h-auto border-b md:border-b-0 md:border-r border-white/5">
                    <div className="w-full h-full flex items-center justify-center p-10">
                        <img 
                            src={getCardImageUrl(detailedCard.id)} 
                            className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(251,191,36,0.3)]"
                            alt={detailedCard.nameEn} 
                            onError={(e) => { (e.target as any).src = 'https://placehold.co/400x700?text=Card+Image'; }}
                        />
                    </div>
                </div>

                <div className="md:w-7/12 p-10 md:p-16 overflow-y-auto flex-1 bg-mystic-900 custom-scrollbar">
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-10 h-px bg-mystic-gold"></span>
                            <span className="text-[10px] text-mystic-gold uppercase tracking-[0.4em] font-bold">The Arcana</span>
                        </div>
                        <h2 className="text-4xl font-serif text-white mb-2">{detailedCard.nameCn}</h2>
                        <p className="text-slate-500 italic font-serif text-sm tracking-widest">{detailedCard.nameEn}</p>
                    </div>

                    <div className="space-y-10">
                        <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/5">
                            <h3 className="text-xs font-bold text-violet-400 mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
                                <CheckCircle size={14} /> 正位启示
                            </h3>
                            <p className="text-slate-200 leading-relaxed text-md font-light">{detailedCard.meaningUp}</p>
                        </div>
                        
                        <div className="p-6 bg-white/[0.03] rounded-3xl border border-white/5">
                            <h3 className="text-xs font-bold text-red-400 mb-4 uppercase tracking-[0.2em] flex items-center gap-2">
                                <X size={14} /> 逆位警告
                            </h3>
                            <p className="text-slate-300 leading-relaxed text-md font-light">{detailedCard.meaningDown}</p>
                        </div>

                        <div>
                            <h3 className="text-[10px] font-bold text-blue-400 mb-4 uppercase tracking-[0.3em] flex items-center gap-2">象征深意</h3>
                            <p className="text-slate-500 text-sm leading-relaxed italic font-light">{detailedCard.description}</p>
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