# 🚀 向量化脚本使用指南

## 📋 前置要求

### 1. 获取 OpenAI API Key

如果你还没有 OpenAI API Key：

1. 访问 https://platform.openai.com/api-keys
2. 登录你的 OpenAI 账号
3. 点击 "Create new secret key"
4. 复制生成的 key（格式：sk-...）

---

## 🎯 快速开始

### Step 1: 设置 API Key

**Windows (PowerShell):**
```powershell
$env:OPENAI_API_KEY="sk-your-actual-key-here"
```

**Windows (CMD):**
```cmd
set OPENAI_API_KEY=sk-your-actual-key-here
```

**Linux/Mac:**
```bash
export OPENAI_API_KEY="sk-your-actual-key-here"
```

### Step 2: 运行向量化脚本

```bash
node scripts/poc/vectorize.cjs
```

---

## ⏱️ 预期结果

### 处理时间
- **预计时长**: 5-10 分钟
- **批次数量**: 4 批次（每批100个chunks）
- **总chunks**: 371 个

### 成本
- **预计tokens**: ~500,000
- **预计成本**: **$0.065** (约 0.44 元人民币)
- **模型**: text-embedding-3-large (3072维)

### 输出文件
```
data/vectors_poc/
  ├── vectors.json              (向量数据，~40MB)
  ├── vectors_metadata.json     (元数据，方便查看)
  └── vectorization_report.json (处理报告)
```

---

## 📊 处理过程预览

```
🚀 开始向量化处理
═══════════════════════════════════════

📖 读取chunks数据...
✅ 读取成功：371 个chunks

💰 成本估算:
   总字符数: 1,257,746
   预计tokens: 503,098
   预计成本: $0.065
   模型: text-embedding-3-large (3072维)

📦 分批策略: 4 个批次，每批 100 chunks
⏱️  预计时间: 8 - 20 分钟

准备开始处理，按 Ctrl+C 取消...

🧠 开始生成向量...

📦 批次 1/4 (100 chunks)...
   ✅ 完成 100/371 (27.0%) - 用时 12.3s
   ⏳ 等待1秒...

📦 批次 2/4 (100 chunks)...
   ✅ 完成 200/371 (53.9%) - 用时 25.1s
   ⏳ 等待1秒...

📦 批次 3/4 (100 chunks)...
   ✅ 完成 300/371 (80.9%) - 用时 38.6s
   ⏳ 等待1秒...

📦 批次 4/4 (71 chunks)...
   ✅ 完成 371/371 (100.0%) - 用时 49.2s

═══════════════════════════════════════
✅ 向量生成完成！
   处理数量: 371/371
   向量维度: 3072
   总耗时: 0.82 分钟

💾 保存向量数据...
   ✅ 保存到: ./data/vectors_poc/vectors.json

💾 保存元数据...
   ✅ 保存到: ./data/vectors_poc/vectors_metadata.json

📄 生成处理报告: ./data/vectors_poc/vectorization_report.json

📊 输出文件:
   vectors.json:          42.15 MB
   vectors_metadata.json: 0.18 MB
   vectorization_report.json

🎉 向量化处理全部完成！
```

---

## 🔧 故障排除

### 问题 1: API Key 错误
```
❌ OpenAI API 错误: 401 - Incorrect API key
```
**解决**: 检查 API Key 是否正确复制，确保没有多余空格

### 问题 2: Rate Limit
```
❌ OpenAI API 错误: 429 - Rate limit exceeded
```
**解决**: 脚本会自动重试，如果持续失败，等待几分钟后重新运行

### 问题 3: 余额不足
```
❌ OpenAI API 错误: 429 - You exceeded your current quota
```
**解决**: 到 OpenAI 账户充值

### 问题 4: 网络问题
```
❌ 批次 2 失败: fetch failed
```
**解决**: 脚本会自动重试一次，如果仍失败，检查网络连接

---

## 📝 注意事项

1. **API Key 安全**: 
   - 不要将 API Key 提交到 git
   - 使用环境变量而非硬编码

2. **成本控制**:
   - 此次处理成本很低（$0.065）
   - 可以先在 OpenAI dashboard 检查账户余额

3. **处理时间**:
   - 取决于网络速度和 OpenAI API 响应时间
   - 正常情况 5-10 分钟完成

4. **中断恢复**:
   - 如果中途失败，已处理的数据会保存
   - 可以修改脚本跳过已处理的部分

---

## ✅ 完成后的检查

### 1. 验证文件生成
```bash
ls -lh data/vectors_poc/vectors*.json
```

应该看到:
- `vectors.json` (~40MB)
- `vectors_metadata.json` (~180KB)
- `vectorization_report.json`

### 2. 查看处理报告
```bash
cat data/vectors_poc/vectorization_report.json
```

### 3. 检查向量维度
```bash
node -e "const v = require('./data/vectors_poc/vectors.json'); console.log('向量数量:', v.length); console.log('向量维度:', v[0].values.length);"
```

应该输出:
```
向量数量: 371
向量维度: 3072
```

---

## 🎉 成功后的下一步

1. **查看成本**: 到 OpenAI dashboard 确认实际花费
2. **测试检索**: 使用向量进行相似度搜索测试
3. **集成系统**: 将向量数据集成到 Lumina Tarot 占卜流程

---

**准备好了吗？** 设置你的 API Key 并运行脚本！🚀

```bash
# 设置 API Key (替换为你的真实key)
export OPENAI_API_KEY="sk-your-actual-key-here"

# 运行向量化
node scripts/poc/vectorize.cjs
```
