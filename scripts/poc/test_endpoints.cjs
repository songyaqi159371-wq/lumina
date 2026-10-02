/**
 * 测试中转站是否支持不同的API端点
 */

const apiKey = process.env.OPENAI_API_KEY;
const baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

async function testEndpoints() {
  console.log('🔍 测试中转站API端点\n');
  console.log('API地址:', baseURL);
  console.log('');

  // 测试1: Chat Completion (聊天)
  console.log('1️⃣ 测试 Chat Completion API (聊天)...');
  try {
    const response = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 5,
      }),
    });

    if (response.ok) {
      console.log('   ✅ Chat API 工作正常！\n');
    } else {
      const error = await response.text();
      console.log(`   ❌ 失败: ${response.status}\n`);
    }
  } catch (error) {
    console.log(`   ❌ 请求失败: ${error.message}\n`);
  }

  // 测试2: Embeddings (向量化)
  console.log('2️⃣ 测试 Embeddings API (向量化)...');
  try {
    const response = await fetch(`${baseURL}/embeddings`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-ada-002',
        input: 'Hello',
      }),
    });

    if (response.ok) {
      console.log('   ✅ Embeddings API 工作正常！\n');
    } else {
      const error = await response.text();
      console.log(`   ❌ 失败: ${response.status}`);
      console.log(`   错误: ${error.substring(0, 200)}\n`);
    }
  } catch (error) {
    console.log(`   ❌ 请求失败: ${error.message}\n`);
  }

  // 测试3: Models列表
  console.log('3️⃣ 测试 Models API (模型列表)...');
  try {
    const response = await fetch(`${baseURL}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ Models API 工作正常！');

      // 检查是否有embedding模型
      const embeddingModels = data.data.filter(m =>
        m.id.includes('embedding') || m.id.includes('embed')
      );

      if (embeddingModels.length > 0) {
        console.log('   📋 支持的embedding模型:');
        embeddingModels.forEach(m => {
          console.log(`      - ${m.id}`);
        });
      } else {
        console.log('   ⚠️  没有找到embedding模型');
      }
      console.log('');
    } else {
      console.log(`   ❌ 失败: ${response.status}\n`);
    }
  } catch (error) {
    console.log(`   ❌ 请求失败: ${error.message}\n`);
  }

  console.log('═══════════════════════════════════════\n');
  console.log('📊 结论:');
  console.log('如果Chat API正常但Embeddings API失败，');
  console.log('说明你的中转站只支持聊天功能，不支持向量化。\n');
  console.log('💡 解决方案:');
  console.log('1. 换一个支持embeddings的中转站');
  console.log('2. 使用官方OpenAI API (仅$0.05)');
  console.log('3. 使用免费的本地方案（后续我可以帮你配置）');
}

if (!apiKey) {
  console.error('❌ 请先设置 OPENAI_API_KEY');
  process.exit(1);
}

testEndpoints();
