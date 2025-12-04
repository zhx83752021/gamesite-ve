<template>
  <div class="game-manage">
    <div class="page-header mb-6">
      <h1 class="text-2xl font-bold">游戏管理</h1>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        添加游戏
      </el-button>
    </div>

    <!-- 搜索筛选 -->
    <el-card class="mb-6">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="游戏名称">
          <el-input v-model="searchForm.title" placeholder="请输入游戏名称" clearable />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="searchForm.category" placeholder="请选择分类" clearable>
            <el-option label="全部" value="" />
            <el-option label="动作冒险" value="action" />
            <el-option label="解谜益智" value="puzzle" />
            <el-option label="运动健身" value="fitness" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="全部" value="" />
            <el-option label="已发布" value="published" />
            <el-option label="审核中" value="review" />
            <el-option label="草稿" value="draft" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 游戏列表 -->
    <el-card>
      <el-table :data="gameList" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="封面" width="100">
          <template #default="{ row }">
            <el-image :src="row.cover_image" fit="cover" style="width: 60px; height: 60px; border-radius: 4px" />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="游戏名称" min-width="200" />
        <el-table-column label="分类" width="120">
          <template #default="{ row }">
            <el-tag>{{ row.category_name || '未分类' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="价格" width="100">
          <template #default="{ row }">
            <span v-if="row.pricing_type === 'free'" class="text-green-600">免费</span>
            <span v-else>¥{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="rating" label="评分" width="100">
          <template #default="{ row }">
            <el-rate v-model="row.rating" disabled show-score />
          </template>
        </el-table-column>
        <el-table-column prop="downloads" label="下载量" width="120" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'published'" type="success">已发布</el-tag>
            <el-tag v-else-if="row.status === 'review'" type="warning">审核中</el-tag>
            <el-tag v-else type="info">草稿</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleView(row)">查看</el-button>
            <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
            <el-button link type="warning" @click="handleChangeStatus(row)">
              {{ row.status === 'published' ? '下架' : '发布' }}
            </el-button>
            <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { Game } from '@/types'

const loading = ref(false)
const gameList = ref<Game[]>([])

const searchForm = reactive({
  title: '',
  category: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

onMounted(() => {
  loadGames()
})

async function loadGames() {
  loading.value = true
  try {
    // TODO: 调用API获取游戏列表
    // 模拟数据
    gameList.value = [
      {
        id: '1',
        title: 'VR战斗先锋',
        cover_image: 'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=200',
        category_name: '动作冒险',
        price: 129,
        pricing_type: 'paid',
        rating: 4.6,
        downloads: 12500,
        status: 'published'
      },
      {
        id: '2',
        title: '谜境探索',
        cover_image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=200',
        category_name: '解谜益智',
        price: 68,
        pricing_type: 'paid',
        rating: 4.8,
        downloads: 18900,
        status: 'published'
      },
      {
        id: '3',
        title: '节奏之星',
        cover_image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=200',
        category_name: '音乐节奏',
        price: 0,
        pricing_type: 'free',
        rating: 4.7,
        downloads: 45600,
        status: 'published'
      }
    ] as any
    pagination.total = 50
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.page = 1
  loadGames()
}

function handleReset() {
  searchForm.title = ''
  searchForm.category = ''
  searchForm.status = ''
  handleSearch()
}

function handlePageChange() {
  loadGames()
}

function handleAdd() {
  ElMessage.info('添加游戏功能开发中')
}

function handleView(row: any) {
  ElMessage.info(`查看游戏: ${row.title}`)
}

function handleEdit(row: any) {
  ElMessage.info(`编辑游戏: ${row.title}`)
}

async function handleChangeStatus(row: any) {
  try {
    const action = row.status === 'published' ? '下架' : '发布'
    await ElMessageBox.confirm(`确定要${action}《${row.title}》吗？`, '提示')
    ElMessage.success(`${action}成功`)
    loadGames()
  } catch {
    // 取消操作
  }
}

async function handleDelete(row: any) {
  try {
    await ElMessageBox.confirm(`确定要删除《${row.title}》吗？此操作不可恢复！`, '警告', {
      type: 'warning'
    })
    ElMessage.success('删除成功')
    loadGames()
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
