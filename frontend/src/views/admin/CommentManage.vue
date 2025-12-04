<template>
  <div class="comment-manage">
    <div class="page-header mb-6">
      <h1 class="text-2xl font-bold text-black">评论管理</h1>
    </div>

    <el-card class="filter-card">
      <el-form :inline="true" :model="filterForm">
        <el-form-item>
          <el-input v-model="filterForm.keyword" placeholder="搜索评论内容、用户名" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="filterForm.status" placeholder="全部状态" clearable style="width: 180px">
            <el-option label="全部" value="" />
            <el-option label="待审核" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="已拒绝" value="rejected" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="filterForm.type" placeholder="全部类型" clearable style="width: 180px">
            <el-option label="全部" value="" />
            <el-option label="游戏评论" value="game" />
            <el-option label="帖子评论" value="post" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width: 280px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>评论列表</span>
          <div class="header-actions">
            <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
              批量删除
            </el-button>
          </div>
        </div>
      </template>

      <el-table
        :data="tableData"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        stripe
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="用户" width="150">
          <template #default="{ row }">
            <div class="user-cell">
              <el-avatar :src="row.user.avatar" :size="32" />
              <span>{{ row.user.username }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="评论内容" min-width="300">
          <template #default="{ row }">
            <div class="comment-content">
              <p>{{ row.content }}</p>
              <el-tag v-if="row.type === 'game'" size="small">游戏: {{ row.target }}</el-tag>
              <el-tag v-else size="small" type="warning">帖子: {{ row.target }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="评分" width="120">
          <template #default="{ row }">
            <el-rate v-if="row.rating" :model-value="row.rating" disabled size="small" />
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'pending'" type="warning">待审核</el-tag>
            <el-tag v-else-if="row.status === 'approved'" type="success">已通过</el-tag>
            <el-tag v-else type="danger">已拒绝</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="likes" label="点赞数" width="100" />
        <el-table-column label="发布时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 'pending'"
              link
              type="success"
              size="small"
              @click="handleApprove(row)"
            >
              通过
            </el-button>
            <el-button
              v-if="row.status === 'pending'"
              link
              type="warning"
              size="small"
              @click="handleReject(row)"
            >
              拒绝
            </el-button>
            <el-button link type="primary" size="small" @click="handleView(row)">
              详情
            </el-button>
            <el-button link type="danger" size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handlePageChange"
        @current-change="handlePageChange"
        class="pagination"
      />
    </el-card>

    <!-- 评论详情对话框 -->
    <el-dialog v-model="dialogVisible" title="评论详情" width="600px">
      <el-descriptions :column="1" border v-if="currentComment">
        <el-descriptions-item label="用户">
          {{ currentComment.user.username }}
        </el-descriptions-item>
        <el-descriptions-item label="评论类型">
          {{ currentComment.type === 'game' ? '游戏评论' : '帖子评论' }}
        </el-descriptions-item>
        <el-descriptions-item label="评论对象">
          {{ currentComment.target }}
        </el-descriptions-item>
        <el-descriptions-item label="评论内容">
          {{ currentComment.content }}
        </el-descriptions-item>
        <el-descriptions-item label="评分" v-if="currentComment.rating">
          <el-rate :model-value="currentComment.rating" disabled />
        </el-descriptions-item>
        <el-descriptions-item label="点赞数">
          {{ currentComment.likes }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="currentComment.status === 'pending'" type="warning">待审核</el-tag>
          <el-tag v-else-if="currentComment.status === 'approved'" type="success">已通过</el-tag>
          <el-tag v-else type="danger">已拒绝</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="发布时间">
          {{ formatTime(currentComment.created_at) }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 拒绝原因对话框 -->
    <el-dialog v-model="rejectDialogVisible" title="拒绝原因" width="500px">
      <el-form :model="rejectForm" label-width="100px">
        <el-form-item label="拒绝原因">
          <el-select v-model="rejectForm.reason" placeholder="请选择拒绝原因">
            <el-option label="内容违规" value="违规内容" />
            <el-option label="垃圾广告" value="垃圾广告" />
            <el-option label="恶意攻击" value="恶意攻击" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="rejectForm.note"
            type="textarea"
            :rows="4"
            placeholder="请输入备注信息（可选）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmReject">确认拒绝</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

// 筛选表单
const filterForm = reactive({
  keyword: '',
  status: '',
  type: '',
  dateRange: []
})

// 分页信息
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 表格数据
const tableData = ref<any[]>([])
const loading = ref(false)
const selectedIds = ref<number[]>([])

// 对话框
const dialogVisible = ref(false)
const rejectDialogVisible = ref(false)
const currentComment = ref<any>(null)
const rejectForm = reactive({
  reason: '',
  note: ''
})

// 获取评论列表
async function fetchComments() {
  loading.value = true
  try {
    // TODO: 调用实际API
    // 模拟数据
    await new Promise(resolve => setTimeout(resolve, 500))
    tableData.value = generateMockData()
    pagination.total = 100
  } catch (error) {
    ElMessage.error('获取评论列表失败')
  } finally {
    loading.value = false
  }
}

// 生成模拟数据
function generateMockData() {
  const mockData = []
  const statuses = ['pending', 'approved', 'rejected']
  const types = ['game', 'post']
  const games = ['Half-Life: Alyx', 'Beat Saber', 'The Walking Dead', 'Resident Evil 4']
  const posts = ['新手入门指南', 'VR设备推荐', '游戏评测', '使用技巧分享']

  for (let i = 1; i <= 10; i++) {
    const type = types[Math.floor(Math.random() * types.length)]
    mockData.push({
      id: i,
      user: {
        username: `用户${i}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`
      },
      content: `这是一条评论内容，包含了用户对产品的真实反馈和使用体验分享。评论${i}`,
      type,
      target: type === 'game'
        ? games[Math.floor(Math.random() * games.length)]
        : posts[Math.floor(Math.random() * posts.length)],
      rating: type === 'game' ? Math.floor(Math.random() * 5) + 1 : null,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      likes: Math.floor(Math.random() * 100),
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    })
  }
  return mockData
}

// 格式化时间
function formatTime(time: string) {
  return new Date(time).toLocaleString('zh-CN')
}

// 搜索
function handleSearch() {
  pagination.page = 1
  fetchComments()
}

// 重置
function handleReset() {
  Object.assign(filterForm, {
    keyword: '',
    status: '',
    type: '',
    dateRange: []
  })
  handleSearch()
}

// 选择改变
function handleSelectionChange(selection: any[]) {
  selectedIds.value = selection.map(item => item.id)
}

// 通过审核
async function handleApprove(row: any) {
  try {
    await ElMessageBox.confirm('确认通过该评论？', '提示', {
      type: 'warning'
    })
    // TODO: 调用实际API
    ElMessage.success('审核通过')
    fetchComments()
  } catch {
    // 取消操作
  }
}

// 拒绝审核
function handleReject(row: any) {
  currentComment.value = row
  rejectForm.reason = ''
  rejectForm.note = ''
  rejectDialogVisible.value = true
}

// 确认拒绝
async function confirmReject() {
  if (!rejectForm.reason) {
    ElMessage.warning('请选择拒绝原因')
    return
  }
  try {
    // TODO: 调用实际API
    ElMessage.success('已拒绝该评论')
    rejectDialogVisible.value = false
    fetchComments()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 查看详情
function handleView(row: any) {
  currentComment.value = row
  dialogVisible.value = true
}

// 删除
async function handleDelete(row: any) {
  try {
    await ElMessageBox.confirm('确认删除该评论？删除后无法恢复', '警告', {
      type: 'warning'
    })
    // TODO: 调用实际API
    ElMessage.success('删除成功')
    fetchComments()
  } catch {
    // 取消操作
  }
}

// 批量删除
async function handleBatchDelete() {
  try {
    await ElMessageBox.confirm(`确认删除选中的 ${selectedIds.value.length} 条评论？`, '警告', {
      type: 'warning'
    })
    // TODO: 调用实际API
    ElMessage.success('批量删除成功')
    fetchComments()
  } catch {
    // 取消操作
  }
}

// 分页改变
function handlePageChange() {
  fetchComments()
}

onMounted(() => {
  fetchComments()
})
</script>

<style scoped>
.comment-manage {
  height: 100%;
}

.filter-card {
  margin-bottom: 20px;
}

.table-card {
  height: calc(100vh - 240px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.comment-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.comment-content p {
  margin: 0;
  line-height: 1.6;
}

.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}
</style>
