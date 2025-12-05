<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-white">编辑用户</h1>
      <button
        @click="$router.back()"
        class="px-6 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-all"
      >
        返回列表
      </button>
    </div>

    <div class="bg-gray-900 rounded-2xl p-8 border border-gray-800">
      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 基本信息 -->
          <div class="md:col-span-2">
            <h2 class="text-xl font-bold text-white mb-4">基本信息</h2>
          </div>

          <div>
            <label class="block text-gray-300 mb-2">用户名 *</label>
            <input
              v-model="form.username"
              type="text"
              class="w-full bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label class="block text-gray-300 mb-2">邮箱 *</label>
            <input
              v-model="form.email"
              type="email"
              class="w-full bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label class="block text-gray-300 mb-2">手机号</label>
            <input
              v-model="form.phone"
              type="tel"
              class="w-full bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label class="block text-gray-300 mb-2">角色 *</label>
            <select
              v-model="form.role"
              class="w-full bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            >
              <option value="user">普通用户</option>
              <option value="vip">VIP用户</option>
              <option value="developer">开发者</option>
              <option value="moderator">版主</option>
              <option value="admin">管理员</option>
            </select>
          </div>

          <div>
            <label class="block text-gray-300 mb-2">状态 *</label>
            <select
              v-model="form.status"
              class="w-full bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            >
              <option value="active">正常</option>
              <option value="banned">封禁</option>
              <option value="pending">待审核</option>
            </select>
          </div>

          <div>
            <label class="block text-gray-300 mb-2">邮箱验证状态</label>
            <select
              v-model="form.emailVerified"
              class="w-full bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option :value="true">已验证</option>
              <option :value="false">未验证</option>
            </select>
          </div>

          <!-- 统计信息 -->
          <div class="md:col-span-2">
            <h2 class="text-xl font-bold text-white mb-4 mt-6">统计信息</h2>
          </div>

          <div>
            <label class="block text-gray-300 mb-2">总游戏时长 (小时)</label>
            <input
              v-model.number="form.totalPlayTime"
              type="number"
              class="w-full bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              readonly
            />
          </div>

          <div>
            <label class="block text-gray-300 mb-2">拥有游戏数</label>
            <input
              v-model.number="form.gamesOwned"
              type="number"
              class="w-full bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              readonly
            />
          </div>

          <div>
            <label class="block text-gray-300 mb-2">成就数量</label>
            <input
              v-model.number="form.achievementsCount"
              type="number"
              class="w-full bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              readonly
            />
          </div>

          <div>
            <label class="block text-gray-300 mb-2">用户等级</label>
            <input
              v-model.number="form.level"
              type="number"
              class="w-full bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <!-- 个人简介 -->
          <div class="md:col-span-2">
            <label class="block text-gray-300 mb-2">个人简介</label>
            <textarea
              v-model="form.bio"
              class="w-full bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              rows="4"
            ></textarea>
          </div>

          <!-- 管理备注 -->
          <div class="md:col-span-2">
            <label class="block text-gray-300 mb-2">管理备注</label>
            <textarea
              v-model="form.adminNotes"
              class="w-full bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              rows="3"
              placeholder="仅管理员可见的备注信息"
            ></textarea>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="flex gap-4 mt-8">
          <button
            type="submit"
            :disabled="loading"
            class="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all disabled:opacity-50"
          >
            {{ loading ? '保存中...' : '保存修改' }}
          </button>
          <button
            type="button"
            @click="$router.back()"
            class="px-8 py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition-all"
          >
            取消
          </button>
          <button
            type="button"
            class="ml-auto px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all"
          >
            删除用户
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const loading = ref(false)

const form = ref({
  username: '',
  email: '',
  phone: '',
  role: 'user',
  status: 'active',
  emailVerified: false,
  totalPlayTime: 0,
  gamesOwned: 0,
  achievementsCount: 0,
  level: 1,
  bio: '',
  adminNotes: ''
})

// 加载用户数据
onMounted(async () => {
  const userId = route.params.id
  // TODO: 调用后端API加载用户数据
  // 模拟数据
  form.value = {
    username: 'VR玩家001',
    email: 'user@example.com',
    phone: '13800138000',
    role: 'user',
    status: 'active',
    emailVerified: true,
    totalPlayTime: 120,
    gamesOwned: 15,
    achievementsCount: 45,
    level: 12,
    bio: '热爱VR游戏的玩家',
    adminNotes: ''
  }
})

async function handleSubmit() {
  loading.value = true
  try {
    // TODO: 调用后端API保存
    await new Promise(resolve => setTimeout(resolve, 1000))

    ElMessage.success('用户信息更新成功！')
    router.push('/admin/users')
  } catch (error) {
    console.error('Failed to save user:', error)
    ElMessage.error('保存失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>
