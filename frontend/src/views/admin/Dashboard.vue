<template>
  <div class="dashboard">
    <h1 class="text-3xl font-bold mb-6 text-black">数据分析大屏</h1>

    <!-- KPI 指标卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon bg-blue-100">
            <el-icon :size="32" color="#409EFF"><User /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalUsers }}</div>
            <div class="stat-label">总用户数</div>
            <div class="stat-trend">
              <span class="text-green-500">↑ 12.5%</span>
            </div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon bg-green-100">
            <el-icon :size="32" color="#67C23A"><TrendCharts /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.activeUsers }}</div>
            <div class="stat-label">日活用户</div>
            <div class="stat-trend">
              <span class="text-green-500">↑ 8.3%</span>
            </div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon bg-purple-100">
            <el-icon :size="32" color="#9C27B0"><Goods /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalGames }}</div>
            <div class="stat-label">总游戏数</div>
            <div class="stat-trend">
              <span class="text-green-500">↑ 5.2%</span>
            </div>
          </div>
        </div>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <div class="stat-icon bg-orange-100">
            <el-icon :size="32" color="#F56C6C"><Money /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">¥{{ stats.todayRevenue }}</div>
            <div class="stat-label">今日收入</div>
            <div class="stat-trend">
              <span class="text-green-500">↑ 15.8%</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 图表区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- 用户增长趋势 -->
      <el-card>
        <template #header>
          <div class="card-header">
            <span class="font-bold">用户增长趋势</span>
          </div>
        </template>
        <div ref="userChartRef" style="height: 300px"></div>
      </el-card>

      <!-- 游戏类型分布 -->
      <el-card>
        <template #header>
          <div class="card-header">
            <span class="font-bold">游戏类型分布</span>
          </div>
        </template>
        <div ref="categoryChartRef" style="height: 300px"></div>
      </el-card>
    </div>

    <!-- 收入统计 -->
    <el-card>
      <template #header>
        <div class="card-header">
          <span class="font-bold">月度收入统计</span>
        </div>
      </template>
      <div ref="revenueChartRef" style="height: 300px"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { User, TrendCharts, Goods, Money } from '@element-plus/icons-vue'

const stats = ref({
  totalUsers: 125487,
  activeUsers: 8234,
  totalGames: 1456,
  todayRevenue: 12580
})

const userChartRef = ref<HTMLElement>()
const categoryChartRef = ref<HTMLElement>()
const revenueChartRef = ref<HTMLElement>()

let userChart: echarts.ECharts
let categoryChart: echarts.ECharts
let revenueChart: echarts.ECharts

onMounted(() => {
  initCharts()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  userChart?.dispose()
  categoryChart?.dispose()
  revenueChart?.dispose()
})

function initCharts() {
  // 用户增长趋势图
  if (userChartRef.value) {
    userChart = echarts.init(userChartRef.value)
    userChart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月']
      },
      yAxis: { type: 'value' },
      series: [{
        name: '新增用户',
        type: 'line',
        smooth: true,
        data: [1200, 2300, 3600, 5200, 7800, 10500],
        itemStyle: { color: '#409EFF' },
        areaStyle: { color: 'rgba(64, 158, 255, 0.1)' }
      }]
    })
  }

  // 游戏类型分布图
  if (categoryChartRef.value) {
    categoryChart = echarts.init(categoryChartRef.value)
    categoryChart.setOption({
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        data: [
          { value: 335, name: '动作冒险' },
          { value: 234, name: '解谜益智' },
          { value: 178, name: '社交互动' },
          { value: 156, name: '运动健身' },
          { value: 98, name: '恐怖惊悚' }
        ],
        label: { formatter: '{b}: {c} ({d}%)' }
      }]
    })
  }

  // 收入统计图
  if (revenueChartRef.value) {
    revenueChart = echarts.init(revenueChartRef.value)
    revenueChart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月']
      },
      yAxis: { type: 'value' },
      series: [{
        name: '收入',
        type: 'bar',
        data: [28500, 35600, 42800, 51200, 63500, 78900],
        itemStyle: { color: '#67C23A' }
      }]
    })
  }
}

function handleResize() {
  userChart?.resize()
  categoryChart?.resize()
  revenueChart?.resize()
}
</script>

<style scoped>
.stat-card {
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 4px;
}

.stat-trend {
  font-size: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
