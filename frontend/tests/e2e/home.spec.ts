import { test, expect } from '@playwright/test'

test.describe('首页测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('首页加载正常', async ({ page }) => {
    // 检查页面标题
    await expect(page).toHaveTitle(/VR游戏平台/)

    // 检查主要导航元素
    await expect(page.locator('nav')).toBeVisible()

    // 检查Hero区域
    const hero = page.locator('[data-testid="hero-section"]')
    await expect(hero).toBeVisible()
  })

  test('导航栏功能', async ({ page }) => {
    // 检查所有导航链接
    const navLinks = ['游戏库', '社区', 'VIP会员', '活动中心', '下载', '帮助']

    for (const link of navLinks) {
      const navItem = page.getByRole('link', { name: link })
      await expect(navItem).toBeVisible()
    }
  })

  test('搜索功能', async ({ page }) => {
    // 点击搜索图标
    const searchButton = page.locator('[data-testid="search-button"]')
    await searchButton.click()

    // 输入搜索关键词
    const searchInput = page.locator('[data-testid="search-input"]')
    await searchInput.fill('Beat Saber')

    // 提交搜索
    await searchInput.press('Enter')

    // 验证跳转到搜索结果页
    await expect(page).toHaveURL(/search/)
  })

  test('轮播图功能', async ({ page }) => {
    // 等待轮播图加载
    const carousel = page.locator('[data-testid="carousel"]')
    await expect(carousel).toBeVisible()

    // 检查轮播图项目
    const carouselItems = carousel.locator('.carousel-item')
    const count = await carouselItems.count()
    expect(count).toBeGreaterThan(0)

    // 测试左右切换按钮
    const nextButton = page.locator('[data-testid="carousel-next"]')
    if (await nextButton.isVisible()) {
      await nextButton.click()
      await page.waitForTimeout(500)
    }
  })

  test('热门游戏展示', async ({ page }) => {
    // 检查热门游戏区域
    const hotGames = page.locator('[data-testid="hot-games"]')
    await expect(hotGames).toBeVisible()

    // 检查游戏卡片
    const gameCards = hotGames.locator('.game-card')
    const count = await gameCards.count()
    expect(count).toBeGreaterThan(0)

    // 点击第一个游戏卡片
    const firstCard = gameCards.first()
    await firstCard.click()

    // 验证跳转到游戏详情页
    await expect(page).toHaveURL(/games\/\d+/)
  })

  test('分类导航', async ({ page }) => {
    const categories = ['动作冒险', '解谜益智', '社交互动', '运动健身', '恐怖惊悚', '模拟经营']

    for (const category of categories) {
      const categoryButton = page.getByText(category)
      if (await categoryButton.isVisible()) {
        await expect(categoryButton).toBeVisible()
      }
    }
  })

  test('响应式设计 - 移动端', async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 })

    // 检查汉堡菜单
    const mobileMenu = page.locator('[data-testid="mobile-menu-button"]')
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click()

      // 检查移动端导航菜单
      const mobileNav = page.locator('[data-testid="mobile-nav"]')
      await expect(mobileNav).toBeVisible()
    }
  })

  test('页脚信息', async ({ page }) => {
    // 滚动到页脚
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // 检查页脚
    const footer = page.locator('footer')
    await expect(footer).toBeVisible()

    // 检查版权信息
    await expect(footer.getByText(/版权所有|Copyright/i)).toBeVisible()
  })
})
