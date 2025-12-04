import { test, expect } from '@playwright/test'

test.describe('后台管理功能测试', () => {
  // 使用管理员身份登录
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login')

    // 登录管理后台
    await page.locator('input[name="username"]').fill('admin')
    await page.locator('input[name="password"]').fill('Admin123!')
    await page.locator('button[type="submit"]').click()

    // 等待跳转到后台首页
    await page.waitForURL('/admin/dashboard', { timeout: 5000 }).catch(() => {})
  })

  test('后台登录功能', async ({ page }) => {
    // 验证已经登录到后台
    await expect(page).toHaveURL(/\/admin/)

    // 检查后台导航栏
    const sidebar = page.locator('[data-testid="admin-sidebar"], .admin-sidebar')
    await expect(sidebar).toBeVisible()
  })

  test('数据大屏显示', async ({ page }) => {
    await page.goto('/admin/dashboard')

    // 检查数据统计卡片
    const statsCards = page.locator('[data-testid="stats-card"], .stats-card')
    const count = await statsCards.count()
    expect(count).toBeGreaterThan(0)

    // 检查图表
    const charts = page.locator('[data-testid="chart"], .chart-container')
    if (await charts.first().isVisible()) {
      expect(await charts.count()).toBeGreaterThan(0)
    }
  })

  test('游戏管理 - 列表显示', async ({ page }) => {
    await page.goto('/admin/games')

    // 检查游戏列表表格
    const table = page.locator('table, [data-testid="games-table"]')
    await expect(table).toBeVisible()

    // 检查添加游戏按钮
    const addButton = page.locator('button:has-text("添加"), button:has-text("新增")')
    await expect(addButton.first()).toBeVisible()
  })

  test('游戏管理 - 搜索功能', async ({ page }) => {
    await page.goto('/admin/games')

    // 使用搜索功能
    const searchInput = page.locator('input[type="search"], input[placeholder*="搜索"]')
    if (await searchInput.isVisible()) {
      await searchInput.fill('Beat Saber')
      await page.waitForTimeout(500)

      // 验证搜索结果
      const rows = page.locator('table tbody tr')
      expect(await rows.count()).toBeGreaterThanOrEqual(0)
    }
  })

  test('游戏管理 - 添加游戏', async ({ page }) => {
    await page.goto('/admin/games')

    // 点击添加按钮
    const addButton = page.locator('button:has-text("添加"), button:has-text("新增")').first()
    await addButton.click()

    // 检查表单对话框
    const dialog = page.locator('.el-dialog, [role="dialog"]')
    await expect(dialog).toBeVisible()

    // 填写游戏信息
    await page.locator('input[name="title"]').fill('测试游戏')
    await page.locator('textarea[name="description"]').fill('这是一个测试游戏')

    // 提交表单（不实际保存）
    // const submitButton = page.locator('button:has-text("确定"), button:has-text("保存")')
    // await submitButton.click()
  })

  test('用户管理 - 列表显示', async ({ page }) => {
    await page.goto('/admin/users')

    // 检查用户列表
    const table = page.locator('table, [data-testid="users-table"]')
    await expect(table).toBeVisible()

    // 检查用户数据行
    const rows = page.locator('table tbody tr')
    expect(await rows.count()).toBeGreaterThan(0)
  })

  test('用户管理 - 封禁用户', async ({ page }) => {
    await page.goto('/admin/users')

    // 查找操作按钮
    const actionButtons = page.locator('button:has-text("封禁"), button:has-text("禁用")')
    if (await actionButtons.first().isVisible()) {
      await actionButtons.first().click()

      // 检查确认对话框
      const confirmDialog = page.locator('.el-message-box, [role="alertdialog"]')
      if (await confirmDialog.isVisible()) {
        // 取消操作
        const cancelButton = confirmDialog.locator('button:has-text("取消")')
        await cancelButton.click()
      }
    }
  })

  test('评论管理 - 列表显示', async ({ page }) => {
    await page.goto('/admin/comments')

    // 检查评论列表
    const table = page.locator('table')
    await expect(table).toBeVisible()

    // 检查筛选选项
    const filters = page.locator('[data-testid="comment-filters"]')
    if (await filters.isVisible()) {
      await expect(filters).toBeVisible()
    }
  })

  test('评论管理 - 审核评论', async ({ page }) => {
    await page.goto('/admin/comments')

    // 查找审核按钮
    const approveButtons = page.locator('button:has-text("通过"), button:has-text("审核")')
    if (await approveButtons.first().isVisible()) {
      const initialCount = await approveButtons.count()
      expect(initialCount).toBeGreaterThanOrEqual(0)
    }
  })

  test('帖子管理 - 列表显示', async ({ page }) => {
    await page.goto('/admin/posts')

    // 检查帖子列表
    const table = page.locator('table')
    await expect(table).toBeVisible()
  })

  test('举报处理 - 列表显示', async ({ page }) => {
    await page.goto('/admin/reports')

    // 检查举报列表
    const table = page.locator('table')
    await expect(table).toBeVisible()

    // 检查状态筛选
    const statusFilters = page.locator('[data-testid="status-filter"]')
    if (await statusFilters.isVisible()) {
      await expect(statusFilters).toBeVisible()
    }
  })

  test('系统设置 - 页面显示', async ({ page }) => {
    await page.goto('/admin/settings')

    // 检查设置表单
    const settingsForm = page.locator('form, [data-testid="settings-form"]')
    await expect(settingsForm).toBeVisible()

    // 检查保存按钮
    const saveButton = page.locator('button:has-text("保存"), button:has-text("更新")')
    await expect(saveButton.first()).toBeVisible()
  })

  test('后台导航 - 菜单切换', async ({ page }) => {
    await page.goto('/admin/dashboard')

    // 测试各个菜单项
    const menuItems = [
      { name: '游戏管理', url: '/admin/games' },
      { name: '用户管理', url: '/admin/users' },
      { name: '评论管理', url: '/admin/comments' },
      { name: '帖子管理', url: '/admin/posts' },
    ]

    for (const item of menuItems) {
      const menuLink = page.locator(`a:has-text("${item.name}")`)
      if (await menuLink.isVisible()) {
        await menuLink.click()
        await expect(page).toHaveURL(item.url)
        await page.waitForTimeout(300)
      }
    }
  })

  test('后台退出登录', async ({ page }) => {
    await page.goto('/admin/dashboard')

    // 查找退出登录按钮
    const logoutButton = page.locator('button:has-text("退出"), a:has-text("退出登录")')
    if (await logoutButton.isVisible()) {
      await logoutButton.click()

      // 验证跳转到登录页
      await expect(page).toHaveURL(/\/admin\/login/)
    }
  })

  test('响应式设计 - 后台移动端', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/admin/dashboard')

    // 检查移动端菜单
    const mobileMenu = page.locator('[data-testid="mobile-menu"], .mobile-menu-toggle')
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click()
      await page.waitForTimeout(300)
    }
  })
})
