<template>
  <div class="min-h-screen bg-gradient-dark cyber-grid relative overflow-hidden">
    <!-- 背景装饰 -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-neon-purple opacity-10 blur-3xl rounded-full"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 bg-neon-blue opacity-10 blur-3xl rounded-full"></div>

    <!-- 顶部导航栏 -->
    <nav class="relative z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
      <div class="w-full px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <div class="flex items-center">
            <router-link to="/" class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span class="text-2xl">🎮</span>
              </div>
              <span class="text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
                VR云游戏
              </span>
            </router-link>

            <div class="hidden lg:flex ml-10 space-x-1">
              <router-link
                to="/"
                class="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200 font-medium">
                首页
              </router-link>
              <router-link
                to="/games"
                class="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200 font-medium">
                游戏库
              </router-link>
              <router-link
                to="/pricing"
                class="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200 font-medium">
                价格套餐
              </router-link>
              <router-link
                to="/vip"
                class="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200 font-medium relative">
                VIP会员
                <span class="absolute -top-1 -right-1 px-1.5 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs rounded-full">HOT</span>
              </router-link>
              <router-link
                to="/activities"
                class="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200 font-medium">
                活动中心
              </router-link>
              <router-link
                to="/download"
                class="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200 font-medium">
                下载
              </router-link>
              <router-link
                to="/help"
                class="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all duration-200 font-medium">
                帮助
              </router-link>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <div class="relative hidden md:block">
              <input
                type="text"
                placeholder="搜索游戏..."
                class="w-64 px-4 py-2 bg-gray-800 text-white rounded-full border border-gray-700 focus:border-cyan-400 focus:outline-none transition-all"
              />
              <svg class="w-5 h-5 text-gray-400 absolute right-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>

            <!-- 未登录状态 -->
            <template v-if="!userStore.isLoggedIn">
              <button
                @click="openLoginModal('login')"
                class="px-5 py-2 text-gray-300 hover:text-white font-medium transition-colors">
                登录
              </button>
              <button
                @click="openLoginModal('register')"
                class="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all duration-300">
                注册
              </button>
            </template>

            <!-- 已登录状态 -->
            <template v-else>
              <router-link
                to="/user"
                class="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-all">
                <img v-if="userStore.userInfo?.avatar" :src="userStore.userInfo.avatar" class="w-8 h-8 rounded-full" />
                <div v-else class="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {{ userStore.username?.charAt(0).toUpperCase() }}
                </div>
                <span>{{ userStore.username }}</span>
              </router-link>
              <button
                @click="handleLogout"
                class="px-4 py-2 text-gray-400 hover:text-white transition-colors">
                退出
              </button>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主体内容 -->
    <main class="relative z-10">
      <router-view />
      <!-- 内容区域容器 -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"></div>
    </main>

    <!-- 底部 - 赛博朋克风格 -->
    <footer class="relative z-10 bg-cyber-darkest/80 backdrop-blur-md border-t border-neon-purple/20 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
        <p class="text-gray-400">© 2024 <span class="text-neon-cyan">VR NEXUS</span>. Powered by Future Tech.</p>
        <p class="text-xs text-gray-500 mt-2">Enter the Virtual Reality Revolution</p>
      </div>
    </footer>

    <!-- 登录/注册模态窗口 -->
    <LoginModal v-model="showLoginModal" :mode="loginMode" @success="handleLoginSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import LoginModal from '@/components/auth/LoginModal.vue'

const router = useRouter()
const userStore = useUserStore()

const showLoginModal = ref(false)
const loginMode = ref<'login' | 'register'>('login')

// 打开登录/注册模态窗口
function openLoginModal(mode: 'login' | 'register') {
  loginMode.value = mode
  showLoginModal.value = true
}

// 登录成功回调
function handleLoginSuccess() {
  ElMessage.success('欢迎回来！')
}

// 退出登录
function handleLogout() {
  userStore.logout()
  ElMessage.success('已退出登录')
  router.push('/')
}
</script>
