<template>
  <div class="user-manage">
    <div class="page-header mb-6">
      <h1 class="text-2xl font-bold text-black">用户管理</h1>
    </div>

    <!-- 搜索筛选 -->
    <el-card class="mb-6">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item>
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.role" placeholder="请选择角色" clearable style="width: 180px">
            <el-option label="全部角色" value="" />
            <el-option label="普通用户" value="user" />
            <el-option label="开发者" value="developer" />
            <el-option label="管理员" value="admin" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 180px">
            <el-option label="全部状态" value="" />
            <el-option label="正常" value="active" />
            <el-option label="封禁" value="banned" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleSearch">搜索</el-button>
          <el-button icon="RefreshLeft" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 用户列表 -->
    <el-card>
      <el-table :data="userList" v-loading="loading" stripe>
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
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <div style="white-space: nowrap;">
              <el-button link type="primary" size="small" @click="handleView(row)">查看</el-button>
              <el-button link type="warning" size="small" @click="handleToggleBan(row)">
                {{ row.status === 'active' ? '封禁' : '解封' }}
              </el-button>
              <el-button link type="danger" size="small" @click="handleDelete(row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="mt-4 flex justify-end">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 用户详情对话框 -->
    <el-dialog v-model="viewDialogVisible" title="用户详情" width="700px">
      <el-descriptions :column="2" border v-if="currentUser">
        <el-descriptions-item label="用户ID">{{ currentUser.id }}</el-descriptions-item>
        <el-descriptions-item label="用户名">{{ currentUser.username }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ currentUser.email }}</el-descriptions-item>
        <el-descriptions-item label="角色">
          <el-tag v-if="currentUser.role === 'admin'" type="danger">管理员</el-tag>
          <el-tag v-else-if="currentUser.role === 'developer'" type="warning">开发者</el-tag>
          <el-tag v-else type="info">普通用户</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="等级">{{ currentUser.level }}</el-descriptions-item>
        <el-descriptions-item label="拥有游戏">{{ currentUser.games_owned }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="currentUser.status === 'active'" type="success">正常</el-tag>
          <el-tag v-else type="danger">封禁</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="注册时间">{{ formatDate(currentUser.created_at) }}</el-descriptions-item>
        <el-descriptions-item label="头像" :span="2">
          <el-avatar :src="currentUser.avatar" :size="100" />
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="viewDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 封禁原因对话框 -->
    <el-dialog v-model="banDialogVisible" title="封禁用户" width="500px">
      <el-form :model="banForm" label-width="100px">
        <el-form-item label="封禁时长">
          <el-select v-model="banForm.duration" placeholder="请选择封禁时长">
            <el-option label="1天" :value="1" />
            <el-option label="3天" :value="3" />
            <el-option label="7天" :value="7" />
            <el-option label="30天" :value="30" />
            <el-option label="永久" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="封禁原因">
          <el-input
            v-model="banForm.reason"
            type="textarea"
            :rows="4"
            placeholder="请输入封禁原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="banDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmBan">确认封禁</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const userList = ref<any[]>([])
const viewDialogVisible = ref(false)
const banDialogVisible = ref(false)
const currentUser = ref<any>(null)

const searchForm = reactive({
  username: '',
  role: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

const banForm = reactive({
  duration: 7,
  reason: ''
})

onMounted(() => {
  loadUsers()
})

async function loadUsers() {
  loading.value = true
  try {
    // TODO: 调用API获取用户列表
    // 模拟数据
    await new Promise(resolve => setTimeout(resolve, 500))
    userList.value = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@vrgame.com',
        avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
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
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
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
        avatar: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
        role: 'developer',
        status: 'active',
        games_owned: 15,
        level: 8,
        created_at: '2024-02-01T00:00:00Z'
      },
      {
        id: '4',
        username: 'user2',
        email: 'user2@example.com',
        avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        role: 'user',
        status: 'banned',
        games_owned: 5,
        level: 3,
        created_at: '2024-05-20T00:00:00Z'
      }
    ]
    pagination.total = 50
  } finally {
    loading.value = false
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('zh-CN')
}

function handleSearch() {
  pagination.page = 1
  loadUsers()
}

function handleReset() {
  searchForm.username = ''
  searchForm.role = ''
  searchForm.status = ''
  handleSearch()
}

function handlePageChange() {
  loadUsers()
}

function handleView(row: any) {
  currentUser.value = row
  viewDialogVisible.value = true
}

async function handleToggleBan(row: any) {
  if (row.status === 'active') {
    // 封禁用户
    currentUser.value = row
    banForm.duration = 7
    banForm.reason = ''
    banDialogVisible.value = true
  } else {
    // 解封用户
    try {
      await ElMessageBox.confirm(`确认解封用户 ${row.username} ？`, '提示', {
        type: 'warning'
      })
      // TODO: 调用实际API
      ElMessage.success('解封成功')
      loadUsers()
    } catch {
      // 取消操作
    }
  }
}

async function confirmBan() {
  if (!banForm.reason) {
    ElMessage.warning('请输入封禁原因')
    return
  }
  try {
    // TODO: 调用实际API
    ElMessage.success('封禁成功')
    banDialogVisible.value = false
    loadUsers()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

async function handleDelete(row: any) {
  try {
    await ElMessageBox.confirm(
      `确认删除用户 ${row.username} ？删除后无法恢复`,
      '警告',
      {
        type: 'warning',
        confirmButtonText: '确认删除',
        cancelButtonText: '取消'
      }
    )
    // TODO: 调用实际API
    ElMessage.success('删除成功')
    loadUsers()
  } catch {
    // 取消操作
  }
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
