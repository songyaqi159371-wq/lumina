/**
 * POC 主脚本 - JavaScript版本（避免TS模块问题）
 *
 * 使用方法：
 * export OPENAI_API_KEY="your-key"
 * node scripts/poc/process.js
 */

const { EPub } = require('epub2');
const { parse } = require('node-html-parser');
const fs = require('fs');
const path = require('path');

const EPUB_PATH = './Holistic Tarot An Integrative Approach to Using Tarot for Personal Growth (Benebell Wen) (z-library.sk, 1lib.sk, z-lib.sk).epub';
const OUTPUT_DIR = './data/vectors_poc';

// ========== EPUB Parser ==========
class EpubParser {
  async load(epubPath) {
    console.log(`📖 正在加载 EPUB: ${epubPath}`);

    return new Promise((resolve, reject) => {
      this.epub = new EPub(epubPath);

      this.epub.on('end', () => {
        console.log(`✅ EPUB 加载成功`);
        console.log(`   标题: ${this.epub.metadata.title}`);
        console.log(`   作者: ${this.epub.metadata.creator}`);
        resolve();
      });

      this.epub.on('error', (err) => {
        reject(err);
      });

      this.epub.parse();
    });
  }

  async extractChapters() {
    const chapters = [];
    console.log(`\n📚 开始提取章节...`);
    console.log(`   总章节数: ${this.epub.flow.length}`);

    for (let i = 0; i < this.epub.flow.length; i++) {
      const chapterId = this.epub.flow[i].id;

      try {
        const chapterRaw = await new Promise((resolve, reject) => {
          this.epub.getChapter(chapterId, (err, text) => {
            if (err) reject(err);
            else resolve(text);
          });
        });

        const root = parse(chapterRaw);
        const textContent = this.cleanText(root.text);

        const titleElement = root.querySelector('h1, h2, h3, title');
        const title = titleElement?.text?.trim() || `Chapter ${i + 1}`;

        if (textContent.length < 100) {
          console.log(`   ⏭️  跳过短章节: ${title} (${textContent.length}字)`);
          continue;
        }

        chapters.push({
          id: `ch_${i + 1}`,
          title: title,
          content: textContent,
          chapterNumber: i + 1,
        });

        console.log(`   ✅ 提取章节 ${i + 1}: ${title.substring(0, 50)}... (${textContent.length}字)`);
      } catch (error) {
        console.error(`   ❌ 提取章节 ${i + 1} 失败:`, error.message);
      }
    }

    console.log(`\n✅ 章节提取完成，共 ${chapters.length} 个有效章节\n`);
    return chapters;
  }

  cleanText(text) {
    return text
      .replace(/\s+/g, ' ')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();
  }
}

// ========== Chunk Builder ==========
class ChunkBuilder {
  constructor() {
    this.targetChunkSize = 600;
    this.minChunkSize = 400;
    this.maxChunkSize = 1000;
    this.overlapSize = 150;

    this.tarotCards = [
      '愚者', '魔术师', '女祭司', '皇后', '皇帝', '教皇', '恋人', '战车',
      '力量', '隐士', '命运之轮', '正义', '倒吊人', '死神', '节制', '恶魔',
      '高塔', '星星', '月亮', '太阳', '审判', '世界',
      'The Fool', 'The Magician', 'The High Priestess', 'The Empress',
      'The Emperor', 'The Hierophant', 'The Lovers', 'The Chariot',
      'Strength', 'The Hermit', 'Wheel of Fortune', 'Justice',
      'The Hanged Man', 'Death', 'Temperance', 'The Devil',
      'The Tower', 'The Star', 'The Moon', 'The Sun',
      'Judgement', 'The World', 'Wands', 'Cups', 'Swords', 'Pentacles'
    ];
  }

  buildChunks(chapters) {
    const allChunks = [];
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

  chunkChapter(chapter, startId) {
    const chunks = [];
    const paragraphs = chapter.content.split(/\n\n+/);
    let currentChunk = '';
    let chunkIndex = 0;

    for (const paragraph of paragraphs) {
      const trimmed = paragraph.trim();
      if (!trimmed) continue;

      if (currentChunk.length + trimmed.length > this.maxChunkSize && currentChunk.length >= this.minChunkSize) {
        chunks.push(this.createChunk(`chunk_${startId + chunkIndex}`, currentChunk, chapter, chunkIndex));

        const words = currentChunk.split(/\s+/);
        const overlapWords = words.slice(-Math.floor(this.overlapSize / 5));
        currentChunk = overlapWords.join(' ') + ' ';
        chunkIndex++;
      }

      currentChunk += trimmed + '\n\n';

      if (currentChunk.length >= this.targetChunkSize) {
        chunks.push(this.createChunk(`chunk_${startId + chunkIndex}`, currentChunk, chapter, chunkIndex));

        const words = currentChunk.split(/\s+/);
        const overlapWords = words.slice(-Math.floor(this.overlapSize / 5));
        currentChunk = overlapWords.join(' ') + ' ';
        chunkIndex++;
      }
    }

    if (currentChunk.trim().length >= this.minChunkSize) {
      chunks.push(this.createChunk(`chunk_${startId + chunkIndex}`, currentChunk, chapter, chunkIndex));
    }

    return chunks;
  }

  createChunk(id, text, chapter, index) {
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

  detectLayer(chapterTitle, content) {
    const title = chapterTitle.toLowerCase();
    if (title.includes('spread') || title.includes('牌阵') || title.includes('reading')) return 'practical';
    if (title.includes('case') || title.includes('案例') || title.includes('example')) return 'practical';
    if (title.includes('symbol') || title.includes('imagery') || title.includes('符号')) return 'symbol';
    if (title.includes('psychology') || title.includes('心理')) return 'psychological';
    return 'psychological';
  }

  detectTopic(chapterTitle, content) {
    const title = chapterTitle.toLowerCase();
    if (title.includes('spread')) return 'spreads';
    if (title.includes('case') || title.includes('example')) return 'case_study';
    if (title.includes('major arcana')) return 'major_arcana';
    if (title.includes('minor arcana') || title.includes('suit')) return 'minor_arcana';
    if (title.includes('court card')) return 'court_cards';
    return 'interpretation';
  }

  detectCardName(text) {
    for (const card of this.tarotCards) {
      if (text.includes(card)) return card;
    }
    return undefined;
  }

  detectLanguage(text) {
    const chineseChars = text.match(/[一-龥]/g);
    const chineseRatio = chineseChars ? chineseChars.length / text.length : 0;
    return chineseRatio > 0.3 ? 'zh' : 'en';
  }

  printStatistics(chunks) {
    const sizes = chunks.map(c => c.text.length);
    const avgSize = sizes.reduce((a, b) => a + b, 0) / sizes.length;
    const minSize = Math.min(...sizes);
    const maxSize = Math.max(...sizes);

    const topics = chunks.reduce((acc, c) => {
      acc[c.metadata.topic] = (acc[c.metadata.topic] || 0) + 1;
      return acc;
    }, {});

    const layers = chunks.reduce((acc, c) => {
      acc[c.metadata.layer] = (acc[c.metadata.layer] || 0) + 1;
      return acc;
    }, {});

    console.log(`\n📊 分块统计:`);
    console.log(`   平均大小: ${Math.round(avgSize)} 字符`);
    console.log(`   大小范围: ${minSize} - ${maxSize} 字符`);
    console.log(`   主题分布:`, topics);
    console.log(`   层次分布:`, layers);
  }
}

// ========== Main Function ==========
async function main() {
  console.log('🚀 Lumina Tarot - 知识库向量化 POC');
  console.log('📖 目标书籍: Holistic Tarot by Benebell Wen\n');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  try {
    // Step 1: 解析EPUB
    console.log('═══════════════════════════════════════');
    console.log('Step 1: 解析 EPUB 文件');
    console.log('═══════════════════════════════════════');

    const parser = new EpubParser();
    await parser.load(EPUB_PATH);
    const chapters = await parser.extractChapters();

    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'chapters.json'),
      JSON.stringify(chapters, null, 2)
    );
    console.log(`💾 章节数据已保存到: ${OUTPUT_DIR}/chapters.json`);

    // Step 2: 智能分块
    console.log('\n═══════════════════════════════════════');
    console.log('Step 2: 智能分块');
    console.log('═══════════════════════════════════════');

    const chunkBuilder = new ChunkBuilder();
    const chunks = chunkBuilder.buildChunks(chapters);

    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'chunks.json'),
      JSON.stringify(chunks, null, 2)
    );
    console.log(`💾 分块数据已保存到: ${OUTPUT_DIR}/chunks.json`);

    // 生成摘要报告
    const report = {
      timestamp: new Date().toISOString(),
      book: 'Holistic Tarot',
      author: 'Benebell Wen',
      processing: {
        chapters: chapters.length,
        chunks: chunks.length,
        totalCharacters: chunks.reduce((s, c) => s + c.text.length, 0),
        avgChunkSize: Math.round(chunks.reduce((s, c) => s + c.text.length, 0) / chunks.length),
      },
      sampleChunks: chunks.slice(0, 3).map(c => ({
        id: c.id,
        preview: c.text.substring(0, 200) + '...',
        metadata: c.metadata,
      })),
    };

    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'processing_report.json'),
      JSON.stringify(report, null, 2)
    );

    console.log('\n\n✅ POC 处理完成！');
    console.log(`📁 输出目录: ${OUTPUT_DIR}`);
    console.log(`📄 生成文件:`);
    console.log(`   - chapters.json (${chapters.length} 章节)`);
    console.log(`   - chunks.json (${chunks.length} 块)`);
    console.log(`   - processing_report.json (处理报告)`);
    console.log(`\n💡 下一步: 查看生成的文件，确认分块质量`);
    console.log(`   如果满意，可以设置 OPENAI_API_KEY 并运行向量化`);

  } catch (error) {
    console.error('\n❌ 处理失败:', error);
    process.exit(1);
  }
}

main();
