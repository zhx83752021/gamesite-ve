<template>
  <div class="system-settings">
    <div class="page-header mb-6">
      <h1 class="text-2xl font-bold text-black">系统设置</h1>
    </div>

    <el-tabs v-model="activeTab" type="border-card">
      <!-- 站点设置 -->
      <el-tab-pane label="站点设置" name="site">
        <el-form :model="siteForm" label-width="120px" class="settings-form">
          <el-form-item label="站点名称">
            <el-input v-model="siteForm.name" placeholder="请输入站点名称" />
          </el-form-item>
          <el-form-item label="站点Logo">
            <el-upload
              class="logo-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="handleLogoUpload"
            >
              <img v-if="siteForm.logo" :src="siteForm.logo" class="logo-preview" />
              <el-icon v-else class="logo-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item label="站点描述">
            <el-input
              v-model="siteForm.description"
              type="textarea"
              :rows="4"
              placeholder="请输入站点描述"
            />
          </el-form-item>
          <el-form-item label="关键词">
            <el-input v-model="siteForm.keywords" placeholder="多个关键词用逗号分隔" />
          </el-form-item>
          <el-form-item label="备案号">
            <el-input v-model="siteForm.icp" placeholder="请输入ICP备案号" />
          </el-form-item>
          <el-form-item label="联系邮箱">
            <el-input v-model="siteForm.email" placeholder="请输入联系邮箱" />
          </el-form-item>
          <el-form-item label="客服电话">
            <el-input v-model="siteForm.phone" placeholder="请输入客服电话" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSaveSite">保存设置</el-button>
            <el-button @click="handleResetSite">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 功能开关 -->
      <el-tab-pane label="功能开关" name="features">
        <el-form :model="featureForm" label-width="150px" class="settings-form">
          <el-form-item label="允许用户注册">
            <el-switch v-model="featureForm.allowRegister" />
            <span class="form-tip">关闭后新用户将无法注册</span>
          </el-form-item>
          <el-form-item label="允许用户评论">
            <el-switch v-model="featureForm.allowComment" />
            <span class="form-tip">关闭后用户将无法发表评论</span>
          </el-form-item>
          <el-form-item label="启用论坛功能">
            <el-switch v-model="featureForm.enableForum" />
            <span class="form-tip">关闭后论坛模块将不可访问</span>
          </el-form-item>
          <el-form-item label="启用支付功能">
            <el-switch v-model="featureForm.enablePayment" />
            <span class="form-tip">关闭后用户将无法进行付费操作</span>
          </el-form-item>
          <el-form-item label="启用内容审核">
            <el-switch v-model="featureForm.enableReview" />
            <span class="form-tip">开启后所有内容需先审核才能发布</span>
          </el-form-item>
          <el-form-item label="维护模式">
            <el-switch v-model="featureForm.maintenanceMode" />
            <span class="form-tip" style="color: #f56c6c;">
              开启后普通用户将无法访问网站
            </span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSaveFeatures">保存设置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- SEO设置 -->
      <el-tab-pane label="SEO设置" name="seo">
        <el-form :model="seoForm" label-width="150px" class="settings-form">
          <el-form-item label="首页标题">
            <el-input v-model="seoForm.homeTitle" placeholder="请输入首页标题" />
          </el-form-item>
          <el-form-item label="首页描述">
            <el-input
              v-model="seoForm.homeDescription"
              type="textarea"
              :rows="3"
              placeholder="请输入首页描述"
            />
          </el-form-item>
          <el-form-item label="首页关键词">
            <el-input v-model="seoForm.homeKeywords" placeholder="多个关键词用逗号分隔" />
          </el-form-item>
          <el-form-item label="Google Analytics">
            <el-input v-model="seoForm.googleAnalytics" placeholder="请输入GA跟踪ID" />
          </el-form-item>
          <el-form-item label="百度统计代码">
            <el-input
              v-model="seoForm.baiduAnalytics"
              type="textarea"
              :rows="4"
              placeholder="请粘贴百度统计代码"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSaveSeo">保存设置</el-button>
            <el-button @click="handleResetSeo">重置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 邮件配置 -->
      <el-tab-pane label="邮件配置" name="email">
        <el-form :model="emailForm" label-width="150px" class="settings-form">
          <el-form-item label="SMTP服务器">
            <el-input v-model="emailForm.smtpHost" placeholder="smtp.example.com" />
          </el-form-item>
          <el-form-item label="SMTP端口">
            <el-input-number v-model="emailForm.smtpPort" :min="1" :max="65535" />
          </el-form-item>
          <el-form-item label="加密方式">
            <el-select v-model="emailForm.encryption" placeholder="请选择加密方式">
              <el-option label="无" value="none" />
              <el-option label="SSL" value="ssl" />
              <el-option label="TLS" value="tls" />
            </el-select>
          </el-form-item>
          <el-form-item label="发件人邮箱">
            <el-input v-model="emailForm.fromEmail" placeholder="noreply@example.com" />
          </el-form-item>
          <el-form-item label="发件人名称">
            <el-input v-model="emailForm.fromName" placeholder="VR游戏平台" />
          </el-form-item>
          <el-form-item label="SMTP用户名">
            <el-input v-model="emailForm.username" placeholder="请输入SMTP用户名" />
          </el-form-item>
          <el-form-item label="SMTP密码">
            <el-input
              v-model="emailForm.password"
              type="password"
              placeholder="请输入SMTP密码"
              show-password
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSaveEmail">保存设置</el-button>
            <el-button @click="handleTestEmail">发送测试邮件</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 存储配置 -->
      <el-tab-pane label="存储配置" name="storage">
        <el-form :model="storageForm" label-width="150px" class="settings-form">
          <el-form-item label="存储方式">
            <el-radio-group v-model="storageForm.type">
              <el-radio label="local">本地存储</el-radio>
              <el-radio label="oss">阿里云OSS</el-radio>
              <el-radio label="cos">腾讯云COS</el-radio>
            </el-radio-group>
          </el-form-item>

          <template v-if="storageForm.type !== 'local'">
            <el-form-item label="AccessKey ID">
              <el-input v-model="storageForm.accessKeyId" placeholder="请输入AccessKey ID" />
            </el-form-item>
            <el-form-item label="AccessKey Secret">
              <el-input
                v-model="storageForm.accessKeySecret"
                type="password"
                placeholder="请输入AccessKey Secret"
                show-password
              />
            </el-form-item>
            <el-form-item label="Bucket名称">
              <el-input v-model="storageForm.bucket" placeholder="请输入Bucket名称" />
            </el-form-item>
            <el-form-item label="区域/地域">
              <el-input v-model="storageForm.region" placeholder="例如: cn-hangzhou" />
            </el-form-item>
            <el-form-item label="CDN域名">
              <el-input v-model="storageForm.cdnDomain" placeholder="请输入CDN域名（可选）" />
            </el-form-item>
          </template>

          <el-form-item label="上传文件大小限制">
            <el-input-number
              v-model="storageForm.maxFileSize"
              :min="1"
              :max="1024"
              :step="1"
            />
            <span class="form-tip">MB</span>
          </el-form-item>
          <el-form-item label="允许的文件类型">
            <el-input
              v-model="storageForm.allowedTypes"
              type="textarea"
              :rows="2"
              placeholder="例如: jpg,png,gif,mp4,zip"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSaveStorage">保存设置</el-button>
            <el-button v-if="storageForm.type !== 'local'" @click="handleTestStorage">
              测试连接
            </el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 安全设置 -->
      <el-tab-pane label="安全设置" name="security">
        <el-form :model="securityForm" label-width="180px" class="settings-form">
          <el-form-item label="密码最小长度">
            <el-input-number v-model="securityForm.minPasswordLength" :min="6" :max="20" />
          </el-form-item>
          <el-form-item label="密码复杂度要求">
            <el-checkbox-group v-model="securityForm.passwordRequirements">
              <el-checkbox label="uppercase">包含大写字母</el-checkbox>
              <el-checkbox label="lowercase">包含小写字母</el-checkbox>
              <el-checkbox label="number">包含数字</el-checkbox>
              <el-checkbox label="special">包含特殊字符</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="登录失败最大次数">
            <el-input-number v-model="securityForm.maxLoginAttempts" :min="3" :max="10" />
            <span class="form-tip">超过次数将临时锁定账号</span>
          </el-form-item>
          <el-form-item label="锁定时长">
            <el-input-number v-model="securityForm.lockDuration" :min="5" :max="120" />
            <span class="form-tip">分钟</span>
          </el-form-item>
          <el-form-item label="启用验证码">
            <el-switch v-model="securityForm.enableCaptcha" />
            <span class="form-tip">登录和注册时显示验证码</span>
          </el-form-item>
          <el-form-item label="启用双因素认证">
            <el-switch v-model="securityForm.enable2FA" />
            <span class="form-tip">为管理员账号启用2FA增强安全性</span>
          </el-form-item>
          <el-form-item label="IP白名单">
            <el-input
              v-model="securityForm.ipWhitelist"
              type="textarea"
              :rows="4"
              placeholder="每行一个IP地址，例如: 192.168.1.1"
            />
            <span class="form-tip">管理后台访问IP限制，留空则不限制</span>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSaveSecurity">保存设置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const activeTab = ref('site')

// 站点设置
const siteForm = reactive({
  name: 'VR游戏平台',
  logo: '',
  description: '专业的VR游戏平台，提供海量优质VR游戏',
  keywords: 'VR游戏,虚拟现实,VR平台',
  icp: '京ICP备xxxxxx号',
  email: 'admin@example.com',
  phone: '400-xxx-xxxx'
})

// 功能开关
const featureForm = reactive({
  allowRegister: true,
  allowComment: true,
  enableForum: true,
  enablePayment: true,
  enableReview: false,
  maintenanceMode: false
})

// SEO设置
const seoForm = reactive({
  homeTitle: 'VR游戏平台 - 专业的虚拟现实游戏平台',
  homeDescription: '提供海量优质VR游戏，包含动作、冒险、解谜等多种类型',
  homeKeywords: 'VR游戏,虚拟现实,VR平台,VR游戏下载',
  googleAnalytics: '',
  baiduAnalytics: ''
})

// 邮件配置
const emailForm = reactive({
  smtpHost: 'smtp.example.com',
  smtpPort: 465,
  encryption: 'ssl',
  fromEmail: 'noreply@example.com',
  fromName: 'VR游戏平台',
  username: '',
  password: ''
})

// 存储配置
const storageForm = reactive({
  type: 'local',
  accessKeyId: '',
  accessKeySecret: '',
  bucket: '',
  region: '',
  cdnDomain: '',
  maxFileSize: 50,
  allowedTypes: 'jpg,jpeg,png,gif,mp4,zip'
})

// 安全设置
const securityForm = reactive({
  minPasswordLength: 8,
  passwordRequirements: ['lowercase', 'number'],
  maxLoginAttempts: 5,
  lockDuration: 30,
  enableCaptcha: true,
  enable2FA: false,
  ipWhitelist: ''
})

// Logo上传
function handleLogoUpload(file: File) {
  // TODO: 实现上传逻辑
  const reader = new FileReader()
  reader.onload = (e) => {
    siteForm.logo = e.target?.result as string
  }
  reader.readAsDataURL(file)
  return false
}

// 保存站点设置
async function handleSaveSite() {
  try {
    // TODO: 调用实际API
    ElMessage.success('站点设置保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

// 重置站点设置
function handleResetSite() {
  // 重置为默认值
  ElMessage.info('已重置为默认设置')
}

// 保存功能开关
async function handleSaveFeatures() {
  try {
    // TODO: 调用实际API
    ElMessage.success('功能开关设置保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

// 保存SEO设置
async function handleSaveSeo() {
  try {
    // TODO: 调用实际API
    ElMessage.success('SEO设置保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

// 重置SEO设置
function handleResetSeo() {
  ElMessage.info('已重置为默认设置')
}

// 保存邮件配置
async function handleSaveEmail() {
  try {
    // TODO: 调用实际API
    ElMessage.success('邮件配置保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

// 测试邮件
async function handleTestEmail() {
  try {
    // TODO: 调用实际API
    ElMessage.success('测试邮件已发送，请检查收件箱')
  } catch (error) {
    ElMessage.error('发送失败')
  }
}

// 保存存储配置
async function handleSaveStorage() {
  try {
    // TODO: 调用实际API
    ElMessage.success('存储配置保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

// 测试存储连接
async function handleTestStorage() {
  try {
    // TODO: 调用实际API
    ElMessage.success('连接测试成功')
  } catch (error) {
    ElMessage.error('连接失败')
  }
}

// 保存安全设置
async function handleSaveSecurity() {
  try {
    // TODO: 调用实际API
    ElMessage.success('安全设置保存成功')
  } catch (error) {
    ElMessage.error('保存失败')
  }
}

onMounted(() => {
  // TODO: 加载设置数据
})
</script>

<style scoped>
.system-settings {
  height: 100%;
}

.settings-form {
  max-width: 800px;
  padding: 20px;
}

.form-tip {
  margin-left: 10px;
  color: #909399;
  font-size: 13px;
}

.logo-uploader {
  width: 120px;
  height: 120px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.3s;
}

.logo-uploader:hover {
  border-color: #409EFF;
}

.logo-uploader-icon {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: #8c939d;
}

.logo-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

:deep(.el-tabs__content) {
  overflow-y: auto;
  max-height: calc(100vh - 280px);
}
</style>
