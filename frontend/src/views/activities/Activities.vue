<template>
  <div class="min-h-screen py-16">
    <!-- Hero Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div class="text-center mb-12">
        <h1 class="text-5xl md:text-6xl font-bold mb-6">
          <span class="text-transparent bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-500 bg-clip-text">
            活动中心
          </span>
        </h1>
        <p class="text-xl text-gray-400 max-w-3xl mx-auto">
          限时优惠 · 新人福利 · 签到有礼 · 每日惊喜
        </p>
      </div>

      <!-- 活动分类标签 -->
      <div class="flex justify-center gap-3 mb-12 flex-wrap">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="selectedCategory = category.id"
          :class="[
            'px-6 py-3 rounded-full font-medium transition-all duration-300',
            selectedCategory === category.id
              ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/50'
              : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700'
          ]"
        >
          {{ category.name }}
        </button>
      </div>
    </section>

    <!-- 轮播大图活动 -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div class="relative rounded-3xl overflow-hidden group cursor-pointer">
        <img
          src="https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1920&h=600&fit=crop"
          alt="Featured Activity"
          class="w-full h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>

        <div class="absolute inset-0 flex flex-col justify-center px-16">
          <div class="max-w-2xl">
            <span class="inline-block px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full mb-4">
              🔥 限时活动
            </span>
            <h2 class="text-5xl font-bold text-white mb-4">新用户专享</h2>
            <p class="text-2xl text-gray-200 mb-6">首月仅需 ¥9.9 畅玩千款游戏</p>
            <div class="flex items-center gap-4 mb-6">
              <div class="text-white">
                <div class="text-sm text-gray-400">活动倒计时</div>
                <div class="text-2xl font-bold">{{ countdown }}</div>
              </div>
            </div>
            <button class="px-10 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white text-lg font-bold rounded-full hover:shadow-[0_0_30px_rgba(239,68,68,0.6)] transition-all duration-300 transform hover:scale-105">
              立即领取
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 活动列表 -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="activity in filteredActivities"
          :key="activity.id"
          class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:border-pink-400/50 transition-all duration-300 hover:scale-105 cursor-pointer group"
        >
          <!-- 活动图片 -->
          <div class="relative aspect-video overflow-hidden">
            <img
              :src="activity.image"
              :alt="activity.title"
              class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
            <div class="absolute top-3 left-3">
              <span :class="[
                'px-3 py-1 rounded-full text-sm font-bold',
                activity.status === 'hot' ? 'bg-red-500 text-white' :
                activity.status === 'new' ? 'bg-green-500 text-white' :
                'bg-gray-800 text-gray-300'
              ]">
                {{ activity.statusText }}
              </span>
            </div>
            <div v-if="activity.endTime" class="absolute bottom-3 right-3 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-white text-xs">
              ⏰ {{ activity.endTime }}
            </div>
          </div>

          <!-- 活动信息 -->
          <div class="p-6">
            <h3 class="text-xl font-bold text-white mb-2 group-hover:text-pink-400 transition-colors">
              {{ activity.title }}
            </h3>
            <p class="text-gray-400 text-sm mb-4 line-clamp-2">{{ activity.description }}</p>

            <!-- 奖励展示 -->
            <div class="flex items-center gap-2 mb-4">
              <span class="text-gray-500 text-sm">奖励:</span>
              <span class="text-yellow-400 font-bold">{{ activity.reward }}</span>
            </div>

            <!-- 参与按钮 -->
            <button class="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all">
              {{ activity.buttonText }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 每日签到 -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div class="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-3xl p-12 border border-purple-500/30">
        <h2 class="text-3xl font-bold text-center mb-8 text-white">每日签到领奖励</h2>
        <p class="text-center text-gray-400 mb-8">连续签到7天可获得额外奖励</p>

        <div class="grid grid-cols-7 gap-4 max-w-4xl mx-auto mb-8">
          <div
            v-for="day in 7"
            :key="day"
            :class="[
              'bg-gray-900/50 rounded-2xl p-6 text-center border-2 transition-all',
              day <= currentSignDay ? 'border-green-400' : 'border-gray-700'
            ]"
          >
            <div class="text-3xl mb-3">
              {{ day <= currentSignDay ? '✅' : '📅' }}
            </div>
            <div class="text-white font-bold mb-2">第{{ day }}天</div>
            <div class="text-yellow-400 text-sm">{{ getSignReward(day) }}</div>
          </div>
        </div>

        <div class="text-center">
          <button
            :disabled="isTodaySigned"
            :class="[
              'px-12 py-4 font-bold rounded-xl text-lg transition-all',
              isTodaySigned
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] transform hover:scale-105'
            ]"
            @click="handleSign"
          >
            {{ isTodaySigned ? '今日已签到' : '立即签到' }}
          </button>
        </div>
      </div>
    </section>

    <!-- 推荐有礼 -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-gradient-to-r from-pink-900/30 to-purple-900/30 rounded-3xl p-12 border border-pink-500/30">
        <div class="flex flex-col md:flex-row items-center justify-between gap-8">
          <div class="flex-1">
            <h2 class="text-3xl font-bold text-white mb-4">邀请好友，双方获奖</h2>
            <p class="text-gray-300 mb-6">
              邀请好友注册并开通会员，你和好友各得30元代金券
              <br />
              邀请越多，奖励越多，无上限
            </p>
            <div class="flex items-center gap-4 mb-6">
              <div class="bg-gray-900/50 rounded-xl p-4 text-center">
                <div class="text-2xl font-bold text-pink-400">{{ inviteCount }}</div>
                <div class="text-xs text-gray-400">已邀请好友</div>
              </div>
              <div class="bg-gray-900/50 rounded-xl p-4 text-center">
                <div class="text-2xl font-bold text-yellow-400">¥{{ inviteReward }}</div>
                <div class="text-xs text-gray-400">累计奖励</div>
              </div>
            </div>
            <button class="px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-lg font-bold rounded-xl hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all duration-300 transform hover:scale-105">
              立即邀请
            </button>
          </div>
          <div class="flex-shrink-0">
            <div class="text-8xl">🎁</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 活动分类
const categories = [
  { id: 'all', name: '全部活动' },
  { id: 'newbie', name: '新人专享' },
  { id: 'limited', name: '限时优惠' },
  { id: 'daily', name: '每日福利' },
  { id: 'vip', name: 'VIP特权' }
]

const selectedCategory = ref('all')

// 倒计时
const countdown = ref('23:45:32')

// 活动列表
const activities = [
  {
    id: 1,
    category: 'newbie',
    title: '新用户专享 · 首月仅需9.9元',
    description: '注册即送3小时免费时长，首次充值享5折优惠，更有海量游戏等你来玩',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=400&fit=crop',
    reward: '5折优惠券 + 3小时时长',
    status: 'hot',
    statusText: '🔥 热门',
    endTime: '7天后结束',
    buttonText: '立即领取'
  },
  {
    id: 2,
    category: 'limited',
    title: '周末狂欢 · 充100送50',
    description: '本周末充值满100元即送50元代金券，可用于游戏时长、会员等',
    image: 'https://images.unsplash.com/photo-1614294148960-9aa740632a87?w=800&h=400&fit=crop',
    reward: '50元代金券',
    status: 'new',
    statusText: '🆕 最新',
    endTime: '3天后结束',
    buttonText: '去充值'
  },
  {
    id: 3,
    category: 'daily',
    title: '每日登录领奖励',
    description: '每天登录可领取游戏时长、代金券等奖励，连续7天额外送大礼包',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop',
    reward: '1小时时长',
    status: 'normal',
    statusText: '进行中',
    endTime: '',
    buttonText: '每日领取'
  },
  {
    id: 4,
    category: 'vip',
    title: 'VIP专享 · 游戏全场8折',
    description: 'VIP会员购买游戏享8折优惠，更有独家游戏抢先体验资格',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop',
    reward: '8折优惠',
    status: 'normal',
    statusText: '长期有效',
    endTime: '',
    buttonText: '查看详情'
  },
  {
    id: 5,
    category: 'limited',
    title: '双十二狂欢 · 年度最低价',
    description: '全年最低价，会员套餐5折起，错过再等一年',
    image: 'https://images.unsplash.com/photo-1607827448387-a67db1383b59?w=800&h=400&fit=crop',
    reward: '最高省500元',
    status: 'hot',
    statusText: '🔥 爆款',
    endTime: '15天后结束',
    buttonText: '抢购'
  },
  {
    id: 6,
    category: 'daily',
    title: '分享有礼 · 每日分享赚时长',
    description: '每天分享给好友可获得免费游戏时长，多分享多得',
    image: 'https://images.unsplash.com/photo-1556438758-8d49568ce18e?w=800&h=400&fit=crop',
    reward: '30分钟时长',
    status: 'normal',
    statusText: '每日任务',
    endTime: '',
    buttonText: '去分享'
  }
]

const filteredActivities = computed(() => {
  if (selectedCategory.value === 'all') {
    return activities
  }
  return activities.filter(a => a.category === selectedCategory.value)
})

// 签到
const currentSignDay = ref(3)
const isTodaySigned = ref(false)

function getSignReward(day: number) {
  const rewards = ['10分钟', '20分钟', '30分钟', '1小时', '2小时', '3小时', '5小时']
  return rewards[day - 1]
}

function handleSign() {
  if (!isTodaySigned.value) {
    currentSignDay.value++
    isTodaySigned.value = true
    ElMessage.success('签到成功！获得' + getSignReward(currentSignDay.value))
  }
}

// 邀请数据
const inviteCount = ref(12)
const inviteReward = ref(360)

// 倒计时
onMounted(() => {
  setInterval(() => {
    // 简单的倒计时逻辑
    const now = new Date()
    const hours = 23 - now.getHours()
    const minutes = 59 - now.getMinutes()
    const seconds = 59 - now.getSeconds()
    countdown.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }, 1000)
})
</script>
