# VR 游戏平台 - API 接口文档

## 一、接口规范

### 1.1 基础信息

- **Base URL**: `https://api.example.com/v1`
- **协议**: HTTPS
- **请求格式**: JSON
- **响应格式**: JSON
- **字符编码**: UTF-8

### 1.2 通用响应格式

```typescript
// 成功响应
{
  "code": 200,
  "message": "success",
  "data": any,
  "timestamp": 1701532800000
}

// 错误响应
{
  "code": 400,
  "message": "错误信息",
  "error": "详细错误描述",
  "timestamp": 1701532800000
}
```

### 1.3 状态码说明

| 状态码 | 说明            |
| ------ | --------------- |
| 200    | 请求成功        |
| 201    | 创建成功        |
| 400    | 请求参数错误    |
| 401    | 未授权/令牌无效 |
| 403    | 禁止访问        |
| 404    | 资源不存在      |
| 429    | 请求过于频繁    |
| 500    | 服务器错误      |

### 1.4 认证方式

```http
Authorization: Bearer <access_token>
```

## 二、认证相关接口

### 2.1 用户注册

**接口**: `POST /auth/register`

**请求参数**:

```json
{
  "username": "testuser",
  "email": "user@example.com",
  "password": "Password123!"
}
```

**响应示例**:

```json
{
  "code": 201,
  "message": "注册成功",
  "data": {
    "user": {
      "id": "uuid",
      "username": "testuser",
      "email": "user@example.com",
      "avatar": null,
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 2.2 用户登录

**接口**: `POST /auth/login`

**请求参数**:

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**响应示例**:

```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "user": {
      "id": "uuid",
      "username": "testuser",
      "email": "user@example.com",
      "avatar": "https://cdn.example.com/avatar.jpg",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 2.3 刷新令牌

**接口**: `POST /auth/refresh`

**请求参数**:

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "token": "new_access_token",
    "refreshToken": "new_refresh_token"
  }
}
```

### 2.4 退出登录

**接口**: `POST /auth/logout`

**请求头**: `Authorization: Bearer <token>`

**响应示例**:

```json
{
  "code": 200,
  "message": "退出成功"
}
```

## 三、游戏相关接口

### 3.1 获取游戏列表

**接口**: `GET /games`

**查询参数**:

```
page=1
pageSize=20
category=action-adventure
platform=Quest
priceMin=0
priceMax=100
sortBy=rating  // rating, downloads, price, date
order=desc     // asc, desc
keyword=beat   // 搜索关键词
```

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "Beat Saber",
        "subtitle": "节奏光剑",
        "coverImage": "https://cdn.example.com/games/beat-saber.jpg",
        "price": 68.0,
        "discountPrice": 54.4,
        "rating": 4.8,
        "ratingCount": 1256,
        "downloads": 125000,
        "category": {
          "id": "uuid",
          "name": "运动健身"
        },
        "tags": ["音乐", "节奏", "运动"],
        "supportedPlatforms": ["Quest", "PSVR", "PC VR"],
        "releaseDate": "2019-05-21"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 156,
      "totalPages": 8
    }
  }
}
```

### 3.2 获取游戏详情

**接口**: `GET /games/:id`

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "id": "uuid",
    "title": "Beat Saber",
    "subtitle": "节奏光剑",
    "slug": "beat-saber",
    "developer": {
      "id": "uuid",
      "username": "Beat Games",
      "avatar": "url"
    },
    "publisher": "Meta",
    "shortDescription": "最受欢迎的VR音乐游戏",
    "fullDescription": "详细介绍...",
    "coverImage": "url",
    "trailerVideo": "url",
    "screenshots": ["url1", "url2", "url3"],
    "category": {
      "id": "uuid",
      "name": "运动健身"
    },
    "tags": ["音乐", "节奏", "运动"],
    "price": 68.0,
    "discountPrice": 54.4,
    "discountEndDate": "2024-12-31",
    "pricingType": "paid",
    "rating": 4.8,
    "ratingCount": 1256,
    "downloads": 125000,
    "views": 50000,
    "supportedPlatforms": ["Quest", "PSVR", "PC VR"],
    "supportedLanguages": ["zh-CN", "en", "ja"],
    "features": ["multiplayer", "chinese", "mod-support"],
    "ageRating": "7+",
    "systemRequirements": {
      "minimum": {
        "cpu": "Intel i5-4590",
        "memory": "8 GB RAM",
        "graphics": "NVIDIA GTX 970",
        "storage": "2 GB"
      },
      "recommended": {
        "cpu": "Intel i7-8700",
        "memory": "16 GB RAM",
        "graphics": "NVIDIA RTX 2060",
        "storage": "5 GB"
      }
    },
    "releaseDate": "2019-05-21",
    "createdAt": "2024-01-01T00:00:00Z",
    "publishedAt": "2024-01-15T00:00:00Z"
  }
}
```

### 3.3 获取热门游戏

**接口**: `GET /games/hot`

**查询参数**:

```
limit=10
timeRange=week  // day, week, month, all
```

**响应示例**:

```json
{
  "code": 200,
  "data": [
    {
      "id": "uuid",
      "title": "Half-Life: Alyx",
      "coverImage": "url",
      "rating": 4.9,
      "downloads": 500000,
      "trendScore": 98.5
    }
  ]
}
```

### 3.4 搜索游戏

**接口**: `GET /games/search`

**查询参数**:

```
q=beat           // 搜索关键词
category=music
platform=Quest
page=1
pageSize=20
```

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "items": [...],
    "suggestions": ["Beat Saber", "Beat Blaster"],
    "filters": {
      "categories": [
        { "id": "uuid", "name": "运动健身", "count": 15 }
      ],
      "platforms": [
        { "name": "Quest", "count": 25 }
      ]
    }
  }
}
```

### 3.5 发布游戏（需要开发者权限）

**接口**: `POST /games`

**请求头**: `Authorization: Bearer <token>`

**请求参数**:

```json
{
  "title": "My VR Game",
  "subtitle": "An amazing VR experience",
  "shortDescription": "简短描述",
  "fullDescription": "完整描述",
  "coverImage": "url",
  "trailerVideo": "url",
  "categoryId": "uuid",
  "tags": ["action", "adventure"],
  "price": 68.00,
  "pricingType": "paid",
  "supportedPlatforms": ["Quest", "PC VR"],
  "supportedLanguages": ["zh-CN", "en"],
  "ageRating": "12+",
  "systemRequirements": {...},
  "releaseDate": "2024-12-01"
}
```

**响应示例**:

```json
{
  "code": 201,
  "message": "游戏创建成功，等待审核",
  "data": {
    "id": "uuid",
    "status": "review"
  }
}
```

### 3.6 更新游戏

**接口**: `PUT /games/:id`

**请求头**: `Authorization: Bearer <token>`

### 3.7 删除游戏

**接口**: `DELETE /games/:id`

**请求头**: `Authorization: Bearer <token>`

## 四、评论相关接口

### 4.1 获取游戏评论

**接口**: `GET /games/:gameId/comments`

**查询参数**:

```
page=1
pageSize=20
sortBy=helpful  // latest, helpful, rating
```

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "items": [
      {
        "id": "uuid",
        "user": {
          "id": "uuid",
          "username": "张三",
          "avatar": "url"
        },
        "rating": 5,
        "content": "这游戏太棒了！",
        "images": ["url1", "url2"],
        "playTime": 25,
        "helpfulCount": 12,
        "isVerifiedPurchase": true,
        "replies": [
          {
            "id": "uuid",
            "user": {...},
            "content": "我也这么觉得",
            "createdAt": "2024-12-01T10:00:00Z"
          }
        ],
        "createdAt": "2024-11-30T15:30:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

### 4.2 发表评论

**接口**: `POST /games/:gameId/comments`

**请求头**: `Authorization: Bearer <token>`

**请求参数**:

```json
{
  "rating": 5,
  "content": "这游戏太棒了！",
  "images": ["url1", "url2"],
  "playTime": 25
}
```

### 4.3 点赞评论

**接口**: `POST /comments/:id/helpful`

**请求头**: `Authorization: Bearer <token>`

### 4.4 回复评论

**接口**: `POST /comments/:id/replies`

**请求头**: `Authorization: Bearer <token>`

**请求参数**:

```json
{
  "content": "我也这么觉得"
}
```

## 五、用户相关接口

### 5.1 获取用户资料

**接口**: `GET /users/:id`

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "id": "uuid",
    "username": "张三",
    "avatar": "url",
    "bio": "VR游戏爱好者",
    "level": 12,
    "totalPlayTime": 1860,
    "gamesOwned": 25,
    "achievementsCount": 148,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### 5.2 获取当前用户信息

**接口**: `GET /users/me`

**请求头**: `Authorization: Bearer <token>`

### 5.3 更新用户资料

**接口**: `PUT /users/me`

**请求头**: `Authorization: Bearer <token>`

**请求参数**:

```json
{
  "username": "newname",
  "bio": "新的个人简介",
  "avatar": "url"
}
```

### 5.4 获取用户游戏库

**接口**: `GET /users/:id/library`

**查询参数**:

```
page=1
pageSize=20
sortBy=playTime  // playTime, addedAt, title
```

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "items": [
      {
        "game": {
          "id": "uuid",
          "title": "Beat Saber",
          "coverImage": "url"
        },
        "playTime": 120,
        "lastPlayed": "2024-12-01T20:00:00Z",
        "achievementsUnlocked": 15,
        "isFavorite": true,
        "addedAt": "2024-11-01T00:00:00Z"
      }
    ]
  }
}
```

### 5.5 获取好友列表

**接口**: `GET /users/:id/friends`

**响应示例**:

```json
{
  "code": 200,
  "data": [
    {
      "id": "uuid",
      "username": "李四",
      "avatar": "url",
      "onlineStatus": "online",
      "currentGame": {
        "id": "uuid",
        "title": "Half-Life: Alyx"
      },
      "friendshipDate": "2024-01-15T00:00:00Z"
    }
  ]
}
```

### 5.6 发送好友请求

**接口**: `POST /users/:id/friend-request`

**请求头**: `Authorization: Bearer <token>`

### 5.7 接受好友请求

**接口**: `POST /friendships/:id/accept`

**请求头**: `Authorization: Bearer <token>`

## 六、社区论坛接口

### 6.1 获取板块列表

**接口**: `GET /forum/sections`

**响应示例**:

```json
{
  "code": 200,
  "data": [
    {
      "id": "uuid",
      "name": "综合讨论",
      "slug": "general",
      "description": "游戏评测、攻略心得",
      "icon": "💬",
      "postCount": 1234,
      "children": [...]
    }
  ]
}
```

### 6.2 获取帖子列表

**接口**: `GET /forum/posts`

**查询参数**:

```
sectionId=uuid
page=1
pageSize=20
sortBy=latest  // latest, hot, replies
```

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "items": [
      {
        "id": "uuid",
        "author": {
          "id": "uuid",
          "username": "张三",
          "avatar": "url"
        },
        "section": {
          "id": "uuid",
          "name": "综合讨论"
        },
        "title": "Beat Saber新手指南",
        "content": "帖子内容...",
        "tags": ["攻略", "新手"],
        "views": 1234,
        "likes": 56,
        "replyCount": 23,
        "isPinned": false,
        "isLocked": false,
        "lastReplyAt": "2024-12-02T10:00:00Z",
        "createdAt": "2024-12-01T15:30:00Z"
      }
    ]
  }
}
```

### 6.3 获取帖子详情

**接口**: `GET /forum/posts/:id`

### 6.4 发布帖子

**接口**: `POST /forum/posts`

**请求头**: `Authorization: Bearer <token>`

**请求参数**:

```json
{
  "sectionId": "uuid",
  "title": "Beat Saber新手指南",
  "content": "帖子内容...",
  "tags": ["攻略", "新手"],
  "images": ["url1", "url2"]
}
```

### 6.5 回复帖子

**接口**: `POST /forum/posts/:id/replies`

**请求头**: `Authorization: Bearer <token>`

**请求参数**:

```json
{
  "content": "回复内容",
  "parentId": "uuid" // 可选，回复某条回复
}
```

### 6.6 点赞帖子

**接口**: `POST /forum/posts/:id/like`

**请求头**: `Authorization: Bearer <token>`

## 七、订单相关接口

### 7.1 创建订单

**接口**: `POST /orders`

**请求头**: `Authorization: Bearer <token>`

**请求参数**:

```json
{
  "items": [
    {
      "gameId": "uuid",
      "quantity": 1
    }
  ]
}
```

**响应示例**:

```json
{
  "code": 201,
  "data": {
    "id": "uuid",
    "orderNumber": "ORD20241202001",
    "totalAmount": 68.00,
    "discountAmount": 13.60,
    "finalAmount": 54.40,
    "items": [
      {
        "game": {...},
        "price": 68.00,
        "quantity": 1
      }
    ],
    "status": "pending",
    "createdAt": "2024-12-02T20:00:00Z"
  }
}
```

### 7.2 获取订单列表

**接口**: `GET /orders`

**请求头**: `Authorization: Bearer <token>`

### 7.3 获取订单详情

**接口**: `GET /orders/:id`

**请求头**: `Authorization: Bearer <token>`

### 7.4 支付订单

**接口**: `POST /orders/:id/pay`

**请求头**: `Authorization: Bearer <token>`

**请求参数**:

```json
{
  "paymentMethod": "wechat", // wechat, alipay, card
  "returnUrl": "https://example.com/payment/callback"
}
```

### 7.5 取消订单

**接口**: `POST /orders/:id/cancel`

**请求头**: `Authorization: Bearer <token>`

## 八、管理后台接口

### 8.1 获取数据统计

**接口**: `GET /admin/stats`

**请求头**: `Authorization: Bearer <admin_token>`

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "totalUsers": 125487,
    "activeUsers": {
      "dau": 8234,
      "wau": 35678,
      "mau": 95432
    },
    "totalGames": 1456,
    "totalRevenue": 5234890.0,
    "todayRevenue": 12580.0
  }
}
```

### 8.2 获取用户列表（管理）

**接口**: `GET /admin/users`

**请求头**: `Authorization: Bearer <admin_token>`

**查询参数**:

```
keyword=zhang
status=active
role=user
page=1
pageSize=20
```

### 8.3 封禁用户

**接口**: `POST /admin/users/:id/ban`

**请求头**: `Authorization: Bearer <admin_token>`

**请求参数**:

```json
{
  "reason": "违反社区规定",
  "duration": 7 // 封禁天数，0表示永久
}
```

### 8.4 审核游戏

**接口**: `POST /admin/games/:id/review`

**请求头**: `Authorization: Bearer <admin_token>`

**请求参数**:

```json
{
  "action": "approve", // approve, reject
  "note": "审核备注"
}
```

### 8.5 处理举报

**接口**: `POST /admin/reports/:id/handle`

**请求头**: `Authorization: Bearer <admin_token>`

**请求参数**:

```json
{
  "action": "resolved", // resolved, dismissed
  "note": "处理说明"
}
```

## 九、文件上传接口

### 9.1 上传图片

**接口**: `POST /upload/image`

**请求头**:

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**请求参数**: FormData

```
file: [图片文件]
type: avatar  // avatar, cover, screenshot, other
```

**响应示例**:

```json
{
  "code": 200,
  "data": {
    "url": "https://cdn.example.com/images/xxx.jpg",
    "thumbnail": "https://cdn.example.com/images/xxx_thumb.jpg",
    "size": 1024000,
    "width": 1920,
    "height": 1080
  }
}
```

### 9.2 上传视频

**接口**: `POST /upload/video`

**限制**: 文件大小最大 50MB

## 十、WebSocket 接口

### 10.1 连接

**URL**: `wss://api.example.com/ws`

**连接参数**: `?token=<access_token>`

### 10.2 事件

#### 用户上线

```json
// 发送
{
  "type": "user:online",
  "data": {
    "userId": "uuid"
  }
}
```

#### 接收消息

```json
// 接收
{
  "type": "message:receive",
  "data": {
    "senderId": "uuid",
    "content": "消息内容",
    "timestamp": 1701532800000
  }
}
```

#### 实时评论

```json
// 接收
{
  "type": "comment:new",
  "data": {
    "gameId": "uuid",
    "comment": {...}
  }
}
```

#### 通知

```json
// 接收
{
  "type": "notification",
  "data": {
    "id": "uuid",
    "type": "friend_request",
    "title": "好友请求",
    "content": "张三向你发送了好友请求"
  }
}
```

## 十一、限流策略

| 接口类型  | 限制           |
| --------- | -------------- |
| 普通接口  | 100 次/15 分钟 |
| 搜索接口  | 30 次/分钟     |
| 上传接口  | 20 次/小时     |
| 登录接口  | 5 次/15 分钟   |
| 发帖/评论 | 10 次/小时     |
