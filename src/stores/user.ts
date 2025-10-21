import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types'
import { users, currentUserId } from '@/data/dummyData'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User>(users.find(u => u.id === currentUserId)!)
  const allUsers = ref<User[]>(users)

  const getUserById = (id: string) => {
    return allUsers.value.find(u => u.id === id)
  }

  const updateUserStatus = (status: User['status']) => {
    currentUser.value.status = status
  }

  const updateUserProfile = (updates: Partial<User>) => {
    Object.assign(currentUser.value, updates)
  }

  const upgradeToPremium = () => {
    currentUser.value.isPremium = true
  }

  return {
    currentUser,
    allUsers,
    getUserById,
    updateUserStatus,
    updateUserProfile,
    upgradeToPremium
  }
})
