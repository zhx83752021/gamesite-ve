<template>
  <div class="min-h-screen flex items-center justify-center -mt-8">
    <div class="text-center">
      <h1 class="text-9xl font-bold text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text mb-4 animate-pulse">
        404
      </h1>
      <p class="text-3xl text-gray-300 mb-8">页面未找到</p>
      <p class="text-gray-400 mb-8">抱歉，您访问的页面不存在</p>
      <button
        @click="$router.push('/')"
        class="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-lg font-bold rounded-full hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] transition-all duration-300 transform hover:scale-105">
        返回首页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// 404页面
</script>
