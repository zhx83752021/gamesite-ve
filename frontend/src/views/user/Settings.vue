<template>
  <div class="min-h-screen py-16">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-4xl font-bold text-white mb-8">账号设置</h1>

      <div class="space-y-6">
        <!-- 基本信息 -->
        <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
          <h2 class="text-2xl font-bold text-white mb-6">基本信息</h2>

          <div class="space-y-6">
            <!-- 头像 -->
            <div class="flex items-center gap-6">
              <label class="text-gray-300 w-32">头像</label>
              <div class="flex items-center gap-4">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" class="w-20 h-20 rounded-full" alt="头像"/>
                <button class="px-6 py-2 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition-all">
                  更换头像
                </button>
              </div>
            </div>

            <!-- 用户名 -->
            <div class="flex items-center gap-6">
              <label class="text-gray-300 w-32">用户名</label>
              <input
                type="text"
                value="VR玩家001"
                class="flex-1 bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <!-- 邮箱 -->
            <div class="flex items-center gap-6">
              <label class="text-gray-300 w-32">邮箱</label>
              <input
                type="email"
                value="user@example.com"
                class="flex-1 bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <!-- 手机号 -->
            <div class="flex items-center gap-6">
              <label class="text-gray-300 w-32">手机号</label>
              <div class="flex-1 flex gap-4">
                <input
                  type="tel"
                  value="138****8888"
                  class="flex-1 bg-gray-800 text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button class="px-6 py-2 bg-cyan-500 text-white font-bold rounded-xl hover:bg-cyan-600 transition-all">
                  验证
                </button>
              </div>
            </div>

            <button class="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all">
              保存修改
            </button>
          </div>
        </div>

        <!-- 安全设置 -->
        <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
          <h2 class="text-2xl font-bold text-white mb-6">安全设置</h2>

          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
              <div>
                <div class="text-white font-bold mb-1">登录密码</div>
                <div class="text-sm text-gray-400">定期更换密码可以提高账号安全性</div>
              </div>
              <button class="px-6 py-2 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition-all">
                修改
              </button>
            </div>

            <div class="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
              <div>
                <div class="text-white font-bold mb-1">支付密码</div>
                <div class="text-sm text-gray-400">用于购买游戏和充值时验证身份</div>
              </div>
              <button class="px-6 py-2 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-700 transition-all">
                设置
              </button>
            </div>

            <div class="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
              <div>
                <div class="text-white font-bold mb-1">双重认证</div>
                <div class="text-sm text-gray-400">开启后登录需要手机验证码</div>
              </div>
              <button class="px-6 py-2 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all">
                已开启
              </button>
            </div>
          </div>
        </div>

        <!-- 隐私设置 -->
        <div class="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
          <h2 class="text-2xl font-bold text-white mb-6">隐私设置</h2>

          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
              <div>
                <div class="text-white font-bold mb-1">公开游戏库</div>
                <div class="text-sm text-gray-400">其他玩家可以查看你的游戏收藏</div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked class="sr-only peer">
                <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
              </label>
            </div>

            <div class="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
              <div>
                <div class="text-white font-bold mb-1">在线状态</div>
                <div class="text-sm text-gray-400">显示你的在线状态给好友</div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked class="sr-only peer">
                <div class="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 设置页面逻辑
</script>
