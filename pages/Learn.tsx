import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Filter, X, ChevronLeft, ChevronRight, Check, Download, Upload, Save, Trash2, Info, Sparkles } from 'lucide-react';
import { tarotDeck, getCardImageUrl, tarotSymbols } from '../constants';
import { Suit, TarotCard } from '../types';
import { getProgress, saveProgress, exportData, importData } from '../services/storage';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

const Learn: React.FC = () => {
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageLoadQueueRef = useRef<Set<number>>(new Set());

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSuit, setFilterSuit] = useState<string>('all');
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  // Modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });
  
  // Calculate filtered cards
  const filteredCards = tarotDeck.filter(card => {
    const matchesSearch = card.nameCn.includes(searchTerm) ||
                          card.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          card.keywords.some(k => k.includes(searchTerm));
    const matchesSuit = filterSuit === 'all' || card.suit === filterSuit;
    return matchesSearch && matchesSuit;
  });

  // Image loading with rate limiting
  const loadImageWithDelay = (cardId: number, delay: number) => {
    if (loadedImages.has(cardId) || imageLoadQueueRef.current.has(cardId)) {
      return;
    }

    imageLoadQueueRef.current.add(cardId);

    setTimeout(() => {
      setLoadedImages(prev => new Set([...prev, cardId]));
      imageLoadQueueRef.current.delete(cardId);
    }, delay);
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            const cardId = parseInt(entry.target.getAttribute('data-card-id') || '0');
            const delay = Math.min(index * 50, 500); // Max 500ms delay
            loadImageWithDelay(cardId, delay);
          }
        });
      },
      { rootMargin: '200px' } // Load images 200px before they're visible
    );

    // Observe all card containers
    const cardElements = document.querySelectorAll('[data-card-id]');
    cardElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [filteredCards]);

  useEffect(() => {
    if (selectedCard) {
        // Update progress
        const progress = getProgress();
        if (!progress.learnedCards.includes(selectedCard.id)) {
            const newProgress = {
                ...progress,
                learnedCards: [...progress.learnedCards, selectedCard.id]
            };
            saveProgress(newProgress);
        }
    }
  }, [selectedCard]);

  // Handle URL query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) {
        const card = tarotDeck.find(c => c.id === parseInt(id));
        if (card) setSelectedCard(card);
    }
  }, [location]);

  const handleClose = () => {
      setSelectedCard(null);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (!selectedCard) return;

    const list = filteredCards.length > 0 ? filteredCards : tarotDeck;
    const currentIndex = list.findIndex(c => c.id === selectedCard.id);
    
    if (currentIndex === -1) return; 

    let newIndex;
    if (direction === 'prev') {
        newIndex = (currentIndex - 1 + list.length) % list.length;
    } else {
        newIndex = (currentIndex + 1) % list.length;
    }
    
    setSelectedCard(list[newIndex]);
  };

  // Data Restore Handler
  const handleImportData = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      
      setConfirmModal({
        isOpen: true,
        title: '导入数据',
        message: '⚠️ 导入数据将覆盖当前的所有笔记和进度，确定要继续吗？',
        onConfirm: async () => {
          try {
              await importData(file);
          } catch (error) {
              console.error("Import failed", error);
          }
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 animate-flip-in">
        <div>
            <h1 className="text-3xl font-serif text-mystic-gold">塔罗图鉴</h1>
            <p className="text-slate-400 text-sm mt-1">共 {tarotDeck.length} 张牌义解析</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto items-center">
            
            {/* Backup/Restore Controls */}
            <div className="flex items-center gap-2 bg-mystic-800 p-1.5 rounded-lg border border-mystic-700 mr-2">
                <button 
                    onClick={exportData}
                    className="p-2 text-slate-300 hover:text-white hover:bg-mystic-700 rounded-md transition"
                    title="备份所有笔记 (下载 JSON)"
                >
                    <Download size={18} />
                </button>
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 text-slate-300 hover:text-white hover:bg-mystic-700 rounded-md transition"
                    title="恢复笔记 (上传 JSON)"
                >
                    <Upload size={18} />
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".json" 
                    onChange={handleImportData}
                />
            </div>

            <div className="flex gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                        type="text" 
                        placeholder="搜索..." 
                        className="w-full md:w-40 pl-9 pr-4 py-2 bg-mystic-800 border border-mystic-700 rounded-lg text-sm focus:outline-none focus:border-mystic-500 transition"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative flex-1 md:flex-none">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <select 
                        className="w-full md:w-32 pl-9 pr-8 py-2 bg-mystic-800 border border-mystic-700 rounded-lg text-sm appearance-none focus:outline-none focus:border-mystic-500 cursor-pointer"
                        value={filterSuit}
                        onChange={(e) => setFilterSuit(e.target.value)}
                    >
                        <option value="all">全部</option>
                        <option value={Suit.Major}>大阿卡那</option>
                        <option value={Suit.Wands}>权杖</option>
                        <option value={Suit.Cups}>圣杯</option>
                        <option value={Suit.Swords}>宝剑</option>
                        <option value={Suit.Pentacles}>星币</option>
                    </select>
                </div>
            </div>
        </div>
      </header>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pb-20 animate-flip-in">
        {filteredCards.length === 0 && (
            <div className="col-span-full text-center py-10 text-slate-500">
                没有找到匹配的牌...
            </div>
        )}
        {filteredCards.map((card, index) => (
            <div
                key={card.id}
                data-card-id={card.id}
                onClick={() => setSelectedCard(card)}
                className="group relative aspect-[3/5] bg-mystic-800 rounded-lg overflow-hidden border border-mystic-700 hover:border-mystic-400 hover:shadow-lg hover:shadow-mystic-500/20 cursor-pointer transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${Math.min(index * 20, 1000)}ms` }}
            >
                {loadedImages.has(card.id) ? (
                    <img
                        src={getCardImageUrl(card.id)}
                        alt={card.nameEn}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                    />
                ) : (
                    <div className="w-full h-full bg-mystic-900 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-mystic-gold/20 border-t-mystic-gold rounded-full animate-spin"></div>
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-3">
                    <p className="text-xs text-mystic-gold font-serif">{card.suit === Suit.Major ? (card.id === 0 ? '0' : 'M' + card.id) : card.suit}</p>
                    <h3 className="text-white font-bold text-sm truncate">{card.nameCn}</h3>
                </div>
            </div>
        ))}
      </div>

      {/* Modal Detail View */}
      {selectedCard && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-flip-in" onClick={handleClose}>
            
            {/* Prev Button */}
            <button 
                onClick={(e) => { e.stopPropagation(); handleNavigate('prev'); }}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 bg-mystic-800/80 hover:bg-mystic-600 rounded-full text-white z-[110] border border-mystic-600 transition-transform hover:scale-110 shadow-lg group"
                title="上一张 (Previous)"
            >
                <ChevronLeft size={32} className="group-active:-translate-x-1 transition-transform"/>
            </button>

            {/* Next Button */}
            <button 
                onClick={(e) => { e.stopPropagation(); handleNavigate('next'); }}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 bg-mystic-800/80 hover:bg-mystic-600 rounded-full text-white z-[110] border border-mystic-600 transition-transform hover:scale-110 shadow-lg group"
                title="下一张 (Next)"
            >
                <ChevronRight size={32} className="group-active:translate-x-1 transition-transform"/>
            </button>

            {/* Modal Content */}
            <div 
                onClick={(e) => e.stopPropagation()} 
                className="relative bg-mystic-900 w-full max-w-4xl max-h-[85vh] rounded-2xl border border-mystic-600 shadow-2xl overflow-hidden flex flex-col md:flex-row z-[105]"
            >
                <button 
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-red-900/80 z-20 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Left: Image Area */}
                <div className="md:w-5/12 bg-black relative flex-shrink-0 h-[40vh] md:h-auto border-b md:border-b-0 md:border-r border-mystic-800">
                    <div className="w-full h-full flex items-center justify-center p-4">
                        <img 
                            key={selectedCard.id} // Force re-render image
                            src={getCardImageUrl(selectedCard.id)} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain drop-shadow-2xl"
                            alt={selectedCard.nameEn} 
                        />
                    </div>
                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                        <h2 className="text-3xl font-serif text-mystic-gold">{selectedCard.nameCn}</h2>
                        <p className="text-slate-300 italic font-serif text-sm">{selectedCard.nameEn}</p>
                    </div>
                </div>

                {/* Right: Text Content */}
                <div className="md:w-7/12 p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1 bg-mystic-900">
                    
                    <div className="flex gap-2 mb-6 flex-wrap">
                        {selectedCard.keywords.map(k => (
                            <span key={k} className="px-3 py-1 bg-mystic-800 border border-mystic-600 rounded-full text-xs text-mystic-200">
                                {k}
                            </span>
                        ))}
                        {selectedCard.element && (
                            <span className="px-3 py-1 bg-slate-800 border border-slate-600 rounded-full text-xs text-slate-300 flex items-center gap-1">
                                ✦ 元素: {selectedCard.element}
                            </span>
                        )}
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-bold text-blue-400 mb-2 uppercase tracking-wider">画面象征</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">{selectedCard.description}</p>
                        </div>

                        <div className="p-4 bg-mystic-800/30 rounded-lg border border-mystic-800">
                            <h3 className="text-sm font-bold text-violet-400 mb-2 uppercase tracking-wider">正位含义 (Upright)</h3>
                            <p className="text-slate-200 leading-relaxed text-sm">{selectedCard.meaningUp}</p>
                        </div>

                        <div className="p-4 bg-mystic-800/30 rounded-lg border border-mystic-800">
                            <h3 className="text-sm font-bold text-red-400 mb-2 uppercase tracking-wider">逆位含义 (Reversed)</h3>
                            <p className="text-slate-300 leading-relaxed text-sm">{selectedCard.meaningDown}</p>
                        </div>

                        {/* Symbols in this card */}
                        {selectedCard.symbols && selectedCard.symbols.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold text-mystic-gold flex items-center gap-2 uppercase tracking-wider">
                                    <Sparkles size={16} /> 关键元素解析
                                </h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {selectedCard.symbols.map(symbolId => {
                                        const symbol = tarotSymbols.find(s => s.id === symbolId);
                                        if (!symbol) return null;
                                        
                                        const cardExplanation = symbol.details.find(
                                            exp => exp.cardName === selectedCard.nameCn || exp.cardName === selectedCard.nameEn
                                        );

                                        return (
                                            <div key={symbolId} className="p-4 bg-mystic-800/40 rounded-xl border border-mystic-700 hover:border-mystic-500 transition-all group">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg">✦</span>
                                                        <h4 className="text-mystic-200 font-bold">{symbol.nameCn} <span className="text-xs font-normal text-slate-500 ml-1">{symbol.nameEn}</span></h4>
                                                    </div>
                                                    <Link 
                                                        to={`/symbols?search=${symbol.nameCn}`}
                                                        className="text-[10px] text-mystic-400 hover:text-mystic-gold flex items-center gap-1 transition-colors"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        查看百科 <Info size={10} />
                                                    </Link>
                                                </div>
                                                
                                                {cardExplanation ? (
                                                    <div className="space-y-2">
                                                        <p className="text-xs text-slate-300 leading-relaxed">
                                                            {cardExplanation.interpretation}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-slate-400 italic">
                                                        {symbol.generalMeaning}
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                    </div>

                </div>
            </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <div className="w-12 h-12 bg-amber-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Trash2 className="text-amber-400" size={24} />
              </div>
              <h3 className="text-xl text-white font-medium mb-2">{confirmModal.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-8">
                {confirmModal.message}
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                  className="flex-1 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 hover:text-white transition"
                >
                  取消
                </button>
                <button 
                  onClick={confirmModal.onConfirm}
                  className="flex-1 px-6 py-3 bg-amber-500 hover:bg-amber-600 rounded-xl text-sm text-white font-medium transition shadow-lg shadow-amber-500/20"
                >
                  确认
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Learn;