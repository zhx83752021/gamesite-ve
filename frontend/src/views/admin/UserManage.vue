<template>
  <div class="user-manage">
    <div class="page-header mb-6">
      <h1 class="text-2xl font-bold text-black">用户管理</h1>
    </div>

    <!-- 搜索筛选 -->
    <el-card class="mb-6">
      <el-form :inline="true" class="search-form">
        <el-form-item>
          <el-input placeholder="请输入用户名" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-select placeholder="请选择角色" clearable style="width: 180px">
            <el-option label="全部" value="" />
            <el-option label="普通用户" value="user" />
            <el-option label="开发者" value="developer" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select placeholder="请选择状态" clearable style="width: 180px">
            <el-option label="全部" value="" />
            <el-option label="正常" value="active" />
            <el-option label="封禁" value="banned" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search">搜索</el-button>
          <el-button icon="RefreshLeft">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 用户列表 -->
    <el-card>
      <el-table :data="userList" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="头像" width="80">
          <template #default="{ row }">
            <el-avatar :src="row.avatar" />
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="150" />
        <el-table-column prop="email" label="邮箱" min-width="200" />
        <el-table-column label="角色" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.role === 'admin'" type="danger">管理员</el-tag>
            <el-tag v-else-if="row.role === 'developer'" type="warning">开发者</el-tag>
            <el-tag v-else type="info">普通用户</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="games_owned" label="拥有游戏" width="100" />
        <el-table-column prop="level" label="等级" width="80" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'active'" type="success">正常</el-tag>
            <el-tag v-else type="danger">封禁</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary">查看</el-button>
            <el-button link type="warning">
              {{ row.status === 'active' ? '封禁' : '解封' }}
            </el-button>
            <el-button link type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-4 flex justify-end">
        <el-pagination
          :current-page="1"
          :page-size="10"
          :total="50"
          layout="total, prev, pager, next"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const userList = ref([
  {
    id: '1',
    username: 'admin',
    email: 'admin@vrgame.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    role: 'admin',
    status: 'active',
    games_owned: 0,
    level: 10,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    username: 'user1',
    email: 'user1@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
    role: 'user',
    status: 'active',
    games_owned: 25,
    level: 6,
    created_at: '2024-03-15T00:00:00Z'
  },
  {
    id: '3',
    username: 'developer1',
    email: 'dev1@vrgame.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dev1',
    role: 'developer',
    status: 'active',
    games_owned: 15,
    level: 8,
    created_at: '2024-02-01T00:00:00Z'
  }
])

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('zh-CN')
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
