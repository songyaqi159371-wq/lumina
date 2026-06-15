import { AIModel } from '../types';
import { AIProvider } from './aiProvider';
import { ProxyProvider } from './proxyProvider';

// AIModel 枚举值即代理层识别的 model 标识，直接透传
export function getAIProvider(model: AIModel): AIProvider {
  switch (model) {
    case AIModel.DeepSeek:
    case AIModel.Kimi:
    case AIModel.Qwen:
    case AIModel.Doubao:
    case AIModel.Claude:
    case AIModel.OpenAI:
      return new ProxyProvider(model);
    case AIModel.Gemini:
    default:
      return new ProxyProvider('gemini');
  }
}
