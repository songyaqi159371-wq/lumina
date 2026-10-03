import React, { useState, useRef, useEffect } from 'react';
import { Download, Sparkles, RefreshCw, Send } from 'lucide-react';
import { TarotCard, Spread, AIModel } from '../../types';
import CardFlip from '../CardFlip';

interface MobileResultProps {
  selectedSpread: Spread;
  question: string;
  drawnCards: (TarotCard & { isReversed: boolean; positionName: string })[];
  revealedIndices: number[];
  onCardClick: (index: number) => void;
  aiInterpretation: string;
  isLoadingAI: boolean;
  onAIRequest: () => void;
  onExport: () => void;
  onRestart: () => void;
  aiModel?: AIModel;
  onModelChange?: (model: AIModel) => void;
  chatHistory?: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }>;
  onFollowUp?: (text: string) => void;
  isSendingFollowUp?: boolean;
}

const MobileResult: React.FC<MobileResultProps> = ({
  selectedSpread,
  question,
  drawnCards,
  revealedIndices,
  onCardClick,
  aiInterpretation,
  isLoadingAI,
  onAIRequest,
  onExport,
  onRestart,
  aiModel,
  onModelChange,
  chatHistory = [],
  onFollowUp,
  isSendingFollowUp = false,
}) => {
  const allRevealed = revealedIndices.length === drawnCards.length;
  const [followUpText, setFollowUpText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendFollowUp = () => {
    if (followUpText.trim() && onFollowUp) {
      onFollowUp(followUpText);
      setFollowUpText('');
    }
  };

  const cardCount = drawnCards.length;
  // Keep every card inside the viewport while preserving enough room for its artwork.
  const columns = cardCount <= 2 ? cardCount : cardCount <= 6 ? 3 : 4;
  const cardMaxWidth = cardCount === 1 ? 128 : cardCount === 2 ? 116 : cardCount <= 6 ? 96 : 72;

  return (
    <div className="flex flex-col min-h-screen bg-mystic-950">
      {/* 顶部标题栏 - 非固定 */}
      <div className="bg-mystic-950 border-b border-white/10">
        {/* 标题栏 */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-mystic-gold" />
            <span className="text-xs text-mystic-gold font-serif">
              {selectedSpread.name}
            </span>
          </div>
          <button
            onClick={onExport}
            className="p-2 hover:bg-white/5 rounded-lg transition active:scale-95"
          >
            <Download size={18} className="text-slate-400" />
          </button>
        </div>

        {/* 问题回顾 */}
        <div className="px-4 pb-3">
          <div className="bg-black/30 border border-white/5 rounded-xl px-4 py-2.5">
            <div className="text-[10px] text-slate-500 mb-1 uppercase tracking-wide">你的问题</div>
            <p className="text-white text-sm leading-relaxed">"{question}"</p>
          </div>
        </div>
      </div>

      {/* 主内容滚动区 */}
      <div className="flex-1 px-4 py-6 space-y-6 pb-32">
        {/* 卡牌排列：按牌数分列，避免固定宽度造成溢出和重叠 */}
        <div
          className="grid w-full justify-items-center gap-x-2 gap-y-4"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {drawnCards.map((card, index) => {
            const isRevealed = revealedIndices.includes(index);

            return (
              <div key={index} className="flex w-full min-w-0 flex-col items-center space-y-1">
                {/* 位置标签 */}
                <div className="px-1 py-0.5 bg-white/5 border border-white/10 rounded-full">
                  <span className="text-[6px] text-slate-400 uppercase tracking-wide truncate block text-center" style={{ maxWidth: '70px' }}>
                    {card.positionName}
                  </span>
                </div>

                {/* 卡牌 - 点击翻牌 */}
                <div
                  onClick={() => onCardClick(index)}
                  className="relative w-full max-w-full aspect-[2/3] cursor-pointer"
                  style={{ maxWidth: `${cardMaxWidth}px` }}
                >
                  <CardFlip
                    card={card}
                    isRevealed={isRevealed}
                    isReversed={card.isReversed}
                    onClick={() => {}}
                    width="w-full"
                    height="h-full"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* AI 解读区 */}
        {allRevealed && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-mystic-gold" />
                <span className="text-sm font-serif text-white">AI 深度解读</span>
              </div>

              {/* AI 模型选择下拉框 */}
              {onModelChange && aiModel && (
                <select
                  value={aiModel}
                  onChange={(e) => onModelChange(e.target.value as AIModel)}
                  className="bg-white/10 border border-white/20 text-white font-medium text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-mystic-gold/50 cursor-pointer"
                >
                  <option value={AIModel.DeepSeek} className="bg-mystic-950 text-white">DeepSeek</option>
                  <option value={AIModel.Qwen} className="bg-mystic-950 text-white">通义千问</option>
                  <option value={AIModel.Claude} className="bg-mystic-950 text-white">Claude</option>
                  <option value={AIModel.OpenAI} className="bg-mystic-950 text-white">OpenAI</option>
                </select>
              )}
            </div>

            {isLoadingAI && (
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-mystic-gold border-t-transparent"></div>
                  <p className="text-sm text-slate-400">AI 正在感应牌阵能量...</p>
                </div>
              </div>
            )}

            {!isLoadingAI && !aiInterpretation && (
              <button
                onClick={onAIRequest}
                className="w-full py-3.5 bg-gradient-to-r from-mystic-gold to-yellow-600 text-mystic-950 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-98 transition shadow-lg"
              >
                <Sparkles size={16} />
                <span>获取 AI 深度解读</span>
              </button>
            )}

            {aiInterpretation && (
              <div className="bg-gradient-to-br from-mystic-gold/5 to-transparent border border-mystic-gold/20 rounded-2xl p-4">
                <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {aiInterpretation}
                </div>
              </div>
            )}

            {/* 聊天历史 */}
            {chatHistory.length > 0 && (
              <div className="space-y-3 mt-4">
                {chatHistory.filter(msg => msg.role === 'model' || msg.parts[0].text !== `请解读牌阵。问题是：${question}`).map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-3 ${
                      msg.role === 'user'
                        ? 'bg-mystic-gold/10 border border-mystic-gold/30 text-white'
                        : 'bg-white/5 border border-white/10 text-slate-300'
                    }`}>
                      <div className="text-xs leading-relaxed whitespace-pre-wrap">{msg.parts[0].text}</div>
                    </div>
                  </div>
                ))}
                {isSendingFollowUp && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-mystic-gold rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-mystic-gold rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                        <div className="w-1.5 h-1.5 bg-mystic-gold rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>
        )}

        {/* 重新开始按钮 */}
        <div className="pt-4 pb-20">
          <button
            onClick={onRestart}
            className="w-full bg-white/5 border border-white/10 text-white font-medium py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <RefreshCw size={18} />
            <span>开始新占卜</span>
          </button>
        </div>
      </div>

      {/* 固定底部追问输入框 */}
      {aiInterpretation && onFollowUp && (
        <div className="fixed bottom-0 left-0 right-0 bg-mystic-950/95 backdrop-blur-xl border-t border-white/10 p-4 pb-safe">
          <div className="flex gap-2">
            <input
              type="text"
              value={followUpText}
              onChange={(e) => setFollowUpText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendFollowUp()}
              placeholder="继续追问..."
              disabled={isSendingFollowUp}
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-mystic-gold/50 disabled:opacity-50"
            />
            <button
              onClick={handleSendFollowUp}
              disabled={!followUpText.trim() || isSendingFollowUp}
              className="bg-mystic-gold text-mystic-950 rounded-xl px-4 py-3 font-bold disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileResult;
