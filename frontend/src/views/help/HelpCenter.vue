<template>
  <div class="min-h-screen py-16">
    <!-- Hero Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div class="text-center mb-12">
        <h1 class="text-5xl md:text-6xl font-bold mb-6">
          <span class="text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text">
            帮助中心
          </span>
        </h1>
        <p class="text-xl text-gray-400 max-w-3xl mx-auto">
          快速找到问题答案 · 7x24小时在线支持
        </p>
      </div>

      <!-- 搜索框 -->
      <div class="max-w-2xl mx-auto mb-16">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索问题关键词..."
            class="w-full px-6 py-4 bg-gray-900/50 border-2 border-gray-700 rounded-2xl text-white focus:border-cyan-400 focus:outline-none transition-all text-lg"
            @keyup.enter="handleSearch"
          />
          <button
            @click="handleSearch"
            class="absolute right-2 top-2 px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all"
          >
            搜索
          </button>
        </div>

        <!-- 热门搜索 -->
        <div class="mt-4 flex flex-wrap gap-2">
          <span class="text-gray-500 text-sm">热门搜索:</span>
          <button
            v-for="tag in hotSearchTags"
            :key="tag"
            @click="searchQuery = tag; handleSearch()"
            class="px-3 py-1 bg-gray-800/50 hover:bg-gray-700 text-gray-300 text-sm rounded-full transition-colors"
          >
            {{ tag }}
          </button>
        </div>
      </div>
    </section>

    <!-- 快速入口 -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div
          v-for="category in quickCategories"
          :key="category.id"
          @click="selectCategory(category.id)"
          class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border-2 border-gray-700 hover:border-cyan-400 transition-all duration-300 cursor-pointer group hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20"
        >
          <div class="text-5xl mb-4 transform group-hover:scale-110 transition-transform">{{ category.icon }}</div>
          <h3 class="text-xl font-bold text-white mb-2">{{ category.title }}</h3>
          <p class="text-gray-400 text-sm">{{ category.count }} 篇文章</p>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <h2 class="text-3xl font-bold mb-8 text-white flex items-center gap-3">
        <span>📋</span> 常见问题
      </h2>

      <div class="space-y-4">
        <div
          v-for="(faq, index) in filteredFaqs"
          :key="index"
          class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden hover:border-cyan-400/50 transition-all"
        >
          <button
            @click="toggleFaq(index)"
            class="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-800/50 transition-colors"
          >
            <div class="flex items-start gap-3 flex-1">
              <span class="text-cyan-400 font-bold mt-1">Q.</span>
              <span class="font-medium text-white">{{ faq.question }}</span>
            </div>
            <svg
              :class="['w-5 h-5 text-gray-400 transition-transform flex-shrink-0', activeFaq === index ? 'rotate-180' : '']"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            v-show="activeFaq === index"
            class="px-6 pb-4"
          >
            <div class="flex items-start gap-3 pl-7">
              <span class="text-purple-400 font-bold">A.</span>
              <div class="text-gray-300 flex-1">{{ faq.answer }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 使用指南 -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <h2 class="text-3xl font-bold mb-8 text-white flex items-center gap-3">
        <span>📖</span> 新手指南
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="guide in guides"
          :key="guide.id"
          class="bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800 hover:border-cyan-400/50 transition-all hover:scale-105 cursor-pointer group"
        >
          <div class="aspect-video bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
            <div class="text-6xl transform group-hover:scale-110 transition-transform">{{ guide.icon }}</div>
          </div>
          <div class="p-6">
            <h3 class="text-lg font-bold text-white mb-2">{{ guide.title }}</h3>
            <p class="text-gray-400 text-sm mb-4">{{ guide.description }}</p>
            <button class="text-cyan-400 hover:text-cyan-300 font-medium text-sm flex items-center gap-1">
              查看详情
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 联系客服 -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-3xl p-12 border border-cyan-500/30">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-white mb-4">没有找到答案？</h2>
          <p class="text-gray-300">我们的客服团队随时为您服务</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-800">
            <div class="text-4xl mb-3">💬</div>
            <h3 class="text-lg font-bold text-white mb-2">在线客服</h3>
            <p class="text-gray-400 text-sm mb-4">7x24小时在线</p>
            <button
              @click="openLiveChat"
              class="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all"
            >
              开始对话
            </button>
          </div>

          <div class="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-800">
            <div class="text-4xl mb-3">📧</div>
            <h3 class="text-lg font-bold text-white mb-2">邮件支持</h3>
            <p class="text-gray-400 text-sm mb-4">24小时内回复</p>
            <button class="w-full py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition-all">
              发送邮件
            </button>
          </div>

          <div class="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 text-center border border-gray-800">
            <div class="text-4xl mb-3">📞</div>
            <h3 class="text-lg font-bold text-white mb-2">电话客服</h3>
            <p class="text-gray-400 text-sm mb-4">工作日 9:00-18:00</p>
            <button class="w-full py-3 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition-all">
              400-888-8888
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

// 搜索
const searchQuery = ref('')
const hotSearchTags = ['网络延迟高', '无法登录', '画质模糊', '手柄设置', '退款政策']

// 快速分类
const quickCategories = [
  { id: 'getting-started', title: '快速开始', icon: '🚀', count: 12 },
  { id: 'account', title: '账户问题', icon: '👤', count: 18 },
  { id: 'technical', title: '技术支持', icon: '⚙️', count: 25 },
  { id: 'payment', title: '充值付费', icon: '💳', count: 15 }
]

const selectedCategoryId = ref('')

// FAQ数据
const activeFaq = ref<number | null>(null)

const faqs = [
  {
    category: 'getting-started',
    question: '如何开始使用云游戏服务？',
    answer: '首先注册账号，然后下载对应平台的客户端或使用浏览器版本。登录后选择套餐开通服务，即可开始游戏。新用户有免费试玩时长。'
  },
  {
    category: 'technical',
    question: '遇到网络延迟高怎么办？',
    answer: '1. 检查网络连接，建议使用有线网络或5G Wi-Fi。2. 切换到就近的服务器节点。3. 关闭其他占用带宽的程序。4. 联系客服检测网络质量。'
  },
  {
    category: 'technical',
    question: '画面模糊或卡顿如何解决？',
    answer: '在设置中调整画质选项，根据网络状况选择合适的分辨率和帧率。建议20Mbps以上网速选择1080P 60FPS，50Mbps以上选择2K或4K画质。'
  },
  {
    category: 'account',
    question: '忘记密码怎么办？',
    answer: '点击登录页面的"忘记密码"链接，通过注册手机号或邮箱接收验证码重置密码。如无法收到验证码，请联系客服协助找回。'
  },
  {
    category: 'payment',
    question: '支持哪些支付方式？',
    answer: '支持支付宝、微信支付、银行卡、PayPal等多种支付方式。企业用户支持对公转账，详询客服。'
  },
  {
    category: 'payment',
    question: '套餐可以随时取消吗？',
    answer: '可以随时取消订阅，按小时计费套餐即用即停，包月/包年套餐在当前周期结束后不再续费。未使用的时长不支持退款。'
  },
  {
    category: 'technical',
    question: '支持哪些游戏手柄？',
    answer: '支持Xbox、PS4/PS5、Switch Pro、罗技等主流手柄。连接后在客户端设置中进行按键映射。部分游戏支持原生手柄识别。'
  },
  {
    category: 'getting-started',
    question: '可以在多个设备上使用吗？',
    answer: '可以，根据套餐不同支持1-无限个设备。游戏存档云端同步，可在手机、电脑、平板等设备无缝切换。'
  },
  {
    category: 'account',
    question: '如何升级或降级套餐？',
    answer: '登录个人中心，在"我的套餐"页面选择升级或降级。升级立即生效并按比例补差价，降级在下个计费周期生效。'
  },
  {
    category: 'technical',
    question: '游戏存档会丢失吗？',
    answer: '所有存档自动保存在云端服务器，不会因设备更换或客户端重装而丢失。建议重要存档额外备份到本地。'
  }
]

const filteredFaqs = computed(() => {
  if (selectedCategoryId.value) {
    return faqs.filter(faq => faq.category === selectedCategoryId.value)
  }
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    return faqs.filter(faq =>
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query)
    )
  }
  return faqs.slice(0, 6)
})

// 新手指南
const guides = [
  {
    id: 1,
    icon: '🎮',
    title: '5分钟快速上手',
    description: '从注册到开始第一款游戏的完整流程'
  },
  {
    id: 2,
    icon: '⚙️',
    title: '客户端设置指南',
    description: '如何配置最佳画质和网络参数'
  },
  {
    id: 3,
    icon: '🎯',
    title: '手柄配置教程',
    description: '连接和设置各类游戏手柄'
  },
  {
    id: 4,
    icon: '💡',
    title: '性能优化技巧',
    description: '降低延迟提升流畅度的实用方法'
  },
  {
    id: 5,
    icon: '🔒',
    title: '账户安全指南',
    description: '保护账号和支付信息的安全设置'
  },
  {
    id: 6,
    icon: '📊',
    title: '套餐选择建议',
    description: '根据需求选择最适合的套餐'
  }
]

function toggleFaq(index: number) {
  activeFaq.value = activeFaq.value === index ? null : index
}

function selectCategory(categoryId: string) {
  selectedCategoryId.value = selectedCategoryId.value === categoryId ? '' : categoryId
}

function handleSearch() {
  if (searchQuery.value.trim()) {
    ElMessage.success(`搜索: ${searchQuery.value}`)
  }
}

function openLiveChat() {
  ElMessage.info('打开在线客服对话窗口')
  // 实际项目中应该打开在线客服系统
}
</script>
