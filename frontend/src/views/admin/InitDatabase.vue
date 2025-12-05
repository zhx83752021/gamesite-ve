<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
      <h1 class="text-3xl font-bold text-white mb-6 text-center">数据库初始化</h1>

      <!-- 状态显示 -->
      <div v-if="status" class="mb-6 p-4 rounded-xl" :class="{
        'bg-green-500/20 text-green-400': status.type === 'success',
        'bg-red-500/20 text-red-400': status.type === 'error',
        'bg-blue-500/20 text-blue-400': status.type === 'info'
      }">
        <div class="font-bold mb-2">{{ status.title }}</div>
        <div class="text-sm">{{ status.message }}</div>
      </div>

      <!-- 输入密钥 -->
      <div class="mb-6">
        <label class="block text-gray-300 mb-2">初始化密钥</label>
        <input
          v-model="secret"
          type="password"
          placeholder="请输入 INIT_DB_SECRET 密钥"
          class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-cyan-400 focus:outline-none transition-all"
        />
        <div class="text-sm text-gray-400 mt-2">
          提示：密钥在 Vercel 环境变量中设置的值
        </div>
      </div>

      <!-- 初始化按钮 -->
      <button
        @click="initDatabase"
        :disabled="loading || !secret"
        class="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        <span v-if="loading" class="flex items-center justify-center gap-2">
          <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          初始化中...
        </span>
        <span v-else>开始初始化数据库</span>
      </button>

      <!-- 说明 -->
      <div class="mt-6 p-4 bg-gray-800/50 rounded-xl">
        <div class="text-sm text-gray-300 space-y-2">
          <div class="font-bold text-cyan-400 mb-2">初始化后将创建：</div>
          <div>• 10个测试游戏数据</div>
          <div>• 2个测试账户（admin / developer1）</div>
          <div>• 多个游戏分类</div>
          <div>• 必要的数据库索引</div>
          <div class="text-xs text-gray-500 mt-3">
            ⚠️ 注意：如果数据已存在，将不会重复创建
          </div>
        </div>
      </div>

      <!-- 返回按钮 -->
      <button
        @click="$router.push('/admin')"
        class="w-full mt-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-all"
      >
        返回后台
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const secret = ref('')
const loading = ref(false)
const status = ref<{type: string, title: string, message: string} | null>(null)

async function initDatabase() {
  if (!secret.value) {
    ElMessage.warning('请输入初始化密钥')
    return
  }

  loading.value = true
  status.value = {
    type: 'info',
    title: '正在初始化...',
    message: '请稍候，正在创建数据库表和插入测试数据'
  }

  try {
    // 调用初始化接口
    const response = await fetch('/init-db', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        secret: secret.value
      })
    })

    const data = await response.json()

    if (response.ok && data.success) {
      const insertedGames = data.gamesAdded || 0;
      const totalGames = data.totalGames || 10;
      const skippedGames = totalGames - insertedGames;

      let message = `数据库初始化完成！`;
      if (insertedGames > 0) {
        message += `\n✅ 新增 ${insertedGames} 个游戏`;
      }
      if (skippedGames > 0) {
        message += `\n⚠️ ${skippedGames} 个游戏已存在，已跳过`;
      }
      message += '\n现在可以访问游戏库页面查看数据了。';

      status.value = {
        type: 'success',
        title: '初始化成功！',
        message: message
      }
      ElMessage.success('数据库初始化成功！')

      // 3秒后跳转到游戏列表
      setTimeout(() => {
        window.location.href = '/games'
      }, 3000)
    } else {
      throw new Error(data.error || data.message || '初始化失败')
    }
  } catch (error: any) {
    console.error('Init database error:', error)

    if (error.message.includes('Unauthorized') || error.message.includes('403')) {
      status.value = {
        type: 'error',
        title: '密钥错误',
        message: '提供的密钥不正确，请检查 Vercel 环境变量中的 INIT_DB_SECRET 值'
      }
    } else {
      status.value = {
        type: 'error',
        title: '初始化失败',
        message: error.message || '发生未知错误，请检查网络连接或稍后重试'
      }
    }

    ElMessage.error('初始化失败：' + error.message)
  } finally {
    loading.value = false
  }
}
</script>
