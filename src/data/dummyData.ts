import type { User, Message, Chat, Contact } from '@/types'

const avatarColors = ['#FF6B9D', '#000000', '#98FFB3', '#FFB3E6', '#1A1A1A', '#B3FFD9']

export const currentUserId = 'user-0'

export const users: User[] = [
  {
    id: 'user-0',
    name: 'You',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
    status: 'online',
    bio: 'Hey there! I am using ChatApp',
    email: 'you@chatapp.com',
    phone: '+1234567890',
    isPremium: true
  },
  ...Array.from({ length: 50 }, (_, i) => {
    const names = [
      'Emma Wilson', 'James Anderson', 'Sophia Martinez', 'Michael Brown', 'Olivia Davis',
      'William Garcia', 'Ava Rodriguez', 'Alexander Lee', 'Isabella Walker', 'Ethan Hall',
      'Mia Allen', 'Benjamin Young', 'Charlotte King', 'Daniel Wright', 'Amelia Lopez',
      'Matthew Hill', 'Harper Scott', 'Joseph Green', 'Evelyn Adams', 'David Baker',
      'Abigail Nelson', 'Jackson Carter', 'Emily Mitchell', 'Lucas Perez', 'Elizabeth Roberts',
      'Henry Turner', 'Sofia Phillips', 'Sebastian Campbell', 'Avery Parker', 'Jack Evans',
      'Ella Edwards', 'Owen Collins', 'Scarlett Stewart', 'Aiden Sanchez', 'Grace Morris',
      'Carter Rogers', 'Chloe Reed', 'Wyatt Cook', 'Victoria Morgan', 'Luke Bell',
      'Zoey Murphy', 'Jayden Bailey', 'Lily Rivera', 'Gabriel Cooper', 'Hannah Richardson',
      'Nathan Cox', 'Lillian Howard', 'Isaac Ward', 'Addison Torres', 'Samuel Peterson'
    ]
    const bios = [
      'Living my best life 🌟',
      'Coffee enthusiast ☕',
      'Adventure awaits 🌍',
      'Making memories 📸',
      'Dream big 💭',
      'Stay positive ✨',
      'Love & light 💫',
      'Creating magic ✨',
      'Just vibing 🎵',
      'Blessed & grateful 🙏'
    ]
    const statuses: Array<'online' | 'offline' | 'away' | 'busy'> = ['online', 'offline', 'away', 'busy']

    return {
      id: `user-${i + 1}`,
      name: names[i] || 'User',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 1}`,
      status: statuses[Math.floor(Math.random() * 4)] || 'online',
      bio: bios[Math.floor(Math.random() * 10)] || 'Hey there!',
      email: `user${i + 1}@email.com`,
      phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      isPremium: Math.random() > 0.7,
      lastSeen: new Date(Date.now() - Math.random() * 86400000 * 7)
    }
  })
]

const messageTemplates = [
  "Hey! How are you?",
  "What are you up to today?",
  "Did you see the news?",
  "That's amazing! 😊",
  "I can't believe it!",
  "Let's catch up soon",
  "Missing you!",
  "Hope you're doing well",
  "Thanks for everything!",
  "You're the best! 💕",
  "OMG really?!",
  "That sounds fun!",
  "Count me in!",
  "I'm so excited!",
  "No way! 😱",
  "Haha that's hilarious 😂",
  "Good morning! ☀️",
  "Good night! 🌙",
  "Have a great day!",
  "Take care! 💚",
  "See you soon!",
  "Talk to you later",
  "Absolutely!",
  "I agree 100%",
  "That makes sense",
  "Interesting point",
  "Tell me more!",
  "I'm listening 👂",
  "What do you think?",
  "Any plans for the weekend?",
  "Let's grab coffee sometime",
  "Congratulations! 🎉",
  "You deserve it!",
  "I'm proud of you!",
  "Keep up the good work!",
  "Don't give up!",
  "You've got this! 💪",
  "Sending positive vibes ✨",
  "Thinking of you",
  "Hope everything is okay",
  "Let me know if you need anything",
  "I'm here for you",
  "Always here to help!",
  "No problem at all!",
  "My pleasure! 😊",
  "Anytime!",
  "Of course!",
  "Definitely!",
  "Sure thing!",
  "Sounds good to me",
  "Perfect! ✓"
]

const generateMessages = (chatId: string, participantIds: string[], count: number): Message[] => {
  const messages: Message[] = []
  let timestamp = new Date(Date.now() - 86400000 * 30) // Start 30 days ago

  for (let i = 0; i < count; i++) {
    timestamp = new Date(timestamp.getTime() + Math.random() * 3600000 * 4) // Add 0-4 hours

    const senderIndex = Math.floor(Math.random() * participantIds.length)
    const sender = participantIds[senderIndex] || participantIds[0] || 'user-0'
    const participant1 = participantIds[0] || 'user-0'
    const participant2 = participantIds[1] || participantIds[0] || 'user-0'

    const hasReaction = Math.random() > 0.8
    const reactions = hasReaction ? { '❤️': [participant1], '😂': [participant2] } : undefined

    messages.push({
      id: `msg-${chatId}-${i}`,
      chatId,
      senderId: sender,
      content: messageTemplates[Math.floor(Math.random() * messageTemplates.length)] || 'Hello',
      timestamp,
      type: Math.random() > 0.9 ? 'image' : 'text',
      fileUrl: Math.random() > 0.9 ? `https://picsum.photos/400/300?random=${i}` : undefined,
      isRead: Math.random() > 0.3,
      reactions
    })
  }

  return messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
}

export const contacts: Contact[] = Array.from({ length: 45 }, (_, i) => ({
  id: `contact-${i}`,
  userId: `user-${i + 1}`,
  addedAt: new Date(Date.now() - Math.random() * 86400000 * 365),
  isFavorite: Math.random() > 0.8,
  isBlocked: false
}))

export const chats: Chat[] = [
  // Private chats with existing contacts
  ...contacts.slice(0, 35).map((contact, i) => {
    const user = users.find(u => u.id === contact.userId)!
    return {
      id: `chat-${i}`,
      type: 'private' as const,
      participants: [currentUserId, contact.userId],
      name: user.name,
      avatar: user.avatar,
      unreadCount: Math.floor(Math.random() * 10),
      isPinned: Math.random() > 0.9,
      isMuted: Math.random() > 0.95,
      isArchived: false,
      createdAt: contact.addedAt
    }
  }),
  // Premium group chats
  {
    id: 'chat-group-1',
    type: 'group',
    participants: [currentUserId, 'user-1', 'user-2', 'user-3', 'user-4', 'user-5'],
    name: 'Weekend Warriors 🏃',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=group1',
    unreadCount: 5,
    isPinned: true,
    isMuted: false,
    isArchived: false,
    createdAt: new Date(Date.now() - 86400000 * 60),
    isPremiumOnly: true,
    groupAdmin: currentUserId,
    groupDescription: 'Weekend adventure enthusiasts!'
  },
  {
    id: 'chat-group-2',
    type: 'group',
    participants: [currentUserId, 'user-6', 'user-7', 'user-8', 'user-9'],
    name: 'Tech Talk 💻',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=group2',
    unreadCount: 12,
    isPinned: true,
    isMuted: false,
    isArchived: false,
    createdAt: new Date(Date.now() - 86400000 * 90),
    isPremiumOnly: true,
    groupAdmin: 'user-6',
    groupDescription: 'Discussing latest in technology'
  },
  {
    id: 'chat-group-3',
    type: 'group',
    participants: [currentUserId, 'user-10', 'user-11', 'user-12', 'user-13', 'user-14'],
    name: 'Foodies United 🍕',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=group3',
    unreadCount: 3,
    isPinned: false,
    isMuted: false,
    isArchived: false,
    createdAt: new Date(Date.now() - 86400000 * 45),
    isPremiumOnly: true,
    groupAdmin: 'user-10',
    groupDescription: 'Share your favorite recipes and restaurants!'
  },
  {
    id: 'chat-group-4',
    type: 'group',
    participants: [currentUserId, 'user-15', 'user-16', 'user-17', 'user-18'],
    name: 'Music Lovers 🎵',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=group4',
    unreadCount: 8,
    isPinned: false,
    isMuted: false,
    isArchived: false,
    createdAt: new Date(Date.now() - 86400000 * 30),
    isPremiumOnly: true,
    groupAdmin: 'user-15',
    groupDescription: 'All genres welcome!'
  },
  {
    id: 'chat-group-5',
    type: 'group',
    participants: [currentUserId, 'user-19', 'user-20', 'user-21', 'user-22', 'user-23'],
    name: 'Fitness Fanatics 💪',
    avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=group5',
    unreadCount: 0,
    isPinned: false,
    isMuted: true,
    isArchived: false,
    createdAt: new Date(Date.now() - 86400000 * 20),
    isPremiumOnly: true,
    groupAdmin: 'user-19',
    groupDescription: 'Get fit together!'
  }
]

export const allMessages: Message[] = chats.flatMap(chat => {
  const messageCount = chat.type === 'group' ?
    Math.floor(Math.random() * 100) + 50 :
    Math.floor(Math.random() * 200) + 30
  return generateMessages(chat.id, chat.participants, messageCount)
})

// Update chats with last messages
chats.forEach(chat => {
  const chatMessages = allMessages
    .filter(m => m.chatId === chat.id)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

  if (chatMessages.length > 0) {
    chat.lastMessage = chatMessages[0]
  }
})

export const mediaFiles = allMessages
  .filter(m => m.type === 'image' && m.fileUrl)
  .map(m => ({
    id: m.id,
    chatId: m.chatId,
    url: m.fileUrl!,
    timestamp: m.timestamp,
    senderId: m.senderId
  }))
