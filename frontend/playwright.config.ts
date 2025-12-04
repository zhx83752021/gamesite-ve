import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright配置 - E2E测试
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',

  /* 并行运行测试 */
  fullyParallel: true,

  /* CI环境下失败时重试 */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,

  /* CI环境下使用更少的worker */
  workers: process.env.CI ? 1 : undefined,

  /* 测试报告 */
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list']
  ],

  /* 共享设置 */
  use: {
    /* 基础URL */
    baseURL: 'http://localhost:3000',

    /* 截图设置 */
    screenshot: 'only-on-failure',

    /* 视频录制 */
    video: 'retain-on-failure',

    /* 追踪 */
    trace: 'on-first-retry',

    /* 浏览器上下文 */
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai',
  },

  /* 配置多个浏览器项目 */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* 移动端测试 */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },

    /* 平板测试 */
    {
      name: 'iPad',
      use: { ...devices['iPad Pro'] },
    },
  ],

  /* 运行开发服务器 */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
