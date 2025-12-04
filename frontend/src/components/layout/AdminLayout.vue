<template>
  <el-container class="admin-layout">
    <el-aside :width="isCollapse ? '64px' : '220px'" class="admin-sidebar">
      <div class="sidebar-header">
        <h2 v-if="!isCollapse">VR后台</h2>
        <span v-else>VR</span>
      </div>

      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :router="true"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/admin/dashboard" :route="{ path: '/admin/dashboard' }">
          <el-icon><HomeFilled /></el-icon>
          <template #title>数据大屏</template>
        </el-menu-item>

        <el-menu-item index="/admin/games" :route="{ path: '/admin/games' }">
          <el-icon><Goods /></el-icon>
          <template #title>游戏管理</template>
        </el-menu-item>

        <el-menu-item index="/admin/users" :route="{ path: '/admin/users' }">
          <el-icon><User /></el-icon>
          <template #title>用户管理</template>
        </el-menu-item>

        <el-menu-item index="/admin/comments" :route="{ path: '/admin/comments' }">
          <el-icon><ChatDotRound /></el-icon>
          <template #title>评论管理</template>
        </el-menu-item>

        <el-menu-item index="/admin/posts" :route="{ path: '/admin/posts' }">
          <el-icon><Document /></el-icon>
          <template #title>帖子管理</template>
        </el-menu-item>

        <el-menu-item index="/admin/reports" :route="{ path: '/admin/reports' }">
          <el-icon><WarningFilled /></el-icon>
          <template #title>举报处理</template>
        </el-menu-item>

        <el-menu-item index="/admin/settings" :route="{ path: '/admin/settings' }">
          <el-icon><Setting /></el-icon>
          <template #title>系统设置</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="admin-header">
        <div class="header-left">
          <el-icon class="toggle-icon" @click="toggleSidebar">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/admin/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="breadcrumb">{{ breadcrumb }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-dropdown">
              <el-avatar :src="userInfo.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'" />
              <span class="username">{{ userInfo.username }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="front">返回前台</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <el-main class="admin-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  HomeFilled, Goods, User, ChatDotRound, Document,
  WarningFilled, Setting, Fold, Expand, ArrowDown
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const isCollapse = ref(false)
const userInfo = ref({
  username: 'Admin',
  avatar: ''
})

const activeMenu = computed(() => route.path)
const breadcrumb = computed(() => {
  const pathMap: Record<string, string> = {
    '/admin/dashboard': '数据大屏',
    '/admin/games': '游戏管理',
    '/admin/users': '用户管理',
    '/admin/comments': '评论管理',
    '/admin/posts': '帖子管理',
    '/admin/reports': '举报处理',
    '/admin/settings': '系统设置'
  }
  return pathMap[route.path] || ''
})

function toggleSidebar() {
  isCollapse.value = !isCollapse.value
}

function handleCommand(command: string) {
  switch (command) {
    case 'profile':
      router.push('/user')
      break
    case 'front':
      router.push('/')
      break
    case 'logout':
      ElMessage.success('退出成功')
      localStorage.removeItem('token')
      router.push('/login')
      break
  }
}
</script>

<style scoped>
.admin-layout {
  height: 100vh;
}

.admin-sidebar {
  background-color: #304156;
  transition: width 0.3s;
}

.sidebar-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  font-weight: bold;
  background-color: #242f3e;
}

.admin-header {
  background: white;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.toggle-icon {
  font-size: 20px;
  cursor: pointer;
  transition: transform 0.3s;
}

.toggle-icon:hover {
  transform: scale(1.2);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-dropdown:hover {
  background-color: #f5f7fa;
}

.username {
  font-size: 14px;
  color: #303133;
  line-height: 1;
  padding: 0;
  margin: 0;
}

.admin-main {
  background: #f0f2f5;
  padding: 20px;
}

:deep(.el-breadcrumb__inner) {
  color: #303133 !important;
}

:deep(.el-breadcrumb__inner.is-link) {
  color: #303133 !important;
}

:deep(.el-breadcrumb__inner.is-link:hover) {
  color: #409EFF !important;
}
</style>
