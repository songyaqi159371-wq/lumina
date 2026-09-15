
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { spreads, tarotDeck, getCardImageUrl } from '../constants';
import { Spread, TarotCard, AIModel } from '../types';
import CardFlip from '../components/CardFlip';
import './Divination.print.css';
import { getAIProvider } from '../services/aiProviderFactory';
import { ChatMessage } from '../services/aiProvider';
import { saveActiveSession, getActiveSession, clearActiveSession, getSettings, saveSettings } from '../services/storage';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
    Sparkles, BrainCircuit, RefreshCw, Layers, ChevronRight,
    HelpCircle, Eye, X, BookOpen,
    Info, ShieldAlert,
    Compass, Zap, Globe, MessageSquarePlus, Send,
    ChevronDown, Ban,
    ShieldCheck, MapPin, UserCheck,
    Feather, Cpu, SlidersHorizontal, Download, Image as ImageIcon
} from 'lucide-react';


// Fisher-Yates Shuffle Algorithm
const shuffleArray = (array: number[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const Divination: React.FC = () => {
  const [step, setStep] = useState<'select' | 'input' | 'drawing' | 'result'>('select');
  const [sessionId, setSessionId] = useState<string>(() => `divine-${Date.now()}`);
  const [selectedSpread, setSelectedSpread] = useState<Spread | null>(null);
  const [question, setQuestion] = useState('');
  const [isProtocolsOpen, setIsProtocolsOpen] = useState(false);
  
  // 新增：记录洗牌后的卡片索引顺序
  const [shuffledDeck, setShuffledDeck] = useState<number[]>([]);
  
  // Selection Logic
  const [pickedIndices, setPickedIndices] = useState<{cardId: number, isReversed: boolean, deckIndex?: number}[]>([]);
  const [drawnCards, setDrawnCards] = useState<{cardId: number, isReversed: boolean, positionId: number}[]>([]);
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
  
  // AI/UI State
  const [aiInterpretation, setAiInterpretation] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [detailedCard, setDetailedCard] = useState<TarotCard | null>(null);
  const [readingStyle, setReadingStyle] = useState(getSettings().readingStyle);
  const [aiModel, setAiModel] = useState(getSettings().aiModel);
  const [showStyleSelector, setShowStyleSelector] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleModelChange = (model: AIModel) => {
    setAiModel(model);
    saveSettings({ ...getSettings(), aiModel: model });
  };
  
  // Chat/Follow-up State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [followUpText, setFollowUpText] = useState('');
  const [isSendingFollowUp, setIsSendingFollowUp] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // 1. 初始化恢复会话
  useEffect(() => {
    const saved = getActiveSession();
    if (saved) {
      setStep(saved.step || 'select');
      setSessionId(saved.sessionId || `divine-${Date.now()}`);
      if (saved.selectedSpreadId) {
        const spread = spreads.find(s => s.id === saved.selectedSpreadId);
        setSelectedSpread(spread || null);
      }
      setQuestion(saved.question || '');
      setPickedIndices(saved.pickedIndices || []);
      setDrawnCards(saved.drawnCards || []);
      setRevealedIndices(saved.revealedIndices || []);
      setAiInterpretation(saved.aiInterpretation || '');
      setChatHistory(saved.chatHistory || []);
      setShuffledDeck(saved.shuffledDeck || []);
    }
    setIsHydrated(true); 
  }, []);

  // 2. 状态监听自动保存
  useEffect(() => {
    if (!isHydrated) return;

    if (step === 'select') {
      clearActiveSession();
    } else {
      saveActiveSession({
        step,
        sessionId,
        selectedSpreadId: selectedSpread?.id,
        question,
        pickedIndices,
        drawnCards,
        revealedIndices,
        aiInterpretation,
        chatHistory,
        shuffledDeck // 同时也保存随机后的牌序，防止刷新页面导致牌序重排
      });
    }
  }, [isHydrated, step, sessionId, selectedSpread, question, pickedIndices, drawnCards, revealedIndices, aiInterpretation, chatHistory, shuffledDeck]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (chatHistory.length > 1) {
        scrollToBottom();
    }
  }, [chatHistory, isSendingFollowUp]);

  const handleSpreadSelect = (spread: Spread) => {
    setSelectedSpread(spread);
    setStep('input');
    // 通知引导：已选择牌阵
    if ((window as any).notifyGuideAction) {
      setTimeout(() => (window as any).notifyGuideAction('spreadSelect'), 300);
    }
  };

  const startDrawing = () => {
    if (!question.trim()) return;

    // 在进入抽牌环节前进行彻底洗牌
    const initialDeck = Array.from({ length: 78 }, (_, i) => i);
    setShuffledDeck(shuffleArray(initialDeck));

    setPickedIndices([]);
    setStep('drawing');

    // 通知引导：已输入问题并开始抽牌
    if ((window as any).notifyGuideAction) {
      setTimeout(() => (window as any).notifyGuideAction('questionInput'), 500);
    }
  };

  const handlePickCard = (deckIndex: number, actualCardId: number) => {
    if (!selectedSpread || pickedIndices.length >= selectedSpread.positions.length) return;
    
    const isAlreadyPicked = pickedIndices.some((p: any) => p.deckIndex === deckIndex);
    if (isAlreadyPicked) return;

    const isReversed = Math.random() > 0.5;

    const newPick = { cardId: actualCardId, isReversed, deckIndex };
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

            // 通知引导：抽牌完成
            if ((window as any).notifyGuideAction) {
              setTimeout(() => (window as any).notifyGuideAction('drawComplete'), 1000);
            }
        }, 800);
    }
  };

  const handleCardClick = (index: number) => {
    if (!revealedIndices.includes(index)) {
        const newRevealed = [...revealedIndices, index];
        setRevealedIndices(newRevealed);

        // 检查是否所有卡牌都已翻开
        if (newRevealed.length === drawnCards.length) {
          // 通知引导：所有卡牌已翻开
          if ((window as any).notifyGuideAction) {
            setTimeout(() => (window as any).notifyGuideAction('cardsRevealed'), 500);
          }
        }
    } else {
        const drawn = drawnCards[index];
        const card = tarotDeck.find(c => c.id === drawn.cardId);
        if (card) setDetailedCard(card);
    }
  };

  const handleAIRequest = async () => {
    if (!selectedSpread) return;
    setIsLoadingAI(true);
    setAiInterpretation('');
    setChatHistory([]);

    const cardsForAI = drawnCards.map(d => ({
        card: tarotDeck.find(c => c.id === d.cardId)!,
        isReversed: d.isReversed,
        positionName: selectedSpread.positions.find(p => p.id === d.positionId)?.name || '未知'
    }));

    const userMsg: ChatMessage = { role: 'user', parts: [{ text: `请解读牌阵。问题是：${question}` }] };

    try {
        const provider = getAIProvider(aiModel);
        let acc = '';
        let started = false;
        const onDelta = (chunk: string) => {
            acc += chunk;
            // 首块到达即关闭 loading 动画，开始打字机式渲染
            if (!started) {
                started = true;
                setIsLoadingAI(false);
                setChatHistory([userMsg, { role: 'model', parts: [{ text: acc }] }]);
            } else {
                setChatHistory([userMsg, { role: 'model', parts: [{ text: acc }] }]);
            }
            setAiInterpretation(acc);
        };
        const result = await provider.interpretReadingStream(question, selectedSpread, cardsForAI, readingStyle, onDelta);
        // 收尾：以最终全文为准（兼容回退到非流式、或部分块丢失的情况）
        setAiInterpretation(result);
        setChatHistory([userMsg, { role: 'model', parts: [{ text: result }] }]);

        // 通知引导：AI 解读已生成
        if ((window as any).notifyGuideAction) {
          setTimeout(() => (window as any).notifyGuideAction('aiGenerated'), 500);
        }
    } catch (e) {
        console.error(e);
        setAiInterpretation("解读过程中遇到了一些波折，请检查网络连接或稍后再试。");
    } finally {
        setIsLoadingAI(false);
    }
  };

  const handleSendFollowUp = async () => {
    if (!followUpText.trim() || isSendingFollowUp) return;
    
    const userMsg = followUpText.trim();
    setFollowUpText('');
    setIsSendingFollowUp(true);
    
    const updatedHistory: ChatMessage[] = [
        ...chatHistory,
        { role: 'user', parts: [{ text: userMsg }] }
    ];
    setChatHistory(updatedHistory);

    try {
        const provider = getAIProvider(aiModel);
        let acc = '';
        let started = false;
        const onDelta = (chunk: string) => {
            acc += chunk;
            // 首块到达即停止"感应中"动画，开始打字机式渲染助手回复
            if (!started) {
                started = true;
                setIsSendingFollowUp(false);
            }
            setChatHistory([...updatedHistory, { role: 'model', parts: [{ text: acc }] }]);
        };
        const responseText = await provider.continueReadingStream(updatedHistory, readingStyle, onDelta);
        const finalHistory: ChatMessage[] = [
            ...updatedHistory,
            { role: 'model', parts: [{ text: responseText }] }
        ];
        setChatHistory(finalHistory);
    } catch (error) {
        console.error(error);
    } finally {
        setIsSendingFollowUp(false);
    }
  };

  const reset = useCallback(() => {
    clearActiveSession();
    setStep('select');
    setSessionId(`divine-${Date.now()}`);
    setSelectedSpread(null);
    setQuestion('');
    setPickedIndices([]);
    setDrawnCards([]);
    setRevealedIndices([]);
    setAiInterpretation('');
    setChatHistory([]);
    setFollowUpText('');
    setDetailedCard(null);
    setIsLoadingAI(false);
    setShuffledDeck([]);
  }, []);

  const handleExportReport = async (format: 'pdf' | 'image') => {
    setIsExporting(true);
    setShowExportMenu(false);

    try {
      const reportElement = document.querySelector('.print-report') as HTMLElement;
      if (!reportElement) {
        alert('找不到报告内容');
        setIsExporting(false);
        return;
      }

      const date = new Date().toLocaleDateString('zh-CN').replace(/\//g, '-');
      const filename = `Lumina-${selectedSpread?.name || '塔罗占卜'}-${date}`;

      // 临时显示报告以便截图
      reportElement.style.opacity = '1';
      reportElement.style.zIndex = '9999';
      await new Promise(resolve => setTimeout(resolve, 500)); // 增加等待时间确保渲染

      if (format === 'pdf') {
        // 使用 jsPDF + html2canvas 手动分页
        const canvas = await html2canvas(reportElement, {
          scale: 1.5, // 降低scale减小文件大小
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowHeight: reportElement.scrollHeight,
          height: reportElement.scrollHeight
        });

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 14;
        const contentWidth = pageWidth - 2 * margin;
        const contentHeight = pageHeight - 2 * margin;

        const imgData = canvas.toDataURL('image/jpeg', 0.90); // JPEG 90%质量
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * contentWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        // 第一页
        pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight);
        heightLeft -= contentHeight;

        // 添加更多页
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', margin, position + margin, imgWidth, imgHeight);
          heightLeft -= contentHeight;
        }

        pdf.save(`${filename}.pdf`);

        if ((window as any).notifyGuideAction) {
          setTimeout(() => (window as any).notifyGuideAction('exported'), 1000);
        }

      } else if (format === 'image') {
        // 导出为图片
        const canvas = await html2canvas(reportElement, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowHeight: reportElement.scrollHeight,
          height: reportElement.scrollHeight
        });

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${filename}.png`;
            link.click();
            URL.revokeObjectURL(url);

            if ((window as any).notifyGuideAction) {
              setTimeout(() => (window as any).notifyGuideAction('exported'), 1000);
            }
          }
        }, 'image/png', 0.95);
      }

      // 恢复隐藏
      reportElement.style.opacity = '0';
      reportElement.style.zIndex = '-1';

    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败：' + (error as Error).message + '\n请重试或使用"下载为图片"选项');

      // 确保恢复隐藏
      const reportElement = document.querySelector('.print-report') as HTMLElement;
      if (reportElement) {
        reportElement.style.opacity = '0';
        reportElement.style.zIndex = '-1';
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto min-h-[80vh] pb-20 px-4 relative">
      
      {/* Step 1: Select Spread */}
      {step === 'select' && (
        <div className="animate-flip-in">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-serif text-white mb-4 tracking-widest uppercase">选择神圣牌阵</h1>
            <p className="text-slate-500 font-light max-w-lg mx-auto leading-relaxed italic">开启与潜意识的对话</p>
          </div>

          <div className="max-w-3xl mx-auto mb-16 protocols-section">
            <div className={`transition-all duration-300 border border-white/10 rounded-2xl overflow-hidden bg-white/5`}>
                <button
                    onClick={() => setIsProtocolsOpen(!isProtocolsOpen)}
                    className="w-full flex items-center justify-between px-8 py-5 transition-all group hover:bg-white/5"
                >
                    <div className="flex items-center gap-4">
                        <div className={`transition-colors duration-500 ${isProtocolsOpen ? 'text-mystic-gold' : 'text-slate-500 group-hover:text-mystic-gold'}`}>
                            <ShieldAlert size={18} className={!isProtocolsOpen ? "animate-pulse" : ""} />
                        </div>
                        <span className={`font-serif text-[11px] tracking-[0.5em] uppercase transition-all ${isProtocolsOpen ? 'text-white font-bold' : 'text-slate-400 group-hover:text-white'}`}>
                            🔮 塔罗占卜禁忌 / 须知
                        </span>
                    </div>
                    <ChevronDown 
                        size={16} 
                        className={`text-slate-600 transition-transform duration-500 ${isProtocolsOpen ? 'rotate-180 text-mystic-gold' : ''}`} 
                    />
                </button>

                <div 
                    className={`transition-all duration-500 ease-in-out ${isProtocolsOpen ? 'max-h-[1500px] opacity-100 border-t border-white/5' : 'max-h-0 opacity-0 pointer-events-none'}`}
                >
                    <div className="p-8 md:p-12 space-y-12 bg-mystic-950/40 overflow-y-auto max-h-[65vh] custom-scrollbar">
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-mystic-gold border-l-4 border-mystic-gold/60 pl-5">
                                <ShieldCheck size={20} />
                                <h3 className="text-[15px] font-serif font-bold uppercase tracking-[0.2em]">一、占卜过程中的禁忌</h3>
                            </div>
                            <div className="space-y-6 pl-10">
                                <ProtocolItem num="1" title="不可重复占卜相同问题" content="24小时内不可重复占卜完全相同的问题；同一问题建议间隔1-3个月再次占卜。" />
                                <ProtocolItem num="2" title="一次只问一个问题" content="不可在一次洗牌中询问多个问题。如有第二个问题，必须重新洗牌。" />
                                <ProtocolItem num="3" title="占卜的时间限制" content="塔罗牌最多只能占卜未来12个月的事。短期预测最为准确。" />
                            </div>
                        </section>

                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-red-400 border-l-4 border-red-500/60 pl-5">
                                <Ban size={20} />
                                <h3 className="text-[15px] font-serif font-bold uppercase tracking-[0.2em]">二、不能问的问题类型</h3>
                            </div>
                            <div className="space-y-6 pl-10">
                                <ProtocolItem num="1" title="健康与生死" content="严禁询问具体的疾病诊断及寿命终点。" />
                                <ProtocolItem num="2" title="偏财与博彩" content="不可询问彩票中奖、赌博或高度投机性的偏财运势。" />
                                <ProtocolItem num="3" title="法律与道德" content="严禁询问任何违反法律、危害他人或违背道德伦理的问题。" />
                            </div>
                        </section>

                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-indigo-400 border-l-4 border-indigo-500/60 pl-5">
                                <MapPin size={20} />
                                <h3 className="text-[15px] font-serif font-bold uppercase tracking-[0.2em]">三、占卜环境要求</h3>
                            </div>
                            <div className="space-y-6 pl-10">
                                <ProtocolItem num="1" title="安静舒适的空间" content="避免吵杂环境，选择一个能让你感到安全且不被打扰的私人空间。" />
                                <ProtocolItem num="2" title="良好的精神状态" content="不要在情绪极端不稳定、精神疲惫或醉酒的状态下开启占卜。" />
                            </div>
                        </section>

                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-emerald-400 border-l-4 border-emerald-500/60 pl-5">
                                <UserCheck size={20} />
                                <h3 className="text-[15px] font-serif font-bold uppercase tracking-[0.2em]">四、使用注意事项</h3>
                            </div>
                            <div className="space-y-6 pl-10">
                                <ProtocolItem num="1" title="不要过度依赖" content="塔罗牌是引路工具，不是唯一决策依据。请始终保留你的自主行动力和理性判断力。" />
                                <ProtocolItem num="2" title="保持尊重与诚实" content="不要占卜纯粹出于戏谑、挑战或无聊的问题。" />
                            </div>
                        </section>
                    </div>
                    
                    <div className="p-5 text-center border-t border-white/5 bg-black/40">
                        <button 
                            onClick={() => setIsProtocolsOpen(false)}
                            className="text-[10px] text-slate-600 hover:text-white uppercase tracking-[0.4em] transition-colors flex items-center gap-2 mx-auto"
                        >
                            收起占卜守则 <ChevronDown size={14} className="rotate-180" />
                        </button>
                    </div>
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 spread-cards">
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
            <div className="glass-card p-10 rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Compass size={120} className="animate-spin-slow text-mystic-gold"/>
                </div>
                
                <div className="mb-10 text-center relative z-10">
                    <span className="text-[10px] text-mystic-gold uppercase tracking-[0.5em] mb-4 block opacity-60 font-serif">Communion of Intent</span>
                    <h2 className="text-4xl font-serif text-white mb-3">{selectedSpread.name}</h2>
                    <p className="text-slate-500 text-sm italic font-light">“提问的方式，决定了宇宙回响的深度。”</p>
                </div>

                <div className="mb-10 relative z-10">
                    <textarea
                        autoFocus
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="描述你的困惑或想要探索的领域..."
                        className="w-full bg-black/40 border border-white/10 p-8 rounded-[2.5rem] text-white focus:outline-none focus:border-mystic-gold/40 min-h-[220px] transition-all shadow-inner text-xl font-light leading-relaxed placeholder-slate-700"
                    />
                </div>
                
                <div className="flex gap-6 relative z-10">
                    <button onClick={() => setStep('select')} className="flex-1 py-5 rounded-2xl border border-white/10 text-slate-500 hover:text-white transition uppercase text-[10px] font-bold tracking-widest">返回</button>
                    <button 
                        onClick={startDrawing}
                        disabled={!question.trim()}
                        className="flex-[2] py-5 bg-gradient-to-tr from-mystic-gold to-yellow-600 text-mystic-950 rounded-2xl font-bold disabled:opacity-20 hover:shadow-xl hover:shadow-mystic-gold/20 active:scale-95 transition flex items-center justify-center gap-3 uppercase text-[10px] tracking-[0.3em]"
                    >
                        开启抽取序列 <ChevronRight size={16}/>
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Step 3: Drawing Cards */}
      {step === 'drawing' && selectedSpread && (
        <div className="animate-flip-in flex flex-col items-center w-full max-w-screen-xl mx-auto">
            <header className="w-full mb-12 text-center">
                <h2 className="text-4xl lg:text-5xl font-serif text-white mb-4 tracking-wider uppercase">亲手开启命运</h2>
                <p className="text-slate-400 text-lg font-light italic">
                    深呼吸，从下方的灵能矩阵中凭直觉选出 <span className="text-mystic-gold font-bold">{selectedSpread.positions.length}</span> 张卡牌。
                </p>
            </header>

            <div className="w-full max-w-2xl mb-16 space-y-6">
                <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3 text-mystic-gold font-serif uppercase tracking-[0.4em]">
                        <Sparkles size={20} className="animate-pulse" />
                        <span className="text-lg">灵能收集</span>
                    </div>
                    <span className="text-2xl font-serif text-white tracking-widest">{pickedIndices.length} / {selectedSpread.positions.length}</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div 
                        className="h-full bg-gradient-to-r from-mystic-gold/40 via-mystic-gold to-mystic-gold/40 transition-all duration-700 ease-out shadow-[0_0_20px_#fbbf24]" 
                        style={{ width: `${(pickedIndices.length / selectedSpread.positions.length) * 100}%` }}
                    ></div>
                </div>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-13 gap-2 sm:gap-3 md:gap-4 p-4 sm:p-8 md:p-12 glass-card rounded-3xl sm:rounded-[3.5rem] border-white/5 w-full mb-10 sm:mb-20 shadow-[0_0_120px_rgba(0,0,0,0.6)] relative overflow-hidden">
                {shuffledDeck.map((actualCardId, i) => {
                    const isPicked = pickedIndices.some((p: any) => p.deckIndex === i);
                    return (
                        <div 
                            key={i}
                            onClick={() => handlePickCard(i, actualCardId)}
                            className={`
                                relative aspect-[2/3] w-full rounded-lg border border-white/5 transition-all duration-700 cursor-pointer
                                ${isPicked 
                                    ? 'opacity-0 scale-50 pointer-events-none -translate-y-24 blur-sm' 
                                    : 'bg-mystic-950 hover:border-mystic-gold/40 hover:shadow-[0_0_30px_rgba(251,191,36,0.2)] hover:-translate-y-2 hover:scale-110 active:scale-90'
                                }
                            `}
                        >
                            <div className="absolute inset-1 rounded-md border border-white/[0.02] flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/sacred-geometry.png')] bg-opacity-10 opacity-40">
                                <div className="w-1 h-1 rounded-full bg-mystic-gold/20"></div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="flex items-center gap-4 text-slate-500 text-[10px] font-serif uppercase tracking-[0.5em] opacity-30 mb-10">
                <Globe size={14} />
                <span>The Universe is Listening</span>
            </div>
        </div>
      )}

      {/* Step 4: Result Display */}
      {step === 'result' && (
          <div className="animate-flip-in">
              <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-6 md:gap-8 glass-card p-6 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border-white/5">
                  <div className="space-y-3 md:space-y-4">
                    <span className="text-[10px] text-mystic-gold uppercase tracking-[0.6em] block opacity-60 font-serif">Revelation of Arcana</span>
                    <h1 className="text-3xl md:text-5xl font-serif text-white tracking-tighter uppercase">{selectedSpread?.name}</h1>
                    <div className="flex items-center gap-3 md:gap-4 px-4 md:px-6 py-2.5 md:py-3 bg-black/40 rounded-2xl border border-white/5 w-fit shadow-inner">
                        <HelpCircle size={16} className="text-mystic-gold shrink-0" />
                        <span className="text-sm md:text-lg italic text-slate-300 font-light tracking-wide">“{question}”</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                      <button
                          onClick={() => setShowExportMenu(!showExportMenu)}
                          disabled={!aiInterpretation || isLoadingAI || isExporting}
                          className="w-full flex items-center justify-center gap-2 md:gap-3 px-6 md:px-10 py-4 md:py-5 bg-gradient-to-tr from-mystic-gold to-yellow-600 hover:from-mystic-gold/90 hover:to-yellow-600/90 text-mystic-950 rounded-2xl text-[11px] font-bold uppercase tracking-[0.25em] transition-all group active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-mystic-gold/20"
                          title={aiInterpretation ? '导出完整占卜报告' : 'AI 解读完成后可导出'}
                      >
                          {isExporting ? (
                            <>正在导出...</>
                          ) : (
                            <>
                              <Download size={16} className="group-hover:translate-y-0.5 transition-transform" /> 导出报告
                            </>
                          )}
                      </button>

                      {/* 导出选项下拉菜单 */}
                      {showExportMenu && aiInterpretation && (
                        <>
                          <div
                            className="fixed inset-0 z-[90]"
                            onClick={() => setShowExportMenu(false)}
                          />
                          <div className="absolute right-0 top-full mt-2 w-56 bg-mystic-900 border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-[100]">
                            <button
                              onClick={() => handleExportReport('pdf')}
                              className="w-full px-5 py-4 text-left text-sm text-slate-300 hover:bg-white/10 hover:text-white transition flex items-center gap-3"
                            >
                              <Download size={18} className="text-indigo-400" />
                              <div>
                                <div className="font-bold">下载为PDF</div>
                                <div className="text-xs text-slate-500 mt-0.5">自动分页，完整保存</div>
                              </div>
                            </button>
                            <button
                              onClick={() => handleExportReport('image')}
                              className="w-full px-5 py-4 text-left text-sm text-slate-300 hover:bg-white/10 hover:text-white transition flex items-center gap-3 border-t border-white/5"
                            >
                              <ImageIcon size={18} className="text-mystic-gold" />
                              <div>
                                <div className="font-bold">下载为图片</div>
                                <div className="text-xs text-slate-500 mt-0.5">PNG格式，长图保存</div>
                              </div>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                    <button onClick={reset} className="flex-1 md:flex-none flex items-center justify-center gap-2 md:gap-3 px-5 md:px-8 py-3.5 md:py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-white transition group active:scale-95">
                        <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700"/> 开启新占卜
                    </button>
                  </div>
              </header>

              <div className="mb-20 md:mb-32">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:flex-wrap lg:justify-center gap-4 sm:gap-6 md:gap-10 lg:gap-20">
                      {drawnCards.map((draw, index) => {
                          const card = tarotDeck.find(c => c.id === draw.cardId);
                          const position = selectedSpread?.positions.find(p => p.id === draw.positionId);
                          const isRevealed = revealedIndices.includes(index);

                          return (
                              <div key={index} className="flex flex-col items-center space-y-4 md:space-y-8 animate-flip-in" style={{ animationDelay: `${index * 150}ms` }}>
                                  <div className="px-4 md:px-6 py-1.5 md:py-2 bg-mystic-950 border border-mystic-gold/10 rounded-full text-[9px] md:text-[10px] text-mystic-gold uppercase tracking-[0.2em] md:tracking-[0.3em] font-serif shadow-2xl text-center">
                                      {position?.name}
                                  </div>
                                  <div className="relative group transition-transform duration-700 hover:-translate-y-4">
                                    <div className={`absolute -inset-10 rounded-full blur-[60px] transition-all duration-1000 ${isRevealed ? 'bg-mystic-gold/10' : 'bg-transparent'}`}></div>
                                    <CardFlip
                                        card={card || null}
                                        isRevealed={isRevealed}
                                        isReversed={draw.isReversed}
                                        onClick={() => handleCardClick(index)}
                                        width="w-28 sm:w-36 md:w-56"
                                        height="h-44 sm:h-56 md:h-88"
                                    />
                                    {isRevealed && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setDetailedCard(card || null); }}
                                            className="absolute top-3 right-3 md:top-4 md:right-4 p-2.5 md:p-3 bg-black/80 rounded-full text-mystic-gold opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all border border-white/10 shadow-2xl md:scale-75 md:group-hover:scale-100"
                                        >
                                            <BookOpen size={16} />
                                        </button>
                                    )}
                                  </div>
                                  <div className={`text-center transition-all duration-1000 ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                                      <p className="text-white font-serif font-bold text-lg md:text-2xl tracking-widest mb-1 md:mb-2">{card?.nameCn}</p>
                                      {draw.isReversed ? (
                                          <span className="text-red-500/80 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] flex items-center justify-center gap-2">
                                              <Zap size={10} /> Reversed 逆位
                                          </span>
                                      ) : (
                                          <span className="text-emerald-500/80 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] flex items-center justify-center gap-2">
                                              <Sparkles size={10} /> Upright 正位
                                          </span>
                                      )}
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              </div>

              {/* AI Analysis Section with Chat Thread */}
              <div className="glass-card rounded-[2rem] md:rounded-[4rem] border-white/5 p-5 md:p-20 relative overflow-hidden shadow-2xl mb-20 bg-mystic-950/20 backdrop-blur-md">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-mystic-gold/40 to-transparent"></div>

                  <div className="flex flex-col md:flex-row items-center justify-between mb-10 md:mb-16 gap-6 md:gap-8">
                      <div className="flex items-center gap-4 md:gap-8">
                          <div className="p-4 md:p-6 bg-purple-900/10 rounded-[1.5rem] md:rounded-[2.5rem] border border-purple-500/10 shadow-[0_0_50px_rgba(168,85,247,0.05)]">
                            <BrainCircuit className="text-purple-400 w-8 h-8 md:w-12 md:h-12"/>
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-2xl md:text-4xl font-serif text-white tracking-tight uppercase">灵能深度报告</h3>
                            <p className="text-slate-500 text-xs md:text-sm font-light tracking-widest uppercase italic">Harmonic Resonance Analysis</p>
                          </div>
                      </div>
                      
                      <div className="flex flex-wrap items-start gap-4 justify-end">
                        {/* 常驻模型选择器 */}
                        <div className="flex items-center gap-2 bg-black/40 rounded-2xl border border-white/5 px-3 py-2">
                          <Cpu size={14} className="text-mystic-gold/60 shrink-0" />
                          <select
                            value={aiModel}
                            onChange={(e) => handleModelChange(e.target.value as AIModel)}
                            className="bg-transparent text-[11px] text-slate-300 font-bold uppercase tracking-widest focus:outline-none cursor-pointer [&>option]:bg-slate-900"
                          >
                            {/* 暂时隐藏 Gemini，后续需要时取消注释即可恢复 */}
                            {/* <option value={AIModel.Gemini}>Gemini</option> */}
                            <option value={AIModel.DeepSeek}>DeepSeek</option>
                            <option value={AIModel.Qwen}>通义千问</option>
                            {/* 暂时隐藏 豆包，后续需要时取消注释即可恢复 */}
                            {/* <option value={AIModel.Doubao}>豆包</option> */}
                            <option value={AIModel.Claude}>Claude</option>
                            <option value={AIModel.OpenAI}>OpenAI</option>
                          </select>
                        </div>

                        {/* 风格选择器：折叠在"解读风格"入口后 */}
                        {aiInterpretation && (
                          <div className="relative">
                            <button
                              onClick={() => setShowStyleSelector(v => !v)}
                              className="flex items-center gap-2 px-4 py-2.5 bg-black/40 rounded-2xl border border-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white transition"
                            >
                              <SlidersHorizontal size={14} />
                              <span className="hidden md:inline">解读风格</span>
                              <ChevronDown size={14} className={`transition-transform ${showStyleSelector ? 'rotate-180' : ''}`} />
                            </button>
                            {showStyleSelector && (
                              <div className="absolute top-full right-0 mt-3 flex flex-wrap gap-1 bg-slate-950 rounded-2xl border border-white/10 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[90] w-56">
                                {[
                                  { id: 'Natural', icon: Globe, label: '自然' },
                                  { id: 'Mystic', icon: Sparkles, label: '神秘' },
                                  { id: 'Psychological', icon: BrainCircuit, label: '心理' },
                                  { id: 'Direct', icon: Zap, label: '直白' },
                                  { id: 'Poetic', icon: Feather, label: '诗意' },
                                  { id: 'Cyberpunk', icon: Cpu, label: '赛博' }
                                ].map(s => (
                                  <button
                                    key={s.id}
                                    onClick={() => setReadingStyle(s.id as any)}
                                    className={`px-3 py-2 rounded-xl flex items-center gap-2 transition-all ${readingStyle === s.id ? 'bg-mystic-gold text-mystic-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}
                                    title={s.label}
                                  >
                                    <s.icon size={14} />
                                    <span className="text-[10px] font-bold uppercase">{s.label}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {!aiInterpretation && !isLoadingAI && (
                            <button
                                onClick={handleAIRequest}
                                disabled={isLoadingAI || revealedIndices.length < drawnCards.length}
                                className="group px-12 py-6 bg-gradient-to-tr from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-20 text-white rounded-[2.5rem] transition-all shadow-2xl shadow-purple-950/50 font-bold flex items-center gap-4 active:scale-95 justify-center"
                            >
                                生成 AI 深度解读
                                <Sparkles size={20} className="animate-pulse" />
                            </button>
                        )}
                        {aiInterpretation && !isLoadingAI && (
                          <div className="relative group">
                            <button 
                                onClick={handleAIRequest}
                                className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-white transition group active:scale-95"
                            >
                                <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-700"/> 重新生成
                            </button>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-6 w-80 p-6 bg-slate-950 border border-mystic-gold/40 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,1)] opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 -translate-y-4 group-hover:translate-y-0 z-[100] ring-1 ring-white/10">
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 -mb-1 border-8 border-transparent border-b-slate-950"></div>
                                <div className="flex items-center gap-3 mb-3 border-b border-white/10 pb-2">
                                    <Info size={16} className="text-mystic-gold shrink-0" />
                                    <span className="text-[10px] text-mystic-gold font-bold uppercase tracking-widest">使用建议</span>
                                </div>
                                <div className="text-sm text-amber-100 leading-relaxed text-left font-light">
                                    此功能主要用于应对网络异常造成的生成中断。塔罗占卜贵在“初念”，如无特殊情况，建议以<span className="text-mystic-gold font-bold">首次感应</span>的结果为准。
                                </div>
                            </div>
                          </div>
                        )}
                      </div>
                  </div>

                  <div className="space-y-12">
                      {isLoadingAI && (
                           <div className="text-center py-24 space-y-10">
                                <div className="relative w-28 h-28 mx-auto">
                                    <div className="absolute inset-0 border border-purple-500/10 rounded-full animate-ping"></div>
                                    <div className="absolute inset-0 border border-t-purple-500 rounded-full animate-spin"></div>
                                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-400 w-12 h-12 animate-pulse" />
                                </div>
                                <div className="space-y-4">
                                    <p className="text-purple-300 font-serif text-3xl tracking-[0.3em] animate-pulse uppercase">调阅阿卡纳档案...</p>
                                    <p className="text-slate-600 text-[10px] uppercase tracking-[0.5em]">Synchronizing with Cosmic Matrix</p>
                                </div>
                           </div>
                      )}

                      {chatHistory.length > 0 && (
                          <div className="space-y-6 md:space-y-10 animate-flip-in">
                              {chatHistory.filter(msg => msg.role === 'model' || msg.parts[0].text !== `请解读牌阵。问题是：${question}`).map((msg, msgIdx) => (
                                  <div key={msgIdx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                      <div className={`${msg.role === 'user' ? 'max-w-[90%]' : 'max-w-full w-full'} md:max-w-[80%] rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-12 border ${
                                          msg.role === 'user'
                                            ? 'bg-mystic-gold/5 border-mystic-gold/20 text-white rounded-br-none'
                                            : 'bg-black/30 border-white/5 text-slate-200 rounded-bl-none shadow-inner'
                                      }`}>
                                          {msg.role === 'user' && <div className="text-[10px] text-mystic-gold uppercase tracking-widest mb-3 md:mb-4 opacity-60">你追问道</div>}
                                          <div className="prose prose-invert prose-purple max-w-none text-[15px] md:text-lg font-light leading-relaxed md:leading-relaxed whitespace-pre-wrap break-words">
                                              {msg.parts[0].text}
                                          </div>
                                      </div>
                                  </div>
                              ))}
                              
                              {isSendingFollowUp && (
                                  <div className="flex justify-start animate-pulse">
                                      <div className="bg-black/20 border border-white/5 rounded-3xl p-6 flex items-center gap-3">
                                          <div className="flex gap-1">
                                              <div className="w-1.5 h-1.5 bg-mystic-gold rounded-full animate-bounce"></div>
                                              <div className="w-1.5 h-1.5 bg-mystic-gold rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                              <div className="w-1.5 h-1.5 bg-mystic-gold rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                          </div>
                                          <span className="text-[10px] text-slate-500 uppercase tracking-widest">感应中...</span>
                                      </div>
                                  </div>
                              )}

                              <div ref={chatEndRef} />

                              <div className="mt-20 pt-12 border-t border-white/5 relative">
                                  <div className="flex items-center gap-4 mb-6">
                                      <div className="p-2 bg-mystic-gold/10 rounded-lg">
                                          <MessageSquarePlus size={16} className="text-mystic-gold"/>
                                      </div>
                                      <h4 className="text-[10px] text-mystic-gold uppercase tracking-[0.4em] font-serif">深空对话 / 继续追问</h4>
                                  </div>
                                  
                                  <div className="relative group">
                                      <textarea 
                                          value={followUpText}
                                          onChange={(e) => setFollowUpText(e.target.value)}
                                          onKeyDown={(e) => {
                                              if (e.key === 'Enter' && !e.shiftKey) {
                                                  e.preventDefault();
                                                  handleSendFollowUp();
                                              }
                                          }}
                                          placeholder="关于这个解读，你还有什么想要深入了解的吗？"
                                          className="w-full bg-black/40 border border-white/10 p-8 pr-20 rounded-3xl text-white focus:outline-none focus:border-mystic-gold/40 min-h-[120px] transition-all shadow-inner text-lg font-light placeholder-slate-700 resize-none"
                                      />
                                      <button 
                                          onClick={handleSendFollowUp}
                                          disabled={!followUpText.trim() || isSendingFollowUp}
                                          className="absolute bottom-6 right-6 p-4 bg-mystic-gold text-mystic-950 rounded-2xl disabled:opacity-20 hover:scale-105 active:scale-95 transition-all shadow-lg"
                                      >
                                          <Send size={20} />
                                      </button>
                                  </div>
                                  <p className="mt-4 text-[9px] text-slate-600 uppercase tracking-widest text-center italic">你可以询问细节，如：“这张逆位的牌对我意味着什么？”或“未来的阻碍具体是什么？”</p>
                              </div>
                          </div>
                      )}
                  </div>
              </div>

              {createPortal(
              <section className="print-report" aria-label="Lumina 塔罗占卜报告">
                  <header className="print-report-header">
                      <div>
                          <p className="print-report-brand">LUMINA TAROT</p>
                          <h1>{selectedSpread?.name}</h1>
                      </div>
                      <p className="print-report-date">{new Date().toLocaleString('zh-CN')}</p>
                  </header>

                  <div className="print-report-question">
                      <span>占卜问题</span>
                      <p>{question}</p>
                  </div>

                  <section className="print-report-section">
                      <h2>抽卡结果</h2>
                      <div className="print-report-cards">
                          {drawnCards.map((draw, index) => {
                              const card = tarotDeck.find(c => c.id === draw.cardId);
                              const position = selectedSpread?.positions.find(p => p.id === draw.positionId);
                              if (!card) return null;

                              return (
                                  <article key={index} className="print-report-card">
                                      <p className="print-report-position">{position?.name}</p>
                                      <div className="print-report-card-image">
                                          <img
                                              src={getCardImageUrl(card.id)}
                                              alt={card.nameEn}
                                              className={draw.isReversed ? 'print-report-reversed' : ''}
                                              referrerPolicy="no-referrer"
                                          />
                                      </div>
                                      <h3>{card.nameCn}</h3>
                                      <p>{draw.isReversed ? '逆位' : '正位'}</p>
                                  </article>
                              );
                          })}
                      </div>
                  </section>

                  {(chatHistory.length > 0 || aiInterpretation) && (
                      <section className="print-report-section print-report-analysis">
                          <h2>AI 深度解读</h2>
                          {chatHistory.length > 0 ? (
                              chatHistory
                                  .filter(msg => msg.role === 'model' || msg.parts[0].text !== '请解读牌阵。问题是：' + question)
                                  .map((msg, index) => (
                                      <article key={index} className={'print-report-message ' + msg.role}>
                                          <h3>{msg.role === 'user' ? '后续提问' : index === 0 ? '综合解读' : '补充解读'}</h3>
                                          <p>{msg.parts[0].text}</p>
                                      </article>
                                  ))
                          ) : (
                              <article className="print-report-message model">
                                  <h3>综合解读</h3>
                                  <p>{aiInterpretation}</p>
                              </article>
                          )}
                      </section>
                  )}

              </section>,
              document.body
              )}
          </div>
      )}

      {/* Card Detail Modal */}
      {detailedCard && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-flip-in" onClick={() => setDetailedCard(null)}>
            <div 
                onClick={(e) => e.stopPropagation()} 
                className="relative bg-mystic-900 w-full max-w-4xl max-h-[90vh] rounded-[3.5rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col md:flex-row"
            >
                <button onClick={() => setDetailedCard(null)} className="absolute top-8 right-8 p-3 bg-black/60 rounded-full text-white hover:bg-red-900/80 z-20 transition-all shadow-xl scale-90 active:scale-75">
                    <X size={20} />
                </button>
                <div className="md:w-5/12 bg-black flex-shrink-0 h-[40vh] md:h-auto border-b md:border-b-0 md:border-r border-white/5">
                    <div className="w-full h-full flex items-center justify-center p-12">
                        <img
                            src={getCardImageUrl(detailedCard.id)}
                            className="w-full h-full object-contain drop-shadow-2xl"
                            alt={detailedCard.nameEn}
                            onError={(e) => {
                              console.error(`Failed to load detail image: ${getCardImageUrl(detailedCard.id)}`);
                            }}
                        />
                    </div>
                </div>
                <div className="md:w-7/12 p-12 md:p-16 overflow-y-auto flex-1 bg-mystic-900 custom-scrollbar">
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="w-12 h-px bg-mystic-gold"></span>
                            <span className="text-[10px] text-mystic-gold uppercase tracking-[0.5em] font-bold font-serif">The Archive</span>
                        </div>
                        <h2 className="text-5xl font-serif text-white mb-2 tracking-tight">{detailedCard.nameCn}</h2>
                        <p className="text-slate-500 italic font-serif text-sm tracking-[0.3em] uppercase">{detailedCard.nameEn}</p>
                    </div>
                    <div className="space-y-12">
                        <div className="p-8 bg-white/[0.02] rounded-[2.5rem] border border-white/5">
                            <h3 className="text-[10px] font-bold text-violet-400 mb-4 uppercase tracking-[0.3em] flex items-center gap-2"> 正位启示</h3>
                            <p className="text-slate-200 leading-relaxed text-lg font-light">{detailedCard.meaningUp}</p>
                        </div>
                        <div className="p-8 bg-white/[0.02] rounded-[2.5rem] border border-white/5">
                            <h3 className="text-[10px] font-bold text-red-400 mb-4 uppercase tracking-[0.3em] flex items-center gap-2"> 逆位警告</h3>
                            <p className="text-slate-300 leading-relaxed text-lg font-light">{detailedCard.meaningDown}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

const ProtocolItem: React.FC<{num: string, title: string, content: string}> = ({num, title, content}) => (
    <div className="flex gap-4 group">
        <span className="text-white/20 font-serif font-bold text-[14px] shrink-0 mt-0.5">{num}.</span>
        <div className="text-[13.5px]">
            <span className="text-slate-200 font-bold block mb-2 group-hover:text-white transition-colors tracking-wide leading-none">{title}</span>
            <p className="text-slate-400 font-light leading-relaxed">{content}</p>
        </div>
    </div>
);

export default Divination;
