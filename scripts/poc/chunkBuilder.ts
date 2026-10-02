/**
 * 智能分块器 - 将章节内容切分成适合向量化的块
 */
import { BookChapter, Chunk, ChunkMetadata } from './types';

export class ChunkBuilder {
  private readonly targetChunkSize = 600;      // 目标块大小（字符）
  private readonly minChunkSize = 400;         // 最小块大小
  private readonly maxChunkSize = 1000;        // 最大块大小
  private readonly overlapSize = 150;          // 重叠大小

  // 塔罗牌名称列表（用于识别）
  private readonly tarotCards = [
    '愚者', '魔术师', '女祭司', '皇后', '皇帝', '教皇', '恋人', '战车',
    '力量', '隐士', '命运之轮', '正义', '倒吊人', '死神', '节制', '恶魔',
    '高塔', '星星', '月亮', '太阳', '审判', '世界',
    '权杖', '圣杯', '宝剑', '钱币', '星币',
    'The Fool', 'The Magician', 'The High Priestess', 'The Empress',
    'The Emperor', 'The Hierophant', 'The Lovers', 'The Chariot',
    'Strength', 'The Hermit', 'Wheel of Fortune', 'Justice',
    'The Hanged Man', 'Death', 'Temperance', 'The Devil',
    'The Tower', 'The Star', 'The Moon', 'The Sun',
    'Judgement', 'The World',
    'Wands', 'Cups', 'Swords', 'Pentacles', 'Coins'
  ];

  buildChunks(chapters: BookChapter[]): Chunk[] {
    const allChunks: Chunk[] = [];
    let globalChunkId = 0;

    console.log(`\n🔪 开始智能分块...`);

    for (const chapter of chapters) {
      const chapterChunks = this.chunkChapter(chapter, globalChunkId);
      allChunks.push(...chapterChunks);
      globalChunkId += chapterChunks.length;

      console.log(`   📄 ${chapter.title}: ${chapterChunks.length} 块`);
    }

    console.log(`\n✅ 分块完成，共 ${allChunks.length} 块`);
    this.printStatistics(allChunks);

    return allChunks;
  }

  private chunkChapter(chapter: BookChapter, startId: number): Chunk[] {
    const chunks: Chunk[] = [];
    const paragraphs = chapter.content.split(/\n\n+/);

    let currentChunk = '';
    let chunkIndex = 0;

    for (const paragraph of paragraphs) {
      const trimmed = paragraph.trim();
      if (!trimmed) continue;

      // 如果加上这段会超出最大大小，先保存当前块
      if (currentChunk.length + trimmed.length > this.maxChunkSize && currentChunk.length >= this.minChunkSize) {
        chunks.push(this.createChunk(
          `chunk_${startId + chunkIndex}`,
          currentChunk,
          chapter,
          chunkIndex
        ));

        // 保留重叠
        const words = currentChunk.split(/\s+/);
        const overlapWords = words.slice(-Math.floor(this.overlapSize / 5));
        currentChunk = overlapWords.join(' ') + ' ';
        chunkIndex++;
      }

      currentChunk += trimmed + '\n\n';

      // 如果达到目标大小，保存块
      if (currentChunk.length >= this.targetChunkSize) {
        chunks.push(this.createChunk(
          `chunk_${startId + chunkIndex}`,
          currentChunk,
          chapter,
          chunkIndex
        ));

        // 保留重叠
        const words = currentChunk.split(/\s+/);
        const overlapWords = words.slice(-Math.floor(this.overlapSize / 5));
        currentChunk = overlapWords.join(' ') + ' ';
        chunkIndex++;
      }
    }

    // 保存剩余内容
    if (currentChunk.trim().length >= this.minChunkSize) {
      chunks.push(this.createChunk(
        `chunk_${startId + chunkIndex}`,
        currentChunk,
        chapter,
        chunkIndex
      ));
    }

    return chunks;
  }

  private createChunk(id: string, text: string, chapter: BookChapter, index: number): Chunk {
    const cleanText = text.trim();

    return {
      id,
      text: cleanText,
      metadata: {
        book: 'holistic_tarot',
        layer: this.detectLayer(chapter.title, cleanText),
        chapter: chapter.title,
        chapterNumber: chapter.chapterNumber,
        cardName: this.detectCardName(cleanText),
        topic: this.detectTopic(chapter.title, cleanText),
        pageEstimate: chapter.chapterNumber ? chapter.chapterNumber * 10 + index * 2 : undefined,
        wordCount: cleanText.length,
        language: this.detectLanguage(cleanText),
      },
    };
  }

  private detectLayer(chapterTitle: string, content: string): ChunkMetadata['layer'] {
    const title = chapterTitle.toLowerCase();
    const text = content.toLowerCase();

    // Holistic Tarot 主要是实用+心理学导向
    if (title.includes('spread') || title.includes('牌阵') || title.includes('reading')) {
      return 'practical';
    }
    if (title.includes('case') || title.includes('案例') || title.includes('example')) {
      return 'practical';
    }
    if (title.includes('symbol') || title.includes('imagery') || title.includes('符号')) {
      return 'symbol';
    }
    if (title.includes('psychology') || title.includes('心理')) {
      return 'psychological';
    }

    // 根据内容判断
    if (text.includes('spread') || text.includes('layout') || text.includes('position')) {
      return 'practical';
    }

    return 'psychological'; // Holistic Tarot 默认偏心理学
  }

  private detectTopic(chapterTitle: string, content: string): string {
    const title = chapterTitle.toLowerCase();
    const text = content.toLowerCase().substring(0, 500);

    if (title.includes('spread') || text.includes('card position')) return 'spreads';
    if (title.includes('case') || title.includes('example')) return 'case_study';
    if (title.includes('major arcana')) return 'major_arcana';
    if (title.includes('minor arcana') || title.includes('suit')) return 'minor_arcana';
    if (title.includes('court card')) return 'court_cards';
    if (title.includes('symbol')) return 'symbolism';
    if (title.includes('reading') || title.includes('interpretation')) return 'interpretation';
    if (title.includes('ethic')) return 'ethics';
    if (title.includes('history')) return 'history';

    return 'interpretation'; // 默认主题
  }

  private detectCardName(text: string): string | undefined {
    for (const card of this.tarotCards) {
      if (text.includes(card)) {
        return card;
      }
    }
    return undefined;
  }

  private detectLanguage(text: string): 'zh' | 'en' {
    // 简单的语言检测：统计中文字符比例
    const chineseChars = text.match(/[一-龥]/g);
    const chineseRatio = chineseChars ? chineseChars.length / text.length : 0;
    return chineseRatio > 0.3 ? 'zh' : 'en';
  }

  private printStatistics(chunks: Chunk[]): void {
    const sizes = chunks.map(c => c.text.length);
    const avgSize = sizes.reduce((a, b) => a + b, 0) / sizes.length;
    const minSize = Math.min(...sizes);
    const maxSize = Math.max(...sizes);

    const topics = chunks.reduce((acc, c) => {
      acc[c.metadata.topic] = (acc[c.metadata.topic] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const layers = chunks.reduce((acc, c) => {
      acc[c.metadata.layer] = (acc[c.metadata.layer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log(`\n📊 分块统计:`);
    console.log(`   平均大小: ${Math.round(avgSize)} 字符`);
    console.log(`   大小范围: ${minSize} - ${maxSize} 字符`);
    console.log(`   主题分布:`, topics);
    console.log(`   层次分布:`, layers);
  }
}
