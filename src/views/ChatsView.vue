<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'
import type { Message } from '@/types'

const chatStore = useChatStore()
const userStore = useUserStore()

const messageInput = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const showEmojiPicker = ref(false)
const replyingTo = ref<Message | null>(null)
const editingMessage = ref<Message | null>(null)
const showChatOptions = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

const emojis = ['😊', '😂', '❤️', '👍', '🎉', '🔥', '😍', '🤔', '😎', '💯', '🙌', '✨']

const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDate = (date: Date) => {
  const today = new Date()
  const messageDate = new Date(date)

  if (messageDate.toDateString() === today.toDateString()) {
    return 'Today'
  }

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (messageDate.toDateString() === yesterday.toDateString()) {
    return 'Yesterday'
  }

  return messageDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: messageDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
  })
}

const groupedMessages = computed(() => {
  const groups: { date: string; messages: Message[] }[] = []
  let currentDate = ''

  chatStore.activeChatMessages.forEach((message) => {
    const messageDate = formatDate(message.timestamp)
    if (messageDate !== currentDate) {
      currentDate = messageDate
      groups.push({ date: messageDate, messages: [message] })
    } else {
      const lastGroup = groups[groups.length - 1]
      if (lastGroup) {
        lastGroup.messages.push(message)
      }
    }
  })

  return groups
})

const sendMessage = () => {
  if (!messageInput.value.trim()) return

  if (editingMessage.value) {
    chatStore.editMessage(editingMessage.value.id, messageInput.value)
    editingMessage.value = null
  } else {
    chatStore.sendMessage(messageInput.value)
  }

  messageInput.value = ''
  replyingTo.value = null
  nextTick(() => {
    scrollToBottom()
  })
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const selectChat = (chatId: string) => {
  chatStore.setActiveChat(chatId)
  nextTick(() => {
    scrollToBottom()
  })
}

const addEmoji = (emoji: string) => {
  messageInput.value += emoji
  showEmojiPicker.value = false
}

const startReply = (message: Message) => {
  replyingTo.value = message
}

const startEdit = (message: Message) => {
  editingMessage.value = message
  messageInput.value = message.content
}

const deleteMessage = (messageId: string) => {
  chatStore.deleteMessage(messageId)
}

const reactToMessage = (messageId: string, emoji: string) => {
  chatStore.reactToMessage(messageId, emoji)
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // Check if file is image or video
  const isImage = file.type.startsWith('image/')
  const isVideo = file.type.startsWith('video/')

  if (!isImage && !isVideo) {
    alert('Please select an image or video file')
    return
  }

  // Create a preview URL for the file
  const fileUrl = URL.createObjectURL(file)
  const fileName = file.name

  // Send the message with the file
  const messageType = isImage ? 'image' : 'video'
  chatStore.sendMessage(fileName, messageType, fileUrl)

  // Reset the file input
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }

  nextTick(() => {
    scrollToBottom()
  })
}

const openFileUpload = () => {
  fileInputRef.value?.click()
}

const getChatName = (chat: any) => {
  if (chat.type === 'group') return chat.name
  const otherUserId = chat.participants.find((p: string) => p !== userStore.currentUser.id)
  return userStore.getUserById(otherUserId)?.name || 'Unknown'
}

const getChatAvatar = (chat: any) => {
  if (chat.type === 'group') return chat.avatar
  const otherUserId = chat.participants.find((p: string) => p !== userStore.currentUser.id)
  return userStore.getUserById(otherUserId)?.avatar || ''
}

const getChatStatus = (chat: any) => {
  if (chat.type === 'group') return `${chat.participants.length} members`
  const otherUserId = chat.participants.find((p: string) => p !== userStore.currentUser.id)
  const user = userStore.getUserById(otherUserId)
  return user?.status || 'offline'
}
</script>

<template>
  <div class="chats-view">
    <div class="chat-list-panel">
      <div class="chat-list-header">
        <h2 class="chat-list-title">Messages</h2>
      </div>

      <div class="chat-search">
        <input
          v-model="chatStore.searchQuery"
          type="text"
          placeholder="Search conversations..."
          class="input"
        />
      </div>

      <div class="chat-list">
        <div
          v-for="chat in chatStore.filteredChats"
          :key="chat.id"
          class="chat-item"
          :class="{ active: chatStore.activeChat === chat.id }"
          @click="selectChat(chat.id)"
        >
          <div class="chat-avatar-container">
            <img :src="getChatAvatar(chat)" :alt="getChatName(chat)" class="avatar" />
            <span
              v-if="chat.type === 'private'"
              :class="['status-indicator', `status-${getChatStatus(chat)}`]"
            ></span>
          </div>
          <div class="chat-info">
            <div class="chat-header-row">
              <span class="chat-name">{{ getChatName(chat) }}</span>
              <span v-if="chat.lastMessage" class="chat-time">
                {{ formatTime(chat.lastMessage.timestamp) }}
              </span>
            </div>
            <div class="chat-message-row">
              <span class="chat-last-message">
                <span v-if="chat.isPremiumOnly" class="premium-badge-mini">⭐</span>
                {{ chat.lastMessage?.content || 'No messages yet' }}
              </span>
              <span v-if="chat.unreadCount > 0" class="badge-count">
                {{ chat.unreadCount }}
              </span>
            </div>
          </div>
          <div class="chat-actions">
            <span v-if="chat.isPinned" class="pin-icon">📌</span>
            <span v-if="chat.isMuted" class="mute-icon">🔕</span>
          </div>
        </div>
      </div>
    </div>

    <div class="chat-conversation-panel">
      <div v-if="!chatStore.activeChat" class="empty-state">
        <div class="empty-icon">💭</div>
        <h3>Select a chat to start messaging</h3>
        <p>Choose from your existing conversations or start a new one</p>
      </div>

      <template v-else>
        <div class="chat-header">
          <div class="chat-header-info">
            <img
              :src="getChatAvatar(chatStore.activeChatData)"
              :alt="getChatName(chatStore.activeChatData)"
              class="avatar"
            />
            <div class="chat-header-text">
              <h3 class="chat-header-name">{{ getChatName(chatStore.activeChatData) }}</h3>
              <p class="chat-header-status">
                <template v-if="chatStore.activeChatData?.type === 'group'">
                  {{ chatStore.activeChatData.participants.length }} members
                  <span v-if="chatStore.activeChatData.isPremiumOnly" class="premium-badge-mini">⭐ Premium</span>
                </template>
                <template v-else>
                  {{ getChatStatus(chatStore.activeChatData) }}
                </template>
              </p>
            </div>
          </div>
          <div class="chat-header-actions">
            <button class="btn-icon btn-secondary">🔍</button>
            <button class="btn-icon btn-secondary" @click="showChatOptions = !showChatOptions">⋮</button>
          </div>
        </div>

        <div ref="messagesContainer" class="messages-container">
          <div v-for="group in groupedMessages" :key="group.date" class="message-group">
            <div class="date-divider">
              <span class="date-text">{{ group.date }}</span>
            </div>

            <div
              v-for="message in group.messages"
              :key="message.id"
              :class="[
                'message',
                message.senderId === userStore.currentUser.id ? 'message-sent' : 'message-received'
              ]"
            >
              <img
                v-if="message.senderId !== userStore.currentUser.id"
                :src="userStore.getUserById(message.senderId)?.avatar"
                class="message-avatar avatar-sm"
              />
              <div class="message-content">
                <div
                  v-if="chatStore.activeChatData?.type === 'group' && message.senderId !== userStore.currentUser.id"
                  class="message-sender-name"
                >
                  {{ userStore.getUserById(message.senderId)?.name }}
                </div>
                <div class="message-bubble">
                  <img v-if="message.type === 'image'" :src="message.fileUrl" class="message-image" />
                  <video v-if="message.type === 'video'" :src="message.fileUrl" class="message-video" controls></video>
                  <p v-if="!message.isDeleted && message.type === 'text'" class="message-text">{{ message.content }}</p>
                  <p v-if="!message.isDeleted && (message.type === 'image' || message.type === 'video')" class="message-caption">{{ message.content }}</p>
                  <p v-if="message.isDeleted" class="message-deleted">{{ message.content }}</p>
                  <span v-if="message.isEdited" class="message-edited">edited</span>
                </div>
                <div class="message-footer">
                  <span class="message-time">{{ formatTime(message.timestamp) }}</span>
                  <div v-if="message.reactions && Object.keys(message.reactions).length > 0" class="message-reactions">
                    <span
                      v-for="(users, emoji) in message.reactions"
                      :key="String(emoji)"
                      class="reaction"
                      @click="reactToMessage(message.id, String(emoji))"
                    >
                      {{ emoji }} {{ users.length }}
                    </span>
                  </div>
                </div>
              </div>
              <div
                v-if="message.senderId === userStore.currentUser.id && !message.isDeleted"
                class="message-options"
              >
                <button class="btn-icon-sm" @click="startEdit(message)">✏️</button>
                <button class="btn-icon-sm" @click="deleteMessage(message.id)">🗑️</button>
                <button class="btn-icon-sm" @click="reactToMessage(message.id, '❤️')">❤️</button>
              </div>
            </div>
          </div>
        </div>

        <div class="message-input-container">
          <div v-if="replyingTo" class="replying-to">
            <span>Replying to: {{ replyingTo.content }}</span>
            <button @click="replyingTo = null">✕</button>
          </div>
          <div v-if="editingMessage" class="editing-message">
            <span>Editing message</span>
            <button @click="editingMessage = null; messageInput = ''">✕</button>
          </div>
          <div class="message-input-row">
            <button class="btn-icon btn-secondary" @click="showEmojiPicker = !showEmojiPicker">
              😊
            </button>
            <input
              v-model="messageInput"
              type="text"
              placeholder="Type a message..."
              class="input message-input"
              @keyup.enter="sendMessage"
            />
            <input
              ref="fileInputRef"
              type="file"
              accept="image/*,video/*"
              style="display: none;"
              @change="handleFileUpload"
            />
            <button class="btn-icon btn-secondary" @click="openFileUpload">📎</button>
            <button class="btn-icon btn-primary" @click="sendMessage">
              ➤
            </button>
          </div>
          <div v-if="showEmojiPicker" class="emoji-picker">
            <button
              v-for="emoji in emojis"
              :key="emoji"
              class="emoji-button"
              @click="addEmoji(emoji)"
            >
              {{ emoji }}
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.chats-view {
  display: flex;
  height: 100%;
  overflow: hidden;
}

.chat-list-panel {
  width: 350px;
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-list-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.chat-list-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.chat-search {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.chat-list {
  flex: 1;
  overflow-y: auto;
}

.chat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid var(--border-light);
}

.chat-item:hover {
  background-color: var(--bg-hover);
}

.chat-item.active {
  background-color: var(--bg-hover);
  border-left: 3px solid var(--accent-pink);
}

.chat-avatar-container {
  position: relative;
  flex-shrink: 0;
}

.chat-avatar-container .status-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
}

.chat-info {
  flex: 1;
  min-width: 0;
}

.chat-header-row,
.chat-message-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.chat-name {
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-time {
  font-size: 0.75rem;
  color: var(--text-tertiary);
  flex-shrink: 0;
}

.chat-last-message {
  font-size: 0.875rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.chat-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.pin-icon,
.mute-icon {
  font-size: 0.875rem;
}

.premium-badge-mini {
  font-size: 0.75rem;
  margin-right: 0.25rem;
}

.chat-conversation-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--bg-chat);
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.empty-state p {
  color: var(--text-secondary);
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.chat-header-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.chat-header-text {
  flex: 1;
}

.chat-header-name {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.chat-header-status {
  margin: 0.25rem 0 0 0;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.chat-header-actions {
  display: flex;
  gap: 0.5rem;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.date-divider {
  text-align: center;
  margin: 1rem 0;
}

.date-text {
  background-color: var(--bg-secondary);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.message {
  display: flex;
  gap: 0.75rem;
  animation: slideUp 0.2s ease-out;
}

.message-sent {
  flex-direction: row-reverse;
}

.message-avatar {
  flex-shrink: 0;
}

.message-content {
  max-width: 60%;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.message-sent .message-content {
  align-items: flex-end;
}

.message-sender-name {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
  padding-left: 0.75rem;
}

.message-bubble {
  background-color: var(--bg-message-received);
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  position: relative;
}

.message-sent .message-bubble {
  background-color: var(--bg-message-sent);
  color: white;
}

.message-text {
  margin: 0;
  word-wrap: break-word;
  line-height: 1.4;
}

.message-deleted {
  margin: 0;
  font-style: italic;
  opacity: 0.6;
}

.message-edited {
  font-size: 0.7rem;
  opacity: 0.7;
  margin-left: 0.5rem;
}

.message-image {
  max-width: 300px;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
}

.message-video {
  max-width: 400px;
  max-height: 300px;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
}

.message-caption {
  margin: 0;
  word-wrap: break-word;
  line-height: 1.4;
  font-size: 0.9rem;
  opacity: 0.9;
}

.message-footer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.25rem;
}

.message-sent .message-footer {
  justify-content: flex-end;
}

.message-time {
  font-size: 0.7rem;
  color: var(--text-tertiary);
}

.message-reactions {
  display: flex;
  gap: 0.25rem;
}

.reaction {
  background-color: var(--bg-secondary);
  padding: 0.125rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.reaction:hover {
  transform: scale(1.1);
}

.message-options {
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.message:hover .message-options {
  opacity: 1;
}

.btn-icon-sm {
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background-color: var(--bg-secondary);
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.btn-icon-sm:hover {
  background-color: var(--bg-hover);
  transform: scale(1.1);
}

.message-input-container {
  background-color: var(--bg-secondary);
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
}

.replying-to,
.editing-message {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: var(--bg-tertiary);
  border-left: 3px solid var(--accent-pink);
  border-radius: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
}

.replying-to button,
.editing-message button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: var(--text-secondary);
}

.message-input-row {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.message-input {
  flex: 1;
}

.emoji-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 1rem;
  background-color: var(--bg-tertiary);
  border-radius: 0.75rem;
  margin-top: 0.75rem;
}

.emoji-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: transform 0.2s;
}

.emoji-button:hover {
  transform: scale(1.2);
  background-color: var(--bg-hover);
}

@media (max-width: 768px) {
  .chat-list-panel {
    width: 100%;
    display: var(--show-chat-list, flex);
  }

  .chat-conversation-panel {
    display: var(--show-conversation, none);
  }

  .message-content {
    max-width: 80%;
  }
}
</style>
