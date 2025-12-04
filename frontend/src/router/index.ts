import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/components/layout/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'games',
        name: 'GameList',
        component: () => import('@/views/games/GameList.vue'),
        meta: { title: '游戏库' }
      },
      {
        path: 'games/:id',
        name: 'GameDetail',
        component: () => import('@/views/games/GameDetail.vue'),
        meta: { title: '游戏详情' }
      },
      {
        path: 'community',
        name: 'Community',
        component: () => import('@/views/community/Forum.vue'),
        meta: { title: '社区论坛' }
      },
      {
        path: 'user',
        name: 'UserCenter',
        component: () => import('@/views/user/Profile.vue'),
        meta: { title: '个人中心', requiresAuth: true }
      },
      {
        path: 'pricing',
        name: 'Pricing',
        component: () => import('@/views/pricing/Pricing.vue'),
        meta: { title: '价格套餐' }
      },
      {
        path: 'download',
        name: 'Download',
        component: () => import('@/views/download/Download.vue'),
        meta: { title: '下载客户端' }
      },
      {
        path: 'help',
        name: 'Help',
        component: () => import('@/views/help/HelpCenter.vue'),
        meta: { title: '帮助中心' }
      },
      {
        path: 'vip',
        name: 'Vip',
        component: () => import('@/views/vip/VipMember.vue'),
        meta: { title: 'VIP会员' }
      },
      {
        path: 'activities',
        name: 'Activities',
        component: () => import('@/views/activities/Activities.vue'),
        meta: { title: '活动中心' }
      }
    ]
  },
  // 前台登录注册（已改为模态窗口）
  {
    path: '/login',
    name: 'Login',
    redirect: '/'
  },
  {
    path: '/register',
    name: 'Register',
    redirect: '/'
  },
  // 后台管理登录（独立页面）
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('@/views/admin/Login.vue'),
    meta: { title: '后台登录' }
  },
  // 后台管理路由
  {
    path: '/admin',
    name: 'Admin',
    redirect: '/admin/dashboard',
    component: () => import('@/components/layout/AdminLayout.vue'),
    meta: { title: '后台管理', requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
        meta: { title: '数据大屏' }
      },
      {
        path: 'games',
        name: 'AdminGames',
        component: () => import('@/views/admin/GameManage.vue'),
        meta: { title: '游戏管理' }
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/UserManage.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: 'comments',
        name: 'AdminComments',
        component: () => import('@/views/admin/CommentManage.vue'),
        meta: { title: '评论管理' }
      },
      {
        path: 'posts',
        name: 'AdminPosts',
        component: () => import('@/views/admin/PostManage.vue'),
        meta: { title: '帖子管理' }
      },
      {
        path: 'reports',
        name: 'AdminReports',
        component: () => import('@/views/admin/ReportManage.vue'),
        meta: { title: '举报处理' }
      },
      {
        path: 'settings',
        name: 'AdminSettings',
        component: () => import('@/views/admin/SystemSettings.vue'),
        meta: { title: '系统设置' }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { title: '404' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - VR游戏平台`
  }

  // 检查是否需要登录
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    if (!token) {
      // 后台路由跳转到后台登录页，前台路由跳转到首页（使用模态窗口）
      if (to.path.startsWith('/admin')) {
        next({ name: 'AdminLogin', query: { redirect: to.fullPath } })
      } else {
        next({ name: 'Home' })
      }
      return
    }
  }

  next()
})

export default router
