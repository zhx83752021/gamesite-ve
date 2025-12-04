<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
    <!-- 背景动画效果 -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
      <div class="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse delay-1000"></div>
    </div>

    <!-- 登录卡片 -->
    <div class="relative z-10 w-full max-w-md px-6">
      <div class="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-8">
        <!-- Logo和标题 -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl mb-4">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-white mb-2">后台管理系统</h1>
          <p class="text-gray-400">VR Game Platform Admin</p>
        </div>

        <!-- 登录表单 -->
        <el-form
          ref="formRef"
          :model="formData"
          :rules="rules"
          autocomplete="off"
          @submit.prevent="handleLogin"
        >
          <el-form-item prop="username">
            <el-input
              v-model="formData.username"
              placeholder="管理员账户"
              size="large"
              autocomplete="off"
            >
              <template #prefix>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="formData.password"
              type="password"
              placeholder="密码"
              size="large"
              show-password
              autocomplete="new-password"
            >
              <template #prefix>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <div class="flex items-center justify-between text-sm w-full">
              <el-checkbox v-model="rememberMe">记住我</el-checkbox>
              <a href="#" class="text-cyan-400 hover:text-cyan-300">忘记密码？</a>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="loading"
              class="w-full"
              @click="handleLogin"
            >
              <span v-if="!loading">登录</span>
              <span v-else>登录中...</span>
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 提示信息 -->
        <div class="mt-6 text-center text-sm text-gray-400">
          <p class="mb-2">测试账户</p>
          <div class="flex flex-wrap gap-2 justify-center">
            <el-tag size="small" type="info">admin / admin123</el-tag>
            <el-tag size="small" type="success">developer1 / admin123</el-tag>
          </div>
        </div>

        <!-- 返回前台链接 -->
        <div class="mt-6 text-center">
          <router-link to="/" class="text-cyan-400 hover:text-cyan-300 text-sm flex items-center justify-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回前台首页
          </router-link>
        </div>
      </div>

      <!-- 版权信息 -->
      <div class="text-center mt-8 text-gray-500 text-sm">
        <p>&copy; 2024 VR Game Platform. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { authApi } from '@/api/auth'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const formRef = ref<FormInstance>()
const loading = ref(false)
const rememberMe = ref(false)

const formData = reactive({
  username: '',
  password: ''
})

// 组件挂载时清空表单，防止浏览器自动填充
onMounted(() => {
  formData.username = ''
  formData.password = ''
})

const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入管理员账户', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' }
  ]
})

async function handleLogin() {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      const res = await authApi.login({
        username: formData.username,
        password: formData.password
      })

      if (res.code === 200) {
        const { token, user } = res.data

        // 检查是否有管理权限
        if (user.role !== 'admin' && user.role !== 'developer' && user.role !== 'moderator') {
          ElMessage.error('您没有访问后台的权限')
          return
        }

        // 保存登录信息
        userStore.setToken(token)
        userStore.setUser(user)

        if (rememberMe.value) {
          localStorage.setItem('rememberMe', 'true')
        }

        ElMessage.success('登录成功！')

        // 跳转到后台首页
        router.push('/admin/dashboard')
      } else {
        ElMessage.error(res.message || '登录失败')
      }
    } catch (error: any) {
      console.error('Login error:', error)
      ElMessage.error(error.response?.data?.message || '登录失败，请检查账号密码')
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
:deep(.el-input__wrapper) {
  background-color: rgba(31, 41, 55, 0.5);
  border: 1px solid rgba(75, 85, 99, 0.5);
  box-shadow: none;
}

:deep(.el-input__wrapper:hover) {
  border-color: rgba(6, 182, 212, 0.5);
}

:deep(.el-input__wrapper.is-focus) {
  border-color: #06b6d4;
  box-shadow: 0 0 0 1px rgba(6, 182, 212, 0.2);
}

:deep(.el-input__inner) {
  color: #f3f4f6;
}

:deep(.el-input__inner::placeholder) {
  color: #9ca3af;
}

:deep(.el-button--primary) {
  background: linear-gradient(to right, #06b6d4, #3b82f6);
  border: none;
  font-size: 16px;
  font-weight: 600;
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(to right, #0891b2, #2563eb);
  transform: translateY(-1px);
  box-shadow: 0 10px 25px -5px rgba(6, 182, 212, 0.3);
}

:deep(.el-checkbox__label) {
  color: #9ca3af;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #06b6d4;
  border-color: #06b6d4;
}

.animate-pulse {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.delay-1000 {
  animation-delay: 1s;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
}
</style>
