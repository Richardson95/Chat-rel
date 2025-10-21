<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useContactStore } from '@/stores/contact'
import { useUserStore } from '@/stores/user'
import { useChatStore } from '@/stores/chat'

const router = useRouter()
const contactStore = useContactStore()
const userStore = useUserStore()
const chatStore = useChatStore()

const showAddContact = ref(false)
const selectedTab = ref<'all' | 'favorites' | 'add'>('all')

const displayContacts = computed(() => {
  if (selectedTab.value === 'favorites') {
    return contactStore.favoriteContacts
  }
  return contactStore.filteredContacts
})

const startChat = (userId: string) => {
  chatStore.createNewChat(userId)
  router.push('/')
}

const formatPhoneNumber = (phone: string) => {
  return phone.replace(/(\+\d{1})(\d{3})(\d{3})(\d{4})/, '$1 ($2) $3-$4')
}
</script>

<template>
  <div class="contacts-view">
    <div class="contacts-header">
      <h2 class="page-title">Contacts</h2>
      <button class="btn btn-primary" @click="selectedTab = 'add'">
        <span>➕</span>
        <span>Add Contact</span>
      </button>
    </div>

    <div class="contacts-tabs">
      <button
        class="tab"
        :class="{ active: selectedTab === 'all' }"
        @click="selectedTab = 'all'"
      >
        All Contacts ({{ contactStore.contactList.length }})
      </button>
      <button
        class="tab"
        :class="{ active: selectedTab === 'favorites' }"
        @click="selectedTab = 'favorites'"
      >
        ⭐ Favorites ({{ contactStore.favoriteContacts.length }})
      </button>
      <button
        class="tab"
        :class="{ active: selectedTab === 'add' }"
        @click="selectedTab = 'add'"
      >
        Add New
      </button>
    </div>

    <div v-if="selectedTab !== 'add'" class="contacts-search">
      <input
        v-model="contactStore.searchQuery"
        type="text"
        placeholder="Search contacts..."
        class="input"
      />
    </div>

    <div v-if="selectedTab === 'add'" class="add-contact-section">
      <h3 class="section-title">Add New Contact</h3>
      <p class="section-description">Select from suggested users or search for someone new</p>

      <div class="suggested-users">
        <div
          v-for="user in contactStore.nonContactUsers.slice(0, 10)"
          :key="user.id"
          class="user-card"
        >
          <img :src="user.avatar" :alt="user.name" class="avatar-lg" />
          <div class="user-card-info">
            <h4 class="user-name">{{ user.name }}</h4>
            <p class="user-bio">{{ user.bio }}</p>
            <p class="user-email">{{ user.email }}</p>
          </div>
          <button
            class="btn btn-accent btn-sm"
            @click="contactStore.addContact(user.id); selectedTab = 'all'"
          >
            Add Contact
          </button>
        </div>
      </div>
    </div>

    <div v-else class="contacts-grid">
      <div
        v-for="contact in displayContacts"
        :key="contact.id"
        class="contact-card"
      >
        <div class="contact-card-header">
          <div class="contact-avatar-container">
            <img
              :src="userStore.getUserById(contact.userId)?.avatar"
              :alt="userStore.getUserById(contact.userId)?.name"
              class="avatar-lg"
            />
            <span
              :class="[
                'status-indicator',
                `status-${userStore.getUserById(contact.userId)?.status}`
              ]"
            ></span>
          </div>
          <button
            class="favorite-button"
            @click="contactStore.toggleFavorite(contact.id)"
          >
            {{ contact.isFavorite ? '⭐' : '☆' }}
          </button>
        </div>

        <div class="contact-card-body">
          <h3 class="contact-name">
            {{ contact.customName || userStore.getUserById(contact.userId)?.name }}
          </h3>
          <p class="contact-status">{{ userStore.getUserById(contact.userId)?.status }}</p>
          <p class="contact-bio">{{ userStore.getUserById(contact.userId)?.bio }}</p>

          <div class="contact-details">
            <div class="contact-detail">
              <span class="detail-icon">📧</span>
              <span class="detail-text">{{ userStore.getUserById(contact.userId)?.email }}</span>
            </div>
            <div class="contact-detail">
              <span class="detail-icon">📞</span>
              <span class="detail-text">
                {{ formatPhoneNumber(userStore.getUserById(contact.userId)?.phone || '') }}
              </span>
            </div>
          </div>
        </div>

        <div class="contact-card-footer">
          <button
            class="btn btn-primary btn-sm"
            @click="startChat(contact.userId)"
          >
            💬 Message
          </button>
          <button class="btn btn-secondary btn-sm" @click="contactStore.removeContact(contact.id)">
            Remove
          </button>
        </div>
      </div>
    </div>

    <div v-if="displayContacts.length === 0 && selectedTab !== 'add'" class="empty-state">
      <div class="empty-icon">👥</div>
      <h3>No contacts found</h3>
      <p>Try adjusting your search or add new contacts</p>
      <button class="btn btn-primary" @click="selectedTab = 'add'">
        Add Contact
      </button>
    </div>
  </div>
</template>

<style scoped>
.contacts-view {
  height: 100%;
  overflow-y: auto;
  padding: 2rem;
  background-color: var(--bg-primary);
}

.contacts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

.contacts-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--border-color);
}

.tab {
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-weight: 600;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
}

.tab:hover {
  color: var(--text-primary);
}

.tab.active {
  color: var(--accent-pink);
  border-bottom-color: var(--accent-pink);
}

.contacts-search {
  margin-bottom: 2rem;
  max-width: 500px;
}

.add-contact-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.section-description {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.suggested-users {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background-color: var(--bg-secondary);
  border-radius: 1rem;
  transition: all 0.2s;
}

.user-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.user-card-info {
  flex: 1;
}

.user-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.user-bio {
  color: var(--text-secondary);
  margin: 0 0 0.25rem 0;
  font-size: 0.9rem;
}

.user-email {
  color: var(--text-tertiary);
  margin: 0;
  font-size: 0.85rem;
}

.contacts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.contact-card {
  background-color: var(--bg-secondary);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
}

.contact-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-4px);
}

.contact-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.contact-avatar-container {
  position: relative;
}

.contact-avatar-container .status-indicator {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 12px;
  height: 12px;
}

.favorite-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.favorite-button:hover {
  transform: scale(1.2);
}

.contact-card-body {
  flex: 1;
  margin-bottom: 1rem;
}

.contact-name {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.contact-status {
  color: var(--text-secondary);
  margin: 0 0 0.75rem 0;
  font-size: 0.85rem;
  text-transform: capitalize;
}

.contact-bio {
  color: var(--text-secondary);
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contact-detail {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.detail-icon {
  font-size: 1rem;
}

.detail-text {
  word-break: break-all;
}

.contact-card-footer {
  display: flex;
  gap: 0.75rem;
}

.contact-card-footer .btn {
  flex: 1;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .contacts-view {
    padding: 1rem;
  }

  .contacts-grid {
    grid-template-columns: 1fr;
  }

  .contacts-tabs {
    flex-direction: column;
    gap: 0;
  }

  .tab {
    border-bottom: 1px solid var(--border-color);
    border-left: 3px solid transparent;
  }

  .tab.active {
    border-bottom-color: var(--border-color);
    border-left-color: var(--accent-pink);
  }
}
</style>
