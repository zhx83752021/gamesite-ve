<template>
  <!-- 遮罩层 -->
  <Transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <!-- 模态窗口内容 -->
      <Transition name="scale">
        <div
          v-if="visible"
          class="max-w-md w-full bg-gray-900/95 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 shadow-2xl relative"
          @click.stop
        >
          <!-- 关闭按钮 -->
          <button
            @click="handleClose"
            class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-full"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- 登录模式 -->
          <div v-if="isLogin">
            <div class="text-center mb-8">
              <h2 class="text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-2">
                欢迎回来
              </h2>
              <p class="text-gray-400">登录您的VR云游戏账户</p>
            </div>

            <form class="space-y-6" @submit.prevent="handleSubmit">
              <div>
                <label class="block text-gray-300 mb-2">用户名</label>
                <input
                  v-model="formData.username"
                  type="text"
                  placeholder="请输入用户名"
                  autocomplete="off"
                  class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-cyan-400 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label class="block text-gray-300 mb-2">密码</label>
                <div class="relative">
                  <input
                    v-model="formData.password"
                    :type="showLoginPassword ? 'text' : 'password'"
                    placeholder="请输入密码"
                    autocomplete="new-password"
                    class="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-cyan-400 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    @click="showLoginPassword = !showLoginPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    <svg v-if="showLoginPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="flex items-center justify-between text-sm">
                <label class="flex items-center text-gray-300">
                  <input v-model="rememberMe" type="checkbox" class="mr-2" />
                  记住我
                </label>
                <a href="#" class="text-cyan-400 hover:text-cyan-300">忘记密码？</a>
              </div>

              <button
                type="submit"
                :disabled="loading"
                class="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ loading ? '登录中...' : '登录' }}
              </button>

              <div class="text-center text-gray-400">
                还没有账号？
                <a href="#" class="text-cyan-400 hover:text-cyan-300 font-bold" @click.prevent="switchMode">立即注册</a>
              </div>
            </form>

          </div>

          <!-- 注册模式 -->
          <div v-else>
            <div class="text-center mb-8">
              <h2 class="text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-2">
                创建账号
              </h2>
              <p class="text-gray-400">加入VR云游戏社区</p>
            </div>

            <form class="space-y-5" @submit.prevent="handleSubmit">
              <div>
                <label class="block text-gray-300 mb-2">用户名</label>
                <input
                  v-model="formData.username"
                  @blur="checkUsername"
                  type="text"
                  placeholder="您的昵称"
                  class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-cyan-400 focus:outline-none transition-all"
                  :class="{ 'border-red-500': usernameError, 'border-green-500': usernameValid }"
                />
                <p v-if="usernameError" class="text-red-400 text-sm mt-1">{{ usernameError }}</p>
                <p v-if="usernameValid" class="text-green-400 text-sm mt-1">✓ 用户名可用</p>
              </div>

              <div>
                <label class="block text-gray-300 mb-2">邮箱</label>
                <input
                  v-model="formData.email"
                  @blur="checkEmail"
                  type="email"
                  placeholder="请输入邮箱"
                  class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-cyan-400 focus:outline-none transition-all"
                  :class="{ 'border-red-500': emailError, 'border-green-500': emailValid }"
                />
                <p v-if="emailError" class="text-red-400 text-sm mt-1">{{ emailError }}</p>
                <p v-if="emailValid" class="text-green-400 text-sm mt-1">✓ 邮箱可用</p>
              </div>

              <div>
                <label class="block text-gray-300 mb-2">密码</label>
                <div class="relative">
                  <input
                    v-model="formData.password"
                    :type="showRegPassword ? 'text' : 'password'"
                    placeholder="至少8位字符"
                    class="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-cyan-400 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    @click="showRegPassword = !showRegPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    👁️
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-gray-300 mb-2">确认密码</label>
                <div class="relative">
                  <input
                    v-model="formData.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    placeholder="再次输入密码"
                    class="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-cyan-400 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    👁️
                  </button>
                </div>
              </div>

              <label class="flex items-center text-gray-300 text-sm">
                <input v-model="agreeTerms" type="checkbox" class="mr-2" />
                我同意<a href="#" class="text-cyan-400 hover:text-cyan-300 mx-1">服务条款</a>和<a href="#" class="text-cyan-400 hover:text-cyan-300 mx-1">隐私政策</a>
              </label>

              <button
                type="submit"
                :disabled="loading || !agreeTerms"
                class="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ loading ? '注册中...' : '注册' }}
              </button>

              <div class="text-center text-gray-400">
                已有账号？
                <a href="#" class="text-cyan-400 hover:text-cyan-300 font-bold" @click.prevent="switchMode">立即登录</a>
              </div>
            </form>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { authApi } from '@/api/auth'
import { useUserStore } from '@/stores/user'

const props = defineProps<{
  modelValue: boolean
  mode?: 'login' | 'register'
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'success': []
}>()

const userStore = useUserStore()
const visible = ref(props.modelValue)
const isLogin = ref(props.mode !== 'register')
const loading = ref(false)
const rememberMe = ref(false)
const agreeTerms = ref(false)

const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// 密码显示控制
const showLoginPassword = ref(false)
const showRegPassword = ref(false)
const showConfirmPassword = ref(false)

// 验证状态
const usernameError = ref('')
const usernameValid = ref(false)
const emailError = ref('')
const emailValid = ref(false)
const checkingUsername = ref(false)
const checkingEmail = ref(false)

// 监听外部传入的值变化
watch(() => props.modelValue, (val) => {
  visible.value = val
})

watch(() => props.mode, (val) => {
  isLogin.value = val !== 'register'
})

// 监听对话框显示状态
watch(visible, (val) => {
  emit('update:modelValue', val)

  // 当对话框显示时添加ESC键监听，关闭时移除
  if (val) {
    document.addEventListener('keydown', handleEscKey)
  } else {
    document.removeEventListener('keydown', handleEscKey)
  }
})

// ESC键监听
function handleEscKey(event: KeyboardEvent) {
  if (event.key === 'Escape' && visible.value) {
    handleClose()
  }
}

// 组件卸载时清理事件监听
onUnmounted(() => {
  document.removeEventListener('keydown', handleEscKey)
})

// 切换登录/注册模式
function switchMode() {
  isLogin.value = !isLogin.value
  // 切换模式时清空所有表单
  resetForm()
}

// 重置表单
function resetForm() {
  formData.username = ''
  formData.email = ''
  formData.password = ''
  formData.confirmPassword = ''
  agreeTerms.value = false
  // 重置验证状态
  usernameError.value = ''
  usernameValid.value = false
  emailError.value = ''
  emailValid.value = false
}

// 清除密码（切换模式时使用）
function clearPasswords() {
  formData.password = ''
  formData.confirmPassword = ''
}

// 防抖定时器
let usernameCheckTimer: number | null = null
let emailCheckTimer: number | null = null

// 检查用户名是否存在
async function checkUsername() {
  if (!formData.username) {
    usernameError.value = ''
    usernameValid.value = false
    return
  }

  if (formData.username.length < 3) {
    usernameError.value = '用户名至少3个字符'
    usernameValid.value = false
    return
  }

  checkingUsername.value = true
  usernameError.value = ''
  usernameValid.value = false

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/v1/auth/check-username?username=${encodeURIComponent(formData.username)}`)
    const data = await response.json()

    console.log('Check username response:', data) // 调试日志

    if (data.code === 200) {
      if (data.data && data.data.exists === true) {
        usernameError.value = '用户名已被使用'
        usernameValid.value = false
      } else {
        usernameError.value = ''
        usernameValid.value = true
      }
    } else {
      // API返回错误
      usernameError.value = ''
      usernameValid.value = false
    }
  } catch (error) {
    console.error('Check username error:', error)
    // 网络错误时不显示验证结果
    usernameError.value = ''
    usernameValid.value = false
  } finally {
    checkingUsername.value = false
  }
}

// 实时检查用户名（防抖）
function checkUsernameDebounced() {
  if (usernameCheckTimer) {
    clearTimeout(usernameCheckTimer)
  }
  usernameCheckTimer = setTimeout(() => {
    checkUsername()
  }, 500) // 500ms防抖
}

// 检查邮箱是否存在
async function checkEmail() {
  if (!formData.email) {
    emailError.value = ''
    emailValid.value = false
    return
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.email)) {
    emailError.value = '邮箱格式不正确'
    emailValid.value = false
    return
  }

  checkingEmail.value = true
  emailError.value = ''
  emailValid.value = false

  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/v1/auth/check-email?email=${encodeURIComponent(formData.email)}`)
    const data = await response.json()

    console.log('Check email response:', data) // 调试日志

    if (data.code === 200) {
      if (data.data && data.data.exists === true) {
        emailError.value = '邮箱已被使用'
        emailValid.value = false
      } else {
        emailError.value = ''
        emailValid.value = true
      }
    } else {
      // API返回错误
      emailError.value = ''
      emailValid.value = false
    }
  } catch (error) {
    console.error('Check email error:', error)
    // 网络错误时不显示验证结果
    emailError.value = ''
    emailValid.value = false
  } finally {
    checkingEmail.value = false
  }
}

// 实时检查邮箱（防抖）
function checkEmailDebounced() {
  if (emailCheckTimer) {
    clearTimeout(emailCheckTimer)
  }
  emailCheckTimer = setTimeout(() => {
    checkEmail()
  }, 500) // 500ms防抖
}

// 监听用户名输入实时验证
watch(() => formData.username, () => {
  if (!isLogin.value && formData.username) {
    checkUsernameDebounced()
  }
})

// 监听邮箱输入实时验证
watch(() => formData.email, () => {
  if (!isLogin.value && formData.email) {
    checkEmailDebounced()
  }
})

// 关闭对话框
function handleClose() {
  visible.value = false
  // 只在登录模式下清空表单，注册模式保留信息
  if (isLogin.value) {
    resetForm()
  } else {
    // 注册模式只清除密码
    clearPasswords()
  }
}

// 处理点击遮罩层 - 已禁用，防止误关闭
// function handleBackdropClick(event: MouseEvent) {
//   if (event.target === event.currentTarget) {
//     handleClose()
//   }
// }

// 提交表单
async function handleSubmit() {
  // 防止重复提交
  if (loading.value) {
    return
  }

  // 简单验证
  if (!formData.username || !formData.password) {
    ElMessage.warning('请填写完整信息')
    return
  }

  if (!isLogin.value) {
    if (!formData.email) {
      ElMessage.warning('请输入邮箱')
      return
    }
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      ElMessage.warning('邮箱格式不正确')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      ElMessage.warning('两次输入的密码不一致')
      return
    }
    if (!agreeTerms.value) {
      ElMessage.warning('请同意服务条款和隐私政策')
      return
    }
  }

  loading.value = true
  try {
    if (isLogin.value) {
      // 登录
      const res = await authApi.login({
        username: formData.username,
        password: formData.password
      })

      if (res.code === 200) {
        // 保存token和用户信息
        userStore.setToken(res.data.token)
        userStore.setUser(res.data.user)

        ElMessage.success('登录成功！')
        visible.value = false
        emit('success')
      } else {
        ElMessage.error(res.message || '登录失败')
      }
    } else {
      // 注册
      const res = await authApi.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      })

      if (res.code === 201 || res.code === 200) {
        ElMessage.success('注册成功！请登录')
        // 切换到登录模式
        isLogin.value = true
        formData.password = ''
        formData.confirmPassword = ''
      } else {
        ElMessage.error(res.message || '注册失败')
        // 注册失败时清除密码
        if (!isLogin.value) {
          formData.password = ''
          formData.confirmPassword = ''
        }
      }
    }
  } catch (error: any) {
    console.error('Auth error:', error)
    ElMessage.error(error.response?.data?.message || '操作失败，请重试')
    // 发生错误时清除密码
    if (!isLogin.value) {
      formData.password = ''
      formData.confirmPassword = ''
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 缩放动画 */
.scale-enter-active,
.scale-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0.95);
  opacity: 0;
}
</style>

<style scoped>
:deep(.el-dialog) {
  background: linear-gradient(to bottom right, #1f2937, #111827);
  border: 1px solid #374151;
}

:deep(.el-dialog__title) {
  color: #06b6d4;
  font-size: 1.5rem;
  font-weight: bold;
}

:deep(.el-form-item__label) {
  color: #9ca3af;
}

:deep(.el-input__wrapper) {
  background-color: #1f2937;
  border: 1px solid #374151;
}

:deep(.el-input__inner) {
  color: #f3f4f6;
}

:deep(.el-button--primary) {
  background: linear-gradient(to right, #06b6d4, #3b82f6);
  border: none;
}
</style>
