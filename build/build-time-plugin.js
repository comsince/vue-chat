const fs = require('fs')
const path = require('path')

class BuildTimePlugin {
  constructor(options = {}) {
    this.options = options
  }

  apply(compiler) {
    const buildTime = new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })

    // 为webpack 2.x版本兼容
    compiler.plugin('emit', (compilation, callback) => {
      // 创建构建信息
      const buildInfo = {
        buildTime: buildTime,
        version: this.options.version || '1.0.14',
        gitCommit: this.getGitCommit(),
        nodeVersion: process.version,
        env: process.env.NODE_ENV || 'development'
      }

      // 将构建信息写入文件
      const buildInfoContent = `window.BUILD_INFO = ${JSON.stringify(buildInfo, null, 2)};`
      
      compilation.assets['build-info.js'] = {
        source: () => buildInfoContent,
        size: () => buildInfoContent.length
      }

      callback()
    })
  }

  getGitCommit() {
    try {
      const gitPath = path.join(process.cwd(), '.git/HEAD')
      if (fs.existsSync(gitPath)) {
        const head = fs.readFileSync(gitPath, 'utf8').trim()
        if (head.startsWith('ref: ')) {
          const refPath = path.join(process.cwd(), '.git', head.slice(5))
          if (fs.existsSync(refPath)) {
            return fs.readFileSync(refPath, 'utf8').trim().slice(0, 8)
          }
        } else {
          return head.slice(0, 8)
        }
      }
    } catch (error) {
      console.warn('无法获取Git提交信息:', error.message)
    }
    return 'unknown'
  }
}

module.exports = BuildTimePlugin