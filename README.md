# AI内容创作助手

基于 Next.js 14 的 AI 内容创作助手 MVP，支持多种内容类型的智能生成。

## 功能特性

- 🤖 **智能内容生成** - 支持文章、社交媒体、广告文案等多种类型
- 🎨 **现代UI设计** - 基于 shadcn/ui 的精美界面
- ⚡ **高性能** - Next.js 14 App Router + 服务端渲染
- 🔐 **用户系统** - 完整的登录注册流程
- 📊 **历史记录** - 保存和管理生成的内容

## 技术栈

| 技术 | 说明 |
|------|------|
| Next.js 14 | React 全栈框架（App Router）|
| TypeScript | 类型安全 |
| Tailwind CSS | 原子化 CSS |
| shadcn/ui | 高质量 UI 组件库 |
| Prisma | ORM 数据库工具 |
| DeepSeek V3 | AI 大语言模型 |
| Supabase | PostgreSQL 数据库 |

## 项目结构

```
ai-content-creator/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API 路由
│   │   │   ├── generate/   # 内容生成 API
│   │   │   └── status/     # 服务状态 API
│   │   ├── auth/           # 认证页面
│   │   │   ├── login/      # 登录页
│   │   │   └── register/   # 注册页
│   │   ├── dashboard/      # 用户仪表板
│   │   ├── generator/      # 内容生成器
│   │   ├── layout.tsx      # 根布局
│   │   ├── page.tsx        # 首页
│   │   └── globals.css     # 全局样式
│   ├── components/         # React 组件
│   │   └── ui/            # shadcn/ui 组件
│   ├── lib/               # 工具函数
│   │   ├── utils.ts       # 通用工具
│   │   └── ai-config.ts   # AI 配置
│   ├── services/          # 服务层
│   │   ├── ai.ts          # AI 服务统一接口
│   │   ├── deepseek.ts    # DeepSeek API 封装
│   │   └── mock-ai.ts     # Mock AI 服务
│   ├── types/             # TypeScript 类型定义
│   └── hooks/             # 自定义 Hooks
├── prisma/
│   └── schema.prisma      # 数据库模型
├── public/                # 静态资源
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## 快速开始

### 1. 克隆项目
```bash
cd /workspace/ai-content-creator
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量

创建 `.env.local` 文件：

```bash
cp .env.example .env.local
```

编辑 `.env.local`，填写以下配置：

```env
# DeepSeek API 配置（必填）
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_API_URL=https://api.deepseek.com/v1

# Supabase 配置（可选，后续启用）
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 数据库连接（可选，后续启用）
DATABASE_URL="postgresql://user:password@localhost:5432/ai_content_creator"

# 应用配置
NEXT_PUBLIC_APP_NAME=AI内容创作助手
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> 💡 **提示**：如果不配置 DEEPSEEK_API_KEY，系统会自动使用 Mock 服务进行演示

### 4. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000

## API 接口

### 生成内容
```http
POST /api/generate
Content-Type: application/json

{
  "type": "article",        // 内容类型
  "input": "文章主题描述",   // 用户输入
  "options": {
    "tone": "professional",  // professional | casual | friendly | formal
    "length": "medium",      // short | medium | long
    "language": "zh"         // zh | en
  }
}
```

### 检查服务状态
```http
GET /api/status
```

## 内容类型说明

| 类型 | 说明 | 适用场景 |
|------|------|----------|
| article | 文章 | 博客、新闻、教程 |
| social | 社交媒体 | 微博、朋友圈、小红书 |
| ad | 广告文案 | 产品推广、营销文案 |
| email | 邮件 | 商务邮件、营销邮件 |
| product | 产品描述 | 电商产品介绍 |
| script | 脚本 | 视频脚本、直播话术 |

## 开发命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务
npm run start

# 代码检查
npm run lint

# 数据库操作（需配置 DATABASE_URL）
npm run db:generate  # 生成 Prisma Client
npm run db:push      # 同步数据库结构
npm run db:studio    # 打开 Prisma Studio
```

## 开发计划

- [x] Day 1-2: 项目初始化与基础架构 ✅
  - [x] 项目结构搭建
  - [x] Next.js 14 配置
  - [x] Tailwind CSS + shadcn/ui
  - [x] 核心页面框架
  - [x] AI API 服务封装
  - [x] 数据库 Schema 设计

- [ ] Day 3-4: 用户认证系统
  - [ ] Supabase Auth 集成
  - [ ] 登录注册功能
  - [ ] 用户会话管理

- [ ] Day 5-6: AI 内容生成功能
  - [ ] 完善生成器界面
  - [ ] 模板系统
  - [ ] 历史记录保存

- [ ] Day 7: 用户仪表板优化
  - [ ] 内容管理
  - [ ] 数据统计
  - [ ] 用户设置

- [ ] Day 8: 部署上线
  - [ ] Vercel 部署
  - [ ] 环境变量配置
  - [ ] 性能优化

## 技术亮点

1. **类型安全**：全栈 TypeScript，类型完整
2. **服务降级**：API 不可用时自动切换 Mock 服务
3. **响应式设计**：适配移动端和桌面端
4. **代码规范**：统一代码风格，添加中文注释

## 常见问题

### Q: 如何获取 DeepSeek API Key？
A: 访问 [DeepSeek 开放平台](https://platform.deepseek.com/) 注册账号后获取

### Q: 不配置 API Key 可以使用吗？
A: 可以。系统会自动使用 Mock 服务生成示例内容

### Q: 如何连接真实数据库？
A: 配置 DATABASE_URL 后运行 `npm run db:push` 同步数据库结构

## License

MIT

---

**当前版本**: v0.1.0 (MVP)
**最后更新**: 2024-01-15
