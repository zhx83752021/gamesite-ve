import request from 'supertest'
import app from '../../src/index'

describe('认证API测试', () => {
  describe('POST /api/v1/auth/register', () => {
    it('成功注册新用户', async () => {
      const userData = {
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        password: 'Password123!',
        confirm_password: 'Password123!'
      }

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201)

      expect(response.body).toHaveProperty('token')
      expect(response.body.user).toHaveProperty('id')
      expect(response.body.user.email).toBe(userData.email)
    })

    it('注册时邮箱已存在应返回错误', async () => {
      const userData = {
        username: 'duplicate',
        email: 'admin@example.com', // 已存在的邮箱
        password: 'Password123!',
        confirm_password: 'Password123!'
      }

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(400)

      expect(response.body).toHaveProperty('error')
    })

    it('密码不匹配应返回错误', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123!',
        confirm_password: 'DifferentPassword123!'
      }

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(400)

      expect(response.body).toHaveProperty('error')
    })

    it('缺少必填字段应返回错误', async () => {
      const userData = {
        email: 'test@example.com'
        // 缺少 username 和 password
      }

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(400)

      expect(response.body).toHaveProperty('error')
    })
  })

  describe('POST /api/v1/auth/login', () => {
    it('成功登录', async () => {
      const credentials = {
        email: 'admin@example.com',
        password: 'Admin123!'
      }

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(credentials)
        .expect(200)

      expect(response.body).toHaveProperty('token')
      expect(response.body.user).toHaveProperty('email', credentials.email)
    })

    it('错误的密码应返回401', async () => {
      const credentials = {
        email: 'admin@example.com',
        password: 'WrongPassword123!'
      }

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(credentials)
        .expect(401)

      expect(response.body).toHaveProperty('error')
    })

    it('不存在的用户应返回401', async () => {
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'Password123!'
      }

      const response = await request(app)
        .post('/api/v1/auth/login')
        .send(credentials)
        .expect(401)

      expect(response.body).toHaveProperty('error')
    })
  })

  describe('POST /api/v1/auth/logout', () => {
    it('成功退出登录', async () => {
      // 先登录获取token
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'Admin123!'
        })

      const token = loginResponse.body.token

      // 执行退出
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(response.body).toHaveProperty('message')
    })

    it('未授权的请求应返回401', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout')
        .expect(401)

      expect(response.body).toHaveProperty('error')
    })
  })

  describe('GET /api/v1/auth/me', () => {
    it('获取当前用户信息', async () => {
      // 先登录
      const loginResponse = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'Admin123!'
        })

      const token = loginResponse.body.token

      // 获取用户信息
      const response = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(response.body).toHaveProperty('id')
      expect(response.body).toHaveProperty('email', 'admin@example.com')
    })

    it('未登录应返回401', async () => {
      const response = await request(app)
        .get('/api/v1/auth/me')
        .expect(401)

      expect(response.body).toHaveProperty('error')
    })
  })
})
