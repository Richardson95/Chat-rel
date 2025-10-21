<script setup lang="ts">
import { ref, computed } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'
import { mediaFiles } from '@/data/dummyData'

const chatStore = useChatStore()
const userStore = useUserStore()

const selectedTab = ref<'all' | 'photos' | 'videos' | 'files'>('all')
const selectedMedia = ref<any>(null)
const searchQuery = ref('')

const filteredMedia = computed(() => {
  let media = mediaFiles

  if (searchQuery.value) {
    // Filter by chat name or sender
    media = media.filter(file => {
      const chat = chatStore.chatList.find(c => c.id === file.chatId)
      const sender = userStore.getUserById(file.senderId)
      return chat?.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
             sender?.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    })
  }

  return media
})

const getChatName = (chatId: string) => {
  const chat = chatStore.chatList.find(c => c.id === chatId)
  if (!chat) return 'Unknown'
  if (chat.type === 'group') return chat.name || 'Group'
  const otherUserId = chat.participants.find((p: string) => p !== userStore.currentUser.id)
  if (!otherUserId) return 'Unknown'
  return userStore.getUserById(otherUserId)?.name || 'Unknown'
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const openMedia = (media: any) => {
  selectedMedia.value = media
}

const closeMedia = () => {
  selectedMedia.value = null
}

const downloadMedia = (url: string) => {
  window.open(url, '_blank')
}
</script>

<template>
  <div class="media-view">
    <div class="media-header">
      <h2 class="page-title">Media Gallery</h2>
      <p class="page-subtitle">Browse and manage all your shared media</p>
    </div>

    <div class="media-tabs">
      <button
        class="tab"
        :class="{ active: selectedTab === 'all' }"
        @click="selectedTab = 'all'"
      >
        All Media ({{ filteredMedia.length }})
      </button>
      <button
        class="tab"
        :class="{ active: selectedTab === 'photos' }"
        @click="selectedTab = 'photos'"
      >
        📷 Photos
      </button>
      <button
        class="tab"
        :class="{ active: selectedTab === 'videos' }"
        @click="selectedTab = 'videos'"
      >
        🎥 Videos
      </button>
      <button
        class="tab"
        :class="{ active: selectedTab === 'files' }"
        @click="selectedTab = 'files'"
      >
        📁 Files
      </button>
    </div>

    <div class="media-search">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by chat or sender..."
        class="input"
      />
    </div>

    <div class="media-stats">
      <div class="stat-item">
        <span class="stat-icon">🖼️</span>
        <div class="stat-content">
          <div class="stat-value">{{ filteredMedia.length }}</div>
          <div class="stat-label">Total Items</div>
        </div>
      </div>
      <div class="stat-item">
        <span class="stat-icon">💾</span>
        <div class="stat-content">
          <div class="stat-value">2.4 GB</div>
          <div class="stat-label">Storage Used</div>
        </div>
      </div>
      <div class="stat-item">
        <span class="stat-icon">📅</span>
        <div class="stat-content">
          <div class="stat-value">Last 30 Days</div>
          <div class="stat-label">Time Period</div>
        </div>
      </div>
    </div>

    <div class="media-grid">
      <div
        v-for="media in filteredMedia"
        :key="media.id"
        class="media-item"
        @click="openMedia(media)"
      >
        <div class="media-thumbnail">
          <img :src="media.url" :alt="getChatName(media.chatId)" />
          <div class="media-overlay">
            <button class="media-action-btn">👁️</button>
            <button class="media-action-btn" @click.stop="downloadMedia(media.url)">⬇️</button>
          </div>
        </div>
        <div class="media-info">
          <div class="media-chat">{{ getChatName(media.chatId) }}</div>
          <div class="media-date">{{ formatDate(media.timestamp) }}</div>
        </div>
      </div>
    </div>

    <div v-if="filteredMedia.length === 0" class="empty-state">
      <div class="empty-icon">🖼️</div>
      <h3>No media found</h3>
      <p>Start sharing photos and videos in your chats</p>
    </div>

    <teleport to="body">
      <div v-if="selectedMedia" class="media-modal" @click="closeMedia">
        <div class="modal-content" @click.stop>
          <button class="modal-close" @click="closeMedia">✕</button>

          <div class="modal-image-container">
            <img :src="selectedMedia.url" :alt="getChatName(selectedMedia.chatId)" />
          </div>

          <div class="modal-info">
            <div class="modal-info-row">
              <span class="info-label">From:</span>
              <span class="info-value">{{ getChatName(selectedMedia.chatId) }}</span>
            </div>
            <div class="modal-info-row">
              <span class="info-label">Sent by:</span>
              <span class="info-value">{{ userStore.getUserById(selectedMedia.senderId)?.name }}</span>
            </div>
            <div class="modal-info-row">
              <span class="info-label">Date:</span>
              <span class="info-value">{{ formatDate(selectedMedia.timestamp) }}</span>
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn btn-primary" @click="downloadMedia(selectedMedia.url)">
              ⬇️ Download
            </button>
            <button class="btn btn-secondary" @click="closeMedia">
              Close
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<style scoped>
.media-view {
  height: 100%;
  overflow-y: auto;
  padding: 2rem;
  background-color: var(--bg-primary);
}

.media-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  color: var(--text-secondary);
  margin: 0;
}

.media-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--border-color);
  overflow-x: auto;
}

.tab {
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-weight: 600;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
  white-space: nowrap;
}

.tab:hover {
  color: var(--text-primary);
}

.tab.active {
  color: var(--accent-pink);
  border-bottom-color: var(--accent-pink);
}

.media-search {
  margin-bottom: 2rem;
  max-width: 500px;
}

.media-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background-color: var(--bg-secondary);
  border-radius: 1rem;
  transition: all 0.2s;
}

.stat-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.stat-icon {
  font-size: 2.5rem;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--accent-pink);
  margin-bottom: 0.25rem;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
}

.media-item {
  background-color: var(--bg-secondary);
  border-radius: 1rem;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
}

.media-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.media-thumbnail {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  background-color: var(--bg-tertiary);
}

.media-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.media-item:hover .media-thumbnail img {
  transform: scale(1.1);
}

.media-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  opacity: 0;
  transition: opacity 0.3s;
}

.media-item:hover .media-overlay {
  opacity: 1;
}

.media-action-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background-color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.media-action-btn:hover {
  transform: scale(1.1);
  background-color: var(--accent-pink);
}

.media-info {
  padding: 1rem;
}

.media-chat {
  font-weight: 600;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.media-date {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--text-secondary);
}

.media-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 2rem;
  animation: fadeIn 0.3s;
}

.modal-content {
  background-color: var(--bg-secondary);
  border-radius: 1rem;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow: auto;
  position: relative;
  animation: slideUp 0.3s;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s;
}

.modal-close:hover {
  background-color: var(--accent-pink);
  color: white;
  transform: rotate(90deg);
}

.modal-image-container {
  width: 100%;
  max-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-tertiary);
  padding: 2rem;
}

.modal-image-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 0.5rem;
}

.modal-info {
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.modal-info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-light);
}

.modal-info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 600;
  color: var(--text-secondary);
}

.info-value {
  color: var(--text-primary);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.modal-actions .btn {
  flex: 1;
}

@media (max-width: 768px) {
  .media-view {
    padding: 1rem;
  }

  .media-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }

  .media-stats {
    grid-template-columns: 1fr;
  }

  .media-modal {
    padding: 1rem;
  }

  .modal-image-container {
    padding: 1rem;
    max-height: 50vh;
  }
}
</style>
