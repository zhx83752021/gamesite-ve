<template>
  <div class="min-h-screen">
    <!-- 页面标题 - 游戏背景图 -->
    <div class="relative py-24 mb-8 -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 overflow-hidden">
      <!-- 背景图 -->
      <div class="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1920&h=600&fit=crop"
             alt="Games Library"
             class="w-full h-full object-cover"/>
      </div>
      <!-- 渐变遮罩 -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

      <div class="relative z-10 max-w-7xl mx-auto px-8">
        <h1 class="text-6xl font-bold text-white mb-4 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
          游戏库
        </h1>
        <p class="text-2xl text-gray-200 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">发现更多精彩VR游戏</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4">
      <!-- 筛选栏 -->
      <div class="flex flex-wrap gap-4 mb-8">
        <button v-for="filter in filters" :key="filter"
                :class="[
                  'px-6 py-2 rounded-full font-medium transition-all duration-300',
                  filter === activeFilter
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)]'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700'
                ]"
                @click="handleFilterChange(filter)">
          {{ filter }}
        </button>
      </div>

      <!-- 加载中 -->
      <div v-if="loading" class="text-center py-12">
        <div class="text-cyan-400 text-xl">加载中...</div>
      </div>

      <!-- 游戏网格 -->
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <div v-for="game in allGames" :key="game.id"
             class="group cursor-pointer"
             @click="$router.push(`/games/${game.slug || game.id}`)">
          <div class="relative rounded-2xl overflow-hidden mb-3 transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]">
            <img :src="game.cover_image" :alt="game.title" class="w-full aspect-[3/4] object-cover"/>
            <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="absolute bottom-4 left-4 right-4">
                <div class="text-xs text-gray-300 mb-1">{{ game.category_name }}</div>
                <div class="flex gap-2">
                  <span class="px-2 py-1 bg-blue-500/80 rounded text-xs">VR</span>
                  <span class="px-2 py-1 bg-purple-500/80 rounded text-xs">在线</span>
                </div>
              </div>
            </div>
            <div v-if="isNewGame(game.created_at)" class="absolute top-2 right-2 px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-xs font-bold">
              NEW
            </div>
          </div>
          <h3 class="font-bold text-gray-200 group-hover:text-cyan-400 transition-colors truncate">{{ game.title }}</h3>
          <div class="flex items-center justify-between text-sm mt-1">
            <span class="text-yellow-400">⭐ {{ game.rating }}</span>
            <span class="text-cyan-400 font-bold">¥{{ game.price }}</span>
          </div>
        </div>
      </div>

      <!-- 加载更多 -->
      <div v-if="allGames.length < total" class="text-center py-12">
        <button
          @click="loadMore"
          :disabled="loading"
          class="px-10 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-cyan-400 font-bold rounded-full border border-cyan-400/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 disabled:opacity-50">
          {{ loading ? '加载中...' : '加载更多' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { gameApi } from '@/api/game'
import { ElMessage } from 'element-plus'

interface Game {
  id: string
  title: string
  slug: string
  cover_image: string
  rating: number
  price: number
  category_name: string
  created_at: string
}

const loading = ref(false)
const allGames = ref<Game[]>([])
const categories = ref<any[]>([])
const activeFilter = ref('全部游戏')
const currentPage = ref(1)
const pageSize = ref(15)
const total = ref(0)

// 动态筛选器
const filters = computed(() => {
  const categoryFilters = categories.value.map(cat => cat.name)
  return ['全部游戏', ...categoryFilters, '最新上架', '热门推荐']
})

// 加载游戏分类
async function loadCategories() {
  try {
    const res = await gameApi.getCategories()
    if (res.code === 200) {
      categories.value = res.data.categories
    }
  } catch (error) {
    console.error('Failed to load categories:', error)
  }
}

// 加载游戏列表
async function loadGames() {
  loading.value = true
  try {
    let params: any = {
      page: currentPage.value,
      pageSize: pageSize.value,
      sortBy: 'rating',
      order: 'desc'
    }

    // 根据筛选条件调整参数
    if (activeFilter.value !== '全部游戏') {
      if (activeFilter.value === '最新上架') {
        params.sortBy = 'created_at'
      } else if (activeFilter.value === '热门推荐') {
        params.sortBy = 'downloads'
      } else {
        // 分类筛选 - 使用分类ID
        const category = categories.value.find(cat => cat.name === activeFilter.value)
        if (category && category.id) {
          params.category = category.id
        }
      }
    }

    const res = await gameApi.getList(params)
    if (res.code === 200) {
      allGames.value = res.data.items
      total.value = res.data.pagination.total
    }
  } catch (error: any) {
    console.error('Failed to load games:', error)
    ElMessage.error('加载游戏列表失败：' + (error.message || '网络错误'))
  } finally {
    loading.value = false
  }
}

// 切换筛选
function handleFilterChange(filter: string) {
  activeFilter.value = filter
  currentPage.value = 1
  loadGames()
}

// 加载更多
function loadMore() {
  currentPage.value++
  loadGames()
}

// 判断是否为新游戏（30天内发布）
function isNewGame(createdAt: string) {
  const daysDiff = Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24))
  return daysDiff <= 30
}

onMounted(() => {
  loadCategories()
  loadGames()
})
</script>
