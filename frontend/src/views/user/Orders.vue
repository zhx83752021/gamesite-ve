<template>
  <div class="min-h-screen py-16">
    <div class="max-w-6xl mx-auto px-4">
      <h1 class="text-4xl font-bold text-white mb-8">我的订单</h1>

      <!-- 订单状态筛选 -->
      <div class="flex gap-4 mb-8">
        <button
          v-for="status in orderStatus"
          :key="status.value"
          @click="activeStatus = status.value"
          :class="[
            'px-6 py-3 rounded-xl font-medium transition-all',
            activeStatus === status.value
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          ]"
        >
          {{ status.label }}
        </button>
      </div>

      <!-- 订单列表 -->
      <div class="space-y-4">
        <div
          v-for="order in orders"
          :key="order.id"
          class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700"
        >
          <!-- 订单头部 -->
          <div class="flex justify-between items-center mb-4 pb-4 border-b border-gray-700">
            <div class="text-sm text-gray-400">
              订单号: {{ order.orderNo }} | {{ order.createdAt }}
            </div>
            <div :class="[
              'px-4 py-1 rounded-full text-sm font-bold',
              order.status === 'paid' ? 'bg-green-500/20 text-green-400' :
              order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-gray-500/20 text-gray-400'
            ]">
              {{ order.statusText }}
            </div>
          </div>

          <!-- 订单内容 -->
          <div class="flex gap-6">
            <img :src="order.cover" :alt="order.title" class="w-32 h-40 rounded-xl object-cover"/>
            <div class="flex-1">
              <h3 class="text-xl font-bold text-white mb-2">{{ order.title }}</h3>
              <div class="text-gray-400 mb-4">{{ order.type }}</div>
              <div class="text-2xl font-bold text-cyan-400">¥{{ order.amount }}</div>
            </div>
            <div class="flex flex-col gap-2 justify-center">
              <button
                v-if="order.status === 'pending'"
                class="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all"
              >
                去支付
              </button>
              <button
                v-if="order.status === 'paid'"
                class="px-6 py-2 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all"
              >
                查看详情
              </button>
              <button class="px-6 py-2 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition-all">
                联系客服
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="orders.length === 0" class="text-center py-16">
        <div class="text-6xl mb-4">📦</div>
        <div class="text-xl text-gray-400">暂无订单</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeStatus = ref('all')
const orderStatus = [
  { value: 'all', label: '全部订单' },
  { value: 'pending', label: '待支付' },
  { value: 'paid', label: '已支付' },
  { value: 'completed', label: '已完成' }
]

// 模拟订单数据
const orders = ref([
  {
    id: 1,
    orderNo: 'VR202412050001',
    title: 'Beat Saber',
    type: '游戏购买',
    cover: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=300&h=400&fit=crop',
    amount: 78,
    status: 'paid',
    statusText: '已支付',
    createdAt: '2024-12-05 10:30'
  },
  {
    id: 2,
    orderNo: 'VR202412040023',
    title: 'VIP会员月卡',
    type: '会员充值',
    cover: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=300&h=400&fit=crop',
    amount: 29.9,
    status: 'paid',
    statusText: '已支付',
    createdAt: '2024-12-04 15:20'
  },
  {
    id: 3,
    orderNo: 'VR202412030045',
    title: 'Half-Life: Alyx',
    type: '游戏购买',
    cover: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=300&h=400&fit=crop',
    amount: 88,
    status: 'pending',
    statusText: '待支付',
    createdAt: '2024-12-03 20:15'
  }
])
</script>
