export interface User {
  id: string
  name: string
  avatar: string
  status: 'online' | 'offline' | 'away' | 'busy'
  bio: string
  email: string
  phone: string
  isPremium: boolean
  lastSeen?: Date
}

export interface Message {
  id: string
  chatId: string
  senderId: string
  content: string
  timestamp: Date
  type: 'text' | 'image' | 'video' | 'audio' | 'file'
  fileUrl?: string
  fileName?: string
  replyTo?: string
  isEdited?: boolean
  isDeleted?: boolean
  reactions?: { [emoji: string]: string[] }
  isRead?: boolean
}

export interface Chat {
  id: string
  type: 'private' | 'group'
  participants: string[]
  name?: string
  avatar?: string
  lastMessage?: Message
  unreadCount: number
  isPinned: boolean
  isMuted: boolean
  isArchived: boolean
  createdAt: Date
  isPremiumOnly?: boolean
  groupAdmin?: string
  groupDescription?: string
}

export interface Contact {
  id: string
  userId: string
  addedAt: Date
  isFavorite: boolean
  isBlocked: boolean
  customName?: string
}

export interface Settings {
  theme: 'light' | 'dark'
  notifications: {
    enabled: boolean
    sound: boolean
    desktop: boolean
    messagePreview: boolean
  }
  privacy: {
    lastSeen: 'everyone' | 'contacts' | 'nobody'
    profilePhoto: 'everyone' | 'contacts' | 'nobody'
    status: 'everyone' | 'contacts' | 'nobody'
    readReceipts: boolean
  }
  chat: {
    enterToSend: boolean
    fontSize: 'small' | 'medium' | 'large'
    wallpaper: string
    showTimestamps: boolean
  }
  language: string
  autoDownloadMedia: boolean
}

export interface PremiumPlan {
  id: string
  name: string
  price: number
  duration: 'monthly' | 'yearly'
  features: string[]
  popular?: boolean
}

export interface Notification {
  id: string
  type: 'message' | 'group_invite' | 'system'
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  chatId?: string
}

export interface TypingStatus {
  chatId: string
  userId: string
  isTyping: boolean
}
