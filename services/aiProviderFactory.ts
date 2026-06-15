import { AIModel } from '../types';
import { AIProvider } from './aiProvider';
import { ProxyProvider } from './proxyProvider';

export function getAIProvider(model: AIModel): AIProvider {
  switch (model) {
    case AIModel.DeepSeek:
      return new ProxyProvider('deepseek');
    case AIModel.Gemini:
    default:
      return new ProxyProvider('gemini');
  }
}
