# Vercel 部署指南

## 项目结构

```
gamesite-ve/
├── frontend/          # Vue3 前端
├── backend/           # Express 后端源代码
├── api/              # Vercel Serverless Functions
└── vercel.json       # Vercel 配置
```

## 部署步骤

### 1. 通过 Vercel 网站部署（推荐）

1. 访问 [Vercel 控制台](https://vercel.com/)
2. 点击 "Import Project"
3. 选择 GitHub 仓库：`zhx83752021/gamesite-ve`
4. 配置项目：
   - **Project Name**: `gamesite-ve`
   - **Framework Preset**: Other（会自动检测）
   - **Root Directory**: 保持为根目录 `/`
   - **Build Command**: 自动检测
   - **Output Directory**: 自动检测

### 2. 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

#### 数据库配置（PostgreSQL）

```
POSTGRES_URL=your_postgres_connection_url
POSTGRES_PRISMA_URL=your_postgres_prisma_url
POSTGRES_URL_NON_POOLING=your_postgres_non_pooling_url
POSTGRES_USER=your_db_user
POSTGRES_HOST=your_db_host
POSTGRES_PASSWORD=your_db_password
POSTGRES_DATABASE=your_db_name
```

推荐使用 Vercel Postgres 或 Supabase：

- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase](https://supabase.com/)

#### Redis 配置（可选）

```
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

推荐使用 [Upstash Redis](https://upstash.com/)

#### JWT 配置

```
JWT_SECRET=your_jwt_secret_key_at_least_32_characters
JWT_EXPIRES_IN=7d
```

#### 其他配置

```
NODE_ENV=production
FRONTEND_URL=https://gamesite-ve.vercel.app
```

### 3. 数据库初始化

部署后需要初始化数据库：

```bash
# 连接到你的 Vercel Postgres 数据库
psql $POSTGRES_URL

# 运行数据库迁移脚本
# 将 backend/database/ 中的 SQL 脚本在数据库中执行
```

或使用 Vercel CLI：

```bash
vercel env pull .env.local
npm run db:init
```

### 4. 验证部署

部署完成后访问：

- 前端：https://gamesite-ve.vercel.app
- API：https://gamesite-ve.vercel.app/api/v1
- 健康检查：https://gamesite-ve.vercel.app/health

## 本地开发

```bash
# 安装依赖
cd frontend && npm install
cd ../backend && npm install
cd ../api && npm install

# 启动前端
cd frontend
npm run dev

# 启动后端
cd backend
npm run dev
```

## 注意事项

1. **Serverless 限制**：

   - 函数执行时间限制：10 秒（Hobby）/ 60 秒（Pro）
   - 请求体大小限制：4.5MB
   - 响应体大小限制：4.5MB

2. **数据库连接**：

   - 使用连接池管理数据库连接
   - 推荐使用 `@vercel/postgres` 或 Supabase
   - 避免在 Serverless Function 中保持长连接

3. **静态资源**：

   - 上传的文件建议使用对象存储（如 Vercel Blob、S3、OSS）
   - 不要依赖本地文件系统存储

4. **环境变量**：
   - 敏感信息必须通过 Vercel 环境变量配置
   - 不要在代码中硬编码密钥

## 故障排查

### API 404 错误

检查 `vercel.json` 的路由配置是否正确

### 数据库连接失败

1. 确认环境变量配置正确
2. 检查数据库是否允许 Vercel IP 访问
3. 验证连接字符串格式

### 构建失败

1. 检查依赖是否正确安装
2. 查看 Vercel 部署日志
3. 本地测试 `npm run build`

## 有用的链接

- [Vercel 文档](https://vercel.com/docs)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
