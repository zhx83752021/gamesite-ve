/**
 * 测试数据配置
 */

export const testUsers = {
  admin: {
    username: 'admin',
    email: 'admin@example.com',
    password: 'Admin123!',
    role: 'admin'
  },
  normalUser: {
    username: 'testuser',
    email: 'test@example.com',
    password: 'Password123!',
    role: 'user'
  },
  vipUser: {
    username: 'vipuser',
    email: 'vip@example.com',
    password: 'Vip123!',
    role: 'vip'
  }
}

export const testGames = {
  beatSaber: {
    id: 1,
    title: 'Beat Saber',
    price: 78,
    rating: 4.9,
    category: 'rhythm'
  },
  halfLifeAlyx: {
    id: 2,
    title: 'Half-Life: Alyx',
    price: 198,
    rating: 4.8,
    category: 'action'
  }
}

export const testComments = {
  positive: {
    content: '这个游戏太棒了！非常推荐！',
    rating: 5
  },
  negative: {
    content: '游戏体验一般，有待改进。',
    rating: 2
  }
}

export const testPosts = {
  guide: {
    title: 'VR游戏新手指南',
    content: '这里是详细的新手入门教程...',
    tags: ['新手', '教程']
  },
  discussion: {
    title: '大家最喜欢的VR游戏是什么？',
    content: '来分享一下你最喜欢的VR游戏吧！',
    tags: ['讨论', '推荐']
  }
}

export const apiEndpoints = {
  auth: {
    login: '/api/v1/auth/login',
    register: '/api/v1/auth/register',
    logout: '/api/v1/auth/logout'
  },
  games: {
    list: '/api/v1/games',
    detail: (id: number) => `/api/v1/games/${id}`,
    search: '/api/v1/games/search'
  },
  user: {
    profile: '/api/v1/user/profile',
    games: '/api/v1/user/games',
    favorites: '/api/v1/user/favorites'
  },
  community: {
    posts: '/api/v1/posts',
    comments: '/api/v1/comments'
  }
}

export const selectors = {
  header: {
    logo: '[data-testid="logo"]',
    nav: 'nav',
    searchButton: '[data-testid="search-button"]',
    loginButton: 'button:has-text("登录")',
    userAvatar: '[data-testid="user-avatar"]'
  },
  auth: {
    loginModal: '[data-testid="login-modal"]',
    registerModal: '[data-testid="register-modal"]',
    emailInput: 'input[type="email"]',
    passwordInput: 'input[type="password"]',
    submitButton: '[data-testid="login-submit"]'
  },
  games: {
    gameCard: '.game-card',
    filterButton: '[data-testid="category-filter"]',
    searchInput: '[data-testid="game-search-input"]',
    detailPage: {
      title: 'h1',
      description: '[data-testid="game-description"]',
      buyButton: '[data-testid="buy-button"]',
      favoriteButton: '[data-testid="favorite-button"]'
    }
  },
  admin: {
    sidebar: '[data-testid="admin-sidebar"]',
    table: 'table',
    addButton: 'button:has-text("添加")',
    editButton: 'button:has-text("编辑")',
    deleteButton: 'button:has-text("删除")'
  }
}
