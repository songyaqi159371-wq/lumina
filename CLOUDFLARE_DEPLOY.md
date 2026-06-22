# Cloudflare Pages 部署指南

## 项目概述
本项目已配置为可以部署到 Cloudflare Pages，包含静态前端和 Serverless Functions。

## 准备工作

### 1. 安装 Wrangler CLI
```bash
npm install -g wrangler
# 或使用 pnpm
pnpm add -g wrangler
```

### 2. 登录 Cloudflare
```bash
wrangler login
```

## 部署步骤

### 方式一：通过 GitHub 自动部署（推荐）

1. **将代码推送到 GitHub**
   ```bash
   git add .
   git commit -m "feat: configure for Cloudflare Pages"
   git push origin main
   ```

2. **在 Cloudflare Dashboard 创建 Pages 项目**
   - 访问 https://dash.cloudflare.com
   - 进入 **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**
   - 选择你的 GitHub 仓库

3. **配置构建设置**
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`（项目根目录）

4. **配置环境变量**
   
   在 Cloudflare Pages 项目设置中，添加以下环境变量：

   **必需的环境变量**（至少配置一个 AI 服务）：
   - `GEMINI_API_KEY` - Google Gemini API Key
   - `ANTHROPIC_AUTH_TOKEN` 或 `CLAUDE_API_KEY` - Claude API Key
   - `DEEPSEEK_API_KEY` - DeepSeek API Key
   - `KIMI_API_KEY` - Kimi API Key
   - `QWEN_API_KEY` - 通义千问 API Key
   - `DOUBAO_API_KEY` - 豆包 API Key
   - `OPENAI_API_KEY` - OpenAI API Key

   **可选的环境变量**：
   - `CLAUDE_MODEL` - Claude 模型名称（默认: claude-sonnet-4-6）
   - `CLAUDE_USE_OPENAI_FORMAT` - 是否使用 OpenAI 格式（true/false）
   - `ANTHROPIC_BASE_URL` - Claude API 基础 URL（用于代理）
   - `CLAUDE_BASE_URL` - Claude OpenAI 格式 API URL
   - `KIMI_MODEL` - Kimi 模型名称（默认: moonshot-v1-32k）
   - `QWEN_MODEL` - 通义千问模型名称（默认: qwen-plus）
   - `DOUBAO_MODEL` - 豆包模型名称（默认: doubao-pro-32k）
   - `OPENAI_MODEL` - OpenAI 模型名称（默认: gpt-4）
   - `OPENAI_BASE_URL` - OpenAI API 基础 URL（用于代理）

5. **触发部署**
   - 保存配置后，Cloudflare Pages 会自动开始构建和部署
   - 后续每次推送到 main 分支都会自动触发部署

### 方式二：使用 Wrangler CLI 直接部署

```bash
# 构建项目
npm run build

# 部署到 Cloudflare Pages
wrangler pages deploy dist --project-name=lumina-tarot
```

首次部署时，Wrangler 会提示创建新项目。

## 配置环境变量（CLI 方式）

```bash
# 设置生产环境变量
wrangler pages secret put GEMINI_API_KEY --project-name=lumina-tarot
wrangler pages secret put CLAUDE_API_KEY --project-name=lumina-tarot
# ... 添加其他 API Keys
```

## 验证部署

部署成功后，你会获得一个 Cloudflare Pages URL，类似：
- `https://lumina-tarot.pages.dev`

测试 API 端点：
```bash
# 测试 interpret API
curl -X POST https://lumina-tarot.pages.dev/api/interpret \
  -H "Content-Type: application/json" \
  -d '{"model":"gemini","prompt":"你好","systemInstruction":"你是一个塔罗牌解读助手"}'

# 测试 chat API
curl -X POST https://lumina-tarot.pages.dev/api/chat \
  -H "Content-Type: application/json" \
  -d '{"model":"gemini","history":[],"newMessage":"你好","systemInstruction":"你是一个塔罗牌解读助手"}'
```

## 自定义域名

1. 在 Cloudflare Pages 项目设置中，进入 **Custom domains**
2. 添加你的域名（需要在 Cloudflare 托管 DNS）
3. Cloudflare 会自动配置 SSL 证书

## 本地开发与调试

```bash
# 本地开发（使用 Vite）
npm run dev

# 使用 Wrangler 在本地模拟 Cloudflare Pages 环境
wrangler pages dev dist --port 3000

# 本地开发时设置环境变量
# 创建 .dev.vars 文件：
echo "GEMINI_API_KEY=your_key_here" > .dev.vars
wrangler pages dev dist --port 3000
```

## 注意事项

1. **速率限制**：当前实现使用内存存储，在 Cloudflare Workers 的分布式环境中可能不够准确。建议生产环境使用：
   - Cloudflare KV（键值存储）
   - Cloudflare Durable Objects（分布式状态管理）
   - Cloudflare Rate Limiting 功能

2. **冷启动**：Functions 在首次调用时可能有轻微延迟（冷启动）

3. **请求限制**：
   - CPU 时间：免费计划每个请求最多 10ms，付费计划 50ms
   - 请求大小：最大 100MB
   - 响应大小：最大 25MB

4. **环境变量安全**：
   - 敏感信息（API Keys）应该使用 Cloudflare Pages 的加密环境变量功能
   - 不要在代码中硬编码 API Keys

## 监控和日志

- 在 Cloudflare Dashboard 中查看 Pages 项目的 **Analytics** 和 **Logs**
- 使用 `wrangler pages deployment tail` 实时查看日志

## 成本估算

Cloudflare Pages 免费计划包括：
- 无限静态请求
- 每天 100,000 个 Function 请求
- 每月 500 次构建

对于大多数个人项目来说，免费计划已经足够。

## 故障排查

### API 返回 500 错误
- 检查环境变量是否正确设置
- 查看 Cloudflare Pages 日志获取详细错误信息

### Functions 超时
- 检查 AI API 是否响应缓慢
- 考虑增加超时设置或使用流式响应

### CORS 错误
- 已在 `functions/_middleware.ts` 中配置 CORS
- 检查是否正确部署了 middleware

## 相关链接

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Cloudflare Functions 文档](https://developers.cloudflare.com/pages/platform/functions/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
