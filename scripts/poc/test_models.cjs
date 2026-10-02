/**
 * 测试中转站支持的模型
 */

const apiKey = process.env.OPENAI_API_KEY;
const baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

async function testModels() {
  console.log('🔍 测试中转站支持的embedding模型\n');
  console.log('API地址:', baseURL);
  console.log('API Key:', apiKey ? apiKey.substring(0, 10) + '...' : '未设置');
  console.log('');

  const modelsToTest = [
    'text-embedding-3-large',
    'text-embedding-3-small',
    'text-embedding-ada-002',
    'embedding-ada-002',
    'text-embedding-v1',
    'embeddings',
  ];

  const testText = 'Hello, world!';

  for (const model of modelsToTest) {
    console.log(`测试模型: ${model}...`);

    try {
      const response = await fetch(`${baseURL}/embeddings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          input: testText,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const dimension = data.data[0].embedding.length;
        console.log(`   ✅ 支持！向量维度: ${dimension}\n`);
      } else {
        const error = await response.text();
        console.log(`   ❌ 不支持: ${response.status}\n`);
      }

    } catch (error) {
      console.log(`   ❌ 请求失败: ${error.message}\n`);
    }

    // 延迟避免rate limit
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\n💡 建议:');
  console.log('1. 联系你的中转站服务商，询问支持的embedding模型');
  console.log('2. 或者使用官方OpenAI API');
  console.log('3. 或者使用本地embedding模型（如sentence-transformers）');
}

if (!apiKey) {
  console.error('❌ 请先设置 OPENAI_API_KEY');
  process.exit(1);
}

testModels();
