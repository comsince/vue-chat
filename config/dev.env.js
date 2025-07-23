var merge = require('webpack-merge')
var prodEnv = require('./prod.env')
var pkg = require('../package.json')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  APP_VERSION: '"' + pkg.version + '"',
  BUILD_TIME: '"' + new Date().toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }) + '"'
})
