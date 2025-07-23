# 关于界面功能说明

## 功能概述

在应用的侧边栏底部新增了"关于"按钮，点击后会弹出关于界面，显示当前软件的详细信息。

## 功能特性

### 显示内容

关于界面显示以下信息：

1. **应用信息**
   - 应用名称：飞享即时通讯
   - 应用图标
   - 版本号：自动从 package.json 读取
   - 应用描述：自动从 package.json 读取

2. **开发信息**
   - 开发者：自动从 package.json 读取
   - 编译时间：显示当前构建时间
   - Vue版本：显示当前使用的Vue.js版本
   - 构建环境：显示当前构建环境（development/production）
   - 许可证：Creative Commons Attribution-NonCommercial-NoDerivs 3.0

3. **相关链接**
   - 官方网站：https://fsharechat.cn
   - GitHub仓库：https://github.com/fsharechat/vue-chat
   - 技术文档：技术说明文档链接

4. **版权信息**
   - 版权声明
   - 许可证说明

### 界面特性

- **美观设计**：采用现代化的对话框设计
- **响应式布局**：适配不同屏幕尺寸
- **动画效果**：平滑的打开/关闭动画
- **键盘支持**：按ESC键快速关闭
- **点击外部关闭**：点击对话框外部区域关闭

## 使用方法

### 打开关于界面

1. 在应用的侧边栏底部，找到"关于"按钮（信息图标）
2. 点击"关于"按钮
3. 关于界面将以动画效果弹出

### 关闭关于界面

可以通过以下方式关闭关于界面：
- 点击对话框右上角的关闭按钮（×）
- 点击对话框底部的"确定"按钮
- 按键盘的ESC键
- 点击对话框外部的遮罩区域

## 技术实现

### 组件结构

```
src/components/menu/aboutDialog.vue  # 关于对话框组件
src/components/mycard/mycard.vue     # 侧边栏组件（集成关于按钮）
```

### 核心代码

#### 关于按钮（mycard.vue）
```html
<i title="关于" class="el-icon-info about-icon" @click="showAbout"></i>
```

#### 关于对话框组件（aboutDialog.vue）
```html
<aboutDialog :visible="showAboutDialog" @close="showAboutDialog = false"></aboutDialog>
```

### 动态数据获取

- **版本信息**：通过 `require('../../../package.json').version` 动态获取
- **应用描述**：通过 `require('../../../package.json').description` 动态获取
- **开发者信息**：通过 `require('../../../package.json').author` 动态获取
- **编译时间**：动态生成当前时间戳
- **Vue版本**：通过 `Vue.version` 获取

## 自定义配置

### 修改显示内容

如需修改关于界面的显示内容，可编辑 `src/components/menu/aboutDialog.vue` 文件：

```javascript
data() {
  return {
    appName: '飞享即时通讯',  // 修改应用名称
    version: require('../../../package.json').version,
    description: require('../../../package.json').description,
    author: require('../../../package.json').author,
    // ... 其他配置
  }
}
```

### 修改样式

可以通过修改组件的CSS样式来自定义界面外观：

```stylus
.about-content
  background: white
  border-radius: 8px
  width: 480px  // 修改对话框宽度
  // ... 其他样式
```

### 添加更多信息

可以在 `info-section` 中添加更多信息项：

```html
<div class="info-item">
  <label>新信息项:</label>
  <span>{{ newInfoValue }}</span>
</div>
```

## 构建时信息注入

项目包含一个构建时插件 `build/build-time-plugin.js`，可以在生产构建时注入真实的构建时间和Git信息。

### 启用构建插件

在webpack配置中添加插件：

```javascript
const BuildTimePlugin = require('./build/build-time-plugin')

plugins: [
  new BuildTimePlugin({
    version: require('./package.json').version
  })
]
```

## 注意事项

1. **图标依赖**：关于按钮使用Element UI的图标，确保项目已正确引入Element UI
2. **动画效果**：使用Vue的transition组件实现动画，确保Vue版本支持
3. **响应式设计**：对话框在小屏幕设备上会自动调整尺寸
4. **键盘事件**：ESC键监听会在组件销毁时自动移除，避免内存泄漏

## 兼容性

- Vue.js 2.x
- Element UI 2.x
- 现代浏览器（支持ES6+）

## 维护说明

- 版本信息会自动从package.json同步，无需手动维护
- 新增功能时，可在相关链接部分添加对应的文档链接
- 样式修改建议使用CSS变量，便于主题切换