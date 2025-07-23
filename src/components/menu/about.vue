<template>
  <div class="about-dialog" v-if="visible" @click.self="close">
    <div class="about-content">
      <div class="about-header">
        <h3>关于</h3>
        <span class="close-btn" @click="close">×</span>
      </div>
      <div class="about-body">
        <div class="app-icon">
          <i class="icon iconfont icon-dkw_xiaoxi"></i>
        </div>
        <div class="app-info">
          <h2>{{ appName }}</h2>
          <div class="info-item">
            <span class="label">版本:</span>
            <span class="value">{{ version }}</span>
          </div>
          <div class="info-item">
            <span class="label">作者:</span>
            <span class="value">{{ author }}</span>
          </div>
          <div class="info-item">
            <span class="label">编译时间:</span>
            <span class="value">{{ buildTime }}</span>
          </div>
          <div class="info-item">
            <span class="label">描述:</span>
            <span class="value">{{ description }}</span>
          </div>
        </div>
      </div>
      <div class="about-footer">
        <button class="btn-close" @click="close">确定</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'About',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      appName: 'WeChat Web',
      version: process.env.APP_VERSION || '1.0.14',
      author: 'comsince',
      buildTime: process.env.BUILD_TIME || new Date().toLocaleString('zh-CN'),
      description: '基于unverse-push的开源即时通讯web客户端'
    }
  },
  methods: {
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../assets/fonts/iconfont.css'

.about-dialog
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  background: rgba(0, 0, 0, 0.5)
  display: flex
  justify-content: center
  align-items: center
  z-index: 1000

.about-content
  background: white
  border-radius: 8px
  width: 400px
  max-width: 90vw
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15)

.about-header
  display: flex
  justify-content: space-between
  align-items: center
  padding: 20px 20px 0 20px
  border-bottom: 1px solid #eee
  margin-bottom: 20px
  h3
    margin: 0
    color: #333
    font-size: 18px
  .close-btn
    cursor: pointer
    font-size: 24px
    color: #999
    font-weight: bold
    line-height: 1
    &:hover
      color: #333

.about-body
  padding: 0 20px
  text-align: center

.app-icon
  margin-bottom: 20px
  .icon
    font-size: 48px
    color: #07c160

.app-info
  h2
    margin: 0 0 20px 0
    color: #333
    font-size: 24px
    font-weight: 500

.info-item
  display: flex
  justify-content: space-between
  align-items: center
  margin-bottom: 12px
  padding: 8px 0
  border-bottom: 1px solid #f5f5f5
  &:last-child
    border-bottom: none
  .label
    font-weight: 500
    color: #666
    min-width: 80px
    text-align: left
  .value
    color: #333
    text-align: right
    flex: 1

.about-footer
  padding: 20px
  text-align: center
  border-top: 1px solid #eee

.btn-close
  background: #07c160
  color: white
  border: none
  padding: 10px 30px
  border-radius: 4px
  cursor: pointer
  font-size: 14px
  &:hover
    background: #06ad56
</style>