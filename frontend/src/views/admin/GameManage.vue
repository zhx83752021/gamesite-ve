<template>
  <div class="game-manage">
    <div class="page-header mb-6">
      <h1 class="text-2xl font-bold text-black">游戏管理</h1>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        添加游戏
      </el-button>
    </div>

    <!-- 搜索筛选 -->
    <el-card class="mb-6">
      <el-form :inline="true" :model="searchForm">
        <el-form-item>
          <el-input v-model="searchForm.title" placeholder="请输入游戏名称" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.category" placeholder="请选择分类" clearable style="width: 180px">
            <el-option label="全部" value="" />
            <el-option label="动作冒险" value="action" />
            <el-option label="解谜益智" value="puzzle" />
            <el-option label="运动健身" value="fitness" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 180px">
            <el-option label="全部" value="" />
            <el-option label="已发布" value="published" />
            <el-option label="审核中" value="review" />
            <el-option label="草稿" value="draft" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleSearch">搜索</el-button>
          <el-button icon="RefreshLeft" @click="handleReset">重置</el-button>
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

    <!-- 查看游戏详情对话框 -->
    <el-dialog v-model="viewDialogVisible" title="游戏详情" width="800px">
      <el-descriptions :column="2" border v-if="currentGame">
        <el-descriptions-item label="游戏ID">{{ currentGame.id }}</el-descriptions-item>
        <el-descriptions-item label="游戏名称">{{ currentGame.title }}</el-descriptions-item>
        <el-descriptions-item label="分类">
          <el-tag>{{ currentGame.category_name }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="价格">
          <span v-if="currentGame.pricing_type === 'free'" class="text-green-600">免费</span>
          <span v-else>¥{{ currentGame.price }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="评分">
          <el-rate v-model="currentGame.rating" disabled show-score />
        </el-descriptions-item>
        <el-descriptions-item label="下载量">{{ currentGame.downloads }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="currentGame.status === 'published'" type="success">已发布</el-tag>
          <el-tag v-else-if="currentGame.status === 'review'" type="warning">审核中</el-tag>
          <el-tag v-else type="info">草稿</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="封面" :span="2">
          <el-image :src="currentGame.cover_image" style="width: 200px; height: 200px" fit="cover" />
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="viewDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 编辑游戏对话框 -->
    <el-dialog v-model="editDialogVisible" title="编辑游戏" width="600px">
      <el-form :model="editForm" label-width="100px" v-if="currentGame">
        <el-form-item label="游戏名称">
          <el-input v-model="editForm.title" placeholder="请输入游戏名称" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="editForm.category" placeholder="请选择分类">
            <el-option label="动作冒险" value="action" />
            <el-option label="解谜益智" value="puzzle" />
            <el-option label="运动健身" value="fitness" />
            <el-option label="音乐节奏" value="music" />
          </el-select>
        </el-form-item>
        <el-form-item label="价格类型">
          <el-radio-group v-model="editForm.pricing_type">
            <el-radio label="free">免费</el-radio>
            <el-radio label="paid">付费</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="价格" v-if="editForm.pricing_type === 'paid'">
          <el-input-number v-model="editForm.price" :min="0" :step="1" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editForm.status" placeholder="请选择状态">
            <el-option label="草稿" value="draft" />
            <el-option label="审核中" value="review" />
            <el-option label="已发布" value="published" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const loading = ref(false)
const gameList = ref<any[]>([])
const viewDialogVisible = ref(false)
const editDialogVisible = ref(false)
const currentGame = ref<any>(null)
const editForm = reactive({
  title: '',
  category: '',
  pricing_type: 'free',
  price: 0,
  status: 'draft'
})

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
  currentGame.value = row
  viewDialogVisible.value = true
}

function handleEdit(row: any) {
  currentGame.value = row
  // 填充编辑表单
  Object.assign(editForm, {
    title: row.title,
    category: row.category || 'action',
    pricing_type: row.pricing_type,
    price: row.price || 0,
    status: row.status
  })
  editDialogVisible.value = true
}

function confirmEdit() {
  if (!editForm.title) {
    ElMessage.warning('请输入游戏名称')
    return
  }

  // TODO: 调用实际API更新游戏信息
  ElMessage.success('保存成功')
  editDialogVisible.value = false
  loadGames()
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
