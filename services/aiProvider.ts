import { TarotCard, Spread, ReadingStyle } from '../types';

export type ChatMessage = { role: 'user' | 'model'; parts: { text: string }[] };

export interface AIProvider {
  interpretReading(
    question: string,
    spread: Spread,
    cards: { card: TarotCard; isReversed: boolean; positionName: string }[],
    style: ReadingStyle
  ): Promise<string>;

  continueReading(
    history: ChatMessage[],
    style: ReadingStyle
  ): Promise<string>;
}
