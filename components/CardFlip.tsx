
import React, { useState, useEffect } from 'react';
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
  const [imgSrc, setImgSrc] = useState<string>('');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (card) {
      setImgSrc(getCardImageUrl(card.id));
      setHasError(false);
    }
  }, [card]);

  const handleImageError = () => {
    if (!card || hasError) return;
    
    // Fallback logic for Sacred Texts Archive
    // IDs: Major 0-21, Wands 22-35, Cups 36-49, Swords 50-63, Pentacles 64-77
    let fallbackUrl = '';
    const pad = (n: number) => n.toString().padStart(2, '0');

    if (card.id <= 21) {
        fallbackUrl = `https://www.sacred-texts.com/tarot/pkt/img/ar${pad(card.id)}.jpg`;
    } else if (card.id >= 22 && card.id <= 35) {
        // Wands: 22(Ace) -> wa01, 35(King) -> wa14
        const num = card.id - 21;
        fallbackUrl = `https://www.sacred-texts.com/tarot/pkt/img/wa${pad(num)}.jpg`;
    } else if (card.id >= 36 && card.id <= 49) {
        // Cups: 36(Ace) -> cu01
        const num = card.id - 35;
        fallbackUrl = `https://www.sacred-texts.com/tarot/pkt/img/cu${pad(num)}.jpg`;
    } else if (card.id >= 50 && card.id <= 63) {
        // Swords: 50(Ace) -> sw01
        const num = card.id - 49;
        fallbackUrl = `https://www.sacred-texts.com/tarot/pkt/img/sw${pad(num)}.jpg`;
    } else if (card.id >= 64 && card.id <= 77) {
        // Pentacles: 64(Ace) -> pe01
        const num = card.id - 63;
        fallbackUrl = `https://www.sacred-texts.com/tarot/pkt/img/pe${pad(num)}.jpg`;
    }

    console.warn(`Primary image failed for card ${card.id}. Trying fallback: ${fallbackUrl}`);
    setImgSrc(fallbackUrl);
    setHasError(true); // Prevent infinite loops
  };

  return (
    <div 
      className={`relative group perspective-1000 ${width} ${height} cursor-pointer`}
      onClick={onClick}
    >
      <div 
        className={`w-full h-full duration-700 preserve-3d absolute transition-all transform-style-3d shadow-xl rounded-xl
          ${isRevealed ? 'rotate-y-180' : ''}`}
      >
        {/* Back of Card (Pattern) */}
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
                 onError={handleImageError}
                 className="w-full h-full object-cover opacity-80"
               />
               {/* Overlay for label if needed inside the card graphic */}
               {showLabel && (
                  <div className={`absolute bottom-0 w-full bg-black/70 text-center py-2 ${isReversed ? 'rotate-180' : ''}`}>
                      <p className="text-mystic-gold font-serif text-sm">{card.nameCn}</p>
                      {isReversed && <p className="text-red-400 text-xs">(逆位)</p>}
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
