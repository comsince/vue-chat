# WeChat-like Instant Messaging Application - API Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Core Architecture](#core-architecture)
3. [WebSocket API](#websocket-api)
4. [WebRTC API](#webrtc-api)
5. [Vue Components](#vue-components)
6. [Store Management](#store-management)
7. [Message Types](#message-types)
8. [Utility Classes](#utility-classes)
9. [Usage Examples](#usage-examples)
10. [Configuration](#configuration)

## Project Overview

This is a Vue.js based instant messaging application (类似微信的Web客户端) built on the unverse-push platform. It provides real-time messaging, voice/video calling, friend management, and group chat functionality.

### Tech Stack
- **Frontend**: Vue.js 2.5.2, Element UI, Vuex, Vue Router
- **Real-time Communication**: WebSocket, WebRTC
- **Media**: Video player (xgplayer), Image viewer (v-viewer)
- **Security**: AES encryption (crypto-js)
- **File Upload**: Qiniu Cloud Storage
- **Build Tools**: Webpack, Babel

## Core Architecture

### Main Application Structure
```
src/
├── components/          # Reusable Vue components
├── page/               # Page-level components  
├── websocket/          # WebSocket communication layer
├── webrtc/             # WebRTC voice/video calling
├── constant/           # Application constants
├── router/             # Vue Router configuration
├── assets/             # Static assets
└── store.js            # Vuex store
```

## WebSocket API

### VueWebSocket Class

The main WebSocket client for real-time messaging.

```javascript
import VueWebSocket from './websocket'

// Initialize WebSocket connection
const websocket = new VueWebSocket()
```

#### Methods

##### `connect(isReconnect: boolean)`
Establishes WebSocket connection.

**Parameters:**
- `isReconnect` (boolean): Whether this is a reconnection attempt

**Example:**
```javascript
websocket.connect(true)
```

##### `sendConnectMessage()`
Sends initial connection message with authentication.

##### `processMessage(data: any)`
Processes incoming WebSocket messages.

##### `sendMessage(message: ProtoMessage)`
Sends a message through WebSocket.

**Example:**
```javascript
const message = new ProtoMessage()
message.signal = 'MP'
message.content = messageContent
websocket.sendMessage(message)
```

### Message Handlers

#### GetFriendResultHandler
Handles friend list retrieval responses.

```javascript
export default class GetFriendResultHandler extends AbstractMessageHandler {
    handle(webSocketClient: VueWebSocket, protoMessage: ProtoMessage): boolean
}
```

#### ReceiveMessageHandler  
Handles incoming chat messages.

```javascript
export default class ReceiveMessageHandler extends AbstractMessageHandler {
    handle(webSocketClient: VueWebSocket, protoMessage: ProtoMessage): boolean
}
```

#### SendMessageHandler
Handles message sending confirmations.

### WebSocket Events

The WebSocket client emits and handles various message types:

- `MP` - Message Push (incoming messages)
- `MS` - Message Status updates  
- `FP` - Friend Profile updates
- `GPGI` - Get Group Info
- `GPGM` - Get Group Members
- `US` - User Search results

## WebRTC API

### VoipClient Class

Main class for voice/video calling functionality.

```javascript
import VoipClient from './webrtc/voipclient'

const voipClient = new VoipClient(store)
```

#### Methods

##### `startCall(target: string, isAudioOnly: boolean)`
Initiates a voice or video call.

**Parameters:**
- `target` (string): User ID to call
- `isAudioOnly` (boolean): Whether this is audio-only call

**Example:**
```javascript
voipClient.startCall('user123', false) // Video call
voipClient.startCall('user456', true)  // Audio call
```

##### `answerCall(audioOnly: boolean)`
Answers an incoming call.

**Example:**
```javascript
voipClient.answerCall(false) // Answer with video
```

##### `cancelCall()`
Cancels an outgoing call.

##### `setCurrentSessionCallback(callback: SessionCallback)`
Sets callback for session events.

**Example:**
```javascript
voipClient.setCurrentSessionCallback({
  onCallStarted: () => console.log('Call started'),
  onCallEnded: () => console.log('Call ended')
})
```

### Call Session Management

#### CallSession Class
Represents an active call session.

```javascript
export default class CallSession {
  clientId: string
  audioOnly: boolean  
  callId: string
  sessionCallback: SessionCallback
}
```

#### CallState Enum
```javascript
export default class CallState {
  static STATUS_IDLE = 0
  static STATUS_OUTGOING = 1
  static STATUS_INCOMING = 2
  static STATUS_CONNECTING = 3
  static STATUS_CONNECTED = 4
}
```

## Vue Components

### Core Components

#### `<chatlist>` - Chat List Component

Displays list of conversations.

**Props:** None

**Methods:**
- `selectConversation(target: string)` - Selects a conversation
- `processageGroupMessage(item)` - Formats group message display

**Events:**
- `@conversation-selected` - Emitted when conversation is selected

**Example:**
```vue
<template>
  <chatlist @conversation-selected="onConversationSelected" />
</template>
```

#### `<message>` - Message Display Component  

Displays messages in a conversation.

**Props:** None (uses Vuex store)

**Computed Properties:**
- `selectedChat` - Currently selected conversation
- `isSingleConversation` - Whether this is a 1-on-1 chat

**Methods:**
- `messageRigthClick(messageId)` - Handles message right-click
- `scrollEvent()` - Handles scroll events for loading history

**Example:**
```vue
<template>
  <message />
</template>
```

#### `<text>` - Message Input Component

Text input area for composing messages.

**Props:** None

**Methods:**
- `sendMessage(type)` - Sends a message
- `selectFile()` - Opens file selector
- `selectVideo()` - Opens video selector
- `chooseEmoji(item)` - Inserts emoji

**Events:**
- `@message-sent` - Emitted when message is sent

#### `<friendlist>` - Friend List Component

Displays user's friend list.

**Props:** None

**Methods:**
- `selectFriend(friend)` - Selects a friend

### Menu Components

#### `<groupInfo>` - Group Information Component

Displays and manages group information.

**Props:**
- `targetId` (String) - Group ID

**Methods:**
- `dismissGroup()` - Dismisses the group
- `addGroupMember()` - Adds members to group
- `kickGroupMember(member)` - Removes member from group

**Example:**
```vue
<template>
  <groupInfo :targetId="currentGroupId" />
</template>
```

#### `<rightMenu>` - Context Menu Component

Right-click context menu for messages.

**Props:**
- `message` (Object) - Message object

**Methods:**
- `deleteMessage()` - Deletes message
- `recallMessage()` - Recalls message
- `forwardMessage()` - Forwards message

### Page Components

#### `<login>` - Login Page

User authentication interface.

**Methods:**
- `sendVerifyCode()` - Sends SMS verification code
- `login()` - Performs login

**Example:**
```vue
<template>
  <login @login-success="onLoginSuccess" />
</template>
```

## Store Management

### Vuex Store Structure

The application uses Vuex for state management with the following key state:

```javascript
const state = {
  // User information
  user: Object,
  
  // Friend management
  friendlist: Array,
  friendIds: Array,
  friendDatas: Array,
  
  // Conversations
  conversationList: Array,
  selectTarget: String,
  
  // Messages  
  messageList: Array,
  
  // UI state
  searchText: String,
  appHeight: Number,
  showGroupInfo: Boolean
}
```

### Store Actions

#### `sendMessage(message: SendMessage)`
Sends a message through WebSocket.

**Example:**
```javascript
this.$store.dispatch('sendMessage', {
  target: 'user123',
  content: new TextMessageContent('Hello!')
})
```

#### `selectConversation(target: string)`
Selects a conversation and loads message history.

#### `loadMessageHistory()`
Loads older messages for current conversation.

#### `addFriend(userId: string)`
Sends friend request.

#### `createGroup(memberIds: string[])`
Creates a new group chat.

### Store Getters

#### `searchedConversationList`
Returns filtered conversation list based on search text.

#### `currentConversation`
Returns currently selected conversation.

#### `unreadMessageCount`
Returns total unread message count.

## Message Types

### MessageContent Classes

#### TextMessageContent
```javascript
export default class TextMessageContent extends MessageContent {
  constructor(text: string)
  
  // Properties
  text: string
  searchableContent: string
}
```

#### ImageMessageContent  
```javascript
export default class ImageMessageContent extends MediaMessageContent {
  constructor(localPath?: string)
  
  // Properties
  localPath: string
  remoteMediaUrl: string
  thumbnailUrl: string
}
```

#### VideoMessageContent
```javascript  
export default class VideoMessageContent extends MediaMessageContent {
  constructor(localPath?: string)
  
  // Properties
  localPath: string
  remoteMediaUrl: string
  thumbnailUrl: string
  duration: number
}
```

### Message Status

```javascript
export default class MessageStatus {
  static Sending = 0
  static Sent = 1  
  static Delivered = 2
  static Read = 3
  static Failed = 4
}
```

### Notification Messages

#### RecallMessageNotification
```javascript
export default class RecallMessageNotification extends NotificationMessageContent {
  operatorId: string
  
  formatNotification(): string
}
```

#### GroupNotificationContent
```javascript
export default class GroupNotificationContent extends NotificationMessageContent {
  groupId: string
  operatorId: string
  targets: string[]
}
```

## Utility Classes

### LocalStore
Local storage management utility.

```javascript
export default class LocalStore {
  static getUserId(): string
  static getToken(): string  
  static setUserId(userId: string): void
  static setToken(token: string): void
}
```

### TimeUtils
Time formatting utilities.

```javascript
export default class TimeUtils {
  static getTimeStringAutoShort2(timestamp: number): string
  static formatTime(date: Date): string
}
```

### Logger
Logging utility with different log levels.

```javascript
export default class Logger {
  static log(message: string): void
  static error(message: string): void
  static warn(message: string): void
}
```

### AES Encryption
```javascript
// Encrypt data
export function encrypt(text: string, key: string): string

// Decrypt data  
export function decrypt(encryptedText: string, key: string): string
```

## Usage Examples

### Basic Setup

```javascript
import Vue from 'vue'
import store from './store'
import router from './router'
import VueWebSocket from './websocket'

// Initialize application
const vm = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

// WebSocket connection is auto-established
```

### Sending Messages

```javascript
// Text message
import TextMessageContent from './websocket/message/textMessageContent'
import SendMessage from './websocket/message/sendMessage'

const textContent = new TextMessageContent('Hello World!')
const sendMessage = new SendMessage('targetUserId', textContent)
this.$store.dispatch('sendMessage', sendMessage)

// Image message
import ImageMessageContent from './websocket/message/imageMessageContent'

const imageContent = new ImageMessageContent()
imageContent.localPath = '/path/to/image.jpg'
imageContent.remoteMediaUrl = 'https://example.com/image.jpg'
const sendMessage = new SendMessage('targetUserId', imageContent)
this.$store.dispatch('sendMessage', sendMessage)
```

### Making Voice/Video Calls

```javascript
// Start video call
this.$store.state.voipClient.startCall('targetUserId', false)

// Start audio call  
this.$store.state.voipClient.startCall('targetUserId', true)

// Answer incoming call
this.$store.state.voipClient.answerCall(false)

// End call
this.$store.state.voipClient.cancelCall()
```

### Friend Management

```javascript
// Add friend
this.$store.dispatch('addFriend', 'targetUserId')

// Accept friend request
this.$store.dispatch('handleFriendRequest', {
  userId: 'requesterId',
  accept: true
})

// Set friend alias
this.$store.dispatch('setFriendAlias', {
  userId: 'friendId', 
  alias: 'New Nickname'
})
```

### Group Management

```javascript
// Create group
this.$store.dispatch('createGroup', {
  memberIds: ['user1', 'user2', 'user3'],
  groupName: 'My Group'
})

// Add group members
this.$store.dispatch('addGroupMembers', {
  groupId: 'groupId',
  memberIds: ['user4', 'user5']  
})

// Remove group member
this.$store.dispatch('kickGroupMember', {
  groupId: 'groupId',
  memberId: 'userId'
})

// Leave group
this.$store.dispatch('quitGroup', 'groupId')

// Dismiss group (admin only)
this.$store.dispatch('dismissGroup', 'groupId')
```

### Message History

```javascript
// Load message history
this.$store.dispatch('loadMessageHistory', {
  target: 'conversationId',
  beforeMessageId: 'messageId' // Optional, for pagination
})

// Mark messages as read
this.$store.dispatch('markConversationRead', 'conversationId')
```

### File Upload

```javascript
// Upload to Qiniu (if enabled)
import { UPLOAD_BY_QINIU } from './constant'

if (UPLOAD_BY_QINIU) {
  // Get upload token
  this.$store.dispatch('getUploadToken').then(token => {
    // Use token to upload file
  })
} else {
  // Use built-in Minio upload
  this.$store.dispatch('getMinioUploadUrl', {
    fileName: 'image.jpg',
    contentType: 'image/jpeg'
  })
}
```

## Configuration

### Constants (src/constant/index.js)

```javascript
// WebSocket Configuration
export const WS_PROTOCOL = 'wss'
export const WS_IP = 'backend-websocket.fsharechat.cn/ws'  
export const WS_PORT = 9326
export const HEART_BEAT_INTERVAL = 25 * 1000
export const RECONNECT_INTERVAL = 30 * 1000

// HTTP API Configuration  
export const HTTP_IP = 'backend-http.fsharechat.cn'
export const HTTP_HOST = "https://" + HTTP_IP + "/"
export const LOGIN_API = HTTP_HOST + "login"
export const SNED_VERIFY_CODE_API = HTTP_HOST + "send_code"

// File Upload Configuration
export const UPLOAD_BY_QINIU = false

// Response Codes
export const ERROR_CODE = 400
export const SUCCESS_CODE = 200
```

### Environment Setup

1. **Install Dependencies**
```bash
npm install
```

2. **Development Server**
```bash
npm run dev
```

3. **Production Build**
```bash
npm run build
```

### Browser Requirements

- Modern browsers supporting WebSocket and WebRTC
- Chrome 60+, Firefox 55+, Safari 11+
- Not compatible with IE

### Authentication

The application uses token-based authentication:

1. Send verification code to phone number
2. Login with phone number and verification code  
3. Receive JWT token for subsequent API calls
4. Token is stored in localStorage and sent with WebSocket connection

### Error Handling

The application includes comprehensive error handling:

- Network connection errors
- WebSocket reconnection logic  
- Message delivery failures
- WebRTC connection issues
- File upload errors

Error messages are displayed to users through Element UI notifications.

## Additional Resources

- [Project Repository](https://github.com/fsharechat/vue-chat)
- [Server Documentation](https://github.com/fsharechat/chat-server-pro)
- [Android Client](https://github.com/fsharechat/android-chat)
- [Technical Documentation](https://www.comsince.cn/2020/05/18/universe-push-tech-doc/)

For technical support and commercial licensing, contact QQ: 1282212195