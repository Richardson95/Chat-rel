<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { useChatStore } from '@/stores/chat'
import { useNotificationStore } from '@/stores/notification'

const route = useRoute()
const chatStore = useChatStore()
const notificationStore = useNotificationStore()

const navItems = [
  { name: 'Chats', path: '/', icon: '💬' },
  { name: 'Contacts', path: '/contacts', icon: '👥' },
  { name: 'Media', path: '/media', icon: '🖼️' },
  { name: 'Settings', path: '/settings', icon: '⚙️' },
]
</script>

<template>
  <nav class="mobile-nav">
    <RouterLink
      v-for="item in navItems"
      :key="item.path"
      :to="item.path"
      class="mobile-nav-item"
      :class="{ active: route.path === item.path }"
    >
      <div class="mobile-nav-icon-container">
        <span class="mobile-nav-icon">{{ item.icon }}</span>
        <span
          v-if="(item.name === 'Chats' && chatStore.unreadCount > 0) ||
                (item.name === 'Settings' && notificationStore.unreadCount > 0)"
          class="mobile-badge"
        ></span>
      </div>
      <span class="mobile-nav-text">{{ item.name }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background-color: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 1000;
}

.mobile-nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s;
  padding: 0.5rem;
}

.mobile-nav-item.active {
  color: var(--accent-pink);
}

.mobile-nav-icon-container {
  position: relative;
}

.mobile-nav-icon {
  font-size: 1.5rem;
}

.mobile-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  background-color: var(--accent-pink);
  border-radius: 50%;
  border: 2px solid var(--bg-secondary);
}

.mobile-nav-text {
  font-size: 0.7rem;
  font-weight: 500;
}
</style>
