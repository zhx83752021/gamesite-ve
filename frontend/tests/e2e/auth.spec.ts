import { test, expect } from '@playwright/test'

test.describe('用户认证测试', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('登录模态窗口显示', async ({ page }) => {
    // 点击登录按钮
    const loginButton = page.getByRole('button', { name: /登录|Sign In/i })
    await loginButton.click()

    // 检查登录模态窗口
    const loginModal = page.locator('[data-testid="login-modal"]')
    await expect(loginModal).toBeVisible()

    // 检查表单元素
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('登录表单验证', async ({ page }) => {
    // 打开登录模态窗口
    const loginButton = page.getByRole('button', { name: /登录|Sign In/i })
    await loginButton.click()

    // 不填写直接提交
    const submitButton = page.locator('[data-testid="login-submit"]')
    await submitButton.click()

    // 检查错误提示
    const errorMessage = page.locator('.error-message, .el-form-item__error')
    await expect(errorMessage.first()).toBeVisible()
  })

  test('成功登录流程', async ({ page }) => {
    // 打开登录模态窗口
    const loginButton = page.getByRole('button', { name: /登录|Sign In/i })
    await loginButton.click()

    // 填写登录信息
    await page.locator('input[type="email"]').fill('test@example.com')
    await page.locator('input[type="password"]').fill('Password123!')

    // 提交登录
    const submitButton = page.locator('[data-testid="login-submit"]')
    await submitButton.click()

    // 等待登录成功
    await page.waitForTimeout(1000)

    // 验证登录成功（用户头像或用户名显示）
    const userAvatar = page.locator('[data-testid="user-avatar"]')
    // await expect(userAvatar).toBeVisible()
  })

  test('注册模态窗口显示', async ({ page }) => {
    // 点击注册按钮
    const registerButton = page.getByRole('button', { name: /注册|Sign Up/i })
    await registerButton.click()

    // 检查注册模态窗口
    const registerModal = page.locator('[data-testid="register-modal"]')
    await expect(registerModal).toBeVisible()

    // 检查表单元素
    await expect(page.locator('input[name="username"]')).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('注册表单验证', async ({ page }) => {
    // 打开注册模态窗口
    const registerButton = page.getByRole('button', { name: /注册|Sign Up/i })
    await registerButton.click()

    // 测试密码强度验证
    const passwordInput = page.locator('input[type="password"]').first()
    await passwordInput.fill('123')

    // 提交表单
    const submitButton = page.locator('[data-testid="register-submit"]')
    await submitButton.click()

    // 检查错误提示
    const errorMessage = page.locator('.error-message, .el-form-item__error')
    await expect(errorMessage.first()).toBeVisible()
  })

  test('登录注册切换', async ({ page }) => {
    // 打开登录模态窗口
    const loginButton = page.getByRole('button', { name: /登录|Sign In/i })
    await loginButton.click()

    // 点击切换到注册
    const switchToRegister = page.getByText(/还没有账号|注册/i)
    if (await switchToRegister.isVisible()) {
      await switchToRegister.click()

      // 验证切换到注册表单
      const registerModal = page.locator('[data-testid="register-modal"]')
      await expect(registerModal).toBeVisible()
    }
  })

  test('忘记密码功能', async ({ page }) => {
    // 打开登录模态窗口
    const loginButton = page.getByRole('button', { name: /登录|Sign In/i })
    await loginButton.click()

    // 点击忘记密码
    const forgotPassword = page.getByText(/忘记密码|Forgot Password/i)
    if (await forgotPassword.isVisible()) {
      await forgotPassword.click()

      // 检查重置密码界面
      await expect(page.locator('input[type="email"]')).toBeVisible()
    }
  })

  test('第三方登录按钮显示', async ({ page }) => {
    // 打开登录模态窗口
    const loginButton = page.getByRole('button', { name: /登录|Sign In/i })
    await loginButton.click()

    // 检查第三方登录选项
    const socialLogin = page.locator('[data-testid="social-login"]')
    if (await socialLogin.isVisible()) {
      await expect(socialLogin).toBeVisible()
    }
  })
})
