<template>
  <div class="min-h-screen flex items-center justify-center -mt-8 bg-gradient-to-br from-purple-900 via-blue-900 to-black">
    <div class="max-w-md w-full bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50">
      <div class="text-center mb-8">
        <h2 class="text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-2">
          创建账号
        </h2>
        <p class="text-gray-400">加入VR云游戏社区</p>
      </div>

      <form class="space-y-5">
        <div>
          <label class="block text-gray-300 mb-2">用户名</label>
          <input type="text" placeholder="您的昵称"
                 class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-cyan-400 focus:outline-none transition-all"/>
        </div>

        <div>
          <label class="block text-gray-300 mb-2">手机号</label>
          <input type="tel" placeholder="请输入手机号"
                 class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-cyan-400 focus:outline-none transition-all"/>
        </div>

        <div>
          <label class="block text-gray-300 mb-2">密码</label>
          <input type="password" placeholder="至少8位字符"
                 class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-cyan-400 focus:outline-none transition-all"/>
        </div>

        <div>
          <label class="block text-gray-300 mb-2">确认密码</label>
          <input type="password" placeholder="再次输入密码"
                 class="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-cyan-400 focus:outline-none transition-all"/>
        </div>

        <label class="flex items-center text-gray-300 text-sm">
          <input type="checkbox" class="mr-2"/>
          我同意<a href="#" class="text-cyan-400 hover:text-cyan-300 mx-1">服务条款</a>和<a href="#" class="text-cyan-400 hover:text-cyan-300 mx-1">隐私政策</a>
        </label>

        <button type="submit"
                class="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all transform hover:scale-105">
          注册
        </button>

        <div class="text-center text-gray-400">
          已有账号？
          <router-link to="/login" class="text-cyan-400 hover:text-cyan-300 font-bold">立即登录</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
// 注册页
</script>
