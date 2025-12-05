<template>
  <div class="p-8">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold text-white">{{ isEdit ? '编辑游戏' : '添加游戏' }}</h1>
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
            <label class="block text-gray-300 mb-2">游戏标题 *</label>
            <input
              v-model="form.title"
              type="text"
              class="w-full bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label class="block text-gray-300 mb-2">Slug (URL标识) *</label>
            <input
              v-model="form.slug"
              type="text"
              placeholder="例如: beat-saber"
              class="w-full bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label class="block text-gray-300 mb-2">副标题</label>
            <input
              v-model="form.subtitle"
              type="text"
              class="w-full bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label class="block text-gray-300 mb-2">分类 *</label>
            <select
              v-model="form.categoryId"
              class="w-full bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            >
              <option value="">请选择分类</option>
              <option value="1">动作冒险</option>
              <option value="2">射击游戏</option>
              <option value="3">恐怖生存</option>
              <option value="4">休闲益智</option>
              <option value="5">竞速游戏</option>
            </select>
          </div>

          <div>
            <label class="block text-gray-300 mb-2">开发商</label>
            <input
              v-model="form.developer"
              type="text"
              class="w-full bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label class="block text-gray-300 mb-2">发行商</label>
            <input
              v-model="form.publisher"
              type="text"
              class="w-full bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <!-- 价格信息 -->
          <div class="md:col-span-2">
            <h2 class="text-xl font-bold text-white mb-4 mt-6">价格信息</h2>
          </div>

          <div>
            <label class="block text-gray-300 mb-2">价格类型 *</label>
            <select
              v-model="form.pricingType"
              class="w-full bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="free">免费</option>
              <option value="paid">付费</option>
              <option value="subscription">订阅</option>
            </select>
          </div>

          <div>
            <label class="block text-gray-300 mb-2">价格 (¥)</label>
            <input
              v-model.number="form.price"
              type="number"
              step="0.01"
              class="w-full bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label class="block text-gray-300 mb-2">折扣价 (¥)</label>
            <input
              v-model.number="form.discountPrice"
              type="number"
              step="0.01"
              class="w-full bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label class="block text-gray-300 mb-2">折扣截止日期</label>
            <input
              v-model="form.discountEndDate"
              type="date"
              class="w-full bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <!-- 媒体资源 -->
          <div class="md:col-span-2">
            <h2 class="text-xl font-bold text-white mb-4 mt-6">媒体资源</h2>
          </div>

          <div class="md:col-span-2">
            <label class="block text-gray-300 mb-2">封面图片URL</label>
            <input
              v-model="form.coverImage"
              type="url"
              placeholder="https://example.com/image.jpg"
              class="w-full bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div class="md:col-span-2">
            <label class="block text-gray-300 mb-2">预告片视频URL</label>
            <input
              v-model="form.trailerVideo"
              type="url"
              placeholder="https://example.com/video.mp4"
              class="w-full bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <!-- 描述信息 -->
          <div class="md:col-span-2">
            <h2 class="text-xl font-bold text-white mb-4 mt-6">描述信息</h2>
          </div>

          <div class="md:col-span-2">
            <label class="block text-gray-300 mb-2">简短描述</label>
            <textarea
              v-model="form.shortDescription"
              class="w-full bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              rows="3"
            ></textarea>
          </div>

          <div class="md:col-span-2">
            <label class="block text-gray-300 mb-2">详细描述</label>
            <textarea
              v-model="form.fullDescription"
              class="w-full bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              rows="6"
            ></textarea>
          </div>

          <!-- 其他设置 -->
          <div class="md:col-span-2">
            <h2 class="text-xl font-bold text-white mb-4 mt-6">其他设置</h2>
          </div>

          <div>
            <label class="block text-gray-300 mb-2">发布日期</label>
            <input
              v-model="form.releaseDate"
              type="date"
              class="w-full bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div>
            <label class="block text-gray-300 mb-2">年龄分级</label>
            <select
              v-model="form.ageRating"
              class="w-full bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="E">E - 所有人</option>
              <option value="T">T - 青少年</option>
              <option value="M">M - 成熟</option>
              <option value="A">A - 仅成人</option>
            </select>
          </div>

          <div>
            <label class="block text-gray-300 mb-2">状态</label>
            <select
              v-model="form.status"
              class="w-full bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="draft">草稿</option>
              <option value="review">审核中</option>
              <option value="published">已发布</option>
              <option value="archived">已归档</option>
            </select>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="flex gap-4 mt-8">
          <button
            type="submit"
            :disabled="loading"
            class="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all disabled:opacity-50"
          >
            {{ loading ? '保存中...' : (isEdit ? '保存修改' : '添加游戏') }}
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
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const loading = ref(false)

const isEdit = computed(() => route.name === 'AdminGameEdit')

const form = ref({
  title: '',
  slug: '',
  subtitle: '',
  categoryId: '',
  developer: '',
  publisher: '',
  pricingType: 'paid',
  price: 0,
  discountPrice: 0,
  discountEndDate: '',
  coverImage: '',
  trailerVideo: '',
  shortDescription: '',
  fullDescription: '',
  releaseDate: '',
  ageRating: 'E',
  status: 'draft'
})

// 如果是编辑模式，加载游戏数据
onMounted(async () => {
  if (isEdit.value) {
    const gameId = route.params.id
    // TODO: 调用后端API加载游戏数据
    console.log('Loading game:', gameId)
  }
})

async function handleSubmit() {
  loading.value = true
  try {
    // TODO: 调用后端API保存
    await new Promise(resolve => setTimeout(resolve, 1000))

    ElMessage.success(isEdit.value ? '游戏更新成功！' : '游戏添加成功！')
    router.push('/admin/games')
  } catch (error) {
    console.error('Failed to save game:', error)
    ElMessage.error('保存失败，请重试')
  } finally {
    loading.value = false
  }
}
</script>
