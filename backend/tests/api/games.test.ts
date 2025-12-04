import request from 'supertest'
import app from '../../src/index'

describe('游戏API测试', () => {
  let authToken: string

  beforeAll(async () => {
    // 登录获取token
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'Admin123!'
      })

    authToken = response.body.token
  })

  describe('GET /api/v1/games', () => {
    it('获取游戏列表', async () => {
      const response = await request(app)
        .get('/api/v1/games')
        .expect(200)

      expect(response.body).toHaveProperty('games')
      expect(Array.isArray(response.body.games)).toBe(true)
      expect(response.body).toHaveProperty('total')
      expect(response.body).toHaveProperty('page')
      expect(response.body).toHaveProperty('pageSize')
    })

    it('分页功能正常', async () => {
      const response = await request(app)
        .get('/api/v1/games?page=1&pageSize=10')
        .expect(200)

      expect(response.body.games.length).toBeLessThanOrEqual(10)
      expect(response.body.page).toBe(1)
      expect(response.body.pageSize).toBe(10)
    })

    it('分类筛选功能', async () => {
      const response = await request(app)
        .get('/api/v1/games?category=action')
        .expect(200)

      expect(response.body).toHaveProperty('games')
    })

    it('排序功能', async () => {
      const response = await request(app)
        .get('/api/v1/games?sort=rating&order=desc')
        .expect(200)

      const games = response.body.games
      if (games.length > 1) {
        expect(games[0].rating).toBeGreaterThanOrEqual(games[1].rating)
      }
    })

    it('搜索功能', async () => {
      const response = await request(app)
        .get('/api/v1/games?search=Beat')
        .expect(200)

      expect(response.body).toHaveProperty('games')
    })
  })

  describe('GET /api/v1/games/:id', () => {
    it('获取游戏详情', async () => {
      const response = await request(app)
        .get('/api/v1/games/1')
        .expect(200)

      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('title')
      expect(response.body).toHaveProperty('description')
      expect(response.body).toHaveProperty('price')
      expect(response.body).toHaveProperty('rating')
    })

    it('不存在的游戏应返回404', async () => {
      const response = await request(app)
        .get('/api/v1/games/99999')
        .expect(404)

      expect(response.body).toHaveProperty('error')
    })
  })

  describe('POST /api/v1/games', () => {
    it('管理员可以创建游戏', async () => {
      const gameData = {
        title: `Test Game ${Date.now()}`,
        description: 'This is a test game',
        price: 99.99,
        category: 'action',
        platform: 'vr',
        cover_image: 'https://example.com/image.jpg'
      }

      const response = await request(app)
        .post('/api/v1/games')
        .set('Authorization', `Bearer ${authToken}`)
        .send(gameData)
        .expect(201)

      expect(response.body).toHaveProperty('id')
      expect(response.body.title).toBe(gameData.title)
    })

    it('未登录无法创建游戏', async () => {
      const gameData = {
        title: 'Test Game',
        description: 'Test',
        price: 99.99
      }

      const response = await request(app)
        .post('/api/v1/games')
        .send(gameData)
        .expect(401)

      expect(response.body).toHaveProperty('error')
    })

    it('缺少必填字段应返回错误', async () => {
      const gameData = {
        title: 'Test Game'
        // 缺少其他必填字段
      }

      const response = await request(app)
        .post('/api/v1/games')
        .set('Authorization', `Bearer ${authToken}`)
        .send(gameData)
        .expect(400)

      expect(response.body).toHaveProperty('error')
    })
  })

  describe('PUT /api/v1/games/:id', () => {
    it('管理员可以更新游戏', async () => {
      const updateData = {
        title: 'Updated Game Title',
        price: 79.99
      }

      const response = await request(app)
        .put('/api/v1/games/1')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200)

      expect(response.body.title).toBe(updateData.title)
      expect(response.body.price).toBe(updateData.price)
    })
  })

  describe('DELETE /api/v1/games/:id', () => {
    it('管理员可以删除游戏', async () => {
      // 先创建一个测试游戏
      const createResponse = await request(app)
        .post('/api/v1/games')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Game to Delete',
          description: 'Test',
          price: 99.99,
          category: 'action',
          platform: 'vr',
          cover_image: 'https://example.com/image.jpg'
        })

      const gameId = createResponse.body.id

      // 删除游戏
      const response = await request(app)
        .delete(`/api/v1/games/${gameId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      expect(response.body).toHaveProperty('message')
    })
  })

  describe('GET /api/v1/games/:id/comments', () => {
    it('获取游戏评论', async () => {
      const response = await request(app)
        .get('/api/v1/games/1/comments')
        .expect(200)

      expect(response.body).toHaveProperty('comments')
      expect(Array.isArray(response.body.comments)).toBe(true)
    })
  })

  describe('POST /api/v1/games/:id/comments', () => {
    it('登录用户可以发表评论', async () => {
      const commentData = {
        content: '这是一个很棒的游戏！',
        rating: 5
      }

      const response = await request(app)
        .post('/api/v1/games/1/comments')
        .set('Authorization', `Bearer ${authToken}`)
        .send(commentData)
        .expect(201)

      expect(response.body).toHaveProperty('id')
      expect(response.body.content).toBe(commentData.content)
      expect(response.body.rating).toBe(commentData.rating)
    })

    it('未登录无法发表评论', async () => {
      const commentData = {
        content: '测试评论',
        rating: 5
      }

      const response = await request(app)
        .post('/api/v1/games/1/comments')
        .send(commentData)
        .expect(401)

      expect(response.body).toHaveProperty('error')
    })
  })
})
