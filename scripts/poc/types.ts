/**
 * POC测试 - 数据类型定义
 */

export interface BookChapter {
  id: string;
  title: string;
  content: string;
  chapterNumber?: number;
}

export interface Chunk {
  id: string;
  text: string;
  metadata: ChunkMetadata;
}

export interface ChunkMetadata {
  book: 'holistic_tarot';
  layer: 'symbol' | 'traditional' | 'psychological' | 'practical';
  chapter: string;
  chapterNumber?: number;
  cardName?: string;        // 如果提到特定塔罗牌
  topic: string;            // 主题：牌义/牌阵/案例/技巧/理论
  pageEstimate?: number;    // 估算的页码
  wordCount: number;
  language: 'zh' | 'en';
}

export interface VectorRecord {
  id: string;
  values: number[];         // embedding向量
  metadata: ChunkMetadata;
}

export interface ProcessingStats {
  totalChapters: number;
  totalChunks: number;
  totalWords: number;
  avgChunkSize: number;
  topicDistribution: Record<string, number>;
  layerDistribution: Record<string, number>;
}
