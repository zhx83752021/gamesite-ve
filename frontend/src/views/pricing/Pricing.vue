<template>
  <div class="min-h-screen py-16">
    <!-- Hero Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
      <h1 class="text-5xl md:text-6xl font-bold mb-6">
        <span class="text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text">
          选择适合你的套餐
        </span>
      </h1>
      <p class="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
        无需高配电脑，随时随地畅玩3A大作 · 按需付费，灵活便捷
      </p>

      <!-- 计费方式切换 -->
      <div class="inline-flex bg-gray-800/50 rounded-full p-1 backdrop-blur-sm">
        <button
          v-for="mode in billingModes"
          :key="mode.value"
          @click="selectedBillingMode = mode.value"
          :class="[
            'px-8 py-3 rounded-full font-medium transition-all duration-300',
            selectedBillingMode === mode.value
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
              : 'text-gray-400 hover:text-white'
          ]"
        >
          {{ mode.label }}
          <span v-if="mode.discount" class="ml-2 text-xs text-yellow-400">{{ mode.discount }}</span>
        </button>
      </div>
    </section>

    <!-- 性能对比表 -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="(plan, index) in pricingPlans"
          :key="plan.id"
          :class="[
            'relative rounded-3xl p-8 backdrop-blur-xl border-2 transition-all duration-300 hover:scale-105',
            plan.popular
              ? 'bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border-cyan-400 shadow-2xl shadow-cyan-500/20'
              : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'
          ]"
        >
          <!-- 热门标签 -->
          <div v-if="plan.popular" class="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span class="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-bold rounded-full shadow-lg">
              🔥 最受欢迎
            </span>
          </div>

          <!-- 套餐名称 -->
          <div class="text-center mb-6">
            <div class="text-5xl mb-4">{{ plan.icon }}</div>
            <h3 class="text-2xl font-bold text-white mb-2">{{ plan.name }}</h3>
            <p class="text-gray-400">{{ plan.description }}</p>
          </div>

          <!-- 价格 -->
          <div class="text-center mb-8">
            <div class="flex items-baseline justify-center mb-2">
              <span class="text-5xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text">
                ¥{{ getPlanPrice(plan) }}
              </span>
              <span class="text-gray-400 ml-2">{{ selectedBillingMode === 'hourly' ? '/小时' : '/月' }}</span>
            </div>
            <p v-if="plan.originalPrice && selectedBillingMode !== 'hourly'" class="text-gray-500 line-through">
              原价 ¥{{ plan.originalPrice }}/月
            </p>
          </div>

          <!-- 性能配置 -->
          <div class="space-y-4 mb-8">
            <div class="bg-gray-800/50 rounded-xl p-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-gray-400">CPU</span>
                <span class="text-white font-bold">{{ plan.specs.cpu }}</span>
              </div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-gray-400">GPU</span>
                <span class="text-white font-bold">{{ plan.specs.gpu }}</span>
              </div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-gray-400">内存</span>
                <span class="text-white font-bold">{{ plan.specs.ram }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-400">存储</span>
                <span class="text-white font-bold">{{ plan.specs.storage }}</span>
              </div>
            </div>
          </div>

          <!-- 特性列表 -->
          <div class="space-y-3 mb-8">
            <div
              v-for="feature in plan.features"
              :key="feature"
              class="flex items-start gap-3"
            >
              <svg class="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span class="text-gray-300">{{ feature }}</span>
            </div>
          </div>

          <!-- 购买按钮 -->
          <button
            :class="[
              'w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105',
              plan.popular
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            ]"
          >
            立即购买
          </button>
        </div>
      </div>
    </section>

    <!-- 性能提升对比 -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 border border-gray-700">
        <h2 class="text-3xl font-bold text-center mb-12 text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
          性能提升对比
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="text-6xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text mb-4">
              40%
            </div>
            <p class="text-gray-400 mb-2">相较10代i7 CPU</p>
            <p class="text-white font-bold">云电脑性能提升</p>
            <p class="text-sm text-gray-500 mt-2">CPU: i7-12700KF</p>
          </div>

          <div class="text-center">
            <div class="text-6xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text mb-4">
              300%
            </div>
            <p class="text-gray-400 mb-2">相较RTX3060</p>
            <p class="text-white font-bold">云电脑性能提升</p>
            <p class="text-sm text-gray-500 mt-2">GPU: RTX 4090</p>
          </div>

          <div class="text-center">
            <div class="text-6xl font-bold text-transparent bg-gradient-to-r from-green-400 to-cyan-500 bg-clip-text mb-4">
              8ms
            </div>
            <p class="text-gray-400 mb-2">超低延迟</p>
            <p class="text-white font-bold">极致流畅体验</p>
            <p class="text-sm text-gray-500 mt-2">支持4K/120FPS</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 常见问题 -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-center mb-12 text-white">常见问题</h2>

      <div class="space-y-4">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          class="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden"
        >
          <button
            @click="toggleFaq(index)"
            class="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-800/50 transition-colors"
          >
            <span class="font-medium text-white">{{ faq.question }}</span>
            <svg
              :class="['w-5 h-5 text-gray-400 transition-transform', activeFaq === index ? 'rotate-180' : '']"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div
            v-show="activeFaq === index"
            class="px-6 pb-4 text-gray-400"
          >
            {{ faq.answer }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 计费模式
const billingModes = [
  { value: 'hourly', label: '按小时计费', discount: '' },
  { value: 'monthly', label: '包月套餐', discount: '省20%' },
  { value: 'yearly', label: '包年套餐', discount: '省40%' }
]

const selectedBillingMode = ref('monthly')

// 套餐配置
const pricingPlans = [
  {
    id: 'basic',
    name: '基础版',
    icon: '🎮',
    description: '适合轻度游戏玩家',
    hourlyPrice: 3,
    monthlyPrice: 99,
    yearlyPrice: 899,
    originalPrice: 129,
    popular: false,
    specs: {
      cpu: 'i5-11400F',
      gpu: 'GTX 1660 Super',
      ram: '16GB DDR4',
      storage: '50GB SSD'
    },
    features: [
      '1080P 60FPS 流畅画质',
      '普通网游、独立游戏',
      '50GB 云存储空间',
      '标准客服支持',
      '单设备同时在线'
    ]
  },
  {
    id: 'pro',
    name: '专业版',
    icon: '🚀',
    description: '畅玩3A大作',
    hourlyPrice: 6,
    monthlyPrice: 199,
    yearlyPrice: 1699,
    originalPrice: 259,
    popular: true,
    specs: {
      cpu: 'i7-12700KF',
      gpu: 'RTX 4070',
      ram: '32GB DDR5',
      storage: '100GB SSD'
    },
    features: [
      '2K 120FPS 高清画质',
      '全平台3A大作',
      '100GB 云存储空间',
      '优先客服支持',
      '2设备同时在线',
      '免费试玩时长'
    ]
  },
  {
    id: 'ultimate',
    name: '至尊版',
    icon: '👑',
    description: '极致性能体验',
    hourlyPrice: 12,
    monthlyPrice: 399,
    yearlyPrice: 3299,
    originalPrice: 499,
    popular: false,
    specs: {
      cpu: 'i9-13900K',
      gpu: 'RTX 4090',
      ram: '64GB DDR5',
      storage: '200GB SSD'
    },
    features: [
      '4K 144FPS 极致画质',
      'VR游戏 + 光追特效',
      '200GB 云存储空间',
      '专属客服1对1',
      '无限设备切换',
      '独享服务器',
      '优先体验新游戏'
    ]
  }
]

// 计算当前价格
const getPlanPrice = (plan: any) => {
  if (selectedBillingMode.value === 'hourly') {
    return plan.hourlyPrice
  } else if (selectedBillingMode.value === 'monthly') {
    return plan.monthlyPrice
  } else {
    return plan.yearlyPrice
  }
}

// FAQ
const activeFaq = ref<number | null>(null)

const faqs = [
  {
    question: '什么是云游戏？',
    answer: '云游戏是将游戏运行在云端服务器上，通过网络将画面实时传输到您的设备。无需高配置电脑，只需稳定的网络连接即可畅玩3A大作。'
  },
  {
    question: '需要什么网络条件？',
    answer: '建议使用20Mbps以上的稳定网络连接。推荐使用有线网络或5G Wi-Fi以获得最佳体验。延迟低于30ms可以流畅游玩大部分游戏。'
  },
  {
    question: '支持哪些设备？',
    answer: '支持Windows PC、Mac、Android手机/平板、iOS设备。只需下载对应客户端即可使用，部分设备还支持浏览器直接游玩。'
  },
  {
    question: '游戏存档保存在哪里？',
    answer: '所有游戏存档都保存在云端服务器，随时随地切换设备都能继续游戏进度。云存储空间根据套餐不同提供50GB-200GB。'
  },
  {
    question: '可以随时取消订阅吗？',
    answer: '可以随时取消订阅，按小时计费套餐即用即付，包月/包年套餐在当前周期结束后不再续费。未使用的时长不支持退款。'
  },
  {
    question: '画质和延迟如何保证？',
    answer: '我们在全国部署了多个数据中心，智能分配最近的服务器。采用先进的视频编码技术，确保画质清晰、延迟低至8ms，支持最高4K 144FPS。'
  }
]

function toggleFaq(index: number) {
  activeFaq.value = activeFaq.value === index ? null : index
}
</script>
