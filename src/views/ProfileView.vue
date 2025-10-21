<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const isEditing = ref(false)
const editForm = ref({
  name: userStore.currentUser.name,
  bio: userStore.currentUser.bio,
  email: userStore.currentUser.email,
  phone: userStore.currentUser.phone,
})

const saveProfile = () => {
  userStore.updateUserProfile(editForm.value)
  isEditing.value = false
}

const cancelEdit = () => {
  editForm.value = {
    name: userStore.currentUser.name,
    bio: userStore.currentUser.bio,
    email: userStore.currentUser.email,
    phone: userStore.currentUser.phone,
  }
  isEditing.value = false
}
</script>

<template>
  <div class="profile-view">
    <div class="profile-header">
      <div class="profile-cover">
        <div class="cover-gradient"></div>
      </div>

      <div class="profile-main">
        <div class="avatar-section">
          <div class="avatar-container">
            <img :src="userStore.currentUser.avatar" :alt="userStore.currentUser.name" class="avatar-xl" />
            <button class="avatar-edit-btn">📷</button>
            <span :class="['status-indicator-large', `status-${userStore.currentUser.status}`]"></span>
          </div>
        </div>

        <div class="profile-info-section">
          <div class="profile-header-content">
            <div>
              <h1 class="profile-name">{{ userStore.currentUser.name }}</h1>
              <p class="profile-email">{{ userStore.currentUser.email }}</p>
            </div>
            <button v-if="!isEditing" class="btn btn-primary" @click="isEditing = true">
              ✏️ Edit Profile
            </button>
          </div>

          <div v-if="userStore.currentUser.isPremium" class="premium-badge-large">
            <span class="premium-icon">⭐</span>
            <span>Premium Member</span>
          </div>
        </div>
      </div>
    </div>

    <div class="profile-content">
      <div v-if="!isEditing" class="profile-details">
        <div class="detail-section">
          <h3 class="detail-section-title">About</h3>
          <div class="detail-card">
            <div class="detail-item">
              <span class="detail-label">Bio</span>
              <span class="detail-value">{{ userStore.currentUser.bio }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Status</span>
              <span class="detail-value">
                <span :class="['status-dot', `status-${userStore.currentUser.status}`]"></span>
                {{ userStore.currentUser.status }}
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Email</span>
              <span class="detail-value">{{ userStore.currentUser.email }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Phone</span>
              <span class="detail-value">{{ userStore.currentUser.phone }}</span>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h3 class="detail-section-title">Account Statistics</h3>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">💬</div>
              <div class="stat-value">1,234</div>
              <div class="stat-label">Messages Sent</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">👥</div>
              <div class="stat-value">45</div>
              <div class="stat-label">Contacts</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🖼️</div>
              <div class="stat-value">256</div>
              <div class="stat-label">Media Shared</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">⭐</div>
              <div class="stat-value">5</div>
              <div class="stat-label">Premium Groups</div>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h3 class="detail-section-title">Achievements</h3>
          <div class="achievements-grid">
            <div class="achievement-card">
              <div class="achievement-icon">🎉</div>
              <div class="achievement-name">Early Adopter</div>
              <div class="achievement-desc">Joined in the first month</div>
            </div>
            <div class="achievement-card">
              <div class="achievement-icon">💬</div>
              <div class="achievement-name">Chatterbox</div>
              <div class="achievement-desc">Sent 1000+ messages</div>
            </div>
            <div class="achievement-card">
              <div class="achievement-icon">👥</div>
              <div class="achievement-name">Social Butterfly</div>
              <div class="achievement-desc">Added 50+ contacts</div>
            </div>
            <div class="achievement-card locked">
              <div class="achievement-icon">🔒</div>
              <div class="achievement-name">Power User</div>
              <div class="achievement-desc">Unlock at 5000 messages</div>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h3 class="detail-section-title">Customization</h3>
          <div class="customization-options">
            <div class="custom-option">
              <span class="custom-label">Profile Theme</span>
              <select class="input">
                <option>Default</option>
                <option>Ocean Blue</option>
                <option>Sunset Pink</option>
                <option>Forest Green</option>
              </select>
            </div>
            <div class="custom-option">
              <span class="custom-label">Avatar Frame</span>
              <div class="frame-options">
                <button class="frame-btn active">None</button>
                <button class="frame-btn">🌟</button>
                <button class="frame-btn">💎</button>
                <button class="frame-btn">🔥</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="profile-edit-form">
        <h3 class="form-title">Edit Profile</h3>

        <div class="form-group">
          <label class="form-label">Name</label>
          <input v-model="editForm.name" type="text" class="input" />
        </div>

        <div class="form-group">
          <label class="form-label">Bio</label>
          <textarea v-model="editForm.bio" class="input" rows="3"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Email</label>
          <input v-model="editForm.email" type="email" class="input" />
        </div>

        <div class="form-group">
          <label class="form-label">Phone</label>
          <input v-model="editForm.phone" type="tel" class="input" />
        </div>

        <div class="form-actions">
          <button class="btn btn-primary" @click="saveProfile">Save Changes</button>
          <button class="btn btn-secondary" @click="cancelEdit">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-view {
  height: 100%;
  overflow-y: auto;
  background-color: var(--bg-primary);
}

.profile-header {
  position: relative;
}

.profile-cover {
  height: 200px;
  background: linear-gradient(135deg, var(--accent-pink), var(--accent-green));
  position: relative;
  overflow: hidden;
}

.cover-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 107, 157, 0.8), rgba(152, 255, 179, 0.8));
}

.profile-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
}

.avatar-section {
  position: absolute;
  top: -80px;
  left: 2rem;
}

.avatar-container {
  position: relative;
  display: inline-block;
}

.avatar-edit-btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: var(--accent-pink);
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-edit-btn:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-md);
}

.status-indicator-large {
  position: absolute;
  bottom: 10px;
  left: 10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 4px solid var(--bg-primary);
}

.profile-info-section {
  padding: 2rem 0 2rem 160px;
  border-bottom: 1px solid var(--border-color);
}

.profile-header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.profile-name {
  font-size: 2rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
}

.profile-email {
  color: var(--text-secondary);
  margin: 0;
}

.premium-badge-large {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, var(--accent-pink), var(--accent-green));
  color: white;
  border-radius: 2rem;
  font-weight: 600;
}

.premium-icon {
  font-size: 1.25rem;
}

.profile-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-details {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.detail-section {
  background-color: var(--bg-secondary);
  border-radius: 1rem;
  padding: 2rem;
}

.detail-section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
}

.detail-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--bg-primary);
  border-radius: 0.75rem;
}

.detail-label {
  font-weight: 600;
  color: var(--text-secondary);
}

.detail-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-transform: capitalize;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  background-color: var(--bg-primary);
  border-radius: 0.75rem;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.2s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--accent-pink);
  margin-bottom: 0.25rem;
}

.stat-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.achievement-card {
  background-color: var(--bg-primary);
  border-radius: 0.75rem;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.achievement-card:hover {
  border-color: var(--accent-green);
  transform: translateY(-4px);
}

.achievement-card.locked {
  opacity: 0.5;
}

.achievement-icon {
  font-size: 3rem;
  margin-bottom: 0.75rem;
}

.achievement-name {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.achievement-desc {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.customization-options {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.custom-option {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.custom-label {
  font-weight: 600;
}

.frame-options {
  display: flex;
  gap: 1rem;
}

.frame-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid var(--border-color);
  background-color: var(--bg-primary);
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.frame-btn:hover {
  border-color: var(--accent-pink);
  transform: scale(1.1);
}

.frame-btn.active {
  border-color: var(--accent-pink);
  background-color: var(--bg-hover);
}

.profile-edit-form {
  background-color: var(--bg-secondary);
  border-radius: 1rem;
  padding: 2rem;
  max-width: 600px;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 2rem 0;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

textarea.input {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

@media (max-width: 768px) {
  .profile-info-section {
    padding-left: 0;
    padding-top: 100px;
  }

  .avatar-section {
    left: 50%;
    transform: translateX(-50%);
  }

  .profile-header-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .stats-grid,
  .achievements-grid {
    grid-template-columns: 1fr;
  }
}
</style>
