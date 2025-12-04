<template>
  <div class="min-h-screen flex items-center justify-center -mt-8 bg-gradient-to-br from-purple-900 via-blue-900 to-black">
    <div class="max-w-md w-full bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50">
      <div class="text-center mb-8">
        <h2 class="text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-2">
          欢迎回来
        </h2>
        <p class="text-gray-400">登录您的VR云游戏账户</p>
      </div>

      <form class="space-y-6">
        <div>
          <label class="block text-gray-300 mb-2">邮箱</label>
          <input type="email" placeholder="your@email.com"
                 class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-cyan-400 focus:outline-none transition-all"/>
        </div>

        <div>
          <label class="block text-gray-300 mb-2">密码</label>
          <input type="password" placeholder="••••••••"
                 class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-cyan-400 focus:outline-none transition-all"/>
        </div>

        <div class="flex items-center justify-between text-sm">
          <label class="flex items-center text-gray-300">
            <input type="checkbox" class="mr-2"/>
            记住我
          </label>
          <a href="#" class="text-cyan-400 hover:text-cyan-300">忘记密码？</a>
        </div>

        <button type="submit"
                class="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all transform hover:scale-105">
          登录
        </button>

        <div class="text-center text-gray-400">
          还没有账号？
          <router-link to="/register" class="text-cyan-400 hover:text-cyan-300 font-bold">立即注册</router-link>
        </div>
      </form>

      <div class="mt-8 pt-8 border-t border-gray-700">
        <p class="text-center text-gray-400 mb-4 text-sm">或使用第三方登录</p>
        <div class="grid grid-cols-3 gap-3">
          <button class="py-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors">微信</button>
          <button class="py-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors">QQ</button>
          <button class="py-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors">Steam</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 登录页
</script>
