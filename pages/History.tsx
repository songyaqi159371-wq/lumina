import React, { useState, useEffect } from 'react';
import { getHistory, deleteHistoryItem, updateHistoryItem } from '../services/storage';
import { DivinationResult, ReadingStyle } from '../types';
import { spreads, tarotDeck, getCardImageUrl } from '../constants';
import { 
  Trash2, Calendar, MessageSquare, ChevronDown, ChevronUp, 
  History as HistoryIcon, Search, Filter, X,
  ExternalLink, BrainCircuit, User, Bot, Trash
} from 'lucide-react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';

const History: React.FC = () => {
  const [history, setHistory] = useState<DivinationResult[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStyle, setFilterStyle] = useState<ReadingStyle | 'All'>('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

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

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleDeleteRecord = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmModal({
      isOpen: true,
      title: '删除记录',
      message: '确定要删除这条占卜记录吗？此操作不可撤销。',
      onConfirm: () => {
        deleteHistoryItem(id);
        setHistory(getHistory());
        if (expandedId === id) setExpandedId(null);
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleDeleteMessage = (recordId: string, messageIndex: number) => {
    setConfirmModal({
      isOpen: true,
      title: '删除对话',
      message: '确定要删除这条对话吗？',
      onConfirm: () => {
        const record = history.find(r => r.id === recordId);
        if (record && record.chatHistory) {
          const newChatHistory = [...record.chatHistory];
          newChatHistory.splice(messageIndex, 1);
          updateHistoryItem(recordId, { chatHistory: newChatHistory });
          setHistory(getHistory());
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.aiInterpretation?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStyle = filterStyle === 'All' || item.readingStyle === filterStyle;
    
    const itemDate = new Date(item.date).getTime();
    const matchesStartDate = !startDate ? true : itemDate >= new Date(startDate).getTime();
    // Set end date to end of day
    const matchesEndDate = !endDate ? true : itemDate <= new Date(endDate).setHours(23, 59, 59, 999);
    
    return matchesSearch && matchesStyle && matchesStartDate && matchesEndDate;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
            <HistoryIcon className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-light tracking-tight text-white">占卜档案</h1>
            <p className="text-slate-400 text-sm mt-1">回顾您的命运轨迹与灵性启示</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mt-8">
          <div className="relative flex-[2]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="搜索问题或解读内容..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-white/20 transition"
            />
          </div>
          
          <div className="flex flex-wrap md:flex-nowrap gap-4 flex-[3]">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 flex-1">
              <Calendar size={16} className="text-slate-500" />
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent text-slate-300 text-sm focus:outline-none cursor-pointer w-full [color-scheme:dark]"
              />
            </div>
            <div className="flex items-center justify-center text-slate-600">至</div>
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 flex-1">
              <Calendar size={16} className="text-slate-500" />
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent text-slate-300 text-sm focus:outline-none cursor-pointer w-full [color-scheme:dark]"
              />
            </div>
            
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-2">
              <Filter size={16} className="text-slate-500" />
              <select 
                value={filterStyle}
                onChange={(e) => setFilterStyle(e.target.value as any)}
                className="bg-transparent text-slate-300 text-sm focus:outline-none cursor-pointer"
              >
                <option value="All">所有风格</option>
                {Object.values(ReadingStyle).map(style => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
            </div>

            {(searchTerm || startDate || endDate || filterStyle !== 'All') && (
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setStartDate('');
                  setEndDate('');
                  setFilterStyle('All');
                }}
                className="p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition"
                title="重置筛选"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </header>

      {filteredHistory.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/10 border-dashed rounded-3xl">
          <HistoryIcon size={48} className="mx-auto text-slate-700 mb-4" />
          <p className="text-slate-500">暂无符合条件的占卜记录</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item) => {
            const spread = spreads.find(s => s.id === item.spreadId);
            const isExpanded = expandedId === item.id;

            return (
              <div 
                key={item.id}
                className={`group border transition-all duration-500 overflow-hidden ${
                  isExpanded 
                    ? 'bg-white/[0.03] border-white/20 rounded-3xl' 
                    : 'bg-white/5 border-white/10 rounded-2xl hover:border-white/20'
                }`}
              >
                <div 
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="p-6 cursor-pointer flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {spread?.name || '未知牌阵'}
                      </span>
                      <span className="text-slate-500 text-xs flex items-center gap-1">
                        <Calendar size={12} /> {formatDate(item.date)}
                      </span>
                    </div>
                    <h3 className="text-lg text-white font-medium truncate">
                      {item.question || '未输入问题'}
                    </h3>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={(e) => handleDeleteRecord(item.id, e)}
                      className="p-2 text-slate-500 hover:text-rose-400 transition"
                      title="删除记录"
                    >
                      <Trash2 size={18} />
                    </button>
                    <div className={`p-1 rounded-full transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-white/10' : 'text-slate-500'}`}>
                      <ChevronDown size={20} />
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "circOut" }}
                    >
                      <div className="px-6 pb-8 border-t border-white/10 pt-8">
                        {/* Cards Section */}
                        <div className="mb-10">
                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <div className="w-1 h-1 bg-slate-500 rounded-full" /> 抽取牌面
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                            {item.cards.map((cardData, idx) => {
                              const card = tarotDeck.find(c => c.id === cardData.cardId);
                              const pos = spread?.positions.find(p => p.id === cardData.positionId);
                              if (!card) return null;
                              return (
                                <div key={idx} className="text-center">
                                  <div className="relative aspect-[2/3.5] rounded-xl overflow-hidden border border-white/10 mb-2">
                                    <img 
                                      src={getCardImageUrl(card.id)} 
                                      alt={card.nameCn}
                                      className={`w-full h-full object-cover ${cardData.isReversed ? 'rotate-180' : ''}`}
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                  <p className="text-[10px] text-slate-500 truncate px-1">{pos?.name || `位置 ${idx + 1}`}</p>
                                  <p className="text-xs text-white font-medium truncate px-1">
                                    {card.nameCn} {cardData.isReversed ? '(逆)' : ''}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Interpretation Section */}
                        <div className="mb-10">
                          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                            <div className="w-1 h-1 bg-slate-500 rounded-full" /> AI 核心解读
                          </h4>
                          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 text-slate-300 leading-relaxed prose prose-invert prose-sm max-w-none">
                            <Markdown>{item.aiInterpretation || '无解读内容'}</Markdown>
                          </div>
                        </div>

                        {/* Chat History Section */}
                        {item.chatHistory && item.chatHistory.length > 0 && (
                          <div>
                            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                              <div className="w-1 h-1 bg-slate-500 rounded-full" /> 追问记录
                            </h4>
                            <div className="space-y-4">
                              {item.chatHistory.map((msg, msgIdx) => (
                                <div 
                                  key={msgIdx} 
                                  className={`flex gap-4 group/msg ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                  {msg.role === 'model' && (
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/30">
                                      <Bot size={14} className="text-indigo-400" />
                                    </div>
                                  )}
                                  
                                  <div className={`relative max-w-[85%] p-4 rounded-2xl border ${
                                    msg.role === 'user' 
                                      ? 'bg-white/5 border-white/10 text-white rounded-tr-none' 
                                      : 'bg-indigo-500/5 border-indigo-500/10 text-slate-300 rounded-tl-none'
                                  }`}>
                                    <button 
                                      onClick={() => handleDeleteMessage(item.id, msgIdx)}
                                      className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/msg:opacity-100 transition-opacity shadow-lg active:scale-90"
                                      title="删除此条对话"
                                    >
                                      <X size={12} />
                                    </button>
                                    <div className="prose prose-invert prose-xs">
                                      <Markdown>{msg.parts[0].text}</Markdown>
                                    </div>
                                  </div>

                                  {msg.role === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                                      <User size={14} className="text-slate-300" />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
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
              <div className="w-12 h-12 bg-rose-500/20 rounded-2xl flex items-center justify-center mb-6">
                <Trash2 className="text-rose-400" size={24} />
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
                  className="flex-1 px-6 py-3 bg-rose-500 hover:bg-rose-600 rounded-xl text-sm text-white font-medium transition shadow-lg shadow-rose-500/20"
                >
                  确认删除
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default History;
