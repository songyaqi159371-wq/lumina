/**
 * POC 主脚本 - 处理《Holistic Tarot》
 *
 * 使用方法：
 * 1. 设置环境变量: export OPENAI_API_KEY="your-key"
 * 2. 运行: npx tsx scripts/poc/main.ts
 */
import * as fs from 'fs';
import * as path from 'path';
import { EpubParser } from './epubParser';
import { ChunkBuilder } from './chunkBuilder';
import { VectorizeProcessor } from './vectorizeProcessor';
import { Chunk, VectorRecord } from './types';

const EPUB_PATH = './Holistic Tarot An Integrative Approach to Using Tarot for Personal Growth (Benebell Wen) (z-library.sk, 1lib.sk, z-lib.sk).epub';
const OUTPUT_DIR = './data/vectors_poc';

async function main() {
  console.log('🚀 Lumina Tarot - 知识库向量化 POC');
  console.log('📖 目标书籍: Holistic Tarot by Benebell Wen\n');

  // 确保输出目录存在
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

    // 保存章节列表
    saveJSON(path.join(OUTPUT_DIR, 'chapters.json'), chapters);
    console.log(`💾 章节数据已保存到: ${OUTPUT_DIR}/chapters.json`);

    // Step 2: 智能分块
    console.log('\n═══════════════════════════════════════');
    console.log('Step 2: 智能分块');
    console.log('═══════════════════════════════════════');

    const chunkBuilder = new ChunkBuilder();
    const chunks = chunkBuilder.buildChunks(chapters);

    // 保存chunks
    saveJSON(path.join(OUTPUT_DIR, 'chunks.json'), chunks);
    console.log(`💾 分块数据已保存到: ${OUTPUT_DIR}/chunks.json`);

    // Step 3: 生成向量 (需要API Key)
    console.log('\n═══════════════════════════════════════');
    console.log('Step 3: 生成向量embeddings');
    console.log('═══════════════════════════════════════');

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.log('⚠️  未检测到 OPENAI_API_KEY 环境变量');
      console.log('   跳过向量生成步骤');
      console.log('\n如需生成向量，请设置 API Key:');
      console.log('   export OPENAI_API_KEY="your-key"');
      console.log('   然后重新运行此脚本\n');

      printSummary(chapters, chunks, null);
      return;
    }

    const vectorizer = new VectorizeProcessor(apiKey);

    // 估算成本
    const estimate = vectorizer.estimateCost(chunks);
    console.log(`\n💰 成本估算:`);
    console.log(`   预计tokens: ${estimate.tokens.toLocaleString()}`);
    console.log(`   预计成本: $${estimate.cost}`);

    // 询问确认
    console.log('\n⏸️  按 Enter 继续，或 Ctrl+C 取消...');
    await waitForEnter();

    const vectors = await vectorizer.generateEmbeddings(chunks);

    // 保存向量数据
    saveJSON(path.join(OUTPUT_DIR, 'vectors.json'), vectors);
    console.log(`💾 向量数据已保存到: ${OUTPUT_DIR}/vectors.json`);

    // 保存元数据（不包含向量值，方便查看）
    const metadataOnly = vectors.map(v => ({
      id: v.id,
      metadata: v.metadata,
      vectorDimension: v.values.length,
    }));
    saveJSON(path.join(OUTPUT_DIR, 'vectors_metadata.json'), metadataOnly);

    // Step 4: 生成报告
    console.log('\n═══════════════════════════════════════');
    console.log('Step 4: 生成处理报告');
    console.log('═══════════════════════════════════════');

    printSummary(chapters, chunks, vectors);
    generateReport(chapters, chunks, vectors);

  } catch (error) {
    console.error('\n❌ 处理失败:', error);
    process.exit(1);
  }
}

function saveJSON(filepath: string, data: any): void {
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
}

function printSummary(chapters: any[], chunks: Chunk[], vectors: VectorRecord[] | null): void {
  console.log('\n\n📊 处理摘要');
  console.log('═══════════════════════════════════════');
  console.log(`📖 提取章节:     ${chapters.length} 个`);
  console.log(`🔪 生成chunks:    ${chunks.length} 个`);
  console.log(`📝 总字符数:     ${chunks.reduce((s, c) => s + c.text.length, 0).toLocaleString()} 字符`);

  if (vectors) {
    console.log(`🧠 生成向量:     ${vectors.length} 个`);
    console.log(`📐 向量维度:     ${vectors[0]?.values.length || 0}`);
  }

  console.log('\n🏷️  主题分布:');
  const topics = chunks.reduce((acc, c) => {
    acc[c.metadata.topic] = (acc[c.metadata.topic] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  Object.entries(topics)
    .sort((a, b) => b[1] - a[1])
    .forEach(([topic, count]) => {
      const percentage = ((count / chunks.length) * 100).toFixed(1);
      console.log(`   ${topic.padEnd(20)} ${count.toString().padStart(4)} (${percentage}%)`);
    });

  console.log('\n📚 层次分布:');
  const layers = chunks.reduce((acc, c) => {
    acc[c.metadata.layer] = (acc[c.metadata.layer] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  Object.entries(layers)
    .sort((a, b) => b[1] - a[1])
    .forEach(([layer, count]) => {
      const percentage = ((count / chunks.length) * 100).toFixed(1);
      console.log(`   ${layer.padEnd(20)} ${count.toString().padStart(4)} (${percentage}%)`);
    });
}

function generateReport(chapters: any[], chunks: Chunk[], vectors: VectorRecord[] | null): void {
  const report = {
    timestamp: new Date().toISOString(),
    book: 'Holistic Tarot',
    author: 'Benebell Wen',
    processing: {
      chapters: chapters.length,
      chunks: chunks.length,
      totalCharacters: chunks.reduce((s, c) => s + c.text.length, 0),
      avgChunkSize: Math.round(chunks.reduce((s, c) => s + c.text.length, 0) / chunks.length),
      vectors: vectors?.length || 0,
    },
    distribution: {
      topics: chunks.reduce((acc, c) => {
        acc[c.metadata.topic] = (acc[c.metadata.topic] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      layers: chunks.reduce((acc, c) => {
        acc[c.metadata.layer] = (acc[c.metadata.layer] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    },
    sampleChunks: chunks.slice(0, 5).map(c => ({
      id: c.id,
      preview: c.text.substring(0, 200) + '...',
      metadata: c.metadata,
    })),
  };

  const reportPath = path.join(OUTPUT_DIR, 'processing_report.json');
  saveJSON(reportPath, report);
  console.log(`\n📄 详细报告已保存到: ${reportPath}`);
}

function waitForEnter(): Promise<void> {
  return new Promise((resolve) => {
    process.stdin.once('data', () => resolve());
  });
}

// 运行主函数
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
