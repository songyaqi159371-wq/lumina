import React from 'react';
import { Share2, Download, Sparkles, RefreshCw } from 'lucide-react';
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
  onShare: () => void;
  onExport: () => void;
  onRestart: () => void;
  aiModel?: AIModel;
  onModelChange?: (model: AIModel) => void;
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
  onShare,
  onExport,
  onRestart,
  aiModel,
  onModelChange,
}) => {
  const allRevealed = revealedIndices.length === drawnCards.length;

  return (
    <div className="flex flex-col min-h-screen bg-mystic-950 pb-20">
      {/* 顶部固定栏 */}
      <div className="sticky top-0 z-20 bg-mystic-950/95 backdrop-blur-xl border-b border-white/10">
        {/* 标题栏 */}
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-mystic-gold" />
            <span className="text-xs text-mystic-gold font-serif">
              {selectedSpread.name}
            </span>
          </div>
          <div className="flex gap-1">
            <button
              onClick={onShare}
              className="p-2 hover:bg-white/5 rounded-lg transition active:scale-95"
            >
              <Share2 size={18} className="text-slate-400" />
            </button>
            <button
              onClick={onExport}
              className="p-2 hover:bg-white/5 rounded-lg transition active:scale-95"
            >
              <Download size={18} className="text-slate-400" />
            </button>
          </div>
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
      <div className="flex-1 px-3 py-6 space-y-6">
        {/* 卡牌排列 - 确保不重叠，自适应布局 */}
        <div className={`grid mx-auto ${
          drawnCards.length === 1 ? 'grid-cols-1 gap-0 max-w-[90px]' :
          drawnCards.length === 2 ? 'grid-cols-2 gap-3 max-w-[200px]' :
          drawnCards.length === 3 ? 'grid-cols-3 gap-2 max-w-[280px]' :
          drawnCards.length === 4 ? 'grid-cols-4 gap-2' :
          drawnCards.length <= 6 ? 'grid-cols-3 gap-2' :
          drawnCards.length <= 9 ? 'grid-cols-3 gap-2' :
          drawnCards.length === 10 ? 'grid-cols-5 gap-1.5' :
          'grid-cols-4 gap-2'
        }`}>
          {drawnCards.map((card, index) => {
            const isRevealed = revealedIndices.includes(index);

            return (
              <div key={index} className="flex flex-col items-center space-y-1.5">
                {/* 位置标签 */}
                <div className="px-1.5 py-0.5 bg-white/5 border border-white/10 rounded-full">
                  <span className="text-[7px] text-slate-400 uppercase tracking-wide truncate max-w-[70px] block text-center">
                    {card.positionName}
                  </span>
                </div>

                {/* 卡牌 - 点击翻牌 */}
                <div
                  onClick={() => onCardClick(index)}
                  className="relative w-full aspect-[2/3] cursor-pointer"
                >
                  <CardFlip
                    card={card}
                    isRevealed={isRevealed}
                    isReversed={card.isReversed}
                    onClick={() => {}}
                    className="w-full h-full"
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
          </div>
        )}

        {/* 重新开始按钮 */}
        <div className="pt-4">
          <button
            onClick={onRestart}
            className="w-full bg-white/5 border border-white/10 text-white font-medium py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <RefreshCw size={18} />
            <span>开始新占卜</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileResult;
