import { AIModel } from '../types';
import { AIProvider } from './aiProvider';
import { GeminiProvider } from './geminiService';

export function getAIProvider(model: AIModel): AIProvider {
  switch (model) {
    case AIModel.Gemini:
    default:
      return new GeminiProvider();
  }
}
