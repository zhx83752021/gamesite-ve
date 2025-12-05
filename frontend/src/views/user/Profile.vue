<template>
  <div class="min-h-screen">
    <!-- 用户头部 - 游戏背景图 -->
    <div class="relative py-20 mb-8 -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 overflow-hidden">
      <!-- 背景图 -->
      <div class="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=1920&h=600&fit=crop"
             alt="User Profile"
             class="w-full h-full object-cover"/>
      </div>
      <!-- 渐变遮罩 -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

      <div class="relative z-10 max-w-7xl mx-auto px-8">
        <div class="flex items-center gap-6">
          <div class="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border-4 border-white/20 bg-gradient-to-r from-cyan-500 to-purple-500">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=user123"
              alt="用户头像"
              class="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 class="text-5xl font-bold text-white mb-3 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">玩家昵称</h1>
            <p class="text-xl text-gray-200 mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">ID: 123456 | 等级: Lv.25</p>
            <div class="flex gap-4">
              <button
                @click="$router.push('/user/settings')"
                class="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all"
              >
                编辑资料
              </button>
              <button
                @click="$router.push('/user/settings')"
                class="px-6 py-2 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/20 transition-all"
              >
                设置
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- 统计信息 -->
        <div class="lg:col-span-2 space-y-6">
          <div class="grid grid-cols-3 gap-4">
            <div class="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50 text-center">
              <div class="text-4xl font-bold text-cyan-400 mb-2">42</div>
              <div class="text-gray-400">拥有游戏</div>
            </div>
            <div class="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50 text-center">
              <div class="text-4xl font-bold text-purple-400 mb-2">158h</div>
              <div class="text-gray-400">游戏时长</div>
            </div>
            <div class="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50 text-center">
              <div class="text-4xl font-bold text-pink-400 mb-2">89</div>
              <div class="text-gray-400">成就数量</div>
            </div>
          </div>

          <!-- 我的游戏 -->
          <div class="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
            <h2 class="text-2xl font-bold text-cyan-400 mb-4">我的游戏</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div v-for="i in 8" :key="i" class="cursor-pointer group">
                <img :src="`https://images.unsplash.com/photo-${i % 2 === 0 ? '1622979135225-d2ba269cf1ac' : '1538481199705-c710c4e965fc'}?w=300&h=400&fit=crop`"
                     class="w-full rounded-xl mb-2 group-hover:scale-105 transition-transform"/>
                <div class="text-sm text-gray-300 group-hover:text-cyan-400 truncate">游戏名称{{ i }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 侧边栏 -->
        <div class="space-y-6">
          <div class="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50">
            <h3 class="text-xl font-bold text-cyan-400 mb-4">最近游戏</h3>
            <div class="space-y-3">
              <div v-for="i in 3" :key="i" class="flex gap-3">
                <img :src="`https://images.unsplash.com/photo-${i % 2 === 0 ? '1542751371-adc38448a05e' : '1511512578047-dfb367046420'}?w=60&h=80&fit=crop`"
                     class="w-12 rounded"/>
                <div class="flex-1">
                  <div class="text-white font-bold text-sm">游戏{{ i }}</div>
                  <div class="text-xs text-gray-400">游玩时间: 12h</div>
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
// 个人中心
</script>
