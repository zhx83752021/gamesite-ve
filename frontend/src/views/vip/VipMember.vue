<template>
  <div class="min-h-screen py-16">
    <!-- Hero Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div class="relative rounded-3xl overflow-hidden">
        <!-- 背景 -->
        <div class="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-blue-900/50 to-cyan-900/50"></div>
        <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>

        <!-- 内容 -->
        <div class="relative z-10 px-12 py-16 text-center">
          <div class="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full mb-6 shadow-2xl shadow-yellow-500/50">
            <span class="text-5xl">👑</span>
          </div>
          <h1 class="text-5xl md:text-6xl font-bold mb-6">
            <span class="text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text">
              VIP 会员特权
            </span>
          </h1>
          <p class="text-xl text-gray-200 max-w-3xl mx-auto mb-8">
            解锁专属福利 · 享受至尊体验 · 游戏无限畅玩
          </p>

          <div class="flex justify-center gap-4">
            <button
              class="px-10 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-lg font-bold rounded-full hover:shadow-[0_0_40px_rgba(234,179,8,0.6)] transition-all duration-300 transform hover:scale-105"
            >
              立即开通
            </button>
            <button
              class="px-10 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white text-lg font-bold rounded-full hover:bg-white/20 transition-all duration-300"
            >
              了解更多
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- VIP等级体系 -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <h2 class="text-3xl font-bold text-center mb-12 text-white">会员等级体系</h2>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div
          v-for="level in vipLevels"
          :key="level.id"
          :class="[
            'relative rounded-3xl p-8 border-2 transition-all duration-300 hover:scale-105',
            level.recommended
              ? 'bg-gradient-to-br from-yellow-500/10 to-orange-600/10 border-yellow-400 shadow-2xl shadow-yellow-500/20'
              : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'
          ]"
        >
          <!-- 推荐标签 -->
          <div v-if="level.recommended" class="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span class="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-sm font-bold rounded-full shadow-lg">
              ⭐ 推荐
            </span>
          </div>

          <!-- 等级图标 -->
          <div class="text-center mb-6">
            <div class="text-6xl mb-4">{{ level.icon }}</div>
            <h3 class="text-2xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text mb-2">
              {{ level.name }}
            </h3>
            <p class="text-gray-400 text-sm">{{ level.description }}</p>
          </div>

          <!-- 价格 -->
          <div class="text-center mb-6 pb-6 border-b border-gray-700">
            <div class="text-4xl font-bold text-white mb-2">¥{{ level.price }}</div>
            <p class="text-gray-400">{{ level.duration }}</p>
          </div>

          <!-- 特权列表 -->
          <div class="space-y-3 mb-6">
            <div
              v-for="privilege in level.privileges"
              :key="privilege"
              class="flex items-start gap-2"
            >
              <svg class="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
              <span class="text-gray-300 text-sm">{{ privilege }}</span>
            </div>
          </div>

          <!-- 开通按钮 -->
          <button
            :class="[
              'w-full py-3 rounded-xl font-bold transition-all duration-300',
              level.recommended
                ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:shadow-[0_0_30px_rgba(234,179,8,0.5)]'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            ]"
          >
            立即开通
          </button>
        </div>
      </div>
    </section>

    <!-- 特权详情 -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <h2 class="text-3xl font-bold text-center mb-12 text-white">专属特权详情</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="feature in vipFeatures"
          :key="feature.title"
          class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105"
        >
          <div class="text-5xl mb-4">{{ feature.icon }}</div>
          <h3 class="text-xl font-bold text-white mb-3">{{ feature.title }}</h3>
          <p class="text-gray-400 mb-4">{{ feature.description }}</p>
          <div class="flex items-center gap-2 text-sm text-yellow-400">
            <span>VIP{{ feature.minLevel }}+</span>
            <span class="text-gray-600">|</span>
            <span>{{ feature.tag }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 成长体系 -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 border border-gray-700">
        <h2 class="text-3xl font-bold text-center mb-8 text-white">成长值体系</h2>
        <p class="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
          通过充值、游戏时长、签到等方式获取成长值，提升会员等级解锁更多特权
        </p>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div
            v-for="way in growthWays"
            :key="way.title"
            class="text-center"
          >
            <div class="bg-gray-800/50 rounded-2xl p-6 mb-4">
              <div class="text-4xl mb-3">{{ way.icon }}</div>
              <h3 class="text-lg font-bold text-white mb-2">{{ way.title }}</h3>
              <p class="text-gray-400 text-sm mb-3">{{ way.description }}</p>
              <div class="text-2xl font-bold text-yellow-400">+{{ way.points }}</div>
              <p class="text-xs text-gray-500">成长值/{{ way.unit }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-center mb-12 text-white">常见问题</h2>

      <div class="space-y-4">
        <div
          v-for="(faq, index) in vipFaqs"
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

          <div v-show="activeFaq === index" class="px-6 pb-4 text-gray-400">
            {{ faq.answer }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// VIP等级
const vipLevels = [
  {
    id: 'vip1',
    name: 'VIP 1',
    icon: '🥉',
    description: '入门会员',
    price: 99,
    duration: '首月体验',
    recommended: false,
    privileges: [
      '基础云电脑配置',
      '每月50小时时长',
      '1080P高清画质',
      '标准客服支持',
      '每周1次免费试玩'
    ]
  },
  {
    id: 'vip2',
    name: 'VIP 2',
    icon: '🥈',
    description: '进阶会员',
    price: 299,
    duration: '月付套餐',
    recommended: true,
    privileges: [
      '专业云电脑配置',
      '每月150小时时长',
      '2K 120FPS画质',
      '优先客服支持',
      '每周3次免费试玩',
      '专属游戏折扣',
      '云存储100GB'
    ]
  },
  {
    id: 'vip3',
    name: 'VIP 3',
    icon: '🥇',
    description: '高级会员',
    price: 599,
    duration: '月付套餐',
    recommended: false,
    privileges: [
      '旗舰云电脑配置',
      '每月300小时时长',
      '4K 144FPS画质',
      '专属客服1对1',
      '无限免费试玩',
      '所有游戏8折',
      '云存储200GB',
      '独享服务器'
    ]
  },
  {
    id: 'svip',
    name: 'SVIP',
    icon: '👑',
    description: '至尊会员',
    price: 1299,
    duration: '月付套餐',
    recommended: false,
    privileges: [
      '顶级云电脑配置',
      '无限时长畅玩',
      '8K 240FPS画质',
      '专属管家服务',
      '全部游戏免费',
      '独享专线网络',
      '云存储500GB',
      '优先体验新游',
      '线下活动特权'
    ]
  }
]

// VIP特权
const vipFeatures = [
  {
    icon: '🎮',
    title: '游戏库免费畅玩',
    description: '数千款精品游戏随心玩，无需额外购买',
    minLevel: 3,
    tag: '省钱必备'
  },
  {
    icon: '⚡',
    title: '独享专线加速',
    description: '专属网络通道，延迟降低50%，稳定不掉线',
    minLevel: 2,
    tag: '极速体验'
  },
  {
    icon: '🎁',
    title: '每月免费时长',
    description: '赠送额外游戏时长，畅玩无压力',
    minLevel: 1,
    tag: '超值福利'
  },
  {
    icon: '💎',
    title: '专属游戏折扣',
    description: '新游首发享折扣，DLC内容优惠购',
    minLevel: 2,
    tag: '独家优惠'
  },
  {
    icon: '🏆',
    title: '优先体验资格',
    description: '抢先体验新游戏、新功能测试版',
    minLevel: 3,
    tag: '尝鲜特权'
  },
  {
    icon: '📊',
    title: '游戏数据分析',
    description: '详细的游戏时长、成就统计分析',
    minLevel: 1,
    tag: '数据可视'
  },
  {
    icon: '💬',
    title: '专属客服通道',
    description: '7x24小时专属客服，问题秒速解决',
    minLevel: 2,
    tag: '贴心服务'
  },
  {
    icon: '🎭',
    title: '专属身份标识',
    description: '独特的VIP标识、聊天气泡、个性装扮',
    minLevel: 1,
    tag: '彰显身份'
  },
  {
    icon: '🎉',
    title: '生日专属礼包',
    description: '生日当月获得专属游戏礼包和祝福',
    minLevel: 2,
    tag: '暖心关怀'
  }
]

// 成长方式
const growthWays = [
  {
    icon: '💰',
    title: '充值消费',
    description: '每充值1元',
    points: 10,
    unit: '元'
  },
  {
    icon: '⏰',
    title: '游戏时长',
    description: '在线游戏',
    points: 5,
    unit: '小时'
  },
  {
    icon: '✅',
    title: '每日签到',
    description: '连续签到',
    points: 20,
    unit: '天'
  },
  {
    icon: '🎯',
    title: '完成任务',
    description: '完成成就',
    points: 100,
    unit: '个'
  }
]

// FAQ
const activeFaq = ref<number | null>(null)

const vipFaqs = [
  {
    question: 'VIP会员有效期多久？',
    answer: '根据购买的套餐类型，有月度、季度、年度等选项。到期前会提醒续费，可设置自动续费。'
  },
  {
    question: '可以升级或降级会员等级吗？',
    answer: '可以随时升级到更高等级，立即享受新特权。降级需在当前周期结束后生效，不支持退还差价。'
  },
  {
    question: 'VIP特权可以转让或赠送吗？',
    answer: 'VIP会员与账号绑定，不支持转让。但可以购买会员礼包赠送给好友。'
  },
  {
    question: '如何快速提升会员等级？',
    answer: '通过充值、游戏时长、签到、完成任务等方式获取成长值。充值是最快的提升方式。'
  },
  {
    question: 'VIP会员可以退款吗？',
    answer: '未使用的包月/包年会员，可在开通7天内申请退款。按小时计费的已消费时长不支持退款。'
  }
]

function toggleFaq(index: number) {
  activeFaq.value = activeFaq.value === index ? null : index
}
</script>
