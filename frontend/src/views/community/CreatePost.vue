<template>
  <div class="min-h-screen py-16">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-4xl font-bold text-white mb-8">发布帖子</h1>

      <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
        <form @submit.prevent="handleSubmit">
          <!-- 选择板块 -->
          <div class="mb-6">
            <label class="block text-white font-bold mb-2">选择板块</label>
            <select
              v-model="form.category"
              class="w-full bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">请选择板块</option>
              <option value="game-discuss">游戏讨论</option>
              <option value="experience">游戏体验</option>
              <option value="help">新手求助</option>
              <option value="strategy">攻略分享</option>
              <option value="feedback">意见反馈</option>
            </select>
          </div>

          <!-- 标题 -->
          <div class="mb-6">
            <label class="block text-white font-bold mb-2">标题</label>
            <input
              v-model="form.title"
              type="text"
              placeholder="请输入帖子标题"
              class="w-full bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <!-- 内容 -->
          <div class="mb-6">
            <label class="block text-white font-bold mb-2">内容</label>
            <textarea
              v-model="form.content"
              placeholder="分享你的想法..."
              class="w-full bg-gray-800 text-white rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
              rows="12"
              required
            ></textarea>
          </div>

          <!-- 图片上传 -->
          <div class="mb-6">
            <label class="block text-white font-bold mb-2">上传图片（可选）</label>
            <div class="grid grid-cols-4 gap-4">
              <div
                v-for="i in 4"
                :key="i"
                class="aspect-square bg-gray-800 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors border-2 border-dashed border-gray-600"
              >
                <span class="text-gray-500 text-3xl">+</span>
              </div>
            </div>
            <div class="text-sm text-gray-400 mt-2">支持jpg、png格式，单张不超过5MB，最多4张</div>
          </div>

          <!-- 标签 -->
          <div class="mb-6">
            <label class="block text-white font-bold mb-2">添加标签</label>
            <input
              v-model="form.tags"
              type="text"
              placeholder="输入标签，用空格分隔"
              class="w-full bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <!-- 按钮 -->
          <div class="flex gap-4">
            <button
              type="submit"
              :disabled="loading"
              class="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all disabled:opacity-50"
            >
              {{ loading ? '发布中...' : '发布帖子' }}
            </button>
            <button
              type="button"
              @click="$router.back()"
              class="px-8 py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition-all"
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const form = ref({
  category: '',
  title: '',
  content: '',
  tags: ''
})

async function handleSubmit() {
  if (!form.value.category) {
    ElMessage.warning('请选择板块')
    return
  }

  loading.value = true
  try {
    // TODO: 调用后端API
    await new Promise(resolve => setTimeout(resolve, 1000))

    ElMessage.success('发布成功！')
    router.push('/community')
  } catch (error) {
    console.error('Failed to create post:', error)
    ElMessage.error('发布失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>
