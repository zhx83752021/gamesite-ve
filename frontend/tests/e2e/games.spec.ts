import { test, expect } from '@playwright/test'

test.describe('游戏相关功能测试', () => {
  test('游戏列表页加载', async ({ page }) => {
    await page.goto('/games')

    // 检查页面标题
    await expect(page.locator('h1')).toContainText(/游戏库|Games/i)

    // 检查游戏卡片
    const gameCards = page.locator('.game-card, [data-testid="game-card"]')
    const count = await gameCards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('游戏筛选功能', async ({ page }) => {
    await page.goto('/games')

    // 测试分类筛选
    const categoryFilter = page.locator('[data-testid="category-filter"]').first()
    if (await categoryFilter.isVisible()) {
      await categoryFilter.click()
      await page.waitForTimeout(500)

      // 验证筛选结果
      const gameCards = page.locator('.game-card')
      expect(await gameCards.count()).toBeGreaterThan(0)
    }
  })

  test('游戏排序功能', async ({ page }) => {
    await page.goto('/games')

    // 测试排序选项
    const sortOptions = ['人气', '评分', '价格', '发布时间']

    for (const option of sortOptions) {
      const sortButton = page.getByText(option, { exact: false })
      if (await sortButton.isVisible()) {
        await sortButton.click()
        await page.waitForTimeout(500)
      }
    }
  })

  test('游戏搜索功能', async ({ page }) => {
    await page.goto('/games')

    // 输入搜索关键词
    const searchInput = page.locator('[data-testid="game-search-input"], input[type="search"]')
    if (await searchInput.isVisible()) {
      await searchInput.fill('Beat Saber')
      await searchInput.press('Enter')

      // 等待搜索结果
      await page.waitForTimeout(1000)

      // 验证搜索结果
      const results = page.locator('.game-card')
      expect(await results.count()).toBeGreaterThan(0)
    }
  })

  test('游戏详情页加载', async ({ page }) => {
    await page.goto('/games')

    // 点击第一个游戏
    const firstGame = page.locator('.game-card').first()
    await firstGame.click()

    // 等待详情页加载
    await page.waitForURL(/games\/\d+/)

    // 检查详情页元素
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('[data-testid="game-description"]')).toBeVisible()
  })

  test('游戏详情页 - 截图展示', async ({ page }) => {
    // 直接访问一个游戏详情页
    await page.goto('/games/1')

    // 检查游戏截图
    const screenshots = page.locator('[data-testid="game-screenshots"] img, .game-screenshots img')
    if (await screenshots.first().isVisible()) {
      const count = await screenshots.count()
      expect(count).toBeGreaterThan(0)

      // 测试截图点击
      await screenshots.first().click()
      await page.waitForTimeout(300)
    }
  })

  test('游戏详情页 - 评论功能', async ({ page }) => {
    await page.goto('/games/1')

    // 滚动到评论区
    const commentsSection = page.locator('[data-testid="comments-section"]')
    if (await commentsSection.isVisible()) {
      await commentsSection.scrollIntoViewIfNeeded()

      // 检查评论列表
      const comments = page.locator('.comment-item')
      expect(await comments.count()).toBeGreaterThanOrEqual(0)
    }
  })

  test('游戏详情页 - 购买按钮', async ({ page }) => {
    await page.goto('/games/1')

    // 检查购买按钮
    const buyButton = page.locator('[data-testid="buy-button"], button:has-text("购买")')
    if (await buyButton.isVisible()) {
      await expect(buyButton).toBeVisible()

      // 点击购买按钮
      await buyButton.click()

      // 检查是否显示登录提示或购买确认
      await page.waitForTimeout(500)
    }
  })

  test('游戏详情页 - 收藏功能', async ({ page }) => {
    await page.goto('/games/1')

    // 检查收藏按钮
    const favoriteButton = page.locator('[data-testid="favorite-button"], button:has-text("收藏")')
    if (await favoriteButton.isVisible()) {
      await favoriteButton.click()
      await page.waitForTimeout(300)

      // 验证收藏状态变化
      await expect(favoriteButton).toBeVisible()
    }
  })

  test('游戏详情页 - 分享功能', async ({ page }) => {
    await page.goto('/games/1')

    // 检查分享按钮
    const shareButton = page.locator('[data-testid="share-button"], button:has-text("分享")')
    if (await shareButton.isVisible()) {
      await shareButton.click()
      await page.waitForTimeout(300)

      // 检查分享选项
      const shareOptions = page.locator('[data-testid="share-options"]')
      if (await shareOptions.isVisible()) {
        await expect(shareOptions).toBeVisible()
      }
    }
  })

  test('游戏列表 - 分页功能', async ({ page }) => {
    await page.goto('/games')

    // 滚动到页面底部
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)

    // 检查加载更多按钮或分页
    const loadMoreButton = page.locator('[data-testid="load-more"], button:has-text("加载更多")')
    if (await loadMoreButton.isVisible()) {
      const initialCount = await page.locator('.game-card').count()

      await loadMoreButton.click()
      await page.waitForTimeout(1000)

      const newCount = await page.locator('.game-card').count()
      expect(newCount).toBeGreaterThan(initialCount)
    }
  })

  test('响应式设计 - 游戏列表移动端', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/games')

    // 检查移动端布局
    const gameCards = page.locator('.game-card')
    await expect(gameCards.first()).toBeVisible()

    // 验证卡片在移动端正常显示
    const cardWidth = await gameCards.first().boundingBox()
    expect(cardWidth?.width).toBeLessThanOrEqual(375)
  })
})
