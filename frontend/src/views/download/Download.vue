<template>
  <div class="min-h-screen py-16">
    <!-- Hero Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
      <h1 class="text-5xl md:text-6xl font-bold mb-6">
        <span class="text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text">
          下载客户端
        </span>
      </h1>
      <p class="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
        支持多平台设备 · 随时随地畅玩游戏 · 一键安装即可开始
      </p>

      <!-- 快速下载卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div
          v-for="platform in platforms"
          :key="platform.id"
          class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 border-2 border-gray-700 hover:border-cyan-400 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20 cursor-pointer group"
          @click="handleDownload(platform)"
        >
          <div class="text-6xl mb-4 transform group-hover:scale-110 transition-transform">
            {{ platform.icon }}
          </div>
          <h3 class="text-2xl font-bold text-white mb-2">{{ platform.name }}</h3>
          <p class="text-gray-400 mb-4">{{ platform.desc }}</p>
          <div class="text-sm text-gray-500 mb-4">
            版本: {{ platform.version }} · {{ platform.size }}
          </div>
          <button
            class="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all duration-300"
          >
            立即下载
          </button>

          <!-- 系统要求 -->
          <div class="mt-4 pt-4 border-t border-gray-700">
            <div class="text-xs text-gray-500 text-left space-y-1">
              <div v-for="req in platform.requirements" :key="req">• {{ req }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 浏览器版本 -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div class="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-3xl p-12 border border-purple-500/30">
        <div class="flex flex-col md:flex-row items-center justify-between gap-8">
          <div class="flex-1">
            <div class="text-5xl mb-4">🌐</div>
            <h2 class="text-3xl font-bold text-white mb-4">无需下载 · 浏览器直接玩</h2>
            <p class="text-gray-300 mb-6">
              支持Chrome、Edge、Safari等主流浏览器
              <br />
              无需安装，打开网页即可开始游戏
            </p>
            <div class="flex gap-4">
              <button
                @click="handleBrowserPlay"
                class="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all duration-300 transform hover:scale-105"
              >
                立即体验
              </button>
              <button
                class="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                查看支持浏览器
              </button>
            </div>
          </div>
          <div class="flex-shrink-0">
            <div class="grid grid-cols-2 gap-4">
              <div
                v-for="browser in browsers"
                :key="browser.name"
                class="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 text-center"
              >
                <div class="text-4xl mb-2">{{ browser.icon }}</div>
                <div class="text-white font-medium">{{ browser.name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 特性展示 -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <h2 class="text-3xl font-bold text-center mb-12 text-white">为什么选择我们的客户端</h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800 hover:border-cyan-400/50 transition-all duration-300"
        >
          <div class="text-5xl mb-4">{{ feature.icon }}</div>
          <h3 class="text-xl font-bold text-white mb-3">{{ feature.title }}</h3>
          <p class="text-gray-400">{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <!-- 安装指南 -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-center mb-12 text-white">快速安装指南</h2>

      <div class="space-y-6">
        <div
          v-for="(step, index) in installSteps"
          :key="index"
          class="flex gap-6 items-start"
        >
          <div class="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
            {{ index + 1 }}
          </div>
          <div class="flex-1 bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
            <h3 class="text-lg font-bold text-white mb-2">{{ step.title }}</h3>
            <p class="text-gray-400">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 技术支持 -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
      <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 border border-gray-700 text-center">
        <h2 class="text-3xl font-bold text-white mb-4">遇到问题？</h2>
        <p class="text-gray-400 mb-8 max-w-2xl mx-auto">
          我们的技术团队随时为您提供支持，解决下载和安装过程中的任何问题
        </p>
        <div class="flex justify-center gap-4">
          <button
            @click="$router.push('/help')"
            class="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all duration-300"
          >
            查看帮助文档
          </button>
          <button
            class="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300"
          >
            联系客服
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'

// 平台列表
const platforms = [
  {
    id: 'windows',
    name: 'Windows',
    icon: '🪟',
    desc: 'Win 10/11',
    version: 'v3.2.1',
    size: '125 MB',
    downloadUrl: '#',
    requirements: [
      'Windows 10/11 64位',
      '至少4GB内存',
      '推荐显卡GTX 1050以上'
    ]
  },
  {
    id: 'macos',
    name: 'macOS',
    icon: '🍎',
    desc: 'macOS 11+',
    version: 'v3.2.1',
    size: '98 MB',
    downloadUrl: '#',
    requirements: [
      'macOS 11 Big Sur或更高',
      'M1/M2/Intel芯片',
      '至少8GB内存'
    ]
  },
  {
    id: 'android',
    name: 'Android',
    icon: '🤖',
    desc: 'Android 8+',
    version: 'v3.1.5',
    size: '75 MB',
    downloadUrl: '#',
    requirements: [
      'Android 8.0或更高',
      '至少3GB内存',
      '支持手柄连接'
    ]
  },
  {
    id: 'ios',
    name: 'iOS',
    icon: '📱',
    desc: 'iOS 13+',
    version: 'v3.1.5',
    size: '82 MB',
    downloadUrl: '#',
    requirements: [
      'iOS 13或更高',
      'iPhone 8或更新',
      'iPad支持'
    ]
  }
]

// 浏览器支持
const browsers = [
  { name: 'Chrome', icon: '🌐' },
  { name: 'Edge', icon: '🔷' },
  { name: 'Safari', icon: '🧭' },
  { name: 'Firefox', icon: '🦊' }
]

// 特性
const features = [
  {
    icon: '⚡',
    title: '极速启动',
    description: '优化的启动流程，从打开客户端到进入游戏仅需3秒，让你即刻沉浸游戏世界'
  },
  {
    icon: '🎮',
    title: '手柄支持',
    description: '完美支持Xbox、PS5、Switch Pro等主流手柄，提供原生游戏体验'
  },
  {
    icon: '📊',
    title: '实时监控',
    description: '实时显示网络延迟、帧率、码率等关键参数，随时掌握游戏质量'
  },
  {
    icon: '🔄',
    title: '自动更新',
    description: '客户端自动静默更新，始终使用最新版本，享受最佳性能和新功能'
  },
  {
    icon: '💾',
    title: '云同步',
    description: '游戏存档、设置自动云端同步，在任何设备无缝继续你的游戏进度'
  },
  {
    icon: '🔐',
    title: '安全加密',
    description: '采用银行级加密技术，保护你的账户和支付信息安全'
  }
]

// 安装步骤
const installSteps = [
  {
    title: '下载客户端',
    description: '选择对应平台点击下载按钮，下载安装包到本地'
  },
  {
    title: '安装程序',
    description: '双击运行安装包，按照向导提示完成安装，推荐使用默认安装路径'
  },
  {
    title: '登录账号',
    description: '打开客户端，使用您的账号登录，首次登录可能需要验证邮箱或手机'
  },
  {
    title: '开始游戏',
    description: '浏览游戏库，选择想玩的游戏点击"启动"即可开始，享受云游戏乐趣'
  }
]

// 处理下载
function handleDownload(platform: any) {
  ElMessage.success(`开始下载 ${platform.name} 客户端`)
  // 实际项目中应该触发真实的下载链接
  // window.location.href = platform.downloadUrl
}

// 浏览器游玩
function handleBrowserPlay() {
  ElMessage.info('跳转到浏览器游戏页面')
  // window.open('/games?play=browser', '_blank')
}
</script>
