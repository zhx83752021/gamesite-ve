<template>
  <div class="report-manage">
    <el-card class="filter-card">
      <el-form :inline="true" :model="filterForm">
        <el-form-item label="关键词">
          <el-input v-model="filterForm.keyword" placeholder="搜索举报内容" clearable />
        </el-form-item>
        <el-form-item label="举报类型">
          <el-select v-model="filterForm.type" placeholder="全部类型" clearable>
            <el-option label="全部" value="" />
            <el-option label="垃圾信息" value="spam" />
            <el-option label="骚扰行为" value="harassment" />
            <el-option label="不当内容" value="inappropriate" />
            <el-option label="侵犯版权" value="copyright" />
            <el-option label="虚假信息" value="fake" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理状态">
          <el-select v-model="filterForm.status" placeholder="全部状态" clearable>
            <el-option label="全部" value="" />
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="processing" />
            <el-option label="已完成" value="completed" />
            <el-option label="已驳回" value="rejected" />
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
          <span>举报列表</span>
          <div class="stats-info">
            <el-tag type="warning">待处理: {{ stats.pending }}</el-tag>
            <el-tag type="info">处理中: {{ stats.processing }}</el-tag>
            <el-tag type="success">已完成: {{ stats.completed }}</el-tag>
          </div>
        </div>
      </template>

      <el-table :data="tableData" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="举报人" width="120">
          <template #default="{ row }">
            <div class="user-cell">
              <el-avatar :src="row.reporter.avatar" :size="32" />
              <span>{{ row.reporter.username }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="被举报对象" width="200">
          <template #default="{ row }">
            <div class="target-info">
              <div class="target-user">
                <el-avatar :src="row.target.avatar" :size="32" />
                <span>{{ row.target.username }}</span>
              </div>
              <el-tag size="small" effect="plain">{{ getTargetTypeLabel(row.target_type) }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="举报类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getTypeColor(row.type)">
              {{ getTypeLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="举报内容" min-width="300">
          <template #default="{ row }">
            <div class="report-content">
              <p class="content-preview">{{ row.content }}</p>
              <p class="reason">原因: {{ row.reason }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'pending'" type="warning">待处理</el-tag>
            <el-tag v-else-if="row.status === 'processing'" type="info">处理中</el-tag>
            <el-tag v-else-if="row.status === 'completed'" type="success">已完成</el-tag>
            <el-tag v-else type="danger">已驳回</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="举报时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 'pending'"
              type="primary"
              size="small"
              @click="handleProcess(row)"
            >
              处理
            </el-button>
            <el-button type="info" size="small" @click="handleView(row)">
              详情
            </el-button>
            <el-button
              v-if="row.status === 'pending'"
              type="danger"
              size="small"
              @click="handleReject(row)"
            >
              驳回
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

    <!-- 详情对话框 -->
    <el-dialog v-model="dialogVisible" title="举报详情" width="700px">
      <el-descriptions :column="2" border v-if="currentReport">
        <el-descriptions-item label="举报ID">
          {{ currentReport.id }}
        </el-descriptions-item>
        <el-descriptions-item label="举报时间">
          {{ formatTime(currentReport.created_at) }}
        </el-descriptions-item>
        <el-descriptions-item label="举报人">
          {{ currentReport.reporter.username }}
        </el-descriptions-item>
        <el-descriptions-item label="被举报人">
          {{ currentReport.target.username }}
        </el-descriptions-item>
        <el-descriptions-item label="举报类型">
          <el-tag :type="getTypeColor(currentReport.type)">
            {{ getTypeLabel(currentReport.type) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="对象类型">
          <el-tag effect="plain">
            {{ getTargetTypeLabel(currentReport.target_type) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="举报原因" :span="2">
          {{ currentReport.reason }}
        </el-descriptions-item>
        <el-descriptions-item label="被举报内容" :span="2">
          <div class="content-detail">{{ currentReport.content }}</div>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="currentReport.status === 'pending'" type="warning">待处理</el-tag>
          <el-tag v-else-if="currentReport.status === 'processing'" type="info">处理中</el-tag>
          <el-tag v-else-if="currentReport.status === 'completed'" type="success">已完成</el-tag>
          <el-tag v-else type="danger">已驳回</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="处理结果" v-if="currentReport.result">
          {{ currentReport.result }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 处理对话框 -->
    <el-dialog v-model="processDialogVisible" title="处理举报" width="600px">
      <el-form :model="processForm" label-width="100px">
        <el-form-item label="处理结果">
          <el-radio-group v-model="processForm.action">
            <el-radio label="accept">举报成立</el-radio>
            <el-radio label="reject">举报不成立</el-radio>
            <el-radio label="investigate">需进一步调查</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理措施" v-if="processForm.action === 'accept'">
          <el-checkbox-group v-model="processForm.measures">
            <el-checkbox label="delete">删除内容</el-checkbox>
            <el-checkbox label="ban">封禁用户</el-checkbox>
            <el-checkbox label="warn">警告用户</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="封禁时长" v-if="processForm.measures.includes('ban')">
          <el-select v-model="processForm.banDuration" placeholder="请选择封禁时长">
            <el-option label="1天" :value="1" />
            <el-option label="3天" :value="3" />
            <el-option label="7天" :value="7" />
            <el-option label="30天" :value="30" />
            <el-option label="永久" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="处理说明">
          <el-input
            v-model="processForm.note"
            type="textarea"
            :rows="4"
            placeholder="请输入处理说明"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="processDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmProcess">确认处理</el-button>
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
  type: '',
  status: '',
  dateRange: []
})

// 统计数据
const stats = reactive({
  pending: 0,
  processing: 0,
  completed: 0
})

// 分页信息
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 表格数据
const tableData = ref([])
const loading = ref(false)

// 对话框
const dialogVisible = ref(false)
const processDialogVisible = ref(false)
const currentReport = ref<any>(null)
const processForm = reactive({
  action: 'accept',
  measures: [] as string[],
  banDuration: 7,
  note: ''
})

// 类型映射
const typeMap: Record<string, string> = {
  spam: '垃圾信息',
  harassment: '骚扰行为',
  inappropriate: '不当内容',
  copyright: '侵犯版权',
  fake: '虚假信息',
  other: '其他'
}

const targetTypeMap: Record<string, string> = {
  comment: '评论',
  post: '帖子',
  game: '游戏',
  user: '用户'
}

function getTypeLabel(type: string) {
  return typeMap[type] || type
}

function getTargetTypeLabel(type: string) {
  return targetTypeMap[type] || type
}

function getTypeColor(type: string) {
  const colorMap: Record<string, string> = {
    spam: 'warning',
    harassment: 'danger',
    inappropriate: 'danger',
    copyright: 'info',
    fake: 'warning',
    other: ''
  }
  return colorMap[type] || ''
}

// 获取举报列表
async function fetchReports() {
  loading.value = true
  try {
    // TODO: 调用实际API
    // 模拟数据
    await new Promise(resolve => setTimeout(resolve, 500))
    tableData.value = generateMockData()
    pagination.total = 100

    // 更新统计
    stats.pending = 15
    stats.processing = 8
    stats.completed = 77
  } catch (error) {
    ElMessage.error('获取举报列表失败')
  } finally {
    loading.value = false
  }
}

// 生成模拟数据
function generateMockData() {
  const mockData = []
  const statuses = ['pending', 'processing', 'completed', 'rejected']
  const types = ['spam', 'harassment', 'inappropriate', 'copyright', 'fake', 'other']
  const targetTypes = ['comment', 'post', 'game', 'user']

  for (let i = 1; i <= 10; i++) {
    mockData.push({
      id: i,
      reporter: {
        username: `举报人${i}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=reporter${i}`
      },
      target: {
        username: `被举报人${i}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=target${i}`
      },
      type: types[Math.floor(Math.random() * types.length)],
      target_type: targetTypes[Math.floor(Math.random() * targetTypes.length)],
      reason: '该内容存在违规行为,请管理员查看处理',
      content: '这是被举报的内容，可能包含不当言论、垃圾广告等违规信息...',
      status: statuses[Math.floor(Math.random() * statuses.length)],
      result: Math.random() > 0.5 ? '已删除违规内容并警告用户' : null,
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
  fetchReports()
}

// 重置
function handleReset() {
  Object.assign(filterForm, {
    keyword: '',
    type: '',
    status: '',
    dateRange: []
  })
  handleSearch()
}

// 处理举报
function handleProcess(row: any) {
  currentReport.value = row
  Object.assign(processForm, {
    action: 'accept',
    measures: [],
    banDuration: 7,
    note: ''
  })
  processDialogVisible.value = true
}

// 确认处理
async function confirmProcess() {
  if (!processForm.action) {
    ElMessage.warning('请选择处理结果')
    return
  }
  try {
    // TODO: 调用实际API
    ElMessage.success('处理成功')
    processDialogVisible.value = false
    fetchReports()
  } catch (error) {
    ElMessage.error('处理失败')
  }
}

// 查看详情
function handleView(row: any) {
  currentReport.value = row
  dialogVisible.value = true
}

// 驳回举报
async function handleReject(row: any) {
  try {
    await ElMessageBox.confirm('确认驳回该举报？', '提示', {
      type: 'warning'
    })
    // TODO: 调用实际API
    ElMessage.success('已驳回举报')
    fetchReports()
  } catch {
    // 取消操作
  }
}

// 分页改变
function handlePageChange() {
  fetchReports()
}

onMounted(() => {
  fetchReports()
})
</script>

<style scoped>
.report-manage {
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

.stats-info {
  display: flex;
  gap: 10px;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.target-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.target-user {
  display: flex;
  align-items: center;
  gap: 10px;
}

.report-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.content-preview {
  margin: 0;
  color: #333;
  line-height: 1.6;
}

.reason {
  margin: 0;
  color: #999;
  font-size: 13px;
}

.content-detail {
  max-height: 200px;
  overflow-y: auto;
  line-height: 1.8;
  white-space: pre-wrap;
}

.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}
</style>
