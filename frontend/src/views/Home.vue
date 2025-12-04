<template>
  <div>
    <!-- 全屏大Banner - 游戏背景图 -->
    <section class="relative overflow-hidden min-h-[75vh] flex items-center justify-center -mx-4 sm:-mx-6 lg:-mx-8 -mt-8">
      <!-- 游戏背景图 -->
      <div class="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&h=1080&fit=crop"
             alt="Featured Game"
             class="w-full h-full object-cover"/>
      </div>

      <!-- 渐变遮罩层 -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"></div>

      <div class="relative z-10 max-w-7xl mx-auto px-8 w-full">
        <div class="max-w-2xl">
          <!-- 游戏标签 -->
          <div class="flex gap-2 mb-4">
            <span class="px-3 py-1 bg-red-500/80 backdrop-blur-sm rounded-full text-sm font-bold">热门推荐</span>
            <span class="px-3 py-1 bg-blue-500/80 backdrop-blur-sm rounded-full text-sm font-bold">VR</span>
            <span class="px-3 py-1 bg-purple-500/80 backdrop-blur-sm rounded-full text-sm font-bold">动作</span>
          </div>

          <h1 class="text-6xl lg:text-7xl font-bold mb-6 text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
            Superhot VR
          </h1>
          <p class="text-xl lg:text-2xl mb-8 text-gray-200 font-light drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
            时间只有在你移动时才会流动 · 创新的时间机制 · 极致的射击体验
          </p>

          <!-- 评分和价格 -->
          <div class="flex items-center gap-6 mb-8">
            <div class="flex items-center gap-2">
              <span class="text-yellow-400 text-2xl">⭐⭐⭐⭐⭐</span>
              <span class="text-white font-bold">4.9</span>
            </div>
            <div class="text-3xl font-bold text-cyan-400">¥98</div>
          </div>

          <div class="flex gap-4">
            <button @click="$router.push('/games/3')"
                    class="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-lg font-bold rounded-full hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all duration-300 transform hover:scale-105">
              立即体验
            </button>
            <button @click="$router.push('/games')"
                    class="px-10 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white text-lg font-bold rounded-full hover:bg-white/20 transition-all duration-300">
              查看更多
            </button>
          </div>
        </div>
      </div>

      <!-- 游戏切换指示器 -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
        <button v-for="i in 3" :key="i"
                :class="[
                  'w-3 h-3 rounded-full transition-all duration-300',
                  i === 1 ? 'bg-cyan-400 w-8' : 'bg-white/30 hover:bg-white/50'
                ]">
        </button>
      </div>
    </section>

    <!-- 内容区 -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

      <!-- 热门推荐 -->
      <section>
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
            🔥 热门推荐
          </h2>
          <button class="text-cyan-400 hover:text-cyan-300 flex items-center gap-2">
            查看全部
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <div v-for="game in games" :key="game.id"
               class="group cursor-pointer">
            <div class="relative rounded-2xl overflow-hidden mb-4 transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]">
              <img :src="game.image" :alt="game.title" class="w-full aspect-[3/4] object-cover"/>
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div class="absolute top-2 right-2 px-2 py-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-xs font-bold">
                HOT
              </div>
            </div>
            <h3 class="font-bold text-gray-200 group-hover:text-cyan-400 transition-colors truncate">{{ game.title }}</h3>
            <div class="flex items-center justify-between text-sm mt-1">
              <span class="text-yellow-400">⭐ {{ game.rating }}</span>
              <span class="text-cyan-400 font-bold">¥{{ game.price }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 性能参数展示 -->
      <section class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 border border-cyan-500/30 mb-16">
        <h2 class="text-4xl font-bold text-center mb-4 text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text">
          ⚡ 顶级云电脑性能
        </h2>
        <p class="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
          基于最新一代服务器硬件，提供远超本地电脑的极致性能体验
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div class="text-center">
            <div class="text-7xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text mb-4">
              40%
            </div>
            <p class="text-gray-400 mb-2">相较10代i7 CPU</p>
            <p class="text-white font-bold text-xl mb-2">云电脑性能提升</p>
            <div class="inline-block px-4 py-2 bg-gray-800/50 rounded-lg">
              <p class="text-sm text-cyan-400">CPU: i7-12700KF / i9-13900K</p>
            </div>
          </div>

          <div class="text-center">
            <div class="text-7xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text mb-4">
              300%
            </div>
            <p class="text-gray-400 mb-2">相较RTX3060</p>
            <p class="text-white font-bold text-xl mb-2">云电脑性能提升</p>
            <div class="inline-block px-4 py-2 bg-gray-800/50 rounded-lg">
              <p class="text-sm text-purple-400">GPU: RTX 4070 / 4090</p>
            </div>
          </div>

          <div class="text-center">
            <div class="text-7xl font-bold text-transparent bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text mb-4">
              8ms
            </div>
            <p class="text-gray-400 mb-2">超低网络延迟</p>
            <p class="text-white font-bold text-xl mb-2">极致流畅体验</p>
            <div class="inline-block px-4 py-2 bg-gray-800/50 rounded-lg">
              <p class="text-sm text-green-400">支持 4K / 120FPS</p>
            </div>
          </div>
        </div>

        <div class="text-center">
          <router-link
            to="/pricing"
            class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-lg font-bold rounded-full hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all duration-300 transform hover:scale-105"
          >
            查看价格套餐
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </router-link>
        </div>
      </section>

      <!-- 产品特色 -->
      <section class="mb-16">
        <h2 class="text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-12 text-center">
          💎 为什么选择我们
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="feature in platformFeatures"
            :key="feature.title"
            class="group bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20"
          >
            <div class="text-5xl mb-4 transform group-hover:scale-110 transition-transform">{{ feature.icon }}</div>
            <h3 class="text-xl font-bold text-white mb-3">{{ feature.title }}</h3>
            <p class="text-gray-400 text-sm">{{ feature.description }}</p>
          </div>
        </div>
      </section>

      <!-- 技术优势 -->
      <section class="bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-cyan-900/30 rounded-3xl p-12 border border-purple-500/20 mb-16">
        <h2 class="text-3xl font-bold text-center mb-12 text-white">🚀 领先的云游戏技术</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            v-for="tech in techAdvantages"
            :key="tech.title"
            class="flex gap-4 bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 hover:border-cyan-400/30 transition-all"
          >
            <div class="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl flex items-center justify-center text-3xl">
              {{ tech.icon }}
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-bold text-white mb-2">{{ tech.title }}</h3>
              <p class="text-gray-400 text-sm">{{ tech.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 分类导航 -->
      <section>
        <h2 class="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text mb-8">
          🎮 游戏分类
        </h2>
        <div class="grid grid-cols-3 md:grid-cols-6 gap-4">
          <div v-for="cat in categories" :key="cat.name"
               class="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 text-center cursor-pointer border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <div class="text-4xl mb-2 group-hover:scale-110 transition-transform">{{ cat.icon }}</div>
            <div class="text-sm text-gray-300 group-hover:text-cyan-400 transition-colors font-medium">{{ cat.name }}</div>
          </div>
        </div>
      </section>

      <!-- 数据统计 -->
      <section class="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-3xl p-8 border border-purple-500/20">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <div class="text-5xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text mb-2">
              {{ stat.value }}
            </div>
            <div class="text-gray-400 text-sm">{{ stat.label }}</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const games = [
  { id: 1, title: 'Beat Saber', image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400&h=500&fit=crop', rating: 4.9, price: 78 },
  { id: 2, title: 'Half-Life: Alyx', image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=500&fit=crop', rating: 4.8, price: 88 },
  { id: 3, title: 'Superhot VR', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=500&fit=crop', rating: 4.7, price: 98 },
  { id: 4, title: 'VR Racing', image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=500&fit=crop', rating: 4.6, price: 68 },
  { id: 5, title: 'Space Odyssey', image: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=400&h=500&fit=crop', rating: 4.8, price: 118 },
  { id: 6, title: 'Neon City', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=500&fit=crop', rating: 4.9, price: 128 },
  { id: 7, title: 'Cyber Arena', image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400&h=500&fit=crop', rating: 4.5, price: 88 },
  { id: 8, title: 'Virtual World', image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=400&h=500&fit=crop', rating: 4.7, price: 98 },
  { id: 9, title: 'Dream VR', image: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=400&h=500&fit=crop', rating: 4.6, price: 78 },
  { id: 10, title: 'Future Game', image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400&h=500&fit=crop', rating: 4.8, price: 108 }
]

const categories = [
  { name: '动作', icon: '⚔️' },
  { name: '冒险', icon: '🗺️' },
  { name: '射击', icon: '🎯' },
  { name: '竞速', icon: '🏎️' },
  { name: '恐怖', icon: '👻' },
  { name: '休闲', icon: '🎮' }
]

const stats = [
  { label: '在线玩家', value: '125K+' },
  { label: '游戏总数', value: '2,580' },
  { label: '活跃社区', value: '98K+' },
  { label: '总下载量', value: '8.5M+' }
]

const platformFeatures = [
  {
    icon: '🚀',
    title: '即点即玩',
    description: '无需下载安装，打开即玩。省去等待时间，随时随地开始游戏'
  },
  {
    icon: '💻',
    title: '无需高配',
    description: '手机平板也能玩3A大作，告别硬件限制，人人都是高端玩家'
  },
  {
    icon: '☁️',
    title: '云端存档',
    description: '游戏进度自动云端同步，换设备也能无缝继续，永不丢失'
  },
  {
    icon: '🎯',
    title: '超低延迟',
    description: '全国数据中心覆盖，智能就近接入，延迟低至8ms丝滑流畅'
  },
  {
    icon: '💎',
    title: '4K高清',
    description: '支持最高4K 144FPS画质，画面细腻流畅，体验极致视觉盛宴'
  },
  {
    icon: '🔒',
    title: '安全可靠',
    description: '企业级数据加密，多重安全防护，账号资产安全无忧'
  },
  {
    icon: '🎮',
    title: '海量游戏',
    description: '3000+精品游戏库，涵盖各类热门大作，总有一款适合你'
  },
  {
    icon: '💰',
    title: '按需付费',
    description: '灵活计费模式，按时长或包月随心选，用多少付多少更实惠'
  }
]

const techAdvantages = [
  {
    icon: '🌐',
    title: '全国节点覆盖',
    description: '在北京、上海、广州、深圳等20+城市部署边缘节点，智能选择最近服务器，确保低延迟体验'
  },
  {
    icon: '🎬',
    title: '先进视频编码',
    description: '采用H.265/H.264自适应编码，智能调节码率和画质，在保证清晰度的同时降低带宽消耗'
  },
  {
    icon: '⚙️',
    title: '容器化虚拟化',
    description: '基于Docker容器技术，资源隔离更安全，启动速度更快，性能损耗低于5%'
  },
  {
    icon: '🔧',
    title: '智能负载均衡',
    description: '实时监控服务器负载，动态分配计算资源，确保高峰时段也能稳定流畅运行'
  }
]
</script>