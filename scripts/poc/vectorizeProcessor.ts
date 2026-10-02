/**
 * 向量化处理器 - 调用OpenAI API生成embeddings
 */
import { Chunk, VectorRecord } from './types';

export class VectorizeProcessor {
  private apiKey: string;
  private readonly model = 'text-embedding-3-large'; // 3072维
  private readonly batchSize = 100; // 每批处理100个chunk

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('❌ 需要提供 OpenAI API Key');
    }
    this.apiKey = apiKey;
  }

  async generateEmbeddings(chunks: Chunk[]): Promise<VectorRecord[]> {
    console.log(`\n🧠 开始生成向量 (使用 ${this.model})...`);
    console.log(`   总chunks: ${chunks.length}`);
    console.log(`   批次大小: ${this.batchSize}`);

    const vectors: VectorRecord[] = [];
    const batches = this.createBatches(chunks, this.batchSize);

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`\n   📦 处理批次 ${i + 1}/${batches.length} (${batch.length} chunks)...`);

      try {
        const embeddings = await this.callOpenAI(batch.map(c => c.text));

        batch.forEach((chunk, idx) => {
          vectors.push({
            id: chunk.id,
            values: embeddings[idx],
            metadata: chunk.metadata,
          });
        });

        console.log(`   ✅ 批次 ${i + 1} 完成`);

        // 避免rate limit，批次之间延迟
        if (i < batches.length - 1) {
          await this.sleep(1000); // 延迟1秒
        }

      } catch (error) {
        console.error(`   ❌ 批次 ${i + 1} 失败:`, error);
        throw error;
      }
    }

    console.log(`\n✅ 向量生成完成，共 ${vectors.length} 个向量`);
    return vectors;
  }

  private async callOpenAI(texts: string[]): Promise<number[][]> {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.model,
        input: texts,
        encoding_format: 'float',
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API 错误: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.data.map((item: any) => item.embedding);
  }

  private createBatches<T>(items: T[], batchSize: number): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 估算成本
  estimateCost(chunks: Chunk[]): { tokens: number; cost: number } {
    // 估算：1个字符 ≈ 0.25 tokens (对于英文)
    const totalChars = chunks.reduce((sum, c) => sum + c.text.length, 0);
    const estimatedTokens = Math.ceil(totalChars * 0.4); // 保守估计

    // text-embedding-3-large 价格: $0.13 per 1M tokens
    const cost = (estimatedTokens / 1_000_000) * 0.13;

    return {
      tokens: estimatedTokens,
      cost: Math.round(cost * 100) / 100, // 保留2位小数
    };
  }
}
