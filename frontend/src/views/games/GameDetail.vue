<template>
  <div class="min-h-screen pb-16">
    <!-- 游戏头图 -->
    <div class="relative h-[60vh] overflow-hidden">
      <img src="https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=1920&h=1080&fit=crop"
           class="w-full h-full object-cover" alt="Game Banner"/>
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

      <div class="absolute bottom-0 left-0 right-0 p-8">
        <div class="max-w-7xl mx-auto">
          <div class="flex gap-8 items-end">
            <img src="https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=300&h=400&fit=crop"
                 class="w-48 rounded-2xl shadow-2xl hidden md:block"/>
            <div class="flex-1">
              <div class="flex gap-2 mb-3">
                <span class="px-3 py-1 bg-blue-500 rounded-full text-sm font-bold">VR</span>
                <span class="px-3 py-1 bg-purple-500 rounded-full text-sm font-bold">在线多人</span>
                <span class="px-3 py-1 bg-red-500 rounded-full text-sm font-bold">HOT</span>
              </div>
              <h1 class="text-5xl font-bold text-white mb-4">Beat Saber</h1>
              <div class="flex items-center gap-6 text-lg">
                <div class="flex items-center gap-2">
                  <span class="text-yellow-400">⭐⭐⭐⭐⭐</span>
                  <span class="text-gray-300">4.9 (1,256评价)</span>
                </div>
                <div class="text-gray-300">125K+ 下载</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-gray-400 line-through text-xl">¥98</div>
              <div class="text-5xl font-bold text-cyan-400 mb-4">¥78</div>
              <button class="px-12 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-lg font-bold rounded-full hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all duration-300 transform hover:scale-105">
                立即购买
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 内容区 -->
    <div class="max-w-7xl mx-auto px-4 mt-12">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 主要内容 -->
        <div class="lg:col-span-2 space-y-8">
          <!-- 游戏介绍 -->
          <section class="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700/50">
            <h2 class="text-2xl font-bold text-cyan-400 mb-4">游戏介绍</h2>
            <p class="text-gray-300 leading-relaxed mb-4">
              Beat Saber 是一款独特的 VR 节奏游戏，玩家手持光剑，随着音乐节奏劈砍迎面而来的方块。每个方块都标有箭头指示你需要匹配的劈砍方向。
            </p>
            <p class="text-gray-300 leading-relaxed">
              游戏结合了令人满意的节拍、充满活力的霓虹灯场景和精心编排的关卡，为玩家带来独一无二的音乐游戏体验。支持自定义歌曲和Mod，游戏内容几乎无限。
            </p>
          </section>

          <!-- 截图展示 -->
          <section>
            <h2 class="text-2xl font-bold text-cyan-400 mb-4">游戏截图</h2>
            <div class="grid grid-cols-2 gap-4">
              <img v-for="i in 4" :key="i"
                   :src="`https://images.unsplash.com/photo-${i % 2 === 0 ? '1622979135225-d2ba269cf1ac' : '1538481199705-c710c4e965fc'}?w=600&h=400&fit=crop`"
                   class="rounded-xl hover:scale-105 transition-transform duration-300 cursor-pointer"/>
            </div>
          </section>

          <!-- 用户评价 -->
          <section class="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700/50">
            <h2 class="text-2xl font-bold text-cyan-400 mb-6">用户评价</h2>
            <div class="space-y-4">
              <div v-for="i in 3" :key="i" class="border-b border-gray-700 pb-4 last:border-0">
                <div class="flex items-center gap-3 mb-2">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500"></div>
                  <div>
                    <div class="font-bold text-white">玩家{{ i }}</div>
                    <div class="text-sm text-gray-400">2024-12-0{{ i }}</div>
                  </div>
                  <div class="ml-auto text-yellow-400">⭐⭐⭐⭐⭐</div>
                </div>
                <p class="text-gray-300">这是我玩过最好的VR游戏！音乐和节奏完美结合，非常有趣！</p>
              </div>
            </div>
          </section>
        </div>

        <!-- 侧边栏 -->
        <div class="space-y-6">
          <!-- 游戏信息 -->
          <div class="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
            <h3 class="text-xl font-bold text-cyan-400 mb-4">游戏信息</h3>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-400">开发商</span>
                <span class="text-white font-medium">Beat Games</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">发行商</span>
                <span class="text-white font-medium">Meta</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">发布日期</span>
                <span class="text-white font-medium">2019-05-21</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">平台</span>
                <span class="text-white font-medium">Quest, PC VR, PSVR</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">语言</span>
                <span class="text-white font-medium">中文, English</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">年龄分级</span>
                <span class="text-white font-medium">7+</span>
              </div>
            </div>
          </div>

          <!-- 系统要求 -->
          <div class="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
            <h3 class="text-xl font-bold text-cyan-400 mb-4">系统要求</h3>
            <div class="space-y-3 text-sm">
              <div>
                <div class="text-gray-400 mb-1">最低配置</div>
                <div class="text-white">Intel i5-4590 / 8GB RAM / GTX 970</div>
              </div>
              <div>
                <div class="text-gray-400 mb-1">推荐配置</div>
                <div class="text-white">Intel i7-8700 / 16GB RAM / RTX 2060</div>
              </div>
              <div>
                <div class="text-gray-400 mb-1">存储空间</div>
                <div class="text-white">需要 2 GB 可用空间</div>
              </div>
            </div>
          </div>

          <!-- 相关推荐 -->
          <div class="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
            <h3 class="text-xl font-bold text-cyan-400 mb-4">相关推荐</h3>
            <div class="space-y-3">
              <div v-for="i in 3" :key="i" class="flex gap-3 cursor-pointer group">
                <img :src="`https://images.unsplash.com/photo-${i % 2 === 0 ? '1542751371-adc38448a05e' : '1511512578047-dfb367046420'}?w=100&h=130&fit=crop`"
                     class="w-20 rounded-lg group-hover:scale-105 transition-transform"/>
                <div class="flex-1">
                  <div class="font-bold text-white group-hover:text-cyan-400 transition-colors text-sm">推荐游戏{{ i }}</div>
                  <div class="text-yellow-400 text-xs my-1">⭐ 4.{{ 7 + i }}</div>
                  <div class="text-cyan-400 font-bold text-sm">¥{{ 88 + i * 10 }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { gameApi } from '@/api/game'
import { ElMessage } from 'element-plus'

const route = useRoute()
const loading = ref(false)
const game = ref<any>(null)
const comments = ref<any[]>([])

// 获取游戏详情
async function loadGameDetail() {
  loading.value = true
  try {
    const gameId = route.params.id as string
    const res = await gameApi.getDetail(gameId)

    if (res.code === 200) {
      game.value = res.data.game
      // 加载评论
      await loadComments(gameId)
    }
  } catch (error) {
    console.error('Failed to load game detail:', error)
    ElMessage.error('加载游戏详情失败')
  } finally {
    loading.value = false
  }
}

// 获取游戏评论（需要后端API）
async function loadComments(gameId: string) {
  try {
    // TODO: 调用评论API
    // const res = await commentApi.getGameComments(gameId)
    // comments.value = res.data.items
  } catch (error) {
    console.error('Failed to load comments:', error)
  }
}

// 格式化日期
function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN')
}

// 渲染星级
function renderStars(rating: number) {
  return '⭐'.repeat(Math.round(rating))
}

onMounted(() => {
  loadGameDetail()
})
</script>
