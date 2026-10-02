import React from 'react';
import { Sparkles } from 'lucide-react';

interface MobileDrawCardsProps {
  selectedSpread: { positions: any[] };
  pickedIndices: any[];
  shuffledDeck: number[];
  handlePickCard: (deckIndex: number, cardId: number) => void;
}

const MobileDrawCards: React.FC<MobileDrawCardsProps> = ({
  selectedSpread,
  pickedIndices,
  shuffledDeck,
  handlePickCard,
}) => {
  const progress = (pickedIndices.length / selectedSpread.positions.length) * 100;

  return (
    <div className="animate-flip-in flex flex-col h-full">
      {/* 标题区 */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-serif text-white mb-3 tracking-wide">
          凭直觉选择
        </h2>
        <p className="text-slate-500 text-sm font-light italic">
          深呼吸，让心灵引导你的选择
        </p>
      </div>

      {/* 进度条区 */}
      <div className="mb-6 space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-mystic-gold">
            <Sparkles size={16} className="animate-pulse" />
            <span className="text-xs font-serif uppercase tracking-wider">
              灵能收集
            </span>
          </div>
          <span className="text-xl font-serif text-white">
            {pickedIndices.length} / {selectedSpread.positions.length}
          </span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
          <div
            className="h-full bg-gradient-to-r from-mystic-gold/40 via-mystic-gold to-mystic-gold/40 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 卡牌网格 - 移动端优化为 6 列 */}
      <div className="flex-1 overflow-y-auto -mx-4 px-4">
        <div className="grid grid-cols-6 gap-2 pb-20">
          {shuffledDeck.map((actualCardId, i) => {
            const isPicked = pickedIndices.some((p: any) => p.deckIndex === i);
            return (
              <div
                key={i}
                onClick={() => !isPicked && handlePickCard(i, actualCardId)}
                className={`
                  relative aspect-[2/3] w-full rounded-lg border transition-all duration-500
                  ${isPicked
                    ? 'opacity-0 scale-50 pointer-events-none blur-sm'
                    : 'bg-mystic-950 border-white/10 active:scale-95 active:border-mystic-gold/50'
                  }
                `}
              >
                {!isPicked && (
                  <div className="absolute inset-1 rounded-md border border-white/[0.02] flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/sacred-geometry.png')] bg-opacity-10 opacity-40">
                    <div className="w-1 h-1 rounded-full bg-mystic-gold/20"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileDrawCards;
