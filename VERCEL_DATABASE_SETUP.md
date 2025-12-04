# Vercel 数据库配置指南

## 步骤一：配置数据库

### 方案 A：使用 Vercel Postgres（推荐）

1. 访问你的 Vercel 项目 Dashboard
2. 点击 **Storage** 标签
3. 点击 **Create Database**
4. 选择 **Postgres**
5. 选择区域（建议选择离用户最近的）
6. 点击 **Create**

Vercel 会自动添加以下环境变量：

- `POSTGRES_URL` - 连接池 URL（应用使用）
- `POSTGRES_URL_NON_POOLING` - 直连 URL（迁移使用）
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

### 方案 B：使用外部数据库（Neon / Supabase）

1. 访问 Vercel 项目 → **Settings** → **Environment Variables**
2. 添加环境变量：

```
POSTGRES_URL = postgresql://user:password@host:5432/database?sslmode=require
```

**推荐的免费数据库服务：**

- [Neon](https://neon.tech/) - 免费 0.5GB
- [Supabase](https://supabase.com/) - 免费 500MB
- [Railway](https://railway.app/) - 每月 $5 免费额度

## 步骤二：添加初始化密钥

在 Vercel → **Settings** → **Environment Variables** 添加：

```
INIT_DB_SECRET = your-secret-key-here
```

（请使用强密码，建议至少 32 位随机字符）

## 步骤三：重新部署

配置完环境变量后，触发重新部署：

1. 方法一：推送新代码到 GitHub
2. 方法二：在 Vercel Dashboard → **Deployments** → 点击最新部署的菜单 → **Redeploy**

## 步骤四：初始化数据库

部署成功后，使用以下方法初始化数据库：

### 方法 1: 使用 curl 命令

```bash
curl -X POST https://你的域名.vercel.app/init-db \
  -H "Content-Type: application/json" \
  -d '{"secret":"your-secret-key-here"}'
```

### 方法 2: 使用 Postman 或任何 API 工具

- **URL**: `https://你的域名.vercel.app/init-db`
- **方法**: POST
- **Headers**: `Content-Type: application/json`
- **Body**:

```json
{
  "secret": "your-secret-key-here"
}
```

### 方法 3: 使用浏览器控制台

```javascript
fetch("https://你的域名.vercel.app/init-db", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ secret: "your-secret-key-here" }),
})
  .then((r) => r.json())
  .then(console.log);
```

## 步骤五：验证

成功初始化后，你应该能看到以下响应：

```json
{
  "success": true,
  "message": "Database initialized successfully",
  "timestamp": "2025-12-04T..."
}
```

现在可以使用以下账户登录：

### 管理员账户

- 用户名：`admin`
- 密码：`admin123`

### 开发者账户

- 用户名：`developer1`
- 密码：`admin123`

## 故障排查

### 错误："Unauthorized"

- 检查 `INIT_DB_SECRET` 环境变量是否正确设置
- 确认请求 body 中的 secret 与环境变量一致

### 错误："Database error"

- 检查 `POSTGRES_URL` 是否正确配置
- 确认数据库服务正在运行
- 查看 Vercel 函数日志获取详细错误信息

### 如何查看日志

1. Vercel Dashboard → 你的项目
2. **Deployments** → 选择最新部署
3. 点击 **Functions** 标签
4. 点击 `/api/init-db` 查看日志

## 安全建议

1. **初始化后立即删除 `/init-db` 路由**（或只在开发环境启用）
2. **修改默认管理员密码**
3. **使用强密码作为 `INIT_DB_SECRET`**
4. **不要将密钥提交到代码仓库**

## 下一步

数据库初始化完成后：

1. 访问 `https://你的域名.vercel.app/admin/login`
2. 使用 admin / admin123 登录
3. 立即修改管理员密码
4. 开始使用平台功能！
