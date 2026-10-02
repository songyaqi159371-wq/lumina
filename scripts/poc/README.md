# POC 测试 - 知识库向量化

## 📋 概述

这个 POC 测试将《Holistic Tarot》书籍处理成向量化知识库。

## 🚀 使用步骤

### 1. 准备 OpenAI API Key

```bash
# Windows (PowerShell)
$env:OPENAI_API_KEY="sk-your-api-key-here"

# Windows (CMD)
set OPENAI_API_KEY=sk-your-api-key-here

# Linux/Mac
export OPENAI_API_KEY="sk-your-api-key-here"
```

### 2. 运行处理脚本

```bash
npx ts-node scripts/poc/main.ts
```

### 3. 查看结果

处理完成后，会在 `data/vectors_poc/` 目录生成以下文件：

- `chapters.json` - 提取的章节数据
- `chunks.json` - 分块后的内容
- `vectors.json` - 生成的向量数据（包含embedding）
- `vectors_metadata.json` - 向量元数据（不包含embedding值，方便查看）
- `processing_report.json` - 处理报告

## 📊 处理流程

```
EPUB文件 → 解析章节 → 智能分块 → 生成向量 → 保存数据
```

### Step 1: 解析 EPUB
- 提取所有章节内容
- 清理 HTML 标签
- 过滤无效章节

### Step 2: 智能分块
- 目标块大小：600字符
- 块大小范围：400-1000字符
- 相邻块重叠：150字符
- 自动检测：层次、主题、塔罗牌名称

### Step 3: 生成向量
- 模型：text-embedding-3-large (3072维)
- 批处理：100 chunks/batch
- 自动重试和延迟（避免 rate limit）

## 💰 成本估算

假设《Holistic Tarot》约 200,000 字：

- 预计 chunks：~350 个
- 预计 tokens：~120,000
- 预计成本：**$0.02 - $0.05**

## ⚙️ 配置说明

### 分块参数

在 `chunkBuilder.ts` 中可调整：

```typescript
targetChunkSize = 600;   // 目标块大小
minChunkSize = 400;      // 最小块大小
maxChunkSize = 1000;     // 最大块大小
overlapSize = 150;       // 重叠大小
```

### 向量化参数

在 `vectorizeProcessor.ts` 中可调整：

```typescript
model = 'text-embedding-3-large';  // embedding模型
batchSize = 100;                   // 批次大小
```

## 🔍 下一步

POC 完成后，可以：

1. **检查数据质量**
   - 查看 `chunks.json` 确认分块是否合理
   - 查看 `vectors_metadata.json` 确认元数据标注是否正确

2. **测试检索**
   - 使用生成的向量数据进行相似度搜索测试
   - 验证检索结果的相关性

3. **扩展到其他书籍**
   - 如果效果满意，处理其他3本书
   - 合并所有向量数据到统一数据库

## 🐛 故障排除

### 问题：EPUB 解析失败
- 检查 EPUB 文件路径是否正确
- 确认 EPUB 文件完整性

### 问题：OpenAI API 错误
- 检查 API Key 是否正确
- 确认账户有足够额度
- 检查网络连接

### 问题：内存不足
- 减小 `batchSize`
- 分批处理章节

## 📝 输出示例

```json
// chunks.json 示例
{
  "id": "chunk_42",
  "text": "The Fool represents the beginning of a journey...",
  "metadata": {
    "book": "holistic_tarot",
    "layer": "psychological",
    "chapter": "Major Arcana: The Fool",
    "cardName": "The Fool",
    "topic": "major_arcana",
    "wordCount": 687,
    "language": "en"
  }
}
```
