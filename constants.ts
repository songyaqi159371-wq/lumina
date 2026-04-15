import { tarotDeck } from './data/tarotCards';
import { tarotSymbols } from './data/tarotSymbols';
import { spreads } from './data/spreads';
import { caseStudies } from './data/caseStudies';

export { tarotDeck, tarotSymbols, spreads, caseStudies };

export const getCardImageUrl = (id: number): string => {
  const pad = (n: number) => n.toString().padStart(2, '0');
  
  // Helper to map 1-14 to Sacred Texts codes (ac, 02-10, pa, kn, qu, ki)
  const getSuffix = (n: number) => {
    if (n === 1) return 'ac';
    if (n === 11) return 'pa';
    if (n === 12) return 'kn';
    if (n === 13) return 'qu';
    if (n === 14) return 'ki';
    return pad(n);
  };

  if (id <= 21) {
    return `https://www.sacred-texts.com/tarot/pkt/img/ar${pad(id)}.jpg`;
  } else if (id >= 22 && id <= 35) {
    // Wands: id 22 maps to index 1
    return `https://www.sacred-texts.com/tarot/pkt/img/wa${getSuffix(id - 21)}.jpg`;
  } else if (id >= 36 && id <= 49) {
    // Cups: id 36 maps to index 1
    return `https://www.sacred-texts.com/tarot/pkt/img/cu${getSuffix(id - 35)}.jpg`;
  } else if (id >= 50 && id <= 63) {
    // Swords: id 50 maps to index 1
    return `https://www.sacred-texts.com/tarot/pkt/img/sw${getSuffix(id - 49)}.jpg`;
  } else if (id >= 64 && id <= 77) {
    // Pentacles: id 64 maps to index 1
    return `https://www.sacred-texts.com/tarot/pkt/img/pe${getSuffix(id - 63)}.jpg`;
  }
  return `https://placehold.co/400x700?text=Card+${id}`;
};
