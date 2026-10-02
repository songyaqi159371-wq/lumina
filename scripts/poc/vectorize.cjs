/**
 * 向量化脚本 - 将chunks转换为OpenAI embeddings
 *
 * 使用方法：
 * export OPENAI_API_KEY="your-key"
 * node scripts/poc/vectorize.cjs
 */

const fs = require('fs');
const path = require('path');

const CHUNKS_FILE = './data/vectors_poc/chunks.json';
const OUTPUT_FILE = './data/vectors_poc/vectors.json';
const METADATA_FILE = './data/vectors_poc/vectors_metadata.json';
const BATCH_SIZE = 100; // 每批处理100个
// 默认模型，可通过环境变量覆盖
const MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-ada-002'; // 1536维，兼容性最好

async function generateEmbeddings(texts, apiKey, baseURL) {
  const apiEndpoint = baseURL || 'https://api.openai.com/v1';
  const response = await fetch(`${apiEndpoint}/embeddings`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      input: texts,
      encoding_format: 'float',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API 错误: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.data.map(item => item.embedding);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  console.log('🚀 开始向量化处理\n');
  console.log('═══════════════════════════════════════');

  // 检查API Key
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('❌ 错误：未设置 OPENAI_API_KEY 环境变量');
    console.log('\n请设置API Key:');
    console.log('  export OPENAI_API_KEY="sk-your-key-here"');
    console.log('\n如果使用中转站，还需设置:');
    console.log('  export OPENAI_BASE_URL="https://your-proxy-url.com/v1"');
    process.exit(1);
  }

  // 检查是否使用自定义Base URL（中转站）
  const baseURL = process.env.OPENAI_BASE_URL;
  if (baseURL) {
    console.log(`🔄 使用自定义API地址: ${baseURL}`);
  } else {
    console.log(`🌐 使用官方API地址: https://api.openai.com/v1`);
  }

  // 读取chunks
  console.log('\n📖 读取chunks数据...');
  const chunks = JSON.parse(fs.readFileSync(CHUNKS_FILE, 'utf-8'));
  console.log(`✅ 读取成功：${chunks.length} 个chunks`);

  // 计算成本
  const totalChars = chunks.reduce((sum, c) => sum + c.text.length, 0);
  const estimatedTokens = Math.ceil(totalChars * 0.4);
  const estimatedCost = (estimatedTokens / 1_000_000) * 0.13;

  console.log('\n💰 成本估算:');
  console.log(`   总字符数: ${totalChars.toLocaleString()}`);
  console.log(`   预计tokens: ${estimatedTokens.toLocaleString()}`);
  console.log(`   预计成本: $${estimatedCost.toFixed(3)}`);
  console.log(`   模型: ${MODEL} (3072维)`);

  // 分批处理
  const batches = [];
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    batches.push(chunks.slice(i, i + BATCH_SIZE));
  }

  console.log(`\n📦 分批策略: ${batches.length} 个批次，每批 ${BATCH_SIZE} chunks`);
  console.log(`⏱️  预计时间: ${Math.ceil(batches.length * 2)} - ${Math.ceil(batches.length * 5)} 分钟\n`);

  // 确认继续
  console.log('准备开始处理，按 Ctrl+C 取消...');
  await sleep(3000);

  const vectors = [];
  let totalProcessed = 0;
  const startTime = Date.now();

  console.log('\n🧠 开始生成向量...\n');

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const batchNum = i + 1;

    console.log(`📦 批次 ${batchNum}/${batches.length} (${batch.length} chunks)...`);

    try {
      const texts = batch.map(c => c.text);
      const embeddings = await generateEmbeddings(texts, apiKey, baseURL);

      batch.forEach((chunk, idx) => {
        vectors.push({
          id: chunk.id,
          values: embeddings[idx],
          metadata: chunk.metadata,
        });
      });

      totalProcessed += batch.length;
      const progress = ((totalProcessed / chunks.length) * 100).toFixed(1);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

      console.log(`   ✅ 完成 ${totalProcessed}/${chunks.length} (${progress}%) - 用时 ${elapsed}s`);

      // 避免rate limit
      if (i < batches.length - 1) {
        console.log('   ⏳ 等待1秒...');
        await sleep(1000);
      }

    } catch (error) {
      console.error(`\n   ❌ 批次 ${batchNum} 失败:`, error.message);
      console.log('   🔄 等待3秒后重试...');
      await sleep(3000);

      // 重试一次
      try {
        const texts = batch.map(c => c.text);
        const embeddings = await generateEmbeddings(texts, apiKey, baseURL);

        batch.forEach((chunk, idx) => {
          vectors.push({
            id: chunk.id,
            values: embeddings[idx],
            metadata: chunk.metadata,
          });
        });

        totalProcessed += batch.length;
        console.log(`   ✅ 重试成功`);

      } catch (retryError) {
        console.error(`   ❌ 重试仍然失败:`, retryError.message);
        console.log('\n处理中断。已处理的数据将被保存。');
        break;
      }
    }
  }

  const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(2);

  console.log('\n═══════════════════════════════════════');
  console.log('✅ 向量生成完成！');
  console.log(`   处理数量: ${vectors.length}/${chunks.length}`);
  console.log(`   向量维度: ${vectors[0]?.values.length || 0}`);
  console.log(`   总耗时: ${totalTime} 分钟`);

  // 保存完整向量数据
  console.log('\n💾 保存向量数据...');
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(vectors, null, 2));
  console.log(`   ✅ 保存到: ${OUTPUT_FILE}`);

  // 保存元数据（不包含向量值，方便查看）
  console.log('\n💾 保存元数据...');
  const metadata = vectors.map(v => ({
    id: v.id,
    metadata: v.metadata,
    vectorDimension: v.values.length,
  }));
  fs.writeFileSync(METADATA_FILE, JSON.stringify(metadata, null, 2));
  console.log(`   ✅ 保存到: ${METADATA_FILE}`);

  // 生成统计报告
  const report = {
    timestamp: new Date().toISOString(),
    model: MODEL,
    processing: {
      totalChunks: chunks.length,
      processedChunks: vectors.length,
      successRate: ((vectors.length / chunks.length) * 100).toFixed(2) + '%',
      totalTimeMinutes: parseFloat(totalTime),
    },
    cost: {
      estimatedTokens: estimatedTokens,
      estimatedCost: estimatedCost.toFixed(3),
      actualCost: 'Check OpenAI dashboard for exact cost',
    },
    output: {
      vectorsFile: OUTPUT_FILE,
      metadataFile: METADATA_FILE,
      vectorDimension: vectors[0]?.values.length || 0,
    },
  };

  const reportPath = './data/vectors_poc/vectorization_report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 生成处理报告: ${reportPath}`);

  // 文件大小统计
  const vectorsSize = (fs.statSync(OUTPUT_FILE).size / 1024 / 1024).toFixed(2);
  const metadataSize = (fs.statSync(METADATA_FILE).size / 1024 / 1024).toFixed(2);

  console.log('\n📊 输出文件:');
  console.log(`   vectors.json:          ${vectorsSize} MB`);
  console.log(`   vectors_metadata.json: ${metadataSize} MB`);
  console.log(`   vectorization_report.json`);

  console.log('\n🎉 向量化处理全部完成！');
  console.log('\n💡 下一步:');
  console.log('   1. 查看 vectorization_report.json 了解详情');
  console.log('   2. 使用这些向量数据进行相似度检索测试');
  console.log('   3. 集成到 Lumina Tarot 占卜系统\n');
}

main().catch(error => {
  console.error('\n❌ 致命错误:', error);
  process.exit(1);
});
