<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useChatStore } from '@/stores/chat'
import { useNotificationStore } from '@/stores/notification'
import { useSettingsStore } from '@/stores/settings'

const route = useRoute()
const userStore = useUserStore()
const chatStore = useChatStore()
const notificationStore = useNotificationStore()
const settingsStore = useSettingsStore()

const menuItems = [
  { name: 'Chats', path: '/', icon: '💬' },
  { name: 'Contacts', path: '/contacts', icon: '👥' },
  { name: 'Media', path: '/media', icon: '🖼️' },
  { name: 'Settings', path: '/settings', icon: '⚙️' },
]
</script>

<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <div class="app-logo">
        <span class="logo-icon">💭</span>
        <span class="logo-text">ChatApp</span>
      </div>
    </div>

    <div class="sidebar-profile">
      <div class="profile-avatar-container">
        <img :src="userStore.currentUser.avatar" :alt="userStore.currentUser.name" class="avatar" />
        <span :class="['status-indicator', `status-${userStore.currentUser.status}`]"></span>
      </div>
      <div class="profile-info">
        <div class="profile-name">{{ userStore.currentUser.name }}</div>
        <div class="profile-status">{{ userStore.currentUser.bio }}</div>
      </div>
      <RouterLink to="/profile" class="profile-link">
        <span class="edit-icon">✏️</span>
      </RouterLink>
    </div>

    <nav class="sidebar-nav">
      <RouterLink
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: route.path === item.path }"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-text">{{ item.name }}</span>
        <span v-if="item.name === 'Chats' && chatStore.unreadCount > 0" class="badge-count">
          {{ chatStore.unreadCount > 99 ? '99+' : chatStore.unreadCount }}
        </span>
        <span v-if="item.name === 'Settings' && notificationStore.unreadCount > 0" class="badge-count">
          {{ notificationStore.unreadCount }}
        </span>
      </RouterLink>
    </nav>

    <div class="sidebar-footer">
      <div
        v-if="!userStore.currentUser.isPremium"
        class="premium-banner"
        @click="$router.push('/premium')"
      >
        <span class="premium-icon">⭐</span>
        <div class="premium-content">
          <div class="premium-title">Upgrade to Premium</div>
          <div class="premium-subtitle">Unlock exclusive features</div>
        </div>
      </div>

      <button class="theme-toggle" @click="settingsStore.toggleTheme">
        <span v-if="settingsStore.settings.theme === 'dark'">🌙</span>
        <span v-else>☀️</span>
        <span class="theme-text">
          {{ settingsStore.settings.theme === 'dark' ? 'Dark' : 'Light' }}
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 280px;
  height: 100vh;
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.app-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: bold;
  font-size: 1.5rem;
}

.logo-icon {
  font-size: 2rem;
}

.logo-text {
  background: linear-gradient(135deg, var(--accent-pink), var(--accent-green));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.sidebar-profile {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: background-color 0.2s;
}

.sidebar-profile:hover {
  background-color: var(--bg-hover);
}

.profile-avatar-container {
  position: relative;
}

.profile-avatar-container .status-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
}

.profile-info {
  flex: 1;
  min-width: 0;
}

.profile-name {
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-status {
  font-size: 0.8rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.profile-link {
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.profile-link:hover {
  background-color: var(--bg-tertiary);
}

.edit-icon {
  font-size: 1.2rem;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  color: var(--text-primary);
  text-decoration: none;
  transition: all 0.2s;
  position: relative;
}

.nav-item:hover {
  background-color: var(--bg-hover);
}

.nav-item.active {
  background-color: var(--bg-hover);
  border-left: 3px solid var(--accent-pink);
}

.nav-icon {
  font-size: 1.5rem;
}

.nav-text {
  flex: 1;
  font-weight: 500;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
}

.premium-banner {
  background: linear-gradient(135deg, var(--accent-pink), var(--accent-green));
  border-radius: 1rem;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.premium-banner:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.premium-icon {
  font-size: 2rem;
}

.premium-content {
  color: white;
}

.premium-title {
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.premium-subtitle {
  font-size: 0.75rem;
  opacity: 0.9;
}

.theme-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background-color: var(--bg-tertiary);
  border: none;
  border-radius: 0.75rem;
  color: var(--text-primary);
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.theme-toggle:hover {
  background-color: var(--bg-hover);
  transform: scale(1.02);
}

.theme-text {
  font-size: 0.9rem;
  font-weight: 500;
}
</style>
