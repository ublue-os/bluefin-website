<script setup lang="ts">
import { ref, computed } from 'vue'
import RssFeed from "./RssFeed.vue"

const selectedStream = ref<string>('stable')

const streams = [
  {
    id: 'stable',
    name: 'Stable',
    description: 'Stable releases (Recommended)',
    feedUrl: '/feeds/stable.xml',
    color: 'bg-green-100 text-green-800'
  },
  {
    id: 'gts',
    name: 'GTS',
    description: 'Greater Than Stable (Testing)',
    feedUrl: '/feeds/gts.xml',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'lts',
    name: 'LTS',
    description: 'Long Term Support',
    feedUrl: '/feeds/lts.xml',
    color: 'bg-purple-100 text-purple-800'
  }
]

const currentStream = computed(() => 
  streams.find(s => s.id === selectedStream.value)
)

const feedUrlForDisplay = computed(() => {
  if (typeof window !== 'undefined' && currentStream.value) {
    return `${window.location.origin}${currentStream.value.feedUrl}`
  }
  return currentStream.value?.feedUrl || ''
})

const copyFeedUrl = async (feedUrl: string) => {
  const fullUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${feedUrl}`
    : feedUrl
  
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(fullUrl)
      console.log('Feed URL copied to clipboard:', fullUrl)
    }
  } catch (err) {
    console.error('Failed to copy feed URL:', err)
  }
}
</script>

<template>
  <section class="release-feeds">
    <div class="container moderate">
      <!-- Header -->
      <div class="header-section">
        <h2>Release Feeds</h2>
        <p class="subtitle">
          Subscribe to release updates for your preferred Bluefin stream. Get notified of new releases, package updates, and upgrade instructions.
        </p>
      </div>

      <!-- Stream Selector -->
      <div class="stream-selector">
        <h3>Choose Your Release Stream</h3>
        <div class="stream-tabs">
          <button 
            v-for="stream in streams" 
            :key="stream.id"
            :class="[
              'stream-tab',
              { 'active': selectedStream === stream.id },
              stream.color
            ]"
            @click="selectedStream = stream.id"
          >
            <div class="stream-info">
              <span class="stream-name">{{ stream.name }}</span>
              <span class="stream-description">{{ stream.description }}</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Feed Actions -->
      <div class="feed-actions">
        <h4>Subscribe Options</h4>
        <div class="action-buttons">
          <a 
            :href="currentStream?.feedUrl" 
            target="_blank"
            class="action-button primary"
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm1.5 2.5c5.523 0 10 4.477 10 10a1 1 0 1 1-2 0 8 8 0 0 0-8-8 1 1 0 0 1 0-2zm0 4a6 6 0 0 1 6 6 1 1 0 1 1-2 0 4 4 0 0 0-4-4 1 1 0 0 1 0-2zm.5 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
            </svg>
            Subscribe in RSS Reader
          </a>
          
          <button 
            @click="copyFeedUrl(currentStream?.feedUrl || '')"
            class="action-button secondary"
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
              <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
            </svg>
            Copy Feed URL
          </button>
        </div>
      </div>

      <!-- Recent Releases Preview -->
      <div class="feed-preview">
        <h4>Recent {{ currentStream?.name }} Releases</h4>
        <RssFeed
          :feed-url="feedUrlForDisplay"
          :per-page="3"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.release-feeds {
  padding: 4rem 0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.header-section {
  text-align: center;
  margin-bottom: 3rem;
}

.header-section h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.125rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.stream-selector {
  margin-bottom: 3rem;
}

.stream-selector h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.5rem;
  text-align: center;
}

.stream-tabs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  max-width: 900px;
  margin: 0 auto;
}

.stream-tab {
  padding: 1.5rem;
  border: 2px solid transparent;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stream-tab:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stream-tab.active {
  border-color: #4285f4;
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.2);
}

.stream-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stream-name {
  font-size: 1.25rem;
  font-weight: 600;
}

.stream-description {
  font-size: 0.875rem;
  opacity: 0.8;
}

.feed-actions {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 3rem;
  text-align: center;
}

.feed-actions h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.action-button.primary {
  background: #4285f4;
  color: white;
}

.action-button.primary:hover {
  background: #3367d6;
  transform: translateY(-1px);
}

.action-button.secondary {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.action-button.secondary:hover {
  background: #e2e8f0;
  transform: translateY(-1px);
}

.feed-preview {
  background: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.feed-preview h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.5rem;
  text-align: center;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .release-feeds {
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  }
  
  .header-section h2,
  .stream-selector h3,
  .feed-actions h4,
  .feed-preview h4 {
    color: #f8fafc;
  }
  
  .subtitle {
    color: #94a3b8;
  }
  
  .stream-tab,
  .feed-actions,
  .feed-preview {
    background: #334155;
    border-color: #475569;
  }
  
  .action-button.secondary {
    background: #475569;
    color: #e2e8f0;
    border-color: #64748b;
  }
  
  .action-button.secondary:hover {
    background: #64748b;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .release-feeds {
    padding: 2rem 0;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .header-section h2 {
    font-size: 2rem;
  }
  
  .stream-tabs {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .action-button {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
}
</style>