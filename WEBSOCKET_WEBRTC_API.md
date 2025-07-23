# WebSocket & WebRTC API Reference

## Table of Contents

1. [WebSocket API](#websocket-api)
2. [WebRTC API](#webrtc-api)
3. [Message Types](#message-types)
4. [Event Handlers](#event-handlers)
5. [Connection Management](#connection-management)
6. [Error Handling](#error-handling)
7. [Security](#security)
8. [Usage Examples](#usage-examples)

## WebSocket API

### VueWebSocket Class

**File:** `src/websocket/index.js`

The main WebSocket client that handles real-time communication with the server.

#### Constructor

```javascript
import VueWebSocket from './websocket'

const websocket = new VueWebSocket()
```

The constructor automatically:
- Sets up WebSocket configuration from constants
- Initializes message handlers
- Establishes connection
- Sets up heartbeat mechanism

#### Configuration

```javascript
// Default configuration from constants
{
  ws_protocol: 'wss',
  ip: 'backend-websocket.fsharechat.cn/ws',
  port: 9326,
  heartbeatTimeout: 25000, // 25 seconds
  reconnectInterval: 30000, // 30 seconds
  binaryType: 'blob'
}
```

#### Core Methods

##### `connect(isReconnect: boolean): void`

Establishes WebSocket connection.

**Parameters:**
- `isReconnect` (boolean) - Whether this is a reconnection attempt

**Example:**
```javascript
websocket.connect(false) // Initial connection
websocket.connect(true)  // Reconnection
```

##### `sendMessage(message: ProtoMessage): void`

Sends a message through WebSocket.

**Parameters:**
- `message` (ProtoMessage) - Protobuf message to send

**Example:**
```javascript
const message = new ProtoMessage()
message.signal = 'MP'
message.content = messageContent
websocket.sendMessage(message)
```

##### `sendConnectMessage(): void`

Sends initial connection message with authentication.

```javascript
// Automatically called after WebSocket connection opens
websocket.sendConnectMessage()
```

##### `processMessage(data: string): void`

Processes incoming WebSocket messages.

**Parameters:**
- `data` (string) - Raw message data from WebSocket

##### `ping(): void`

Sends heartbeat ping to keep connection alive.

```javascript
// Automatically called every 25 seconds
websocket.ping()
```

##### `disconnect(): void`

Closes WebSocket connection gracefully.

```javascript
websocket.disconnect()
```

### WebSocket Events

#### Connection Events

```javascript
// Connection established
websocket.ws.onopen = (event) => {
  console.log('WebSocket connected')
  // Send authentication
  websocket.sendConnectMessage()
}

// Connection closed
websocket.ws.onclose = (event) => {
  console.log('WebSocket disconnected')
  // Attempt reconnection
  if (!websocket.userDisconnect) {
    setTimeout(() => websocket.connect(true), websocket.reconnectInterval)
  }
}

// Connection error
websocket.ws.onerror = (error) => {
  console.error('WebSocket error:', error)
}
```

#### Message Events

```javascript
// Incoming message
websocket.ws.onmessage = (event) => {
  websocket.processMessage(event.data)
}
```

### Message Signals

#### Core Signals

| Signal | Description | Direction | Example |
|--------|-------------|-----------|---------|
| CONNECT | Initial connection | Client → Server | Authentication |
| CONNECT_ACK | Connection acknowledgment | Server → Client | Connection confirmed |
| PUBLISH | General message publish | Bidirectional | Any message type |
| PUB_ACK | Publish acknowledgment | Server → Client | Message received |
| DISCONNECT | Disconnect notification | Client → Server | Clean disconnect |

#### Sub-signals

| Sub-signal | Description | Usage |
|------------|-------------|-------|
| MP | Message Push | Incoming chat messages |
| MS | Message Status | Message delivery status |
| MN | Message Notification | System notifications |
| MR | Message Recall | Message recall notifications |
| FP | Friend Profile | Friend information updates |
| FALS | Friend Add List | Friend add request list |
| FRP | Friend Request Process | Friend request handling |
| FAR | Friend Add Request | Send friend request |
| FRN | Friend Request Notification | Incoming friend requests |
| FHR | Friend Handle Request | Handle friend request |
| FN | Friend Notification | Friend status updates |
| GPGI | Get Group Info | Group information request |
| GPGM | Get Group Members | Group member list request |
| GC | Group Create | Create new group |
| GAM | Group Add Member | Add member to group |
| GKM | Group Kick Member | Remove member from group |
| GQ | Group Quit | Leave group |
| GD | Group Dismiss | Dismiss group |
| GMI | Group Member Info | Group member information |
| US | User Search | Search for users |
| UPUI | Update User Info | Update user profile |
| MMI | Modify My Info | Modify own profile |
| GQNUT | Get Qiniu Upload Token | File upload token |
| GMURL | Get Minio Upload URL | Minio upload URL |

### Message Handlers

#### AbstractMessageHandler

Base class for all message handlers.

```javascript
export default class AbstractMessageHandler extends MessageHandler {
  handle(webSocketClient: VueWebSocket, protoMessage: ProtoMessage): boolean
}
```

#### Specific Handlers

##### ConnectAckHandler

Handles connection acknowledgment.

```javascript
export default class ConnectAckHandler extends AbstractMessageHandler {
  handle(webSocketClient, protoMessage) {
    // Process connection acknowledgment
    // Update connection status
    // Load initial data (friends, conversations)
    return true
  }
}
```

##### ReceiveMessageHandler

Handles incoming chat messages.

```javascript
export default class ReceiveMessageHandler extends AbstractMessageHandler {
  handle(webSocketClient, protoMessage) {
    // Parse message content
    // Add to conversation
    // Update UI
    // Show notification if needed
    return true
  }
}
```

##### SendMessageHandler

Handles message sending confirmations.

```javascript
export default class SendMessageHandler extends AbstractMessageHandler {
  handle(webSocketClient, protoMessage) {
    // Update message status
    // Resolve promise if waiting
    return true
  }
}
```

##### GetFriendResultHandler

Handles friend list responses.

```javascript
export default class GetFriendResultHandler extends AbstractMessageHandler {
  handle(webSocketClient, protoMessage) {
    // Process friend list
    // Update store
    return true
  }
}
```

## WebRTC API

### VoipClient Class

**File:** `src/webrtc/voipclient.js`

Main class for voice/video calling functionality using WebRTC.

#### Constructor

```javascript
import VoipClient from './webrtc/voipclient'

const voipClient = new VoipClient(store)
```

**Parameters:**
- `store` (Vuex Store) - Vuex store instance for state management

#### Core Methods

##### `startCall(target: string, isAudioOnly: boolean): void`

Initiates a voice or video call.

**Parameters:**
- `target` (string) - User ID to call
- `isAudioOnly` (boolean) - Whether this is audio-only call

**Example:**
```javascript
// Start video call
voipClient.startCall('user123', false)

// Start audio call
voipClient.startCall('user123', true)
```

##### `answerCall(audioOnly: boolean): void`

Answers an incoming call.

**Parameters:**
- `audioOnly` (boolean) - Whether to answer with audio only

**Example:**
```javascript
// Answer with video
voipClient.answerCall(false)

// Answer audio only
voipClient.answerCall(true)
```

##### `cancelCall(): void`

Cancels an outgoing call or ends current call.

```javascript
voipClient.cancelCall()
```

##### `setCurrentSessionCallback(callback: SessionCallback): void`

Sets callback for session events.

**Parameters:**
- `callback` (SessionCallback) - Callback object with event handlers

**Example:**
```javascript
voipClient.setCurrentSessionCallback({
  onCallStarted: () => console.log('Call started'),
  onCallConnected: () => console.log('Call connected'),
  onCallEnded: (reason) => console.log('Call ended:', reason),
  onRemoteStreamReceived: (stream) => {
    // Handle remote video/audio stream
    const remoteVideo = document.getElementById('remoteVideo')
    remoteVideo.srcObject = stream
  }
})
```

##### `setCurrentEngineCallback(callback: EngineCallback): void`

Sets callback for WebRTC engine events.

**Parameters:**
- `callback` (EngineCallback) - Engine callback object

### CallSession Class

**File:** `src/webrtc/callSession.js`

Represents an active call session.

#### Properties

```javascript
export default class CallSession {
  clientId: string        // Target user ID
  audioOnly: boolean      // Audio-only flag
  callId: string         // Unique call identifier
  sessionCallback: SessionCallback
  state: number          // Current call state
  startTime: number      // Call start timestamp
}
```

#### Methods

##### `setState(state: number): void`

Updates call state.

**Parameters:**
- `state` (number) - New call state from CallState enum

##### `endCall(reason: number): void`

Ends the call session.

**Parameters:**
- `reason` (number) - End reason from CallEndReason enum

### Call States

**File:** `src/webrtc/callState.js`

```javascript
export default class CallState {
  static STATUS_IDLE = 0       // No active call
  static STATUS_OUTGOING = 1   // Outgoing call
  static STATUS_INCOMING = 2   // Incoming call
  static STATUS_CONNECTING = 3 // Call connecting
  static STATUS_CONNECTED = 4  // Call connected
}
```

### Call End Reasons

**File:** `src/webrtc/callEndReason.js`

```javascript
export default class CallEndReason {
  static REASON_LocalHangup = 0     // Local user hung up
  static REASON_RemoteHangup = 1    // Remote user hung up
  static REASON_RemoteBusy = 2      // Remote user busy
  static REASON_RemoteReject = 3    // Remote user rejected
  static REASON_RemoteTimeout = 4   // Call timeout
  static REASON_NetworkError = 5    // Network error
}
```

### WebRTC Message Types

#### CallStartMessageContent

Initiates a call.

```javascript
export default class CallStartMessageContent extends MessageContent {
  constructor(callId, target, isAudioOnly) {
    super()
    this.callId = callId
    this.target = target
    this.isAudioOnly = isAudioOnly
  }
}
```

#### CallAnswerMessageContent

Answers a call (for caller).

```javascript
export default class CallAnswerMessageContent extends MessageContent {
  constructor() {
    super()
    this.callId = ''
    this.sdp = ''  // Session Description Protocol
  }
}
```

#### CallAnswerTMessageContent

Answers a call (for callee).

```javascript
export default class CallAnswerTMessageContent extends MessageContent {
  constructor() {
    super()
    this.callId = ''
    this.isAudioOnly = false
  }
}
```

#### CallSignalMessageContent

WebRTC signaling message.

```javascript
export default class CallSignalMessageContent extends MessageContent {
  constructor() {
    super()
    this.callId = ''
    this.candidate = ''  // ICE candidate
    this.sdp = ''        // Session description
  }
}
```

#### CallByeMessageContent

Ends a call.

```javascript
export default class CallByeMessageContent extends MessageContent {
  constructor() {
    super()
    this.callId = ''
  }
}
```

## Message Types

### MessageContent Base Class

**File:** `src/websocket/message/messageContent.js`

```javascript
export default class MessageContent {
  constructor() {
    this.type = 0              // Message type
    this.searchableContent = '' // Searchable text content
    this.pushContent = ''       // Push notification content
    this.mentionedType = 0      // Mention type
    this.mentionedTargets = []  // Mentioned user IDs
    this.extra = ''             // Extra data
  }
  
  digest() {
    // Returns message summary for display
    return this.searchableContent
  }
  
  encode() {
    // Encodes message for transmission
    return {}
  }
  
  static decode(data) {
    // Decodes received message data
    return new MessageContent()
  }
}
```

### Text Message

```javascript
export default class TextMessageContent extends MessageContent {
  constructor(text) {
    super()
    this.type = 1
    this.text = text
    this.searchableContent = text
  }
}
```

### Image Message

```javascript
export default class ImageMessageContent extends MediaMessageContent {
  constructor() {
    super()
    this.type = 3
    this.localPath = ''      // Local file path
    this.remoteMediaUrl = '' // Remote URL after upload
    this.thumbnailUrl = ''   // Thumbnail URL
    this.width = 0          // Image width
    this.height = 0         // Image height
  }
}
```

### Video Message

```javascript
export default class VideoMessageContent extends MediaMessageContent {
  constructor() {
    super()
    this.type = 6
    this.localPath = ''      // Local file path
    this.remoteMediaUrl = '' // Remote URL after upload
    this.thumbnailUrl = ''   // Thumbnail URL
    this.duration = 0        // Video duration in seconds
    this.width = 0          // Video width
    this.height = 0         // Video height
  }
}
```

### Message Types Enum

```javascript
export default class MessageContentType {
  static Unknown = 0
  static Text = 1
  static Voice = 2
  static Image = 3
  static Location = 4
  static File = 5
  static Video = 6
  static Sticker = 7
  static ImageText = 8
  static Card = 9
  static Tip = 90
  static Call = 400
}
```

## Event Handlers

### Message Event Handling

```javascript
// Register message handler
websocket.handlerList.push(new ReceiveMessageHandler())

// Handler implementation
export default class ReceiveMessageHandler extends AbstractMessageHandler {
  handle(webSocketClient, protoMessage) {
    try {
      // Parse message
      const message = this.parseMessage(protoMessage)
      
      // Add to conversation
      this.addMessageToConversation(message)
      
      // Update UI
      this.updateUI(message)
      
      // Show notification
      this.showNotification(message)
      
      return true
    } catch (error) {
      Logger.error('Failed to handle message:', error)
      return false
    }
  }
}
```

### Call Event Handling

```javascript
// Set call callbacks
voipClient.setCurrentSessionCallback({
  onCallStarted() {
    // Update UI to show outgoing call
    store.commit('SET_CALL_STATE', CallState.STATUS_OUTGOING)
  },
  
  onCallConnected() {
    // Update UI to show connected call
    store.commit('SET_CALL_STATE', CallState.STATUS_CONNECTED)
  },
  
  onCallEnded(reason) {
    // Clean up call UI
    store.commit('SET_CALL_STATE', CallState.STATUS_IDLE)
    
    // Show end reason if needed
    if (reason !== CallEndReason.REASON_LocalHangup) {
      this.showCallEndReason(reason)
    }
  },
  
  onRemoteStreamReceived(stream) {
    // Display remote video/audio
    const remoteVideo = document.getElementById('remoteVideo')
    if (remoteVideo) {
      remoteVideo.srcObject = stream
    }
  }
})
```

## Connection Management

### Connection Lifecycle

```javascript
// Connection establishment
websocket.connect(false)

// Authentication
websocket.sendConnectMessage()

// Heartbeat
setInterval(() => websocket.ping(), 25000)

// Reconnection
websocket.ws.onclose = () => {
  if (!websocket.userDisconnect) {
    setTimeout(() => websocket.connect(true), 30000)
  }
}
```

### Connection States

```javascript
const ConnectionState = {
  DISCONNECTED: 0,
  CONNECTING: 1,
  CONNECTED: 2,
  RECONNECTING: 3,
  FAILED: 4
}
```

### Automatic Reconnection

```javascript
export default class VueWebSocket {
  attemptReconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        this.connect(true)
      }, this.reconnectInterval * this.reconnectAttempts)
    }
  }
}
```

## Error Handling

### WebSocket Errors

```javascript
websocket.ws.onerror = (error) => {
  Logger.error('WebSocket error:', error)
  
  // Show user notification
  this.$notify.error({
    title: 'Connection Error',
    message: 'Unable to connect to server. Retrying...'
  })
  
  // Attempt reconnection
  this.attemptReconnection()
}
```

### Message Handling Errors

```javascript
export default class AbstractMessageHandler {
  handle(webSocketClient, protoMessage) {
    try {
      return this.handleMessage(webSocketClient, protoMessage)
    } catch (error) {
      Logger.error(`Handler ${this.constructor.name} failed:`, error)
      
      // Report error to monitoring
      this.reportError(error)
      
      return false
    }
  }
}
```

### WebRTC Errors

```javascript
voipClient.myPeerConnection.onerror = (error) => {
  Logger.error('WebRTC error:', error)
  
  // End call on error
  voipClient.cancelCall()
  
  // Show error message
  this.$message.error('Call failed due to network error')
}
```

## Security

### Authentication

```javascript
// WebSocket authentication
const connectMessage = {
  signal: 'CONNECT',
  userId: LocalStore.getUserId(),
  token: LocalStore.getToken(),
  deviceId: LocalStore.getDeviceId(),
  clientVersion: '1.0.14'
}

websocket.sendMessage(connectMessage)
```

### Message Encryption

```javascript
import { encrypt, decrypt } from './utils/aes'

// Encrypt outgoing message
const encryptedContent = encrypt(messageContent, encryptionKey)

// Decrypt incoming message  
const decryptedContent = decrypt(encryptedData, encryptionKey)
```

### Token Management

```javascript
export default class LocalStore {
  static setToken(token) {
    localStorage.setItem(KEY_VUE_TOKEN, token)
  }
  
  static getToken() {
    return localStorage.getItem(KEY_VUE_TOKEN)
  }
  
  static clearToken() {
    localStorage.removeItem(KEY_VUE_TOKEN)
  }
}
```

## Usage Examples

### Complete WebSocket Setup

```javascript
import VueWebSocket from '@/websocket'
import store from '@/store'

// Initialize WebSocket
const websocket = new VueWebSocket()

// Set up event listeners
websocket.on('connected', () => {
  console.log('Connected to server')
  store.commit('SET_CONNECTION_STATUS', 'connected')
})

websocket.on('disconnected', () => {
  console.log('Disconnected from server')
  store.commit('SET_CONNECTION_STATUS', 'disconnected')
})

websocket.on('message', (message) => {
  store.dispatch('handleIncomingMessage', message)
})

// Connect
websocket.connect(false)
```

### Send Text Message

```javascript
import TextMessageContent from '@/websocket/message/textMessageContent'
import SendMessage from '@/websocket/message/sendMessage'

const textContent = new TextMessageContent('Hello World!')
const sendMessage = new SendMessage('targetUserId', textContent)

// Send via store action
this.$store.dispatch('sendMessage', sendMessage)

// Or send directly
websocket.sendMessage(sendMessage.toProtoMessage())
```

### WebRTC Call Implementation

```javascript
// Initialize VoIP client
const voipClient = new VoipClient(this.$store)

// Set up callbacks
voipClient.setCurrentSessionCallback({
  onCallStarted: () => {
    this.showCallUI()
  },
  
  onCallConnected: () => {
    this.updateCallTimer()
  },
  
  onCallEnded: (reason) => {
    this.hideCallUI()
    this.showCallEndMessage(reason)
  },
  
  onRemoteStreamReceived: (stream) => {
    this.$refs.remoteVideo.srcObject = stream
  }
})

// Start call
voipClient.startCall('targetUserId', false) // video call

// Answer call
voipClient.answerCall(false) // answer with video

// End call
voipClient.cancelCall()
```

### File Upload Integration

```javascript
// Get upload URL
this.$store.dispatch('getMinioUploadUrl', {
  fileName: file.name,
  contentType: file.type
}).then(uploadUrl => {
  // Upload file
  return this.uploadFile(file, uploadUrl)
}).then(fileUrl => {
  // Send image message
  const imageContent = new ImageMessageContent()
  imageContent.remoteMediaUrl = fileUrl
  
  const sendMessage = new SendMessage(targetId, imageContent)
  this.$store.dispatch('sendMessage', sendMessage)
})
```

This comprehensive API reference covers all aspects of the WebSocket and WebRTC implementations, providing developers with the information needed to understand and extend the real-time communication features.