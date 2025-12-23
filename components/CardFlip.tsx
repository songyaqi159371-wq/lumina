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
        className={`w-full h-full duration-700 preserve-3d absolute transition-all transform-style-3d shadow-xl rounded-xl
          ${isRevealed ? 'rotate-y-180' : ''}`}
      >
        {/* Back of Card */}
        <div className="absolute w-full h-full backface-hidden rounded-xl border-2 border-mystic-700 bg-mystic-800 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]"></div>
            <div className="absolute inset-2 border border-mystic-500 rounded-lg flex items-center justify-center">
                <span className="text-4xl text-mystic-500">✦</span>
            </div>
        </div>

        {/* Front of Card */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-xl overflow-hidden bg-slate-900 border-2 border-mystic-gold/50">
          {card ? (
            <div className={`relative w-full h-full flex flex-col ${isReversed ? 'rotate-180' : ''}`}>
               <img 
                 src={imgSrc} 
                 alt={card.nameEn}
                 className="w-full h-full object-cover"
                 loading="lazy"
               />
               {showLabel && (
                  <div className={`absolute bottom-0 w-full bg-black/70 text-center py-2 ${isReversed ? 'rotate-180' : ''}`}>
                      <p className="text-mystic-gold font-serif text-[10px] tracking-widest uppercase">{card.nameEn}</p>
                      <p className="text-white font-serif text-sm">{card.nameCn}</p>
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