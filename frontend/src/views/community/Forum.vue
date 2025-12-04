<template>
  <div class="min-h-screen">
    <!-- 页面标题 - 游戏背景图 -->
    <div class="relative py-24 mb-8 -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 overflow-hidden">
      <!-- 背景图 -->
      <div class="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1920&h=600&fit=crop"
             alt="Community Forum"
             class="w-full h-full object-cover"/>
      </div>
      <!-- 渐变遮罩 -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

      <div class="relative z-10 max-w-7xl mx-auto px-8">
        <h1 class="text-6xl font-bold text-white mb-4 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
          社区论坛
        </h1>
        <p class="text-2xl text-gray-200 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">与全球玩家交流游戏心得</p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 主要内容 -->
        <div class="lg:col-span-2 space-y-4">
          <div v-for="post in posts" :key="post.id"
               class="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50 hover:border-cyan-400/30 transition-all duration-300 cursor-pointer">
            <div class="flex gap-4">
              <div class="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex-shrink-0"></div>
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <span class="font-bold text-white">{{ post.author }}</span>
                  <span class="text-sm text-gray-400">{{ post.time }}</span>
                  <span class="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">{{ post.tag }}</span>
                </div>
                <h3 class="text-xl font-bold text-cyan-400 mb-2 hover:text-cyan-300">{{ post.title }}</h3>
                <p class="text-gray-300 mb-4">{{ post.content }}</p>
                <div class="flex gap-6 text-sm text-gray-400">
                  <span class="flex items-center gap-1">👍 {{ post.likes }}</span>
                  <span class="flex items-center gap-1">💬 {{ post.comments }}</span>
                  <span class="flex items-center gap-1">👁️ {{ post.views }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 侧边栏 -->
        <div class="space-y-6">
          <button class="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all">
            发布新帖
          </button>

          <div class="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
            <h3 class="text-xl font-bold text-cyan-400 mb-4">热门话题</h3>
            <div class="space-y-3">
              <div v-for="i in 5" :key="i" class="flex items-center gap-2 text-sm">
                <span class="text-cyan-400 font-bold">#{{ i }}</span>
                <span class="text-gray-300 hover:text-white cursor-pointer">热门话题标题{{ i }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const posts = [
  { id: 1, author: '玩家A', time: '2小时前', tag: '攻略', title: 'Beat Saber通关技巧分享', content: '经过100小时的游戏，终于摸索出一些通关技巧，分享给大家...', likes: 128, comments: 45, views: 1230 },
  { id: 2, author: '玩家B', time: '5小时前', tag: '讨论', title: '最值得入手的VR游戏推荐', content: '作为一名VR游戏爱好者，我想推荐几款必玩游戏...', likes: 256, comments: 89, views: 2340 },
  { id: 3, author: '玩家C', time: '1天前', tag: '求助', title: '游戏卡顿问题怎么解决？', content: '最近玩游戏总是卡顿，有没有大神能帮忙看看...', likes: 67, comments: 34, views: 890 },
]
</script>
