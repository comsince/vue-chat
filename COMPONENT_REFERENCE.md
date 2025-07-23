# Vue Component Reference Guide

## Table of Contents

1. [Core Communication Components](#core-communication-components)
2. [UI Components](#ui-components)
3. [Menu Components](#menu-components)
4. [Page Components](#page-components)
5. [Component Props Reference](#component-props-reference)
6. [Component Events Reference](#component-events-reference)
7. [Component Methods Reference](#component-methods-reference)

## Core Communication Components

### ChatList Component

**File:** `src/components/chatlist/chatlist.vue`

**Description:** Displays the list of conversations/chats with unread count and last message preview.

**Template Usage:**
```vue
<chatlist />
```

**Computed Properties:**
- `searchedConversationList` - Filtered list of conversations based on search text
- `isEmptyConversation` - Boolean indicating if conversation list is empty

**Methods:**
- `selectConversation(target: string)` - Selects a conversation and switches to it
- `processageGroupMessage(item)` - Formats group message display text
- `getDisplayName(from: string)` - Gets display name for user

**Vuex Dependencies:**
- State: `selectId`, `selectTarget`, `searchText`, `appHeight`, `userInfoList`, `emptyMessage`
- Actions: `selectSession`, `selectConversation`
- Getters: `searchedConversationList`

**Example:**
```vue
<template>
  <div class="chat-container">
    <chatlist />
  </div>
</template>

<script>
import chatlist from '@/components/chatlist/chatlist'

export default {
  components: {
    chatlist
  }
}
</script>
```

### Message Component

**File:** `src/components/message/message.vue`

**Description:** Displays messages in the selected conversation with support for text, images, videos, and call messages.

**Template Usage:**
```vue
<message />
```

**Computed Properties:**
- `selectedChat` - Currently selected conversation data
- `isSingleConversation` - Boolean indicating if this is a 1-on-1 chat
- `showGroupInfo` - Boolean for showing group info panel
- `avatarSrc(item)` - Returns avatar URL for message sender

**Methods:**
- `messageRigthClick(messageId: string)` - Handles right-click context menu
- `scrollEvent()` - Handles scroll for loading message history
- `messageBoxClick()` - Handles click on message area
- `isShowTime(index, messages)` - Determines if timestamp should be shown
- `isGroupNotification(item)` - Checks if message is a group notification
- `isRecallNotification(item)` - Checks if message is a recall notification
- `notificationContent(item)` - Formats notification message content
- `showUserName(from)` - Gets display name for message sender
- `replaceFace(content)` - Replaces emoji codes with emoji images
- `videoConfig(item, autoPlay, poster)` - Returns video player configuration

**Vuex Dependencies:**
- Uses Vuex store for message data and conversation state

**Example:**
```vue
<template>
  <div class="message-container">
    <message />
  </div>
</template>
```

### Text Input Component

**File:** `src/components/text/text.vue`

**Description:** Text input area for composing and sending messages with emoji support and file attachments.

**Template Usage:**
```vue
<text />
```

**Data Properties:**
- `content` - Current text content
- `showEmoji` - Boolean for emoji panel visibility
- `videoFile` - Selected video file
- `imageFile` - Selected image file

**Methods:**
- `sendMessage(type: number)` - Sends message of specified type
- `selectFile()` - Opens file selection dialog
- `selectVideo()` - Opens video selection dialog
- `selectImage()` - Opens image selection dialog
- `chooseEmoji(item)` - Inserts selected emoji
- `clearContent()` - Clears input content
- `focus()` - Focuses the input area

**Events:**
- `@message-sent` - Emitted when message is successfully sent
- `@file-selected` - Emitted when file is selected

**Example:**
```vue
<template>
  <div class="input-container">
    <text @message-sent="onMessageSent" />
  </div>
</template>

<script>
export default {
  methods: {
    onMessageSent(message) {
      console.log('Message sent:', message)
    }
  }
}
</script>
```

## UI Components

### FriendList Component

**File:** `src/components/friendlist/friendlist.vue`

**Description:** Displays the user's friend list with search functionality.

**Template Usage:**
```vue
<friendlist />
```

**Computed Properties:**
- `searchFriendList` - Filtered friend list based on search text

**Methods:**
- `selectFriend(friend)` - Selects a friend and starts conversation

**Vuex Dependencies:**
- State: `friendlist`, `searchText`

### Search Component

**File:** `src/components/search/search.vue`

**Description:** Search input component for filtering conversations and friends.

**Template Usage:**
```vue
<search />
```

**Methods:**
- `searchTextChange()` - Handles search text changes
- `clearSearch()` - Clears search input

**Events:**
- `@search-change` - Emitted when search text changes

## Menu Components

### GroupInfo Component

**File:** `src/components/menu/groupInfo.vue`

**Description:** Displays and manages group information, members, and settings.

**Props:**
- `targetId` (String, required) - Group ID to display information for

**Template Usage:**
```vue
<groupInfo :targetId="groupId" />
```

**Computed Properties:**
- `currentGroup` - Current group information
- `groupMembers` - List of group members
- `isGroupOwner` - Boolean indicating if current user is group owner

**Methods:**
- `dismissGroup()` - Dismisses the group (owner only)
- `quitGroup()` - Leaves the group
- `addGroupMember()` - Opens member addition dialog
- `kickGroupMember(member)` - Removes member from group
- `modifyGroupName()` - Changes group name
- `showMemberProfile(member)` - Shows member profile

**Events:**
- `@group-dismissed` - Emitted when group is dismissed
- `@member-added` - Emitted when member is added
- `@member-removed` - Emitted when member is removed

**Example:**
```vue
<template>
  <groupInfo 
    :targetId="selectedGroupId"
    @group-dismissed="onGroupDismissed"
    @member-added="onMemberAdded"
  />
</template>

<script>
export default {
  data() {
    return {
      selectedGroupId: 'group123'
    }
  },
  methods: {
    onGroupDismissed() {
      this.$router.push('/conversation')
    },
    onMemberAdded(member) {
      console.log('Member added:', member)
    }
  }
}
</script>
```

### RightMenu Component

**File:** `src/components/menu/rightMenu.vue`

**Description:** Context menu for message actions (delete, recall, forward).

**Props:**
- `message` (Object, required) - Message object to show menu for

**Template Usage:**
```vue
<rightMenu :message="selectedMessage" />
```

**Methods:**
- `deleteMessage()` - Deletes the message locally
- `recallMessage()` - Recalls the message (removes for all users)
- `forwardMessage()` - Opens forward message dialog
- `copyMessage()` - Copies message text to clipboard

**Events:**
- `@message-deleted` - Emitted when message is deleted
- `@message-recalled` - Emitted when message is recalled
- `@message-forwarded` - Emitted when message is forwarded

### PersonalCard Component

**File:** `src/components/menu/personalCard.vue`

**Description:** Displays user profile card with actions.

**Props:**
- `userId` (String, required) - User ID to display profile for

**Template Usage:**
```vue
<personalCard :userId="friendId" />
```

**Methods:**
- `sendMessage()` - Starts conversation with user
- `addFriend()` - Sends friend request
- `deleteFriend()` - Removes friend
- `setAlias()` - Sets friend alias/nickname

## Page Components

### Login Page

**File:** `src/page/login/login.vue`

**Description:** User authentication page with phone number and verification code.

**Template Usage:**
```vue
<login />
```

**Data Properties:**
- `phoneNumber` - User's phone number
- `verifyCode` - SMS verification code
- `loading` - Loading state during authentication

**Methods:**
- `sendVerifyCode()` - Sends SMS verification code
- `login()` - Performs login with phone and code
- `validatePhone()` - Validates phone number format

**Events:**
- `@login-success` - Emitted when login is successful
- `@login-error` - Emitted when login fails

**Example:**
```vue
<template>
  <login 
    @login-success="onLoginSuccess"
    @login-error="onLoginError"
  />
</template>

<script>
export default {
  methods: {
    onLoginSuccess(user) {
      this.$router.push('/conversation')
    },
    onLoginError(error) {
      this.$message.error('Login failed: ' + error.message)
    }
  }
}
</script>
```

### Main Page

**File:** `src/page/main.vue`

**Description:** Main application layout with navigation and content areas.

**Template Usage:**
```vue
<main />
```

**Computed Properties:**
- `currentUser` - Current logged-in user
- `unreadCount` - Total unread message count

**Methods:**
- `switchToConversation()` - Switches to conversation view
- `switchToFriends()` - Switches to friends view
- `logout()` - Logs out the user

### Friend Page

**File:** `src/page/friend/friend.vue`

**Description:** Friend management page with friend list and requests.

**Template Usage:**
```vue
<friend />
```

**Methods:**
- `handleFriendRequest(request, accept)` - Handles incoming friend requests
- `searchFriend()` - Opens friend search dialog

### Chat Page

**File:** `src/page/chat/chat.vue`

**Description:** Main chat interface combining chat list, messages, and input.

**Template Usage:**
```vue
<chat />
</template>
```

**Computed Properties:**
- `hasSelectedConversation` - Boolean indicating if a conversation is selected

### SearchFriend Component

**File:** `src/page/friend/searchfriend.vue`

**Description:** Friend search dialog for finding and adding new friends.

**Template Usage:**
```vue
<searchfriend />
```

**Data Properties:**
- `searchKeyword` - Search keyword (phone number/username)
- `searchResults` - Array of search results
- `loading` - Search loading state

**Methods:**
- `searchUser()` - Searches for users
- `sendFriendRequest(userId)` - Sends friend request to user
- `closeDialog()` - Closes search dialog

**Events:**
- `@friend-request-sent` - Emitted when friend request is sent

### CreateGroup Component

**File:** `src/page/group/creategroup.vue`

**Description:** Group creation dialog for selecting members and creating groups.

**Template Usage:**
```vue
<creategroup />
```

**Data Properties:**
- `groupName` - Name for the new group
- `selectedMembers` - Array of selected member IDs
- `availableFriends` - List of friends that can be added

**Methods:**
- `selectMember(friend)` - Toggles friend selection
- `createGroup()` - Creates the group with selected members
- `cancelCreate()` - Cancels group creation

**Events:**
- `@group-created` - Emitted when group is successfully created

**Example:**
```vue
<template>
  <creategroup @group-created="onGroupCreated" />
</template>

<script>
export default {
  methods: {
    onGroupCreated(group) {
      console.log('Group created:', group)
      this.$store.dispatch('selectConversation', group.id)
    }
  }
}
</script>
```

## Component Props Reference

### Common Props

| Component | Prop | Type | Required | Default | Description |
|-----------|------|------|----------|---------|-------------|
| groupInfo | targetId | String | Yes | - | Group ID to display |
| rightMenu | message | Object | Yes | - | Message object for context menu |
| personalCard | userId | String | Yes | - | User ID for profile display |

### Props Validation Examples

```javascript
// groupInfo component props
props: {
  targetId: {
    type: String,
    required: true,
    validator: (value) => value && value.length > 0
  }
}

// rightMenu component props  
props: {
  message: {
    type: Object,
    required: true,
    validator: (message) => message && message.messageId
  }
}
```

## Component Events Reference

### Event Naming Convention

Events follow the pattern: `action-target` (e.g., `message-sent`, `friend-added`)

| Component | Event | Payload | Description |
|-----------|-------|---------|-------------|
| text | message-sent | `{ content, type, target }` | Message was sent |
| groupInfo | group-dismissed | `{ groupId }` | Group was dismissed |
| groupInfo | member-added | `{ groupId, memberId }` | Member added to group |
| groupInfo | member-removed | `{ groupId, memberId }` | Member removed from group |
| rightMenu | message-deleted | `{ messageId }` | Message was deleted |
| rightMenu | message-recalled | `{ messageId }` | Message was recalled |
| login | login-success | `{ user, token }` | Login successful |
| login | login-error | `{ error }` | Login failed |
| searchfriend | friend-request-sent | `{ userId }` | Friend request sent |
| creategroup | group-created | `{ groupId, groupName }` | Group created |

### Event Usage Examples

```javascript
// Listening to events
<template>
  <text @message-sent="handleMessageSent" />
</template>

<script>
export default {
  methods: {
    handleMessageSent(payload) {
      console.log('Message sent:', payload)
      // payload: { content: 'Hello', type: 1, target: 'user123' }
    }
  }
}
</script>

// Emitting events from component
this.$emit('message-sent', {
  content: this.content,
  type: this.messageType,
  target: this.currentTarget
})
```

## Component Methods Reference

### Public Methods

These methods can be called on component instances via refs:

```javascript
// Get component reference
const textComponent = this.$refs.textInput

// Call public methods
textComponent.focus()
textComponent.clearContent()
textComponent.insertText('Hello World')
```

| Component | Method | Parameters | Returns | Description |
|-----------|--------|------------|---------|-------------|
| text | focus() | - | void | Focuses the input area |
| text | clearContent() | - | void | Clears input content |
| text | insertText(text) | text: string | void | Inserts text at cursor |
| message | scrollToBottom() | - | void | Scrolls to latest message |
| message | loadMoreHistory() | - | Promise | Loads more message history |
| chatlist | refreshList() | - | void | Refreshes conversation list |
| friendlist | refreshFriends() | - | void | Refreshes friend list |

### Component Lifecycle Methods

Components implement standard Vue lifecycle methods:

```javascript
// Example component lifecycle
export default {
  created() {
    // Component instance created
    this.initializeData()
  },
  
  mounted() {
    // Component mounted to DOM
    this.setupEventListeners()
    this.loadInitialData()
  },
  
  beforeDestroy() {
    // Clean up before component destruction
    this.removeEventListeners()
    this.cancelPendingRequests()
  }
}
```

### Component Communication Patterns

#### Parent-Child Communication
```javascript
// Parent component
<template>
  <groupInfo 
    :targetId="groupId"
    @member-added="onMemberAdded"
  />
</template>

// Child component (groupInfo)
export default {
  props: ['targetId'],
  methods: {
    addMember(memberId) {
      // Add member logic...
      this.$emit('member-added', { groupId: this.targetId, memberId })
    }
  }
}
```

#### Sibling Communication via Event Bus
```javascript
// Event bus (can use Vuex instead)
import Vue from 'vue'
export const EventBus = new Vue()

// Component A (sender)
EventBus.$emit('conversation-selected', conversationId)

// Component B (receiver)
EventBus.$on('conversation-selected', (conversationId) => {
  this.loadConversation(conversationId)
})
```

#### Component Communication via Vuex
```javascript
// Component dispatches action
this.$store.dispatch('selectConversation', conversationId)

// Component watches store state
computed: {
  ...mapState(['selectedConversation']),
  ...mapGetters(['currentMessages'])
},

watch: {
  selectedConversation(newConversation) {
    this.loadMessages(newConversation.id)
  }
}
```

This comprehensive component reference provides detailed information about all Vue components in the application, their APIs, and usage patterns.