import { test as setup, expect } from '@playwright/test'
import { testUsers } from './test-data'

const authFile = 'tests/.auth/user.json'
const adminAuthFile = 'tests/.auth/admin.json'

/**
 * 普通用户登录设置
 */
setup('authenticate as user', async ({ page }) => {
  await page.goto('/login')

  // 执行登录
  await page.locator('input[type="email"]').fill(testUsers.normalUser.email)
  await page.locator('input[type="password"]').fill(testUsers.normalUser.password)
  await page.locator('button[type="submit"]').click()

  // 等待登录成功
  await page.waitForURL('/', { timeout: 5000 }).catch(() => {})

  // 保存认证状态
  await page.context().storageState({ path: authFile })
})

/**
 * 管理员登录设置
 */
setup('authenticate as admin', async ({ page }) => {
  await page.goto('/admin/login')

  // 执行登录
  await page.locator('input[name="username"]').fill(testUsers.admin.username)
  await page.locator('input[name="password"]').fill(testUsers.admin.password)
  await page.locator('button[type="submit"]').click()

  // 等待登录成功
  await page.waitForURL('/admin/dashboard', { timeout: 5000 }).catch(() => {})

  // 保存认证状态
  await page.context().storageState({ path: adminAuthFile })
})
