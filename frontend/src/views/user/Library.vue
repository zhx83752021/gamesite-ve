<template>
  <div class="min-h-screen py-16">
    <div class="max-w-7xl mx-auto px-4">
      <h1 class="text-4xl font-bold text-white mb-8">我的游戏库</h1>

      <!-- 筛选选项 -->
      <div class="flex gap-4 mb-8">
        <button
          v-for="filter in filters"
          :key="filter"
          @click="activeFilter = filter"
          :class="[
            'px-6 py-3 rounded-xl font-medium transition-all',
            activeFilter === filter
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          ]"
        >
          {{ filter }}
        </button>
      </div>

      <!-- 游戏列表 -->
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <div
          v-for="game in games"
          :key="game.id"
          class="group cursor-pointer"
          @click="$router.push(`/games/${game.slug}`)"
        >
          <div class="relative rounded-2xl overflow-hidden mb-3 transform transition-all duration-300 group-hover:scale-105">
            <img :src="game.cover" :alt="game.title" class="w-full aspect-[3/4] object-cover"/>
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div class="absolute bottom-4 left-4 right-4">
                <div class="text-xs text-gray-300 mb-2">游戏时长: {{ game.playTime }}小时</div>
                <button class="w-full py-2 bg-cyan-500 text-white font-bold rounded-lg hover:bg-cyan-600 transition-colors">
                  开始游戏
                </button>
              </div>
            </div>
          </div>
          <h3 class="font-bold text-gray-200 group-hover:text-cyan-400 transition-colors truncate">
            {{ game.title }}
          </h3>
          <div class="text-sm text-gray-400">最后游玩: {{ game.lastPlayed }}</div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="games.length === 0" class="text-center py-16">
        <div class="text-6xl mb-4">🎮</div>
        <div class="text-xl text-gray-400 mb-6">游戏库空空如也</div>
        <button
          @click="$router.push('/games')"
          class="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all"
        >
          去选购游戏
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeFilter = ref('全部游戏')
const filters = ['全部游戏', '最近游玩', '最多游玩', '已安装']

// 模拟数据
const games = ref([
  {
    id: 1,
    slug: 'beat-saber',
    title: 'Beat Saber',
    cover: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400&h=500&fit=crop',
    playTime: 23,
    lastPlayed: '今天'
  },
  {
    id: 2,
    slug: 'half-life-alyx',
    title: 'Half-Life: Alyx',
    cover: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=500&fit=crop',
    playTime: 15,
    lastPlayed: '昨天'
  },
  {
    id: 3,
    slug: 'superhot-vr',
    title: 'Superhot VR',
    cover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=500&fit=crop',
    playTime: 8,
    lastPlayed: '3天前'
  }
])
</script>
