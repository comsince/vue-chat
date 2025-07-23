# Quick Start Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Development Setup](#development-setup)
4. [Basic Usage](#basic-usage)
5. [Common Development Tasks](#common-development-tasks)
6. [Troubleshooting](#troubleshooting)
7. [Next Steps](#next-steps)

## Prerequisites

Before getting started, ensure you have the following installed:

- **Node.js** (>= 4.0.0)
- **npm** (>= 3.0.0)
- **Git**
- **Modern Web Browser** (Chrome 60+, Firefox 55+, Safari 11+)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/fsharechat/vue-chat.git
cd vue-chat
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configuration

The application uses default configuration for the demo environment. For production deployment, update the configuration in `src/constant/index.js`:

```javascript
// WebSocket Configuration
export const WS_PROTOCOL = 'wss'
export const WS_IP = 'your-websocket-server.com/ws'
export const HTTP_IP = 'your-api-server.com'

// File Upload Configuration
export const UPLOAD_BY_QINIU = false // Set to true if using Qiniu
```

## Development Setup

### 1. Start Development Server

```bash
npm run dev
# or
npm start
```

The application will start at `http://localhost:8080`

### 2. Build for Production

```bash
npm run build
```

Built files will be in the `dist/` directory.

### 3. Project Structure Overview

```
src/
├── components/         # Reusable Vue components
│   ├── chatlist/      # Chat list component
│   ├── message/       # Message display component  
│   ├── text/          # Text input component
│   ├── friendlist/    # Friend list component
│   └── menu/          # Context menus and dialogs
├── page/              # Page-level components
│   ├── login/         # Login page
│   ├── chat/          # Main chat page
│   ├── friend/        # Friend management page
│   └── group/         # Group management
├── websocket/         # WebSocket communication
│   ├── handler/       # Message handlers
│   ├── message/       # Message types
│   ├── model/         # Data models
│   └── utils/         # Utility functions
├── webrtc/            # WebRTC voice/video calling
├── router/            # Vue Router configuration
├── constant/          # Application constants
└── assets/            # Static assets
```

## Basic Usage

### 1. User Authentication

The application uses phone number + SMS verification code authentication:

```javascript
// Demo credentials (for testing)
const demoCredentials = {
  phone: '13800000000', // or 13800000001, 13800000002
  verifyCode: '556677'
}
```

### 2. Sending Messages

#### Text Message
```javascript
import TextMessageContent from '@/websocket/message/textMessageContent'
import SendMessage from '@/websocket/message/sendMessage'

// Create text message
const textContent = new TextMessageContent('Hello World!')
const sendMessage = new SendMessage('targetUserId', textContent)

// Send via Vuex store
this.$store.dispatch('sendMessage', sendMessage)
```

#### Image Message
```javascript
import ImageMessageContent from '@/websocket/message/imageMessageContent'

// Create image message
const imageContent = new ImageMessageContent()
imageContent.localPath = '/path/to/image.jpg'
imageContent.remoteMediaUrl = 'https://example.com/image.jpg'

const sendMessage = new SendMessage('targetUserId', imageContent)
this.$store.dispatch('sendMessage', sendMessage)
```

### 3. Voice/Video Calls

```javascript
// Access VoIP client from store
const voipClient = this.$store.state.voipClient

// Start video call
voipClient.startCall('targetUserId', false)

// Start audio call  
voipClient.startCall('targetUserId', true)

// Answer incoming call
voipClient.answerCall(false) // with video
voipClient.answerCall(true)  // audio only

// End call
voipClient.cancelCall()
```

### 4. Friend Management

```javascript
// Add friend
this.$store.dispatch('addFriend', 'targetUserId')

// Accept friend request
this.$store.dispatch('handleFriendRequest', {
  userId: 'requesterId',
  accept: true
})

// Search for users
this.$store.dispatch('searchUser', 'phoneNumber')
```

### 5. Group Management

```javascript
// Create group
this.$store.dispatch('createGroup', {
  memberIds: ['user1', 'user2'],
  groupName: 'My Group'
})

// Add members
this.$store.dispatch('addGroupMembers', {
  groupId: 'groupId',
  memberIds: ['user3']
})

// Leave group
this.$store.dispatch('quitGroup', 'groupId')
```

## Common Development Tasks

### 1. Adding a New Message Type

#### Step 1: Create Message Content Class

```javascript
// src/websocket/message/customMessageContent.js
import MessageContent from './messageContent'

export default class CustomMessageContent extends MessageContent {
  constructor(customData) {
    super()
    this.type = 999 // Custom type number
    this.customData = customData
    this.searchableContent = customData.toString()
  }
  
  encode() {
    return {
      type: this.type,
      customData: this.customData
    }
  }
  
  static decode(data) {
    const content = new CustomMessageContent(data.customData)
    return content
  }
}
```

#### Step 2: Register Message Type

```javascript
// src/websocket/message/messageConfig.js
import CustomMessageContent from './customMessageContent'

// Add to message type mapping
const messageTypes = {
  // ... existing types
  999: CustomMessageContent
}
```

#### Step 3: Add UI Component

```vue
<!-- In message component template -->
<div v-if="item.content.type === 999" class="custom-message">
  {{ item.content.customData }}
</div>
```

### 2. Adding a New Component

#### Step 1: Create Component File

```vue
<!-- src/components/custom/customComponent.vue -->
<template>
  <div class="custom-component">
    <h3>{{ title }}</h3>
    <p>{{ content }}</p>
    <button @click="handleClick">Click Me</button>
  </div>
</template>

<script>
export default {
  name: 'CustomComponent',
  props: {
    title: String,
    content: String
  },
  methods: {
    handleClick() {
      this.$emit('custom-event', { data: 'example' })
    }
  }
}
</script>

<style scoped>
.custom-component {
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
```

#### Step 2: Register Component

```javascript
// In parent component
import CustomComponent from '@/components/custom/customComponent'

export default {
  components: {
    CustomComponent
  }
}
```

#### Step 3: Use Component

```vue
<template>
  <CustomComponent 
    :title="componentTitle"
    :content="componentContent"
    @custom-event="handleCustomEvent"
  />
</template>
```

### 3. Adding WebSocket Message Handler

#### Step 1: Create Handler Class

```javascript
// src/websocket/handler/customHandler.js
import AbstractMessageHandler from './abstractmessagehandler'

export default class CustomHandler extends AbstractMessageHandler {
  handle(webSocketClient, protoMessage) {
    try {
      // Parse message data
      const data = JSON.parse(protoMessage.content)
      
      // Process the message
      this.processCustomMessage(data)
      
      // Update UI if needed
      this.updateUI(data)
      
      return true
    } catch (error) {
      console.error('Custom handler error:', error)
      return false
    }
  }
  
  processCustomMessage(data) {
    // Custom processing logic
  }
  
  updateUI(data) {
    // Update UI based on message
  }
}
```

#### Step 2: Register Handler

```javascript
// src/websocket/index.js
import CustomHandler from './handler/customHandler'

export default class VueWebSocket {
  initHandlerList() {
    // ... existing handlers
    this.handlerList.push(new CustomHandler())
  }
}
```

### 4. Customizing UI Theme

#### Step 1: Update CSS Variables

```css
/* src/assets/styles/variables.css */
:root {
  --primary-color: #1989fa;
  --secondary-color: #f7f8fa;
  --text-color: #323233;
  --border-color: #ebedf0;
  --success-color: #07c160;
  --warning-color: #ff976a;
  --error-color: #ee0a24;
}
```

#### Step 2: Apply Custom Styles

```vue
<style scoped>
.chat-container {
  background-color: var(--secondary-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.send-button {
  background-color: var(--primary-color);
  color: white;
}
</style>
```

### 5. Adding State Management

#### Step 1: Define State

```javascript
// src/store.js
const state = {
  // ... existing state
  customData: {},
  customList: []
}
```

#### Step 2: Add Mutations

```javascript
const mutations = {
  // ... existing mutations
  SET_CUSTOM_DATA(state, data) {
    state.customData = data
  },
  
  ADD_TO_CUSTOM_LIST(state, item) {
    state.customList.push(item)
  }
}
```

#### Step 3: Add Actions

```javascript
const actions = {
  // ... existing actions
  async fetchCustomData({ commit }) {
    try {
      const response = await api.getCustomData()
      commit('SET_CUSTOM_DATA', response.data)
    } catch (error) {
      console.error('Failed to fetch custom data:', error)
    }
  }
}
```

#### Step 4: Use in Component

```javascript
export default {
  computed: {
    ...mapState(['customData', 'customList'])
  },
  
  methods: {
    ...mapActions(['fetchCustomData']),
    
    async loadData() {
      await this.fetchCustomData()
    }
  },
  
  async created() {
    await this.loadData()
  }
}
```

## Troubleshooting

### Common Issues

#### 1. WebSocket Connection Failed

**Symptoms:** Application shows "Connection Error" or fails to connect

**Solutions:**
- Check WebSocket server configuration in `src/constant/index.js`
- Verify server is running and accessible
- Check browser console for detailed error messages
- Ensure firewall allows WebSocket connections

#### 2. Login Failed

**Symptoms:** Login button doesn't work or shows error

**Solutions:**
- Use demo credentials: phone `13800000000`, code `556677`
- Check HTTP API configuration in constants
- Verify API server is running
- Check browser network tab for HTTP errors

#### 3. Messages Not Sending

**Symptoms:** Messages appear stuck in "sending" state

**Solutions:**
- Check WebSocket connection status
- Verify message content format
- Check browser console for JavaScript errors
- Ensure user is properly authenticated

#### 4. Video Calls Not Working

**Symptoms:** Video calls fail to connect or show black screen

**Solutions:**
- Check browser permissions for camera/microphone
- Ensure HTTPS is used (required for WebRTC)
- Verify WebRTC support in browser
- Check browser console for WebRTC errors

#### 5. File Upload Fails

**Symptoms:** Image/video uploads don't work

**Solutions:**
- Check upload configuration (Qiniu vs Minio)
- Verify upload tokens are valid
- Check file size limits
- Ensure proper CORS configuration

### Debug Mode

Enable debug logging by adding to browser console:

```javascript
// Enable WebSocket debug logging
localStorage.setItem('debug', 'websocket')

// Enable all debug logging
localStorage.setItem('debug', '*')
```

### Browser Developer Tools

1. **Console Tab:** Check for JavaScript errors
2. **Network Tab:** Monitor WebSocket connections and HTTP requests
3. **Application Tab:** Check localStorage for authentication tokens
4. **Sources Tab:** Set breakpoints for debugging

## Next Steps

### 1. Explore Documentation

- [Full API Documentation](./API_DOCUMENTATION.md)
- [Component Reference](./COMPONENT_REFERENCE.md)
- [WebSocket & WebRTC API](./WEBSOCKET_WEBRTC_API.md)

### 2. Customization

- Modify UI components to match your design
- Add custom message types
- Integrate with your authentication system
- Add custom business logic

### 3. Deployment

- Configure production WebSocket/HTTP endpoints
- Set up file upload service (Qiniu or Minio)
- Configure SSL certificates
- Set up monitoring and logging

### 4. Advanced Features

- Implement message encryption
- Add push notifications
- Integrate with mobile apps
- Add bot/AI functionality

### 5. Community & Support

- Join QQ Group for discussions
- Check GitHub issues for known problems
- Contribute to the project
- Contact for commercial support

### Example Projects

Check out these related projects for inspiration:

- [Android Client](https://github.com/fsharechat/android-chat)
- [Server Implementation](https://github.com/fsharechat/chat-server-pro)
- [Mobile Web Version](https://github.com/fsharechat/vue-mobile-chat)
- [Desktop App](https://github.com/fsharechat/electron-vue-chat)

### Resources

- [Vue.js Documentation](https://vuejs.org/guide/)
- [Element UI Documentation](https://element.eleme.io/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [WebRTC Documentation](https://webrtc.org/getting-started/)

This quick start guide should help you get up and running with the WeChat-like instant messaging application quickly. For more detailed information, refer to the comprehensive API documentation.