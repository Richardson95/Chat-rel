<script setup lang="ts">
import { ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useUserStore } from '@/stores/user'
import { useNotificationStore } from '@/stores/notification'

const settingsStore = useSettingsStore()
const userStore = useUserStore()
const notificationStore = useNotificationStore()

const selectedSection = ref<'general' | 'privacy' | 'notifications' | 'chat' | 'appearance'>('general')

const sections = [
  { id: 'general', name: 'General', icon: '⚙️' },
  { id: 'appearance', name: 'Appearance', icon: '🎨' },
  { id: 'notifications', name: 'Notifications', icon: '🔔' },
  { id: 'privacy', name: 'Privacy', icon: '🔒' },
  { id: 'chat', name: 'Chat Settings', icon: '💬' },
]

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'zh', name: '中文' },
]
</script>

<template>
  <div class="settings-view">
    <div class="settings-sidebar">
      <h2 class="settings-title">Settings</h2>
      <nav class="settings-nav">
        <button
          v-for="section in sections"
          :key="section.id"
          class="settings-nav-item"
          :class="{ active: selectedSection === section.id }"
          @click="selectedSection = section.id as any"
        >
          <span class="nav-icon">{{ section.icon }}</span>
          <span class="nav-text">{{ section.name }}</span>
        </button>
      </nav>
    </div>

    <div class="settings-content">
      <div v-if="selectedSection === 'general'" class="settings-section">
        <h3 class="section-title">General Settings</h3>

        <div class="setting-group">
          <label class="setting-label">Language</label>
          <select v-model="settingsStore.settings.language" class="input">
            <option v-for="lang in languages" :key="lang.code" :value="lang.code">
              {{ lang.name }}
            </option>
          </select>
        </div>

        <div class="setting-group">
          <label class="setting-label">Auto-download Media</label>
          <div class="toggle-switch">
            <input
              id="autoDownload"
              v-model="settingsStore.settings.autoDownloadMedia"
              type="checkbox"
              class="toggle-input"
            />
            <label for="autoDownload" class="toggle-label"></label>
          </div>
          <p class="setting-description">
            Automatically download photos and videos when received
          </p>
        </div>

        <div class="setting-group">
          <label class="setting-label">Account Status</label>
          <select v-model="userStore.currentUser.status" class="input">
            <option value="online">🟢 Online</option>
            <option value="away">🟡 Away</option>
            <option value="busy">🔴 Busy</option>
            <option value="offline">⚫ Offline</option>
          </select>
        </div>

        <div class="divider"></div>

        <div class="danger-zone">
          <h4 class="danger-title">Danger Zone</h4>
          <button class="btn btn-secondary">Clear Chat History</button>
          <button class="btn btn-secondary">Export Data</button>
          <button class="btn" style="background-color: #dc3545; color: white;">
            Delete Account
          </button>
        </div>
      </div>

      <div v-if="selectedSection === 'appearance'" class="settings-section">
        <h3 class="section-title">Appearance</h3>

        <div class="setting-group">
          <label class="setting-label">Theme</label>
          <div class="theme-options">
            <button
              class="theme-option"
              :class="{ active: settingsStore.settings.theme === 'light' }"
              @click="settingsStore.settings.theme = 'light'"
            >
              <span class="theme-icon">☀️</span>
              <span class="theme-name">Light</span>
            </button>
            <button
              class="theme-option"
              :class="{ active: settingsStore.settings.theme === 'dark' }"
              @click="settingsStore.settings.theme = 'dark'"
            >
              <span class="theme-icon">🌙</span>
              <span class="theme-name">Dark</span>
            </button>
          </div>
        </div>

        <div class="setting-group">
          <label class="setting-label">Font Size</label>
          <div class="size-options">
            <button
              class="size-option"
              :class="{ active: settingsStore.settings.chat.fontSize === 'small' }"
              @click="settingsStore.settings.chat.fontSize = 'small'"
            >
              Small
            </button>
            <button
              class="size-option"
              :class="{ active: settingsStore.settings.chat.fontSize === 'medium' }"
              @click="settingsStore.settings.chat.fontSize = 'medium'"
            >
              Medium
            </button>
            <button
              class="size-option"
              :class="{ active: settingsStore.settings.chat.fontSize === 'large' }"
              @click="settingsStore.settings.chat.fontSize = 'large'"
            >
              Large
            </button>
          </div>
        </div>

        <div class="setting-group">
          <label class="setting-label">Chat Wallpaper</label>
          <div class="wallpaper-options">
            <button class="wallpaper-option active">
              <div class="wallpaper-preview" style="background-color: var(--bg-chat)">
                Default
              </div>
            </button>
            <button class="wallpaper-option">
              <div class="wallpaper-preview" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                Purple
              </div>
            </button>
            <button class="wallpaper-option">
              <div class="wallpaper-preview" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
                Pink
              </div>
            </button>
            <button class="wallpaper-option">
              <div class="wallpaper-preview" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
                Blue
              </div>
            </button>
          </div>
        </div>

        <div class="setting-group">
          <label class="setting-label">Show Timestamps</label>
          <div class="toggle-switch">
            <input
              id="showTimestamps"
              v-model="settingsStore.settings.chat.showTimestamps"
              type="checkbox"
              class="toggle-input"
            />
            <label for="showTimestamps" class="toggle-label"></label>
          </div>
        </div>
      </div>

      <div v-if="selectedSection === 'notifications'" class="settings-section">
        <h3 class="section-title">Notifications</h3>

        <div class="setting-group">
          <label class="setting-label">Enable Notifications</label>
          <div class="toggle-switch">
            <input
              id="notifEnabled"
              v-model="settingsStore.settings.notifications.enabled"
              type="checkbox"
              class="toggle-input"
            />
            <label for="notifEnabled" class="toggle-label"></label>
          </div>
        </div>

        <div class="setting-group">
          <label class="setting-label">Sound Alerts</label>
          <div class="toggle-switch">
            <input
              id="notifSound"
              v-model="settingsStore.settings.notifications.sound"
              type="checkbox"
              class="toggle-input"
            />
            <label for="notifSound" class="toggle-label"></label>
          </div>
          <p class="setting-description">Play sound when receiving messages</p>
        </div>

        <div class="setting-group">
          <label class="setting-label">Desktop Notifications</label>
          <div class="toggle-switch">
            <input
              id="notifDesktop"
              v-model="settingsStore.settings.notifications.desktop"
              type="checkbox"
              class="toggle-input"
            />
            <label for="notifDesktop" class="toggle-label"></label>
          </div>
        </div>

        <div class="setting-group">
          <label class="setting-label">Message Preview</label>
          <div class="toggle-switch">
            <input
              id="notifPreview"
              v-model="settingsStore.settings.notifications.messagePreview"
              type="checkbox"
              class="toggle-input"
            />
            <label for="notifPreview" class="toggle-label"></label>
          </div>
          <p class="setting-description">Show message content in notifications</p>
        </div>

        <div class="divider"></div>

        <h4 class="subsection-title">Notification History</h4>
        <div class="notification-list">
          <div
            v-for="notif in notificationStore.notifications.slice(0, 5)"
            :key="notif.id"
            class="notification-item"
            :class="{ unread: !notif.isRead }"
          >
            <div class="notification-content">
              <span class="notification-icon">
                {{ notif.type === 'message' ? '💬' : notif.type === 'group_invite' ? '👥' : '🔔' }}
              </span>
              <div class="notification-text">
                <div class="notification-title">{{ notif.title }}</div>
                <div class="notification-message">{{ notif.message }}</div>
              </div>
            </div>
            <button class="btn-icon-sm" @click="notificationStore.deleteNotification(notif.id)">
              ✕
            </button>
          </div>
        </div>
        <button class="btn btn-secondary" @click="notificationStore.markAllAsRead">
          Mark All as Read
        </button>
      </div>

      <div v-if="selectedSection === 'privacy'" class="settings-section">
        <h3 class="section-title">Privacy & Security</h3>

        <div class="setting-group">
          <label class="setting-label">Last Seen</label>
          <select v-model="settingsStore.settings.privacy.lastSeen" class="input">
            <option value="everyone">Everyone</option>
            <option value="contacts">My Contacts</option>
            <option value="nobody">Nobody</option>
          </select>
          <p class="setting-description">Who can see when you were last online</p>
        </div>

        <div class="setting-group">
          <label class="setting-label">Profile Photo</label>
          <select v-model="settingsStore.settings.privacy.profilePhoto" class="input">
            <option value="everyone">Everyone</option>
            <option value="contacts">My Contacts</option>
            <option value="nobody">Nobody</option>
          </select>
        </div>

        <div class="setting-group">
          <label class="setting-label">Status</label>
          <select v-model="settingsStore.settings.privacy.status" class="input">
            <option value="everyone">Everyone</option>
            <option value="contacts">My Contacts</option>
            <option value="nobody">Nobody</option>
          </select>
        </div>

        <div class="setting-group">
          <label class="setting-label">Read Receipts</label>
          <div class="toggle-switch">
            <input
              id="readReceipts"
              v-model="settingsStore.settings.privacy.readReceipts"
              type="checkbox"
              class="toggle-input"
            />
            <label for="readReceipts" class="toggle-label"></label>
          </div>
          <p class="setting-description">Let others know when you've read their messages</p>
        </div>

        <div class="divider"></div>

        <div class="blocked-users">
          <h4 class="subsection-title">Blocked Users</h4>
          <p class="setting-description">You haven't blocked anyone yet</p>
        </div>
      </div>

      <div v-if="selectedSection === 'chat'" class="settings-section">
        <h3 class="section-title">Chat Settings</h3>

        <div class="setting-group">
          <label class="setting-label">Enter to Send</label>
          <div class="toggle-switch">
            <input
              id="enterToSend"
              v-model="settingsStore.settings.chat.enterToSend"
              type="checkbox"
              class="toggle-input"
            />
            <label for="enterToSend" class="toggle-label"></label>
          </div>
          <p class="setting-description">Press Enter to send messages (Shift+Enter for new line)</p>
        </div>

        <div class="setting-group">
          <label class="setting-label">Archive Settings</label>
          <button class="btn btn-secondary">Manage Archived Chats</button>
        </div>

        <div class="setting-group">
          <label class="setting-label">Storage Usage</label>
          <div class="storage-info">
            <div class="storage-bar">
              <div class="storage-used" style="width: 45%"></div>
            </div>
            <p class="storage-text">4.5 GB of 10 GB used</p>
          </div>
          <button class="btn btn-secondary">Manage Storage</button>
        </div>

        <div class="setting-group">
          <label class="setting-label">Backup & Restore</label>
          <button class="btn btn-accent">Create Backup</button>
          <button class="btn btn-secondary">Restore from Backup</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-view {
  display: flex;
  height: 100%;
  overflow: hidden;
  background-color: var(--bg-primary);
}

.settings-sidebar {
  width: 280px;
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  padding: 2rem;
  overflow-y: auto;
}

.settings-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 0 2rem 0;
}

.settings-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.settings-nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: none;
  border: none;
  border-radius: 0.75rem;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.settings-nav-item:hover {
  background-color: var(--bg-hover);
}

.settings-nav-item.active {
  background-color: var(--bg-hover);
  color: var(--accent-pink);
}

.nav-icon {
  font-size: 1.5rem;
}

.nav-text {
  font-weight: 500;
}

.settings-content {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.settings-section {
  max-width: 800px;
}

.section-title {
  font-size: 1.75rem;
  font-weight: bold;
  margin: 0 0 2rem 0;
}

.subsection-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.setting-group {
  margin-bottom: 2rem;
}

.setting-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}

.setting-description {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin-top: 0.5rem;
  margin-bottom: 0;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.toggle-input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-label {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--bg-tertiary);
  transition: 0.3s;
  border-radius: 34px;
}

.toggle-label:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

.toggle-input:checked + .toggle-label {
  background-color: var(--accent-pink);
}

.toggle-input:checked + .toggle-label:before {
  transform: translateX(26px);
}

.theme-options,
.size-options {
  display: flex;
  gap: 1rem;
}

.theme-option,
.size-option {
  flex: 1;
  padding: 1.5rem;
  background-color: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.theme-option:hover,
.size-option:hover {
  border-color: var(--accent-pink);
  transform: translateY(-2px);
}

.theme-option.active,
.size-option.active {
  border-color: var(--accent-pink);
  background-color: var(--bg-hover);
}

.theme-icon {
  font-size: 2rem;
}

.theme-name {
  font-weight: 600;
}

.wallpaper-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
}

.wallpaper-option {
  background: none;
  border: 2px solid var(--border-color);
  border-radius: 0.75rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.2s;
}

.wallpaper-option:hover,
.wallpaper-option.active {
  border-color: var(--accent-pink);
}

.wallpaper-preview {
  aspect-ratio: 16/9;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  font-size: 0.875rem;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--bg-secondary);
  border-radius: 0.75rem;
  border-left: 3px solid transparent;
}

.notification-item.unread {
  border-left-color: var(--accent-pink);
  background-color: var(--bg-hover);
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.notification-icon {
  font-size: 1.5rem;
}

.notification-text {
  flex: 1;
}

.notification-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.notification-message {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.btn-icon-sm {
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background-color: transparent;
  border-radius: 50%;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.btn-icon-sm:hover {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.danger-zone {
  padding: 1.5rem;
  background-color: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3);
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.danger-title {
  color: #dc3545;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.storage-info {
  margin-bottom: 1rem;
}

.storage-bar {
  height: 8px;
  background-color: var(--bg-tertiary);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.storage-used {
  height: 100%;
  background: linear-gradient(90deg, var(--accent-pink), var(--accent-green));
  border-radius: 4px;
  transition: width 0.3s;
}

.storage-text {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.divider {
  margin: 2rem 0;
}

@media (max-width: 768px) {
  .settings-view {
    flex-direction: column;
  }

  .settings-sidebar {
    width: 100%;
    padding: 1rem;
  }

  .settings-nav {
    flex-direction: row;
    overflow-x: auto;
  }

  .settings-nav-item {
    flex-shrink: 0;
  }

  .nav-text {
    display: none;
  }

  .settings-content {
    padding: 1rem;
  }

  .theme-options {
    flex-direction: column;
  }
}
</style>
