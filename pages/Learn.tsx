import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { tarotDeck, getCardImageUrl } from '../constants';
import { Suit, TarotCard } from '../types';
import { saveNote, getNote, getProgress, saveProgress } from '../services/storage';

const Learn: React.FC = () => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSuit, setFilterSuit] = useState<string>('all');
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [userNote, setUserNote] = useState('');
  
  // Calculate filtered cards
  const filteredCards = tarotDeck.filter(card => {
    const matchesSearch = card.nameCn.includes(searchTerm) || 
                          card.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          card.keywords.some(k => k.includes(searchTerm));
    const matchesSuit = filterSuit === 'all' || card.suit === filterSuit;
    return matchesSearch && matchesSuit;
  });

  useEffect(() => {
    if (selectedCard) {
        setUserNote(getNote(selectedCard.id));
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

  const handleSaveNote = () => {
      if (selectedCard) {
          saveNote(selectedCard.id, userNote);
          // Optional toast here
      }
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (!selectedCard) return;
    
    // Navigate within currently filtered list
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

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 animate-flip-in">
        <div>
            <h1 className="text-3xl font-serif text-mystic-gold">塔罗图鉴</h1>
            <p className="text-slate-400 text-sm mt-1">共 {tarotDeck.length} 张牌义解析</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                    type="text" 
                    placeholder="搜索牌名、关键词..." 
                    className="w-full pl-9 pr-4 py-2 bg-mystic-800 border border-mystic-700 rounded-lg text-sm focus:outline-none focus:border-mystic-500 transition focus:ring-1 focus:ring-mystic-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select 
                    className="w-full pl-9 pr-8 py-2 bg-mystic-800 border border-mystic-700 rounded-lg text-sm appearance-none focus:outline-none focus:border-mystic-500 cursor-pointer"
                    value={filterSuit}
                    onChange={(e) => setFilterSuit(e.target.value)}
                >
                    <option value="all">全部牌组</option>
                    <option value={Suit.Major}>大阿卡那 (Major)</option>
                    <option value={Suit.Wands}>权杖 (Wands)</option>
                    <option value={Suit.Cups}>圣杯 (Cups)</option>
                    <option value={Suit.Swords}>宝剑 (Swords)</option>
                    <option value={Suit.Pentacles}>星币 (Pentacles)</option>
                </select>
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
        {filteredCards.map(card => (
            <div 
                key={card.id} 
                onClick={() => setSelectedCard(card)}
                className="group relative aspect-[3/5] bg-mystic-800 rounded-lg overflow-hidden border border-mystic-700 hover:border-mystic-400 hover:shadow-lg hover:shadow-mystic-500/20 cursor-pointer transition-all duration-300 hover:-translate-y-1"
            >
                <img 
                    src={getCardImageUrl(card.id)} 
                    alt={card.nameEn} 
                    loading="lazy"
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-3">
                    <p className="text-xs text-mystic-gold font-serif">{card.suit === Suit.Major ? (card.id === 0 ? '0' : 'M' + card.id) : card.suit}</p>
                    <h3 className="text-white font-bold text-sm truncate">{card.nameCn}</h3>
                </div>
            </div>
        ))}
      </div>

      {/* Modal Detail View */}
      {selectedCard && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-flip-in" onClick={() => setSelectedCard(null)}>
            
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
                    onClick={() => setSelectedCard(null)}
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
                        <div className="p-4 bg-mystic-800/30 rounded-lg border border-mystic-800">
                            <h3 className="text-sm font-bold text-violet-400 mb-2 uppercase tracking-wider">正位含义 (Upright)</h3>
                            <p className="text-slate-200 leading-relaxed text-sm">{selectedCard.meaningUp}</p>
                        </div>
                        
                        <div className="p-4 bg-mystic-800/30 rounded-lg border border-mystic-800">
                            <h3 className="text-sm font-bold text-red-400 mb-2 uppercase tracking-wider">逆位含义 (Reversed)</h3>
                            <p className="text-slate-300 leading-relaxed text-sm">{selectedCard.meaningDown}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-bold text-blue-400 mb-2 uppercase tracking-wider">画面象征</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{selectedCard.description}</p>
                        </div>

                        {/* Notes Section */}
                        <div className="bg-mystic-800/50 p-4 rounded-xl border border-mystic-700 mt-4">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-sm font-bold text-mystic-gold">🔮 学习笔记</h3>
                                <button 
                                    onClick={handleSaveNote}
                                    className="px-3 py-1 bg-mystic-700 hover:bg-mystic-600 text-white text-xs rounded transition border border-mystic-600"
                                >
                                    保存
                                </button>
                            </div>
                            <textarea 
                                className="w-full bg-mystic-900/80 text-slate-200 text-sm p-3 rounded-lg border border-mystic-700 focus:border-mystic-500 focus:outline-none min-h-[80px] resize-y placeholder-slate-600"
                                placeholder="在这里记录你的感悟..."
                                value={userNote}
                                onChange={(e) => setUserNote(e.target.value)}
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Learn;