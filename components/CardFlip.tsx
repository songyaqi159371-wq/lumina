import React from 'react';
import { getCardImageUrl } from '../constants';
import { TarotCard } from '../types';

interface CardFlipProps {
  card: TarotCard | null;
  isReversed?: boolean;
  isRevealed: boolean;
  onClick?: () => void;
  width?: string;
  height?: string;
  showLabel?: boolean;
}

const CardFlip: React.FC<CardFlipProps> = ({ 
  card, 
  isReversed = false, 
  isRevealed, 
  onClick,
  width = "w-48",
  height = "h-80",
  showLabel = true
}) => {
  const imgSrc = card ? getCardImageUrl(card.id) : '';

  return (
    <div 
      className={`relative group perspective-1000 ${width} ${height} cursor-pointer`}
      onClick={onClick}
    >
      <div 
        className={`w-full h-full duration-[800ms] preserve-3d absolute transition-all transform-style-3d shadow-2xl rounded-2xl
          ${isRevealed ? 'rotate-y-180' : ''}`}
      >
        {/* Back of Card */}
        <div className="absolute w-full h-full backface-hidden rounded-2xl border border-white/10 bg-[#0f172a] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/sacred-geometry.png')]"></div>
            <div className="absolute inset-3 border border-mystic-gold/20 rounded-xl flex items-center justify-center">
                <div className="w-12 h-12 rounded-full border border-mystic-gold/40 flex items-center justify-center animate-pulse-slow">
                    <span className="text-2xl text-mystic-gold drop-shadow-[0_0_8px_#fbbf24]">✦</span>
                </div>
            </div>
            {/* Corner decorations */}
            <div className="absolute top-4 left-4 text-[8px] text-mystic-gold/30 font-serif">LUMINA</div>
            <div className="absolute bottom-4 right-4 text-[8px] text-mystic-gold/30 font-serif rotate-180">LUMINA</div>
        </div>

        {/* Front of Card */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-2xl overflow-hidden bg-slate-950 border border-mystic-gold/30 shadow-[0_0_30px_rgba(251,191,36,0.1)]">
          {card ? (
            <div className={`relative w-full h-full flex flex-col ${isReversed ? 'rotate-180' : ''}`}>
               <img 
                 src={imgSrc} 
                 alt={card.nameEn}
                 referrerPolicy="no-referrer"
                 className="w-full h-full object-cover saturate-[0.85] contrast-[1.1]"
                 loading="lazy"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
               {showLabel && (
                  <div className={`absolute bottom-0 w-full text-center py-4 bg-black/40 backdrop-blur-md border-t border-white/5 ${isReversed ? 'rotate-180' : ''}`}>
                      <p className="text-mystic-gold font-serif text-[9px] tracking-[0.3em] uppercase opacity-80 mb-0.5">{card.nameEn}</p>
                      <p className="text-white font-serif text-lg tracking-widest font-bold">{card.nameCn}</p>
                  </div>
               )}
            </div>
          ) : (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white">?</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardFlip;