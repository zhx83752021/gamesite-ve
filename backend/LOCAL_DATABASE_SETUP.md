# 本地 PostgreSQL 数据库配置指南

## 步骤 1：在 pgAdmin 中创建数据库

1. 打开 pgAdmin
2. 连接到本地 PostgreSQL 服务器（通常是 localhost）
3. 右键点击 "Databases" → "Create" → "Database"
4. 填写数据库信息：
   - **Database name**: `vr_game_platform`
   - **Owner**: `postgres`（或你的用户名）
   - 点击 "Save"

## 步骤 2：创建.env 配置文件

在 `backend` 目录下创建 `.env` 文件（复制以下内容）：

```env
# 环境配置
NODE_ENV=development
PORT=5000

# 本地PostgreSQL数据库连接
DATABASE_URL=postgresql://postgres:你的密码@localhost:5432/vr_game_platform

# JWT密钥
JWT_SECRET=local-dev-secret-key-change-in-production
JWT_REFRESH_SECRET=local-dev-refresh-key-change-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# 前端URL
FRONTEND_URL=http://localhost:3000

# Redis配置（可选，暂时不需要）
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

**重要**：将 `你的密码` 替换为你的 PostgreSQL 密码！

## 步骤 3：运行数据库迁移

在 `backend` 目录下执行：

```bash
# 安装依赖（如果还没安装）
npm install

# 一键初始化数据库（创建17张表 + 填充测试数据）
npm run db:fresh
```

## 步骤 4：验证数据库

在 pgAdmin 中：

1. 刷新 `vr_game_platform` 数据库
2. 展开 "Schemas" → "public" → "Tables"
3. 应该能看到 17 张表：
   - users
   - categories
   - games
   - tags
   - game_tags
   - game_media
   - comments
   - comment_replies
   - user_game_library
   - orders
   - order_items
   - forum_sections
   - posts
   - post_replies
   - friendships
   - notifications
   - reports

## 测试数据

数据库会自动填充测试数据，包括：

- **7 个测试用户**（admin、developer1、developer2、user1-3、moderator1）
- **5 个游戏**
- **完整的评论、帖子等数据**

### 测试账户

| 用户名     | 密码      | 角色     |
| ---------- | --------- | -------- |
| admin      | Admin123! | 管理员   |
| developer1 | Dev123!   | 开发者   |
| user1      | User123!  | 普通用户 |

## 常见问题

### Q: DATABASE_URL 格式是什么？

A: `postgresql://用户名:密码@主机:端口/数据库名`

示例：

```
DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/vr_game_platform
```

### Q: 如何重置数据库？

A:

```bash
npm run db:fresh  # 删除所有表并重新创建
```

### Q: 密码中有特殊字符怎么办？

A: 需要进行 URL 编码，或者用双引号包裹：

```
# 方法1：URL编码
DATABASE_URL=postgresql://postgres:my%40password@localhost:5432/vr_game_platform

# 方法2：修改密码为简单字符
```

## 后续迁移到 Vercel

当你准备部署到 Vercel 时：

1. 在 Vercel 控制台创建 PostgreSQL 数据库
2. 获取 Vercel 的 DATABASE_URL
3. 在 Vercel 项目设置中添加环境变量
4. 部署时自动使用 Vercel 数据库

本地开发继续使用本地 PostgreSQL 数据库。

---

**下一步**：创建.env 文件后，执行 `npm run db:fresh` 初始化数据库
