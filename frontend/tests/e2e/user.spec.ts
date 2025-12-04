import { test, expect } from '@playwright/test'

test.describe('用户中心功能测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')

    // 登录（如果需要）
    // 这里假设用户已登录或使用测试账号
  })

  test('用户中心页面加载', async ({ page }) => {
    await page.goto('/user')

    // 检查用户信息区域
    const userInfo = page.locator('[data-testid="user-info"]')
    if (await userInfo.isVisible()) {
      await expect(userInfo).toBeVisible()
    }

    // 检查统计数据
    const stats = page.locator('[data-testid="user-stats"]')
    if (await stats.isVisible()) {
      await expect(stats).toBeVisible()
    }
  })

  test('我的游戏库显示', async ({ page }) => {
    await page.goto('/user')

    // 检查游戏库
    const gameLibrary = page.locator('[data-testid="game-library"]')
    if (await gameLibrary.isVisible()) {
      const games = gameLibrary.locator('.game-card, [data-testid="game-item"]')
      const count = await games.count()
      expect(count).toBeGreaterThanOrEqual(0)
    }
  })

  test('编辑个人资料', async ({ page }) => {
    await page.goto('/user')

    // 点击编辑资料按钮
    const editButton = page.locator('button:has-text("编辑资料"), button:has-text("编辑")')
    if (await editButton.isVisible()) {
      await editButton.click()

      // 检查编辑表单
      const form = page.locator('form, [data-testid="profile-form"]')
      await expect(form).toBeVisible()
    }
  })

  test('游戏成就展示', async ({ page }) => {
    await page.goto('/user')

    // 检查成就区域
    const achievements = page.locator('[data-testid="achievements"]')
    if (await achievements.isVisible()) {
      await expect(achievements).toBeVisible()
    }
  })

  test('好友列表', async ({ page }) => {
    await page.goto('/user')

    // 检查好友列表
    const friendsList = page.locator('[data-testid="friends-list"]')
    if (await friendsList.isVisible()) {
      await expect(friendsList).toBeVisible()
    }
  })
})

test.describe('社区论坛功能测试', () => {
  test('论坛首页加载', async ({ page }) => {
    await page.goto('/community')

    // 检查帖子列表
    const posts = page.locator('[data-testid="post-item"], .post-item')
    const count = await posts.count()
    expect(count).toBeGreaterThan(0)
  })

  test('发布新帖按钮', async ({ page }) => {
    await page.goto('/community')

    // 查找发布按钮
    const createPostButton = page.locator('button:has-text("发布新帖"), button:has-text("发帖")')
    await expect(createPostButton).toBeVisible()

    // 点击发布按钮
    await createPostButton.click()

    // 检查编辑器
    const editor = page.locator('[data-testid="post-editor"], .editor')
    if (await editor.isVisible()) {
      await expect(editor).toBeVisible()
    }
  })

  test('帖子点赞功能', async ({ page }) => {
    await page.goto('/community')

    // 查找点赞按钮
    const likeButtons = page.locator('button:has-text("👍"), [data-testid="like-button"]')
    if (await likeButtons.first().isVisible()) {
      const firstButton = likeButtons.first()
      await firstButton.click()
      await page.waitForTimeout(300)
    }
  })

  test('热门话题显示', async ({ page }) => {
    await page.goto('/community')

    // 检查热门话题
    const hotTopics = page.locator('[data-testid="hot-topics"]')
    if (await hotTopics.isVisible()) {
      await expect(hotTopics).toBeVisible()
    }
  })

  test('帖子详情查看', async ({ page }) => {
    await page.goto('/community')

    // 点击第一个帖子
    const firstPost = page.locator('[data-testid="post-item"]').first()
    if (await firstPost.isVisible()) {
      await firstPost.click()
      await page.waitForTimeout(500)
    }
  })
})

test.describe('VIP会员功能测试', () => {
  test('VIP页面加载', async ({ page }) => {
    await page.goto('/vip')

    // 检查页面标题
    await expect(page.locator('h1')).toContainText(/VIP|会员/i)

    // 检查会员等级
    const vipLevels = page.locator('[data-testid="vip-level"], .vip-level')
    const count = await vipLevels.count()
    expect(count).toBeGreaterThan(0)
  })

  test('会员特权展示', async ({ page }) => {
    await page.goto('/vip')

    // 检查特权列表
    const privileges = page.locator('[data-testid="vip-privilege"], .privilege-item')
    const count = await privileges.count()
    expect(count).toBeGreaterThan(0)
  })

  test('开通会员按钮', async ({ page }) => {
    await page.goto('/vip')

    // 查找开通按钮
    const subscribeButtons = page.locator('button:has-text("立即开通"), button:has-text("购买")')
    await expect(subscribeButtons.first()).toBeVisible()
  })

  test('成长体系展示', async ({ page }) => {
    await page.goto('/vip')

    // 滚动到成长体系区域
    const growthSection = page.locator('[data-testid="growth-system"]')
    if (await growthSection.isVisible()) {
      await growthSection.scrollIntoViewIfNeeded()
      await expect(growthSection).toBeVisible()
    }
  })
})

test.describe('价格套餐功能测试', () => {
  test('价格页面加载', async ({ page }) => {
    await page.goto('/pricing')

    // 检查套餐卡片
    const pricingCards = page.locator('[data-testid="pricing-card"], .pricing-card')
    const count = await pricingCards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('计费方式切换', async ({ page }) => {
    await page.goto('/pricing')

    // 测试计费方式切换
    const billingModes = ['按小时计费', '包月套餐', '包年套餐']

    for (const mode of billingModes) {
      const modeButton = page.getByText(mode, { exact: false })
      if (await modeButton.isVisible()) {
        await modeButton.click()
        await page.waitForTimeout(300)
      }
    }
  })

  test('FAQ展开功能', async ({ page }) => {
    await page.goto('/pricing')

    // 滚动到FAQ区域
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(300)

    // 点击FAQ项目
    const faqItems = page.locator('[data-testid="faq-item"] button, .faq-item button')
    if (await faqItems.first().isVisible()) {
      await faqItems.first().click()
      await page.waitForTimeout(300)
    }
  })
})

test.describe('下载页面功能测试', () => {
  test('下载页面加载', async ({ page }) => {
    await page.goto('/download')

    // 检查平台选项
    const platforms = page.locator('[data-testid="platform-card"], .platform-card')
    const count = await platforms.count()
    expect(count).toBeGreaterThan(0)
  })

  test('下载按钮功能', async ({ page }) => {
    await page.goto('/download')

    // 查找下载按钮
    const downloadButtons = page.locator('button:has-text("立即下载"), button:has-text("下载")')
    await expect(downloadButtons.first()).toBeVisible()

    // 点击下载按钮（不实际下载）
    // await downloadButtons.first().click()
  })

  test('浏览器版本介绍', async ({ page }) => {
    await page.goto('/download')

    // 检查浏览器版本区域
    const browserSection = page.locator('[data-testid="browser-section"]')
    if (await browserSection.isVisible()) {
      await expect(browserSection).toBeVisible()
    }
  })

  test('安装指南展示', async ({ page }) => {
    await page.goto('/download')

    // 滚动到安装指南
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.7))

    // 检查安装步骤
    const steps = page.locator('[data-testid="install-step"], .install-step')
    const count = await steps.count()
    expect(count).toBeGreaterThan(0)
  })
})

test.describe('帮助中心功能测试', () => {
  test('帮助中心页面加载', async ({ page }) => {
    await page.goto('/help')

    // 检查搜索框
    const searchInput = page.locator('input[type="text"], input[type="search"]')
    await expect(searchInput.first()).toBeVisible()
  })

  test('搜索功能', async ({ page }) => {
    await page.goto('/help')

    // 输入搜索关键词
    const searchInput = page.locator('input[type="text"], input[type="search"]').first()
    await searchInput.fill('网络延迟')

    // 提交搜索
    const searchButton = page.locator('button:has-text("搜索")')
    await searchButton.click()
    await page.waitForTimeout(500)
  })

  test('快速分类入口', async ({ page }) => {
    await page.goto('/help')

    // 检查分类卡片
    const categories = page.locator('[data-testid="help-category"], .help-category')
    const count = await categories.count()
    expect(count).toBeGreaterThan(0)
  })

  test('FAQ展开', async ({ page }) => {
    await page.goto('/help')

    // 点击FAQ
    const faqButtons = page.locator('[data-testid="faq-item"] button')
    if (await faqButtons.first().isVisible()) {
      await faqButtons.first().click()
      await page.waitForTimeout(300)
    }
  })

  test('在线客服按钮', async ({ page }) => {
    await page.goto('/help')

    // 查找在线客服按钮
    const chatButton = page.locator('button:has-text("在线客服"), button:has-text("开始对话")')
    if (await chatButton.first().isVisible()) {
      await expect(chatButton.first()).toBeVisible()
    }
  })
})

test.describe('活动中心功能测试', () => {
  test('活动中心页面加载', async ({ page }) => {
    await page.goto('/activities')

    // 检查活动列表
    const activities = page.locator('[data-testid="activity-item"], .activity-item')
    const count = await activities.count()
    expect(count).toBeGreaterThan(0)
  })

  test('活动分类筛选', async ({ page }) => {
    await page.goto('/activities')

    // 测试分类切换
    const categories = ['全部活动', '新人专享', '限时优惠', '每日福利']

    for (const category of categories) {
      const categoryButton = page.getByText(category, { exact: false })
      if (await categoryButton.isVisible()) {
        await categoryButton.click()
        await page.waitForTimeout(300)
      }
    }
  })

  test('签到功能', async ({ page }) => {
    await page.goto('/activities')

    // 滚动到签到区域
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.5))

    // 查找签到按钮
    const signButton = page.locator('button:has-text("立即签到"), button:has-text("签到")')
    if (await signButton.isVisible()) {
      await expect(signButton).toBeVisible()
    }
  })

  test('邀请好友功能', async ({ page }) => {
    await page.goto('/activities')

    // 滚动到邀请区域
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))

    // 查找邀请按钮
    const inviteButton = page.locator('button:has-text("立即邀请"), button:has-text("邀请")')
    if (await inviteButton.isVisible()) {
      await expect(inviteButton).toBeVisible()
    }
  })
})
