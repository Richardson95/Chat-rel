import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Contact } from '@/types'
import { contacts, users } from '@/data/dummyData'

export const useContactStore = defineStore('contact', () => {
  const contactList = ref<Contact[]>(contacts)
  const searchQuery = ref('')

  const filteredContacts = computed(() => {
    if (!searchQuery.value) {
      return contactList.value
    }

    const query = searchQuery.value.toLowerCase()
    return contactList.value.filter(contact => {
      const user = users.find(u => u.id === contact.userId)
      return user?.name.toLowerCase().includes(query) ||
             user?.email.toLowerCase().includes(query) ||
             contact.customName?.toLowerCase().includes(query)
    })
  })

  const favoriteContacts = computed(() => {
    return contactList.value.filter(c => c.isFavorite)
  })

  const nonContactUsers = computed(() => {
    const contactUserIds = contactList.value.map(c => c.userId)
    return users.filter(u => !contactUserIds.includes(u.id) && u.id !== 'user-0')
  })

  const addContact = (userId: string) => {
    const exists = contactList.value.find(c => c.userId === userId)
    if (exists) return

    const newContact: Contact = {
      id: `contact-new-${Date.now()}`,
      userId,
      addedAt: new Date(),
      isFavorite: false,
      isBlocked: false
    }

    contactList.value.push(newContact)
  }

  const removeContact = (contactId: string) => {
    const index = contactList.value.findIndex(c => c.id === contactId)
    if (index !== -1) {
      contactList.value.splice(index, 1)
    }
  }

  const toggleFavorite = (contactId: string) => {
    const contact = contactList.value.find(c => c.id === contactId)
    if (contact) {
      contact.isFavorite = !contact.isFavorite
    }
  }

  const toggleBlock = (contactId: string) => {
    const contact = contactList.value.find(c => c.id === contactId)
    if (contact) {
      contact.isBlocked = !contact.isBlocked
    }
  }

  const setCustomName = (contactId: string, name: string) => {
    const contact = contactList.value.find(c => c.id === contactId)
    if (contact) {
      contact.customName = name
    }
  }

  return {
    contactList,
    searchQuery,
    filteredContacts,
    favoriteContacts,
    nonContactUsers,
    addContact,
    removeContact,
    toggleFavorite,
    toggleBlock,
    setCustomName
  }
})
