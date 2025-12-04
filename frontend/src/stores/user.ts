import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  role: string
}

export const useUserStore = defineStore('user', () => {
  // 状态
  const userInfo = ref<User | null>(null)
  const token = ref<string>(localStorage.getItem('token') || '')
  const isLoggedIn = ref<boolean>(!!token.value)

  // 计算属性
  const userId = computed(() => userInfo.value?.id)
  const username = computed(() => userInfo.value?.username)
  const isAdmin = computed(() => userInfo.value?.role === 'admin')

  // 方法
  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
    isLoggedIn.value = true
  }

  function setUserInfo(user: User) {
    userInfo.value = user
  }

  function setUser(user: User) {
    userInfo.value = user
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    isLoggedIn.value = false
    localStorage.removeItem('token')
  }

  function login(loginToken: string, user: User) {
    setToken(loginToken)
    setUserInfo(user)
  }

  return {
    userInfo,
    token,
    isLoggedIn,
    userId,
    username,
    isAdmin,
    setToken,
    setUserInfo,
    setUser,
    logout,
    login
  }
})
