import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Chat, Message, TypingStatus } from '@/types'
import { chats, allMessages, currentUserId } from '@/data/dummyData'

export const useChatStore = defineStore('chat', () => {
  const chatList = ref<Chat[]>(chats)
  const messages = ref<Message[]>(allMessages)
  const activeChat = ref<string | null>(null)
  const typingStatuses = ref<TypingStatus[]>([])
  const searchQuery = ref('')

  const filteredChats = computed(() => {
    let filtered = chatList.value.filter(chat => !chat.isArchived)

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(chat =>
        chat.name?.toLowerCase().includes(query) ||
        chat.lastMessage?.content.toLowerCase().includes(query)
      )
    }

    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1

      const aTime = a.lastMessage?.timestamp.getTime() || 0
      const bTime = b.lastMessage?.timestamp.getTime() || 0
      return bTime - aTime
    })
  })

  const archivedChats = computed(() => {
    return chatList.value.filter(chat => chat.isArchived)
  })

  const activeChatData = computed(() => {
    return chatList.value.find(c => c.id === activeChat.value)
  })

  const activeChatMessages = computed(() => {
    if (!activeChat.value) return []
    return messages.value
      .filter(m => m.chatId === activeChat.value)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
  })

  const unreadCount = computed(() => {
    return chatList.value.reduce((sum, chat) => sum + chat.unreadCount, 0)
  })

  const setActiveChat = (chatId: string) => {
    activeChat.value = chatId
    const chat = chatList.value.find(c => c.id === chatId)
    if (chat) {
      chat.unreadCount = 0
    }
  }

  const sendMessage = (content: string, type: Message['type'] = 'text', fileUrl?: string) => {
    if (!activeChat.value) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      chatId: activeChat.value,
      senderId: currentUserId,
      content,
      timestamp: new Date(),
      type,
      fileUrl,
      isRead: false
    }

    messages.value.push(newMessage)

    const chat = chatList.value.find(c => c.id === activeChat.value)
    if (chat) {
      chat.lastMessage = newMessage
    }

    // Simulate response after 1-3 seconds
    setTimeout(() => {
      simulateResponse()
    }, Math.random() * 2000 + 1000)
  }

  const simulateResponse = () => {
    if (!activeChat.value) return

    const chat = chatList.value.find(c => c.id === activeChat.value)
    if (!chat) return

    const otherParticipants = chat.participants.filter(p => p !== currentUserId)
    const randomParticipant = otherParticipants[Math.floor(Math.random() * otherParticipants.length)] || otherParticipants[0] || currentUserId

    const responses = [
      "That's great!",
      "Awesome! 😊",
      "I see what you mean",
      "Interesting!",
      "Tell me more",
      "Sounds good!",
      "Haha nice! 😄",
      "Absolutely!",
      "I agree",
      "Thanks for sharing!"
    ]

    const responseMessage: Message = {
      id: `msg-${Date.now()}`,
      chatId: activeChat.value,
      senderId: randomParticipant,
      content: responses[Math.floor(Math.random() * responses.length)] || 'Thanks!',
      timestamp: new Date(),
      type: 'text',
      isRead: false
    }

    messages.value.push(responseMessage)
    chat.lastMessage = responseMessage
  }

  const deleteMessage = (messageId: string) => {
    const message = messages.value.find(m => m.id === messageId)
    if (message && message.senderId === currentUserId) {
      message.isDeleted = true
      message.content = 'This message was deleted'
    }
  }

  const editMessage = (messageId: string, newContent: string) => {
    const message = messages.value.find(m => m.id === messageId)
    if (message && message.senderId === currentUserId) {
      message.content = newContent
      message.isEdited = true
    }
  }

  const togglePin = (chatId: string) => {
    const chat = chatList.value.find(c => c.id === chatId)
    if (chat) {
      chat.isPinned = !chat.isPinned
    }
  }

  const toggleMute = (chatId: string) => {
    const chat = chatList.value.find(c => c.id === chatId)
    if (chat) {
      chat.isMuted = !chat.isMuted
    }
  }

  const toggleArchive = (chatId: string) => {
    const chat = chatList.value.find(c => c.id === chatId)
    if (chat) {
      chat.isArchived = !chat.isArchived
    }
  }

  const deleteChat = (chatId: string) => {
    const index = chatList.value.findIndex(c => c.id === chatId)
    if (index !== -1) {
      chatList.value.splice(index, 1)
    }
    messages.value = messages.value.filter(m => m.chatId !== chatId)
  }

  const setTyping = (chatId: string, userId: string, isTyping: boolean) => {
    const index = typingStatuses.value.findIndex(
      t => t.chatId === chatId && t.userId === userId
    )

    if (isTyping) {
      if (index === -1) {
        typingStatuses.value.push({ chatId, userId, isTyping })
      }
    } else {
      if (index !== -1) {
        typingStatuses.value.splice(index, 1)
      }
    }
  }

  const getTypingUsers = (chatId: string) => {
    return typingStatuses.value
      .filter(t => t.chatId === chatId && t.isTyping)
      .map(t => t.userId)
  }

  const reactToMessage = (messageId: string, emoji: string) => {
    const message = messages.value.find(m => m.id === messageId)
    if (message) {
      if (!message.reactions) {
        message.reactions = {}
      }
      if (!message.reactions[emoji]) {
        message.reactions[emoji] = []
      }
      const userIndex = message.reactions[emoji].indexOf(currentUserId)
      if (userIndex === -1) {
        message.reactions[emoji].push(currentUserId)
      } else {
        message.reactions[emoji].splice(userIndex, 1)
        if (message.reactions[emoji].length === 0) {
          delete message.reactions[emoji]
        }
      }
    }
  }

  const createNewChat = (userId: string) => {
    // Check if chat already exists
    const existingChat = chatList.value.find(chat =>
      chat.type === 'private' &&
      chat.participants.includes(userId) &&
      chat.participants.includes(currentUserId)
    )

    if (existingChat) {
      setActiveChat(existingChat.id)
      return existingChat.id
    }

    // Create new chat
    const newChat: Chat = {
      id: `chat-new-${Date.now()}`,
      type: 'private',
      participants: [currentUserId, userId],
      unreadCount: 0,
      isPinned: false,
      isMuted: false,
      isArchived: false,
      createdAt: new Date()
    }

    chatList.value.push(newChat)
    setActiveChat(newChat.id)
    return newChat.id
  }

  return {
    chatList,
    messages,
    activeChat,
    searchQuery,
    filteredChats,
    archivedChats,
    activeChatData,
    activeChatMessages,
    unreadCount,
    setActiveChat,
    sendMessage,
    deleteMessage,
    editMessage,
    togglePin,
    toggleMute,
    toggleArchive,
    deleteChat,
    setTyping,
    getTypingUsers,
    reactToMessage,
    createNewChat
  }
})
