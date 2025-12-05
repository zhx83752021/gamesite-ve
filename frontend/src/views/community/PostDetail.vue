<template>
  <div class="min-h-screen py-16">
    <div class="max-w-5xl mx-auto px-4">
      <!-- 返回按钮 -->
      <button
        @click="$router.back()"
        class="mb-6 flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        返回列表
      </button>

      <div v-if="loading" class="text-center py-12">
        <div class="text-cyan-400 text-xl">加载中...</div>
      </div>

      <div v-else-if="post" class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
        <!-- 帖子标题 -->
        <h1 class="text-3xl font-bold text-white mb-4">{{ post.title }}</h1>

        <!-- 作者信息 -->
        <div class="flex items-center gap-4 mb-6 pb-6 border-b border-gray-700">
          <img :src="post.authorAvatar" class="w-12 h-12 rounded-full" alt="作者头像" />
          <div class="flex-1">
            <div class="font-bold text-white">{{ post.authorName }}</div>
            <div class="text-sm text-gray-400">{{ post.createdAt }}</div>
          </div>
          <div class="flex gap-4 text-sm text-gray-400">
            <span>👁️ {{ post.views }}</span>
            <span>💬 {{ post.replyCount }}</span>
            <span>👍 {{ post.likeCount }}</span>
          </div>
        </div>

        <!-- 帖子内容 -->
        <div class="prose prose-invert max-w-none mb-8">
          <div class="text-gray-300 leading-relaxed" v-html="post.content"></div>
        </div>

        <!-- 图片展示 -->
        <div v-if="post.images && post.images.length" class="grid grid-cols-2 gap-4 mb-8">
          <img
            v-for="(img, index) in post.images"
            :key="index"
            :src="img"
            class="rounded-lg cursor-pointer hover:scale-105 transition-transform"
            alt="帖子图片"
          />
        </div>

        <!-- 操作按钮 -->
        <div class="flex gap-4">
          <button class="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all">
            👍 点赞 ({{ post.likeCount }})
          </button>
          <button class="px-6 py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition-all">
            ⭐ 收藏
          </button>
          <button class="px-6 py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition-all">
            🔗 分享
          </button>
        </div>
      </div>

      <!-- 回复列表 -->
      <div v-if="!loading" class="mt-8">
        <h2 class="text-2xl font-bold text-white mb-6">全部回复 ({{ replies.length }})</h2>

        <!-- 发表回复 -->
        <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700 mb-6">
          <textarea
            v-model="replyContent"
            placeholder="写下你的回复..."
            class="w-full bg-gray-800 text-white rounded-xl p-4 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
            rows="4"
          ></textarea>
          <button class="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all">
            发表回复
          </button>
        </div>

        <!-- 回复列表 -->
        <div class="space-y-4">
          <div
            v-for="reply in replies"
            :key="reply.id"
            class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700"
          >
            <div class="flex items-start gap-4">
              <img :src="reply.authorAvatar" class="w-10 h-10 rounded-full" alt="回复者头像" />
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <span class="font-bold text-white">{{ reply.authorName }}</span>
                  <span class="text-sm text-gray-400">{{ reply.createdAt }}</span>
                </div>
                <div class="text-gray-300 mb-3">{{ reply.content }}</div>
                <div class="flex gap-4 text-sm">
                  <button class="text-gray-400 hover:text-cyan-400 transition-colors">
                    👍 {{ reply.likeCount }}
                  </button>
                  <button class="text-gray-400 hover:text-cyan-400 transition-colors">
                    💬 回复
                  </button>
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const loading = ref(false)
const post = ref<any>(null)
const replies = ref<any[]>([])
const replyContent = ref('')

// 加载帖子详情
async function loadPostDetail() {
  loading.value = true
  try {
    // TODO: 调用后端API
    // 模拟数据
    post.value = {
      id: route.params.id,
      title: '分享我的VR游戏初体验，太震撼了！',
      content: `<p>昨天第一次体验了VR游戏，选择的是Beat Saber，真的太震撼了！</p>
        <p>刚开始戴上头显的时候还有点不适应，但是进入游戏后完全沉浸其中。随着音乐节奏挥动光剑砍方块，那种感觉就像真的在舞台上表演一样。</p>
        <p>推荐给所有还没尝试过VR的朋友，一定要试试！</p>`,
      authorName: '游戏爱好者',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
      createdAt: '2小时前',
      views: 1234,
      replyCount: 15,
      likeCount: 89,
      images: []
    }

    // 模拟回复
    replies.value = [
      {
        id: 1,
        authorName: 'VR老玩家',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
        content: '确实很棒！如果你喜欢Beat Saber，可以试试Half-Life: Alyx，剧情和画面都是顶级的。',
        createdAt: '1小时前',
        likeCount: 23
      },
      {
        id: 2,
        authorName: '新手玩家',
        authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
        content: '看了你的分享我也想试试了，请问设备要求高吗？',
        createdAt: '30分钟前',
        likeCount: 5
      }
    ]
  } catch (error) {
    console.error('Failed to load post:', error)
    ElMessage.error('加载帖子失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPostDetail()
})
</script>
