<template>
  <transition name="dialog-fade">
    <div class="about-dialog" id="about-dialog" v-if="visible" @click.self="closeDialog">
      <transition name="dialog-content">
        <div class="about-content" v-if="visible">
      <div class="about-header">
        <h3>关于飞享即时通讯</h3>
        <i class="el-icon-close close-btn" @click="closeDialog"></i>
      </div>
      
      <div class="about-body">
        <div class="app-info">
          <div class="app-icon">
            <img src="static/images/vue.jpg" alt="App Icon" class="icon">
          </div>
          <div class="app-details">
            <h4>{{ appName }}</h4>
            <p class="version">版本 {{ version }}</p>
            <p class="description">{{ description }}</p>
          </div>
        </div>
        
        <div class="info-section">
          <div class="info-item">
            <label>开发者:</label>
            <span>{{ author }}</span>
          </div>
          
          <div class="info-item">
            <label>编译时间:</label>
            <span>{{ buildTime }}</span>
          </div>
          
          <div class="info-item">
            <label>Vue版本:</label>
            <span>{{ vueVersion }}</span>
          </div>
          
          <div class="info-item">
            <label>构建环境:</label>
            <span>{{ buildEnv }}</span>
          </div>
          
          <div class="info-item">
            <label>许可证:</label>
            <span>Creative Commons License</span>
          </div>
        </div>
        
        <div class="links-section">
          <h5>相关链接</h5>
          <div class="links">
            <a href="https://fsharechat.cn" target="_blank" class="link-item">
              <i class="el-icon-link"></i>
              官方网站
            </a>
            <a href="https://github.com/fsharechat/vue-chat" target="_blank" class="link-item">
              <i class="el-icon-link"></i>
              GitHub
            </a>
            <a href="https://www.comsince.cn/2020/05/18/universe-push-tech-doc/" target="_blank" class="link-item">
              <i class="el-icon-document"></i>
              技术文档
            </a>
          </div>
        </div>
        
        <div class="copyright">
          <p>&copy; 2024 飞享开发组. 保留所有权利.</p>
          <p class="license-text">
            本项目使用 Creative Commons Attribution-NonCommercial-NoDerivs 3.0 许可证
          </p>
        </div>
      </div>
      
        <div class="about-footer">
          <el-button @click="closeDialog" type="primary">确定</el-button>
        </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'AboutDialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      appName: '飞享即时通讯',
      version: require('../../../package.json').version,
      description: require('../../../package.json').description,
      author: require('../../../package.json').author,
      vueVersion: Vue.version,
      buildTime: this.getBuildTime(),
      buildEnv: process.env.NODE_ENV || 'development'
    }
  },
  mounted() {
    // 添加ESC键监听
    document.addEventListener('keydown', this.handleKeydown)
  },
  
  beforeDestroy() {
    // 移除ESC键监听
    document.removeEventListener('keydown', this.handleKeydown)
  },
  
  methods: {
    closeDialog() {
      this.$emit('close')
    },
    
    handleKeydown(event) {
      if (event.key === 'Escape' && this.visible) {
        this.closeDialog()
      }
    },
    
    getBuildTime() {
      // 在开发模式下显示当前时间，生产模式下需要通过构建工具注入
      const now = new Date()
      return now.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.about-dialog
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  background-color: rgba(0, 0, 0, 0.5)
  display: flex
  justify-content: center
  align-items: center
  z-index: 9999

.about-content
  background: white
  border-radius: 8px
  width: 480px
  max-height: 80vh
  overflow-y: auto
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15)
  
.about-header
  padding: 20px 20px 0 20px
  display: flex
  justify-content: space-between
  align-items: center
  border-bottom: 1px solid #ebeef5
  
  h3
    margin: 0
    color: #303133
    font-size: 18px
    font-weight: 500
    
  .close-btn
    font-size: 20px
    color: #909399
    cursor: pointer
    &:hover
      color: #606266

.about-body
  padding: 20px
  
.app-info
  display: flex
  align-items: center
  margin-bottom: 25px
  
  .app-icon
    margin-right: 20px
    
    .icon
      width: 64px
      height: 64px
      border-radius: 8px
      
  .app-details
    flex: 1
    
    h4
      margin: 0 0 8px 0
      color: #303133
      font-size: 20px
      font-weight: 500
      
    .version
      margin: 0 0 8px 0
      color: #606266
      font-size: 14px
      
    .description
      margin: 0
      color: #909399
      font-size: 13px
      line-height: 1.4

.info-section
  margin-bottom: 25px
  
.info-item
  display: flex
  justify-content: space-between
  align-items: center
  padding: 8px 0
  border-bottom: 1px solid #f5f7fa
  
  &:last-child
    border-bottom: none
    
  label
    color: #606266
    font-size: 14px
    font-weight: 500
    min-width: 80px
    
  span
    color: #303133
    font-size: 14px
    text-align: right

.links-section
  margin-bottom: 25px
  
  h5
    margin: 0 0 15px 0
    color: #303133
    font-size: 15px
    font-weight: 500
    
.links
  display: flex
  flex-direction: column
  gap: 10px
  
.link-item
  display: flex
  align-items: center
  padding: 8px 12px
  background: #f5f7fa
  border-radius: 4px
  text-decoration: none
  color: #606266
  font-size: 14px
  transition: all 0.3s
  
  &:hover
    background: #ecf5ff
    color: #409eff
    
  i
    margin-right: 8px
    font-size: 16px

.copyright
  text-align: center
  padding-top: 20px
  border-top: 1px solid #ebeef5
  
  p
    margin: 0 0 8px 0
    color: #909399
    font-size: 12px
    line-height: 1.4
    
  .license-text
    font-size: 11px
    color: #c0c4cc

.about-footer
  padding: 15px 20px 20px 20px
  text-align: center
  border-top: 1px solid #ebeef5

// 动画效果
.dialog-fade-enter-active, .dialog-fade-leave-active
  transition: opacity 0.3s

.dialog-fade-enter, .dialog-fade-leave-to
  opacity: 0

.dialog-content-enter-active
  transition: all 0.3s ease

.dialog-content-leave-active
  transition: all 0.2s ease

.dialog-content-enter, .dialog-content-leave-to
  transform: scale(0.9) translateY(-20px)
  opacity: 0
</style>