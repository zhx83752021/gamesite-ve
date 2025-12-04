import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
// 定义响应数据结构
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}
// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})
// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    // 添加token
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)
// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 直接返回 response.data，它应该符合 ApiResponse 结构
    return response.data as any
  },
  (error) => {
    console.error('Response error:', error)
    let message = '请求失败'
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message = '未授权，请登录'
          const userStore = useUserStore()
          userStore.logout()
          window.location.href = '/login'
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = '请求地址不存在'
          break
        case 500:
          message = '服务器错误'
          break
        default:
          message = error.response.data?.message || '请求失败'
      }
    } else if (error.message) {
      message = error.message
    }
    ElMessage.error(message)
    return Promise.reject(error)
  }
)
// 封装请求方法，提供正确的类型
const request = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return service.get(url, config)
  },
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return service.post(url, data, config)
  },
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return service.put(url, data, config)
  },
  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return service.delete(url, config)
  },
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return service.patch(url, data, config)
  }
}
export default request
