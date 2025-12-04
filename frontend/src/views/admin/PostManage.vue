<template>
  <div class="post-manage">
    <div class="page-header mb-6">
      <h1 class="text-2xl font-bold text-black">帖子管理</h1>
    </div>

    <el-card class="filter-card">
      <el-form :inline="true" :model="filterForm">
        <el-form-item label="关键词">
          <el-input v-model="filterForm.keyword" placeholder="搜索标题、内容" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="filterForm.status" placeholder="全部状态" clearable>
            <el-option label="全部" value="" />
            <el-option label="待审核" value="pending" />
            <el-option label="已发布" value="published" />
            <el-option label="已拒绝" value="rejected" />
            <el-option label="已隐藏" value="hidden" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="filterForm.category" placeholder="全部分类" clearable>
            <el-option label="全部" value="" />
            <el-option label="游戏攻略" value="guide" />
            <el-option label="新手教程" value="tutorial" />
            <el-option label="经验分享" value="experience" />
            <el-option label="问题求助" value="help" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
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
          <span>帖子列表</span>
          <div class="header-actions">
            <el-button type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
              批量删除
            </el-button>
            <el-button type="warning" :disabled="selectedIds.length === 0" @click="handleBatchHide">
              批量隐藏
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
        <el-table-column label="作者" width="150">
          <template #default="{ row }">
            <div class="user-cell">
              <el-avatar :src="row.author.avatar" :size="32" />
              <span>{{ row.author.username }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="帖子信息" min-width="300">
          <template #default="{ row }">
            <div class="post-info">
              <h4>{{ row.title }}</h4>
              <p>{{ row.excerpt }}</p>
              <div class="post-tags">
                <el-tag size="small" type="info">{{ getCategoryLabel(row.category) }}</el-tag>
                <el-tag
                  v-for="tag in row.tags"
                  :key="tag"
                  size="small"
                  effect="plain"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="统计" width="150">
          <template #default="{ row }">
            <div class="stats">
              <span>👁️ {{ row.views }}</span>
              <span>👍 {{ row.likes }}</span>
              <span>💬 {{ row.comments }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'pending'" type="warning">待审核</el-tag>
            <el-tag v-else-if="row.status === 'published'" type="success">已发布</el-tag>
            <el-tag v-else-if="row.status === 'rejected'" type="danger">已拒绝</el-tag>
            <el-tag v-else type="info">已隐藏</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
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
            <el-button
              v-if="row.status === 'published'"
              link
              type="warning"
              size="small"
              @click="handleHide(row)"
            >
              隐藏
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

    <!-- 帖子详情对话框 -->
    <el-dialog v-model="dialogVisible" title="帖子详情" width="800px">
      <el-descriptions :column="2" border v-if="currentPost">
        <el-descriptions-item label="帖子标题" :span="2">
          {{ currentPost.title }}
        </el-descriptions-item>
        <el-descriptions-item label="作者">
          {{ currentPost.author.username }}
        </el-descriptions-item>
        <el-descriptions-item label="分类">
          {{ getCategoryLabel(currentPost.category) }}
        </el-descriptions-item>
        <el-descriptions-item label="标签" :span="2">
          <el-tag
            v-for="tag in currentPost.tags"
            :key="tag"
            size="small"
            class="tag-item"
          >
            {{ tag }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="内容" :span="2">
          <div class="post-content">{{ currentPost.content }}</div>
        </el-descriptions-item>
        <el-descriptions-item label="浏览数">
          {{ currentPost.views }}
        </el-descriptions-item>
        <el-descriptions-item label="点赞数">
          {{ currentPost.likes }}
        </el-descriptions-item>
        <el-descriptions-item label="评论数">
          {{ currentPost.comments }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="currentPost.status === 'pending'" type="warning">待审核</el-tag>
          <el-tag v-else-if="currentPost.status === 'published'" type="success">已发布</el-tag>
          <el-tag v-else-if="currentPost.status === 'rejected'" type="danger">已拒绝</el-tag>
          <el-tag v-else type="info">已隐藏</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="发布时间">
          {{ formatTime(currentPost.created_at) }}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间">
          {{ formatTime(currentPost.updated_at) }}
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
            <el-option label="内容违规" value="内容违规" />
            <el-option label="标题不当" value="标题不当" />
            <el-option label="垃圾广告" value="垃圾广告" />
            <el-option label="虚假信息" value="虚假信息" />
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
  category: '',
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
const currentPost = ref<any>(null)
const rejectForm = reactive({
  reason: '',
  note: ''
})

// 分类映射
const categoryMap: Record<string, string> = {
  guide: '游戏攻略',
  tutorial: '新手教程',
  experience: '经验分享',
  help: '问题求助',
  other: '其他'
}

function getCategoryLabel(category: string) {
  return categoryMap[category] || category
}

// 获取帖子列表
async function fetchPosts() {
  loading.value = true
  try {
    // TODO: 调用实际API
    // 模拟数据
    await new Promise(resolve => setTimeout(resolve, 500))
    tableData.value = generateMockData()
    pagination.total = 100
  } catch (error) {
    ElMessage.error('获取帖子列表失败')
  } finally {
    loading.value = false
  }
}

// 生成模拟数据
function generateMockData() {
  const mockData = []
  const statuses = ['pending', 'published', 'rejected', 'hidden']
  const categories = ['guide', 'tutorial', 'experience', 'help', 'other']
  const titles = [
    'VR新手入门完全指南',
    'Beat Saber高分技巧分享',
    'Half-Life: Alyx通关攻略',
    'VR设备选购建议',
    'VR游戏推荐TOP10'
  ]

  for (let i = 1; i <= 10; i++) {
    mockData.push({
      id: i,
      author: {
        username: `用户${i}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`
      },
      title: titles[Math.floor(Math.random() * titles.length)],
      excerpt: '这是帖子的摘要内容，简要介绍了帖子的主要内容和核心观点...',
      content: '这是完整的帖子内容，包含了详细的说明和图文介绍。用户可以在这里分享自己的游戏体验、攻略技巧等内容。',
      category: categories[Math.floor(Math.random() * categories.length)],
      tags: ['VR', '游戏', '攻略'].slice(0, Math.floor(Math.random() * 3) + 1),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      views: Math.floor(Math.random() * 1000),
      likes: Math.floor(Math.random() * 100),
      comments: Math.floor(Math.random() * 50),
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
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
  fetchPosts()
}

// 重置
function handleReset() {
  Object.assign(filterForm, {
    keyword: '',
    status: '',
    category: '',
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
    await ElMessageBox.confirm('确认通过该帖子？', '提示', {
      type: 'warning'
    })
    // TODO: 调用实际API
    ElMessage.success('审核通过')
    fetchPosts()
  } catch {
    // 取消操作
  }
}

// 拒绝审核
function handleReject(row: any) {
  currentPost.value = row
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
    ElMessage.success('已拒绝该帖子')
    rejectDialogVisible.value = false
    fetchPosts()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 隐藏帖子
async function handleHide(row: any) {
  try {
    await ElMessageBox.confirm('确认隐藏该帖子？隐藏后用户将无法查看', '提示', {
      type: 'warning'
    })
    // TODO: 调用实际API
    ElMessage.success('已隐藏该帖子')
    fetchPosts()
  } catch {
    // 取消操作
  }
}

// 查看详情
function handleView(row: any) {
  currentPost.value = row
  dialogVisible.value = true
}

// 删除
async function handleDelete(row: any) {
  try {
    await ElMessageBox.confirm('确认删除该帖子？删除后无法恢复', '警告', {
      type: 'warning'
    })
    // TODO: 调用实际API
    ElMessage.success('删除成功')
    fetchPosts()
  } catch {
    // 取消操作
  }
}

// 批量删除
async function handleBatchDelete() {
  try {
    await ElMessageBox.confirm(`确认删除选中的 ${selectedIds.value.length} 条帖子？`, '警告', {
      type: 'warning'
    })
    // TODO: 调用实际API
    ElMessage.success('批量删除成功')
    fetchPosts()
  } catch {
    // 取消操作
  }
}

// 批量隐藏
async function handleBatchHide() {
  try {
    await ElMessageBox.confirm(`确认隐藏选中的 ${selectedIds.value.length} 条帖子？`, '提示', {
      type: 'warning'
    })
    // TODO: 调用实际API
    ElMessage.success('批量隐藏成功')
    fetchPosts()
  } catch {
    // 取消操作
  }
}

// 分页改变
function handlePageChange() {
  fetchPosts()
}

onMounted(() => {
  fetchPosts()
})
</script>

<style scoped>
.post-manage {
  height: 100%;
}

.filter-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.post-info h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
}

.post-info p {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

.post-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
}

.post-content {
  max-height: 200px;
  overflow-y: auto;
  line-height: 1.8;
  white-space: pre-wrap;
}

.tag-item {
  margin-right: 8px;
}

.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}
</style>
