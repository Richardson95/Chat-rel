import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Settings } from '@/types'

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<Settings>({
    theme: 'dark',
    notifications: {
      enabled: true,
      sound: true,
      desktop: true,
      messagePreview: true
    },
    privacy: {
      lastSeen: 'everyone',
      profilePhoto: 'everyone',
      status: 'everyone',
      readReceipts: true
    },
    chat: {
      enterToSend: true,
      fontSize: 'medium',
      wallpaper: 'default',
      showTimestamps: true
    },
    language: 'en',
    autoDownloadMedia: true
  })

  // Load settings from localStorage
  const savedSettings = localStorage.getItem('chatapp-settings')
  if (savedSettings) {
    settings.value = JSON.parse(savedSettings)
  }

  // Watch for changes and save to localStorage
  watch(
    settings,
    (newSettings) => {
      localStorage.setItem('chatapp-settings', JSON.stringify(newSettings))
      applyTheme(newSettings.theme)
    },
    { deep: true }
  )

  const applyTheme = (theme: 'light' | 'dark') => {
    document.documentElement.setAttribute('data-theme', theme)
  }

  const toggleTheme = () => {
    settings.value.theme = settings.value.theme === 'light' ? 'dark' : 'light'
  }

  const updateSettings = (updates: Partial<Settings>) => {
    Object.assign(settings.value, updates)
  }

  // Apply theme on load
  applyTheme(settings.value.theme)

  return {
    settings,
    toggleTheme,
    updateSettings
  }
})
