# Cloudflare Pages 部署配置说明

## 使用 GitHub 集成时的正确配置

如果你通过 GitHub 连接部署 Cloudflare Pages，**不需要**在构建脚本中运行 `wrangler pages deploy`。

### Cloudflare Dashboard 中的正确设置

1. **Build settings**:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/`（留空或填 /）
   - **Build watch paths**: 留空
   - **Environment variables**: 在下方 Environment variables 部分配置

2. **环境变量**（Settings → Environment variables）:
   - `GEMINI_API_KEY`: 你的 Gemini API Key
   - `CLAUDE_API_KEY`: 你的 Claude API Key
   - ... 其他 AI 服务的 API Keys

### 不需要的配置

❌ **不要**设置自定义 Deploy command
❌ **不要**在构建中运行 `npx wrangler pages deploy`
❌ **不要**配置 `CLOUDFLARE_API_TOKEN`（GitHub 集成时不需要）

### GitHub 自动部署流程

```
GitHub push → Cloudflare 自动检测 → 运行 npm run build → 自动部署 dist/ 目录
```

Cloudflare Pages 会自动：
1. 检测到新的 Git push
2. 运行你配置的 build command
3. 将 build output directory 的内容部署到全球 CDN
4. 自动识别 `functions/` 目录并部署为 Serverless Functions

### 如果遇到部署错误

1. 确保 Cloudflare Dashboard 中只配置了 build command，没有 deploy command
2. 检查 `functions/` 目录和 `dist/` 目录是否正确生成
3. 在 Deployments 页面查看详细的构建日志

### CLI 手动部署（可选，用于本地测试）

如果你想从本地命令行部署（不通过 GitHub），可以：

```bash
# 登录
wrangler login

# 构建
npm run build

# 部署
wrangler pages deploy dist --project-name=lumina-tarot
```

这需要你有正确的 API Token 权限。但**推荐使用 GitHub 自动部署**，更简单可靠。
