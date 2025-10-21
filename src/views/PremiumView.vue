<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import type { PremiumPlan } from '@/types'

const userStore = useUserStore()
const selectedPlan = ref<string | null>(null)

const plans: PremiumPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly Premium',
    price: 9.99,
    duration: 'monthly',
    features: [
      '✨ Access to exclusive premium groups',
      '🎨 Custom themes and wallpapers',
      '📁 Unlimited file storage (up to 2GB per file)',
      '👥 Create up to 50 group chats',
      '🎭 Custom emoji reactions',
      '📌 Pin unlimited conversations',
      '🔒 Enhanced privacy features',
      '⚡ Priority support',
    ]
  },
  {
    id: 'yearly',
    name: 'Yearly Premium',
    price: 99.99,
    duration: 'yearly',
    popular: true,
    features: [
      '✨ All monthly premium features',
      '💎 Exclusive yearly subscriber badge',
      '🎁 Early access to new features',
      '📊 Advanced analytics',
      '🎨 Premium avatar frames',
      '🌟 Custom status messages',
      '📱 Cross-device sync priority',
      '🎯 2 months free (save $20)',
    ]
  }
]

const handleSubscribe = (planId: string) => {
  selectedPlan.value = planId
  // In a real app, this would initiate payment
  setTimeout(() => {
    userStore.upgradeToPremium()
    alert('Successfully subscribed to Premium! 🎉')
  }, 1000)
}
</script>

<template>
  <div class="premium-view">
    <div class="premium-hero">
      <div class="hero-content">
        <div class="hero-badge">⭐ PREMIUM</div>
        <h1 class="hero-title">Upgrade to Premium</h1>
        <p class="hero-subtitle">
          Unlock exclusive features and take your chat experience to the next level
        </p>
      </div>
      <div class="hero-illustration">
        <div class="floating-icon" style="animation-delay: 0s">💬</div>
        <div class="floating-icon" style="animation-delay: 0.5s">🎨</div>
        <div class="floating-icon" style="animation-delay: 1s">⭐</div>
        <div class="floating-icon" style="animation-delay: 1.5s">🔒</div>
      </div>
    </div>

    <div v-if="userStore.currentUser.isPremium" class="already-premium">
      <div class="premium-card">
        <div class="premium-icon">🎉</div>
        <h2>You're a Premium Member!</h2>
        <p>Thank you for your support. Enjoy all premium features!</p>
        <div class="premium-benefits">
          <div class="benefit-item">
            <span class="benefit-icon">✓</span>
            <span>Premium Groups Access</span>
          </div>
          <div class="benefit-item">
            <span class="benefit-icon">✓</span>
            <span>Custom Themes</span>
          </div>
          <div class="benefit-item">
            <span class="benefit-icon">✓</span>
            <span>Unlimited Storage</span>
          </div>
          <div class="benefit-item">
            <span class="benefit-icon">✓</span>
            <span>Priority Support</span>
          </div>
        </div>
        <button class="btn btn-secondary">Manage Subscription</button>
      </div>
    </div>

    <div v-else class="pricing-section">
      <h2 class="pricing-title">Choose Your Plan</h2>
      <p class="pricing-subtitle">Select the plan that works best for you</p>

      <div class="pricing-cards">
        <div
          v-for="plan in plans"
          :key="plan.id"
          class="pricing-card"
          :class="{ popular: plan.popular, selected: selectedPlan === plan.id }"
        >
          <div v-if="plan.popular" class="popular-badge">MOST POPULAR</div>

          <div class="plan-header">
            <h3 class="plan-name">{{ plan.name }}</h3>
            <div class="plan-price">
              <span class="price-currency">$</span>
              <span class="price-amount">{{ plan.price.toString().split('.')[0] }}</span>
              <span class="price-decimal">.{{ plan.price.toString().split('.')[1] }}</span>
              <span class="price-period">/{{ plan.duration === 'monthly' ? 'month' : 'year' }}</span>
            </div>
            <div v-if="plan.duration === 'yearly'" class="savings-badge">
              Save $20 per year
            </div>
          </div>

          <div class="plan-features">
            <div
              v-for="(feature, index) in plan.features"
              :key="index"
              class="feature-item"
            >
              {{ feature }}
            </div>
          </div>

          <button
            class="btn btn-primary"
            :class="{ 'btn-accent': plan.popular }"
            @click="handleSubscribe(plan.id)"
          >
            {{ selectedPlan === plan.id ? 'Processing...' : 'Subscribe Now' }}
          </button>
        </div>
      </div>
    </div>

    <div class="premium-features-section">
      <h2 class="section-title">Premium Features</h2>

      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">👥</div>
          <h3 class="feature-title">Exclusive Groups</h3>
          <p class="feature-description">
            Join premium-only groups with like-minded members and engage in high-quality discussions
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🎨</div>
          <h3 class="feature-title">Custom Themes</h3>
          <p class="feature-description">
            Personalize your chat experience with exclusive themes, colors, and wallpapers
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">📁</div>
          <h3 class="feature-title">Unlimited Storage</h3>
          <p class="feature-description">
            Share files up to 2GB each with unlimited cloud storage for all your media
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🔒</div>
          <h3 class="feature-title">Enhanced Privacy</h3>
          <p class="feature-description">
            Advanced privacy controls and security features to protect your conversations
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">⚡</div>
          <h3 class="feature-title">Priority Support</h3>
          <p class="feature-description">
            Get help faster with dedicated premium support available 24/7
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🎭</div>
          <h3 class="feature-title">Custom Reactions</h3>
          <p class="feature-description">
            Express yourself with custom emoji reactions and animated stickers
          </p>
        </div>
      </div>
    </div>

    <div class="faq-section">
      <h2 class="section-title">Frequently Asked Questions</h2>

      <div class="faq-list">
        <details class="faq-item">
          <summary class="faq-question">How do I cancel my subscription?</summary>
          <p class="faq-answer">
            You can cancel your subscription anytime from your settings. You'll continue to have premium access until the end of your billing period.
          </p>
        </details>

        <details class="faq-item">
          <summary class="faq-question">Can I switch between monthly and yearly plans?</summary>
          <p class="faq-answer">
            Yes! You can upgrade or downgrade your plan at any time. Changes will take effect at the start of your next billing cycle.
          </p>
        </details>

        <details class="faq-item">
          <summary class="faq-question">Is there a refund policy?</summary>
          <p class="faq-answer">
            We offer a 14-day money-back guarantee for all new subscriptions. If you're not satisfied, contact our support team for a full refund.
          </p>
        </details>

        <details class="faq-item">
          <summary class="faq-question">What payment methods do you accept?</summary>
          <p class="faq-answer">
            We accept all major credit cards, PayPal, Apple Pay, and Google Pay for your convenience.
          </p>
        </details>
      </div>
    </div>
  </div>
</template>

<style scoped>
.premium-view {
  height: 100%;
  overflow-y: auto;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
}

.premium-hero {
  position: relative;
  padding: 4rem 2rem;
  text-align: center;
  background: linear-gradient(135deg, var(--accent-pink), var(--accent-green));
  color: white;
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.hero-badge {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  letter-spacing: 1px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: bold;
  margin: 0 0 1rem 0;
  text-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.hero-subtitle {
  font-size: 1.25rem;
  margin: 0;
  opacity: 0.95;
}

.hero-illustration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  overflow: hidden;
}

.floating-icon {
  position: absolute;
  font-size: 4rem;
  opacity: 0.15;
  animation: float 6s ease-in-out infinite;
}

.floating-icon:nth-child(1) {
  top: 10%;
  left: 10%;
}

.floating-icon:nth-child(2) {
  top: 60%;
  left: 80%;
}

.floating-icon:nth-child(3) {
  top: 30%;
  right: 15%;
}

.floating-icon:nth-child(4) {
  bottom: 20%;
  left: 70%;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.already-premium {
  padding: 2rem;
  display: flex;
  justify-content: center;
}

.premium-card {
  max-width: 600px;
  width: 100%;
  background: linear-gradient(135deg, var(--accent-pink), var(--accent-green));
  color: white;
  padding: 3rem;
  border-radius: 1.5rem;
  text-align: center;
  box-shadow: var(--shadow-lg);
}

.premium-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
}

.premium-card h2 {
  font-size: 2rem;
  margin: 0 0 1rem 0;
}

.premium-card p {
  font-size: 1.1rem;
  margin: 0 0 2rem 0;
  opacity: 0.95;
}

.premium-benefits {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  text-align: left;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.benefit-icon {
  width: 24px;
  height: 24px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pricing-section {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.pricing-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0 0 1rem 0;
}

.pricing-subtitle {
  text-align: center;
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin: 0 0 3rem 0;
}

.pricing-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.pricing-card {
  background-color: var(--bg-secondary);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: var(--shadow-md);
  transition: all 0.3s;
  position: relative;
  border: 2px solid transparent;
}

.pricing-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}

.pricing-card.popular {
  border-color: var(--accent-green);
  box-shadow: 0 8px 24px rgba(152, 255, 179, 0.2);
}

.pricing-card.selected {
  border-color: var(--accent-pink);
}

.popular-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, var(--accent-pink), var(--accent-green));
  color: white;
  padding: 0.5rem 1.5rem;
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 1px;
}

.plan-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid var(--border-color);
}

.plan-name {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
}

.plan-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.price-currency {
  font-size: 1.5rem;
  font-weight: 600;
  margin-right: 0.25rem;
}

.price-amount {
  font-size: 4rem;
  font-weight: bold;
  line-height: 1;
}

.price-decimal {
  font-size: 2rem;
  font-weight: bold;
}

.price-period {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-left: 0.5rem;
}

.savings-badge {
  display: inline-block;
  background-color: var(--accent-green);
  color: var(--accent-black);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.plan-features {
  margin-bottom: 2rem;
}

.feature-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-light);
  text-align: left;
}

.feature-item:last-child {
  border-bottom: none;
}

.premium-features-section {
  padding: 4rem 2rem;
  background-color: var(--bg-secondary);
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0 0 3rem 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background-color: var(--bg-primary);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.feature-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
}

.feature-description {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.faq-section {
  padding: 4rem 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  background-color: var(--bg-secondary);
  border-radius: 0.75rem;
  padding: 1.5rem;
  cursor: pointer;
}

.faq-question {
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.faq-question::-webkit-details-marker {
  display: none;
}

.faq-question::after {
  content: '+';
  font-size: 1.5rem;
  color: var(--accent-pink);
  transition: transform 0.3s;
}

.faq-item[open] .faq-question::after {
  transform: rotate(45deg);
}

.faq-answer {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 1rem 0 0 0;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .pricing-cards {
    grid-template-columns: 1fr;
  }

  .premium-benefits {
    grid-template-columns: 1fr;
  }
}
</style>
