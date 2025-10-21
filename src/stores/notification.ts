import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Notification } from '@/types'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([
    {
      id: 'notif-1',
      type: 'group_invite',
      title: 'Group Invitation',
      message: 'You were added to "Tech Talk 💻"',
      timestamp: new Date(Date.now() - 3600000),
      isRead: false,
      chatId: 'chat-group-2'
    },
    {
      id: 'notif-2',
      type: 'system',
      title: 'Premium Subscription',
      message: 'Your premium subscription is active!',
      timestamp: new Date(Date.now() - 86400000),
      isRead: true
    },
    {
      id: 'notif-3',
      type: 'message',
      title: 'New Message',
      message: 'Emma Wilson sent you a message',
      timestamp: new Date(Date.now() - 7200000),
      isRead: false,
      chatId: 'chat-0'
    }
  ])

  const unreadCount = computed(() => {
    return notifications.value.filter(n => !n.isRead).length
  })

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    notifications.value.unshift({
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date(),
      isRead: false
    })
  }

  const markAsRead = (notificationId: string) => {
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification) {
      notification.isRead = true
    }
  }

  const markAllAsRead = () => {
    notifications.value.forEach(n => n.isRead = true)
  }

  const deleteNotification = (notificationId: string) => {
    const index = notifications.value.findIndex(n => n.id === notificationId)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearAll = () => {
    notifications.value = []
  }

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  }
})
