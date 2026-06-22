import { TarotCard, Spread, ReadingStyle } from '../types';

export type ChatMessage = { role: 'user' | 'model'; parts: { text: string }[] };

export interface AIProvider {
  interpretReading(
    question: string,
    spread: Spread,
    cards: { card: TarotCard; isReversed: boolean; positionName: string }[],
    style: ReadingStyle
  ): Promise<string>;

  // Streaming variant: onDelta is called with each incremental chunk; resolves
  // with the full accumulated text. Falls back to non-streaming on failure.
  interpretReadingStream(
    question: string,
    spread: Spread,
    cards: { card: TarotCard; isReversed: boolean; positionName: string }[],
    style: ReadingStyle,
    onDelta: (chunk: string) => void
  ): Promise<string>;

  continueReading(
    history: ChatMessage[],
    style: ReadingStyle
  ): Promise<string>;

  // Streaming variant of continueReading.
  continueReadingStream(
    history: ChatMessage[],
    style: ReadingStyle,
    onDelta: (chunk: string) => void
  ): Promise<string>;
}
