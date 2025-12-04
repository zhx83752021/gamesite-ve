import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 侧边栏状态
  const sidebarCollapsed = ref(false)

  // 加载状态
  const loading = ref(false)

  // 移动端检测
  const isMobile = ref(window.innerWidth < 768)

  // 切换侧边栏
  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  // 设置加载状态
  function setLoading(value: boolean) {
    loading.value = value
  }

  // 检查是否移动端
  function checkMobile() {
    isMobile.value = window.innerWidth < 768
  }

  // 监听窗口大小变化
  window.addEventListener('resize', checkMobile)

  return {
    sidebarCollapsed,
    loading,
    isMobile,
    toggleSidebar,
    setLoading,
    checkMobile
  }
})
