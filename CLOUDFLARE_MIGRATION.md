# Cloudflare Pages 迁移总结

✅ 已完成 Cloudflare Pages 迁移配置

## 创建的文件

### 1. Cloudflare Functions (API 路由)
- `functions/_middleware.ts` - 中间件（CORS + 速率限制）
- `functions/api/interpret.ts` - 塔罗牌解读 API
- `functions/api/interpret-stream.ts` - 流式解读 API
- `functions/api/chat.ts` - 对话 API
- `functions/api/chat-stream.ts` - 流式对话 API

### 2. 配置文件
- `wrangler.toml` - Cloudflare Pages 配置
- `CLOUDFLARE_DEPLOY.md` - 详细部署文档

### 3. 更新的文件
- `.gitignore` - 添加 Cloudflare 相关忽略规则
- `package.json` - 添加 Cloudflare 部署脚本

## 快速开始

### 本地开发
```bash
# 安装依赖（如果还没安装）
npm install

# 构建项目
npm run build

# 使用 Cloudflare Pages 本地环境测试
npm run cf:dev
```

### 部署到 Cloudflare

#### 方式 1: GitHub 自动部署（推荐）
1. 推送代码到 GitHub
2. 在 Cloudflare Dashboard 连接 GitHub 仓库
3. 设置构建命令和环境变量
4. 自动部署完成

#### 方式 2: CLI 直接部署
```bash
# 安装 wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署
npm run cf:deploy
```

## 需要配置的环境变量

在 Cloudflare Pages Dashboard 中设置以下环境变量（至少配置一个 AI 服务）：

**必需**（根据使用的 AI 服务）：
- `GEMINI_API_KEY`
- `CLAUDE_API_KEY` 或 `ANTHROPIC_AUTH_TOKEN`
- `DEEPSEEK_API_KEY`
- `KIMI_API_KEY`
- `QWEN_API_KEY`
- `DOUBAO_API_KEY`
- `OPENAI_API_KEY`

**可选**：
- `CLAUDE_MODEL`
- `CLAUDE_USE_OPENAI_FORMAT`
- `ANTHROPIC_BASE_URL`
- `OPENAI_MODEL`
- `OPENAI_BASE_URL`
- 等等...

详细说明请查看 `CLOUDFLARE_DEPLOY.md`

## 与 Vercel 的区别

1. **API 路由位置**: `api/` → `functions/api/`
2. **请求对象**: Vercel Request/Response → Cloudflare Fetch API
3. **环境变量**: `process.env` → `context.env`
4. **IP 获取**: `x-forwarded-for` → `CF-Connecting-IP`
5. **速率限制**: 建议使用 Cloudflare KV 或 Durable Objects

## 注意事项

- 保留原有的 `api/` 目录，以便在 Vercel 上继续运行
- Cloudflare Functions 使用 `functions/` 目录
- 可以同时支持两个平台部署

查看 `CLOUDFLARE_DEPLOY.md` 获取完整部署指南。
