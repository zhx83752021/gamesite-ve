# VR 游戏平台 (VR Game Platform)

一个现代化的虚拟现实游戏展示平台，提供游戏浏览、社区互动、内容管理等功能。

## 📋 项目概述

- **前端**：Vue 3 + Vite + TypeScript + Element Plus + TailwindCSS
- **后端**：Node.js + Express + TypeScript + PostgreSQL
- **部署**：Vercel + GitHub
- **特性**：响应式设计，支持 PC、平板、手机

## 📁 项目结构

```
site5/
├── docs/                    # 项目文档
│   ├── 01-项目概述与竞品分析.md
│   ├── 02-前台功能设计.md
│   ├── 03-后台管理系统.md
│   ├── 04-技术架构设计.md
│   ├── 05-数据库设计.md
│   ├── 06-API接口文档.md
│   ├── 07-部署运维方案.md
│   ├── 08-项目排期与里程碑.md
│   └── 09-数据库快速开始.md ⭐
├── frontend/                # 前端项目
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/                 # 后端项目
│   ├── src/
│   ├── database/           # 数据库脚本 ⭐
│   │   ├── schema.sql     # 17张表结构
│   │   ├── seed.sql       # 测试数据
│   │   ├── migrate.ts     # 迁移工具
│   │   └── README.md
│   ├── api/
│   └── package.json
└── README.md
```

## 🚀 快速开始

**详细教程**：📖 [快速开始指南](./QUICK_START.md)

### 1️⃣ 安装依赖

```bash
# 后端
cd backend && npm install

# 前端
cd frontend && npm install
```

### 2️⃣ 配置数据库

```bash
cd backend
# 配置 .env 中的 DATABASE_URL
npm run db:fresh  # 一键初始化（创建表+测试数据）
```

### 3️⃣ 启动服务

```bash
# 后端（终端1）
cd backend && npm run dev
# ✅ http://localhost:5000

# 前端（终端2）
cd frontend && npm run dev
# ✅ http://localhost:3000
```

### 4️⃣ 访问应用

- 🏠 **前台首页**：http://localhost:3000
- 🔐 **登录**：http://localhost:3000/login（admin / Admin123!）
- 📊 **后台管理**：http://localhost:3000/admin
- 📡 **API 文档**：http://localhost:5000/api/v1

## 🛠️ 技术栈

### 前端

- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite 5
- **语言**: TypeScript 5
- **状态管理**: Pinia 2
- **路由**: Vue Router 4
- **UI 组件**: Element Plus 2
- **CSS 框架**: TailwindCSS 3
- **图表库**: ECharts 5
- **HTTP 客户端**: Axios

### 后端

- **运行时**: Node.js 20
- **框架**: Express 4
- **语言**: TypeScript 5
- **数据库**: PostgreSQL 15
- **缓存**: Redis (Upstash)
- **认证**: JWT
- **ORM**: 原生 SQL (pg)

## 📦 核心功能

### 前台功能

- ✅ 首页展示（轮播图、热门游戏）
- ✅ 游戏列表（筛选、排序、搜索）
- ✅ 游戏详情（介绍、评论、购买）
- ✅ 用户中心（资料、游戏库、好友）
- ✅ 社区论坛（发帖、回复、互动）
- ✅ 搜索功能（游戏、用户、帖子）

### 后台功能

- ✅ 数据分析大屏
- ✅ 游戏管理（发布、审核、编辑）
- ✅ 用户管理（查看、封禁、权限）
- ✅ 内容审核（评论、帖子、举报）
- ✅ 系统配置（站点设置、功能开关）

## 🔧 开发计划

- [x] 需求分析与文档编写
- [x] 项目结构初始化
- [x] 前端框架配置（TailwindCSS、Element Plus、Router、Pinia）
- [x] 基础页面框架搭建
- [x] 数据库设计与初始化（17 张表 + 测试数据）
- [ ] 后端 API 开发
- [ ] 前端页面功能完善
- [ ] 管理后台开发
- [ ] 功能联调与测试
- [ ] 性能优化
- [ ] 部署上线

## 📖 文档

**📚 [文档索引](./DOCUMENTATION_INDEX.md)** - 查找所有文档

### 快速入门文档

- 🚀 [快速开始指南](./QUICK_START.md) ⭐ **推荐首读**
- 📡 [API 使用示例](./API_EXAMPLES.md)
- 🌐 [部署指南](./DEPLOYMENT.md)
- 📊 [项目交付清单](./PROJECT_DELIVERY.md)

### 技术设计文档

- [01-项目概述与竞品分析](./docs/01-项目概述与竞品分析.md)
- [02-前台功能设计](./docs/02-前台功能设计.md)
- [03-后台管理系统](./docs/03-后台管理系统.md)
- [04-技术架构设计](./docs/04-技术架构设计.md)
- [05-数据库设计](./docs/05-数据库设计.md)
- [06-API 接口文档](./docs/06-API接口文档.md)
- [07-部署运维方案](./docs/07-部署运维方案.md)
- [08-项目排期与里程碑](./docs/08-项目排期与里程碑.md)
- [09-数据库快速开始](./docs/09-数据库快速开始.md)

### 项目报告

- [项目进度报告](./PROJECT_STATUS.md)
- [开发完成总结](./DEVELOPMENT_SUMMARY.md)
- [最终完成报告](./FINAL_SUMMARY.md)

## 🌐 部署

### Vercel 部署

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 配置环境变量
4. 自动部署完成

### 环境变量配置

后端需要配置以下环境变量：

```env
# 数据库
DATABASE_URL=your_postgres_url

# Redis
UPSTASH_REDIS_URL=your_redis_url

# JWT
JWT_SECRET=your_secret_key

# 前端URL
FRONTEND_URL=https://your-domain.vercel.app
```

## 📝 License

MIT

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

如有问题，请通过 GitHub Issues 联系。
