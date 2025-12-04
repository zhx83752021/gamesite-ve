import request from '@/utils/request'

export const authApi = {
  // 登录
  login: (data: { username: string; password: string }) =>
    request.post('/v1/auth/login', data),

  // 注册
  register: (data: { username: string; email: string; password: string }) =>
    request.post('/v1/auth/register', data),

  // 获取当前用户信息
  getCurrentUser: () => request.get('/v1/auth/me'),

  // 刷新Token
  refreshToken: (refreshToken: string) =>
    request.post('/v1/auth/refresh', { refreshToken }),

  // 修改密码
  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    request.post('/v1/auth/change-password', data),

  // 登出
  logout: () => request.post('/v1/auth/logout'),
}
