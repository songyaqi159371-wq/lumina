# 🚀 使用中转站API运行向量化

## 📍 运行位置

**是的，你需要在项目根目录运行！**

脚本中使用的是相对路径 `./data/vectors_poc/`，所以必须在项目根目录执行。

---

## 🔧 快速开始指南

### Step 1: 打开终端并进入项目目录

```bash
cd C:\Users\86159\Desktop\lumina_tarot
```

### Step 2: 设置环境变量

**Windows PowerShell:**
```powershell
# 设置API Key
$env:OPENAI_API_KEY="sk-你的中转站key"

# 设置中转站地址（重要！）
$env:OPENAI_BASE_URL="https://你的中转站地址.com/v1"
```

**Windows CMD:**
```cmd
set OPENAI_API_KEY=sk-你的中转站key
set OPENAI_BASE_URL=https://你的中转站地址.com/v1
```

**Linux/Mac:**
```bash
export OPENAI_API_KEY="sk-你的中转站key"
export OPENAI_BASE_URL="https://你的中转站地址.com/v1"
```

### Step 3: 运行脚本

```bash
node scripts/poc/vectorize.cjs
```

---

## 📝 常见中转站地址格式

根据不同的中转站服务商，地址格式可能是：

```
https://api.xxx.com/v1
https://xxx.openai-proxy.com/v1
https://openai.xxx.cn/v1
```

**注意：**
- ✅ 地址通常以 `/v1` 结尾
- ✅ 包含完整的 `https://`
- ✅ 不要在末尾加 `/embeddings`（脚本会自动添加）

---

## ✅ 完整示例（假设中转站是 api.example.com）

### PowerShell 完整命令：
```powershell
# 1. 进入项目目录
cd C:\Users\86159\Desktop\lumina_tarot

# 2. 设置环境变量
$env:OPENAI_API_KEY="sk-abc123xyz"
$env:OPENAI_BASE_URL="https://api.example.com/v1"

# 3. 运行脚本
node scripts/poc/vectorize.cjs
```

### CMD 完整命令：
```cmd
REM 1. 进入项目目录
cd C:\Users\86159\Desktop\lumina_tarot

REM 2. 设置环境变量
set OPENAI_API_KEY=sk-abc123xyz
set OPENAI_BASE_URL=https://api.example.com/v1

REM 3. 运行脚本
node scripts/poc/vectorize.cjs
```

---

## 🔍 验证设置是否正确

运行脚本后，你应该看到：

```
🚀 开始向量化处理
═══════════════════════════════════════

🔄 使用自定义API地址: https://你的中转站地址.com/v1  ← 确认这一行出现

📖 读取chunks数据...
✅ 读取成功：371 个chunks
...
```

如果看到 `🌐 使用官方API地址`，说明 BASE_URL 没设置成功。

---

## 🐛 常见问题

### 问题 1: 找不到文件
```
Error: ENOENT: no such file or directory, open './data/vectors_poc/chunks.json'
```
**解决**: 确认你在项目根目录（lumina_tarot）下运行

验证方法：
```bash
# 查看当前目录
pwd  # 或 cd（Windows）

# 应该显示类似：
# C:\Users\86159\Desktop\lumina_tarot

# 确认 chunks.json 存在
ls data/vectors_poc/chunks.json
```

### 问题 2: 中转站连接失败
```
❌ OpenAI API 错误: 404 - Not Found
```
**可能原因**:
1. BASE_URL 地址错误
2. BASE_URL 格式不对（检查是否有 `/v1`）
3. 中转站服务暂时不可用

### 问题 3: 中转站不支持 embedding 模型
```
❌ OpenAI API 错误: 400 - Model not found
```
**解决**: 联系你的中转站服务商确认是否支持 `text-embedding-3-large`

---

## 📊 一键运行脚本（可选）

为了方便，你可以创建一个批处理文件：

**Windows (run_vectorize.bat):**
```batch
@echo off
cd C:\Users\86159\Desktop\lumina_tarot
set OPENAI_API_KEY=sk-你的key
set OPENAI_BASE_URL=https://你的中转站.com/v1
node scripts/poc/vectorize.cjs
pause
```

然后直接双击运行 `run_vectorize.bat`

---

## ✅ 准备清单

在运行前确认：

- [ ] 已进入项目根目录 `lumina_tarot`
- [ ] 已设置 `OPENAI_API_KEY`
- [ ] 已设置 `OPENAI_BASE_URL`（如果使用中转站）
- [ ] 确认 `data/vectors_poc/chunks.json` 文件存在
- [ ] 网络连接正常

---

**准备好了吗？开始运行吧！** 🚀

如果遇到问题，把错误信息告诉我，我会帮你解决！
