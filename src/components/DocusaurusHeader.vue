<template>
  <header :class="['navbar', isOpaque ? 'navbar--opaque' : 'navbar--translucent']">
    <div class="navbar__inner">
      <div class="theme-layout-navbar-left navbar__items">
        <button 
          aria-label="Toggle navigation bar" 
          :aria-expanded="isMobileMenuOpen" 
          class="navbar__toggle clean-btn" 
          type="button"
          @click="toggleMobileMenu"
        >
          <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
            <path stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="2" d="M4 7h22M4 15h22M4 23h22"></path>
          </svg>
        </button>
        <a class="navbar__brand" href="https://projectbluefin.io/">
          <div class="navbar__logo">
            <img src="/brands/universal-blue.svg" alt="Bluefin" class="themedComponent_mlkZ themedComponent--dark_xIcU" />
          </div>
          <b class="navbar__title text--truncate">Bluefin</b>
        </a>
        <a class="navbar__item navbar__link" href="https://docs.projectbluefin.io/introduction">Documentation</a>
        <a href="https://ask.projectbluefin.io" target="_blank" rel="noopener noreferrer" class="navbar__item navbar__link">
          Ask Bluefin
        </a>
      </div>
      <div class="theme-layout-navbar-right navbar__items navbar__items--right">
        <a class="navbar__item navbar__link" href="https://docs.projectbluefin.io/blog">Blog</a>
        <a class="navbar__item navbar__link" href="https://docs.projectbluefin.io/changelogs">Changelogs</a>
        <a href="https://github.com/ublue-os/bluefin/discussions" target="_blank" rel="noopener noreferrer" class="navbar__item navbar__link">
          Community
        </a>
        <a href="https://feedback.projectbluefin.io/" target="_blank" rel="noopener noreferrer" class="navbar__item navbar__link">
          Feedback
        </a>
        <a href="https://github.com/ublue-os/bluefin" target="_blank" rel="noopener noreferrer" class="navbar__item navbar__link">
          GitHub
        </a>
        <div class="toggle_vylO colorModeToggle_DEke">
          <button 
            class="clean-btn toggleButton_gllP" 
            type="button" 
            :title="getThemeLabel()" 
            :aria-label="`Switch between dark and light mode (currently ${getThemeLabel()})`"
            @click="toggleTheme"
          >
            <svg 
              v-show="currentTheme === 'light'" 
              viewBox="0 0 24 24" 
              width="24" 
              height="24" 
              aria-hidden="true" 
              class="toggleIcon_g3eP lightToggleIcon_pyhR"
            >
              <path fill="currentColor" d="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5 S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1 s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0 c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95 c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41 L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41 s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06 c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z"></path>
            </svg>
            <svg 
              v-show="currentTheme === 'dark'" 
              viewBox="0 0 24 24" 
              width="24" 
              height="24" 
              aria-hidden="true" 
              class="toggleIcon_g3eP darkToggleIcon_wfgR"
            >
              <path fill="currentColor" d="M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36 c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z"></path>
            </svg>
            <svg 
              v-show="currentTheme === 'auto'" 
              viewBox="0 0 24 24" 
              width="24" 
              height="24" 
              aria-hidden="true" 
              class="toggleIcon_g3eP systemToggleIcon_QzmC"
            >
              <path fill="currentColor" d="m12 21c4.971 0 9-4.029 9-9s-4.029-9-9-9-9 4.029-9 9 4.029 9 9 9zm4.95-13.95c1.313 1.313 2.05 3.093 2.05 4.95s-0.738 3.637-2.05 4.95c-1.313 1.313-3.093 2.05-4.95 2.05v-14c1.857 0 3.637 0.737 4.95 2.05z"></path>
            </svg>
          </button>
        </div>
        <div class="navbarSearchContainer_Bca1">
          <div ref="searchContainer" id="docsearch-container"></div>
        </div>
      </div>
    </div>
    
    <!-- Mobile Menu Sidebar -->
    <div 
      v-if="isMobileMenuOpen" 
      class="navbar-sidebar" 
      :class="{ 'navbar-sidebar--show': isMobileMenuOpen }"
    >
      <div class="navbar-sidebar__brand">
        <a class="navbar__brand" href="https://docs.projectbluefin.io/" @click="closeMobileMenu">
          <div class="navbar__logo">
            <img src="/brands/bluefin.svg" alt="Bluefin" />
          </div>
          <b class="navbar__title">Bluefin</b>
        </a>
      </div>
      <div class="navbar-sidebar__items">
        <div class="navbar-sidebar__item">
          <a class="navbar__link" href="https://docs.projectbluefin.io/introduction" @click="closeMobileMenu">Documentation</a>
        </div>
        <div class="navbar-sidebar__item">
          <a href="https://ask.projectbluefin.io" target="_blank" rel="noopener noreferrer" class="navbar__link" @click="closeMobileMenu">
            Ask Bluefin
          </a>
        </div>
        <div class="navbar-sidebar__item">
          <a class="navbar__link" href="https://docs.projectbluefin.io/blog" @click="closeMobileMenu">Blog</a>
        </div>
        <div class="navbar-sidebar__item">
          <a class="navbar__link" href="https://docs.projectbluefin.io/changelogs" @click="closeMobileMenu">Changelogs</a>
        </div>
        <div class="navbar-sidebar__item">
        </div>
        <div class="navbar-sidebar__item">
          <a href="https://github.com/ublue-os/bluefin/discussions" target="_blank" rel="noopener noreferrer" class="navbar__link" @click="closeMobileMenu">
            Community
          </a>
        </div>
        <div class="navbar-sidebar__item">
          <a href="https://feedback.projectbluefin.io/" target="_blank" rel="noopener noreferrer" class="navbar__link" @click="closeMobileMenu">
            Feedback
          </a>
        </div>
        <div class="navbar-sidebar__item">
          <a href="https://github.com/ublue-os/bluefin" target="_blank" rel="noopener noreferrer" class="navbar__link" @click="closeMobileMenu">
            GitHub
          </a>
        </div>
      </div>
    </div>
    
    <div 
      v-if="isMobileMenuOpen" 
      role="presentation" 
      class="navbar-sidebar__backdrop"
      @click="closeMobileMenu"
    ></div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

defineProps<{ isOpaque: boolean }>()

// Theme toggle functionality
const currentTheme = ref<'light' | 'dark' | 'auto'>('light')

// Mobile menu functionality
const isMobileMenuOpen = ref(false)

// Search functionality
const searchContainer = ref<HTMLElement>()
let docsearchInstance: any = null

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

// Initialize DocSearch with CDN approach
function initializeSearch() {
  if (searchContainer.value && !docsearchInstance && (window as any).docsearch) {
    try {
      docsearchInstance = (window as any).docsearch({
        container: searchContainer.value,
        appId: 'H1LI1VATRI',
        apiKey: '201fbeeb537ae90f533bedcb5a73230b',
        indexName: 'projectbluefin',
        placeholder: 'Search docs',
        searchParameters: {
          facetFilters: []
        },
        transformItems(items: any[]) {
          return items.map(item => ({
            ...item,
            url: `https://docs.projectbluefin.io${item.url}`
          }))
        }
      })
    } catch (error) {
      console.error('Failed to initialize DocSearch:', error)
      createFallbackButton()
    }
  } else if (searchContainer.value && !(window as any).docsearch) {
    createFallbackButton()
  }
}

function createFallbackButton() {
  if (searchContainer.value) {
    searchContainer.value.innerHTML = `
      <button class="DocSearch-Button" onclick="window.open('https://docs.projectbluefin.io/search', '_blank')">
        <span class="DocSearch-Button-Container">
          <svg width="20" height="20" class="DocSearch-Search-Icon" viewBox="0 0 20 20">
            <path d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z" stroke="currentColor" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
          <span class="DocSearch-Button-Placeholder">Search docs</span>
        </span>
        <span class="DocSearch-Button-Keys">
          <kbd class="DocSearch-Button-Key">⌘</kbd>
          <kbd class="DocSearch-Button-Key">K</kbd>
        </span>
      </button>
    `
  }
}

function destroySearch() {
  try {
    if (docsearchInstance && typeof docsearchInstance.destroy === 'function') {
      docsearchInstance.destroy()
    }
  } catch (error) {
    console.error('Failed to destroy DocSearch:', error)
  } finally {
    docsearchInstance = null
  }
}

// Load DocSearch from CDN
function loadDocSearch() {
  return new Promise((resolve, reject) => {
    if ((window as any).docsearch) {
      resolve(true)
      return
    }

    // Load CSS
    const cssLink = document.createElement('link')
    cssLink.rel = 'stylesheet'
    cssLink.href = 'https://cdn.jsdelivr.net/npm/@docsearch/css@3'
    document.head.appendChild(cssLink)

    // Load JS
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/@docsearch/js@3'
    script.onload = () => resolve(true)
    script.onerror = () => reject(new Error('Failed to load DocSearch'))
    document.head.appendChild(script)
  })
}

// Handle Ctrl+K / Cmd+K for search
onMounted(async () => {
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto' | null
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (savedTheme) {
    currentTheme.value = savedTheme
  } else if (prefersDark) {
    currentTheme.value = 'dark'
  }
  
  applyTheme()
  
  // Load and initialize DocSearch
  try {
    await loadDocSearch()
    setTimeout(initializeSearch, 100)
  } catch (error) {
    console.error('Failed to load DocSearch from CDN:', error)
    setTimeout(createFallbackButton, 100)
  }
  
  // Add keyboard shortcut for search
  const handleKeydown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      const searchButton = document.querySelector('.DocSearch-Button') as HTMLButtonElement
      if (searchButton) {
        searchButton.click()
      }
    }
    // Close mobile menu on escape
    if (e.key === 'Escape') {
      closeMobileMenu()
    }
  }
  
  document.addEventListener('keydown', handleKeydown)
  
  // Cleanup
  return () => {
    document.removeEventListener('keydown', handleKeydown)
    destroySearch()
  }
})

onUnmounted(() => {
  destroySearch()
})

function toggleTheme() {
  const themes: ('light' | 'dark' | 'auto')[] = ['light', 'dark', 'auto']
  const currentIndex = themes.indexOf(currentTheme.value)
  const nextIndex = (currentIndex + 1) % themes.length
  currentTheme.value = themes[nextIndex]
  
  localStorage.setItem('theme', currentTheme.value)
  applyTheme()
}

function applyTheme() {
  const html = document.documentElement
  
  // Remove existing theme classes
  html.classList.remove('light', 'dark')
  
  if (currentTheme.value === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    html.classList.add(prefersDark ? 'dark' : 'light')
  } else {
    html.classList.add(currentTheme.value)
  }
  
  // Update data-theme attribute for CSS
  html.setAttribute('data-theme', getEffectiveTheme())
}

function getEffectiveTheme(): 'light' | 'dark' {
  if (currentTheme.value === 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return currentTheme.value
}

function getThemeLabel(): string {
  const effectiveTheme = getEffectiveTheme()
  if (currentTheme.value === 'auto') {
    return `auto mode (currently ${effectiveTheme})`
  }
  return `${currentTheme.value} mode`
}
</script>

<style scoped>
/* Import Docusaurus-like styling with proper fonts */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  transition: background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  background-color: var(--ifm-navbar-background-color, #ffffff);
  box-shadow: var(--ifm-navbar-shadow, 0 1px 2px 0 rgba(0, 0, 0, 0.1));
  font-size: 1.5rem;
  font-family: var(--ifm-font-family-base, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol");
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.navbar--opaque {
  background-color: #ffffff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
}

.navbar--translucent {
  background-color: #242526;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
}

.navbar__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1360px;
  margin: 0 auto;
}

.navbar__items {
  display: flex;
  align-items: center;
  gap: 0;
}

.navbar__brand {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--ifm-navbar-link-color, #1c1e21);
  margin-right: 1rem;
  font-weight: var(--ifm-font-weight-bold, 700);
  font-family: var(--ifm-font-family-base);
  transition: opacity 0.15s ease-in-out;
}

.navbar__brand:hover {
  text-decoration: none;
  color: var(--ifm-navbar-link-color, #1c1e21);
  opacity: 0.6;
}

.navbar__logo {
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
}

.navbar__logo img {
  height: 32px;
  width: 32px;
}

.navbar__title {
  font-size: 1.5rem;
  font-weight: var(--ifm-font-weight-bold, 700);
  font-family: var(--ifm-font-family-base);
  color: var(--ifm-navbar-link-color, #1c1e21);
  white-space: nowrap;
}

.text--truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.navbar__item {
  display: flex;
  align-items: center;
}

.navbar__link {
  text-decoration: none;
  color: var(--ifm-navbar-link-color, #1c1e21);
  font-weight: var(--ifm-font-weight-semibold, 600);
  font-family: var(--ifm-font-family-base);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 0.75rem;
  border-radius: 0.375rem;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out;
  font-size: var(--ifm-font-size-base, 1.5rem);
}

.navbar__link:hover {
  color: var(--ifm-navbar-link-hover-color, var(--ifm-color-primary, #4a69bd));
  text-decoration: none;
}

.navbar__toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  margin-right: 0.75rem;
  color: #1c1e21;
}

.navbar__toggle svg {
  color: #1c1e21;
}

.clean-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
}

/* Mobile menu sidebar */
.navbar-sidebar {
  position: fixed;
  top: 60px;
  left: 0;
  width: 300px;
  height: calc(100vh - 60px);
  background: var(--ifm-navbar-background-color, #242526);
  border-right: 1px solid var(--ifm-toc-border-color, #e3e5e6);
  z-index: 999;
  transform: translateX(-100%);
  transition: transform 0.3s ease-in-out;
  overflow-y: auto;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.navbar-sidebar--show {
  transform: translateX(0);
}

.navbar-sidebar__brand {
  padding: 1rem;
  border-bottom: 1px solid var(--ifm-toc-border-color, #e3e5e6);
}

.navbar-sidebar__items {
  padding: 1rem 0;
}

.navbar-sidebar__item {
  margin: 0;
}

.navbar-sidebar__item .navbar__link {
  display: block;
  padding: 0.75rem 1rem;
  border-radius: 0;
  margin: 0;
  color: var(--ifm-navbar-link-color, #1c1e21);
  font-weight: var(--ifm-font-weight-normal, 400);
  text-decoration: none;
}

.navbar-sidebar__item .navbar__link:hover {
  background-color: var(--ifm-color-emphasis-100, rgba(0, 0, 0, 0.05));
  color: var(--ifm-navbar-link-hover-color, #4a69bd);
}

.navbar-sidebar__backdrop {
  position: fixed;
  top: 60px;
  left: 0;
  width: 100vw;
  height: calc(100vh - 60px);
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
}

.toggle_vylO {
  margin-left: 0.5rem;
}

.colorModeToggle_DEke {
  margin-left: 0.5rem;
}

.toggleButton_gllP {
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: background-color 0.15s ease-in-out;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ifm-navbar-link-color, #1c1e21);
}

.toggleButton_gllP:hover {
  background-color: var(--ifm-color-emphasis-200, rgba(0, 0, 0, 0.05));
}

.toggleIcon_g3eP {
  width: 20px;
  height: 20px;
  color: inherit;
}

.lightToggleIcon_pyhR,
.darkToggleIcon_wfgR,
.systemToggleIcon_QzmC {
  color: inherit;
}

.navbarSearchContainer_Bca1 {
  margin-left: 0.5rem;
}

/* DocSearch customization to match Docusaurus styling */
.DocSearch-Button {
  border-radius: 0.375rem;
  border: 1px solid var(--docsearch-searchbox-border-color, #dadde1);
  background: var(--docsearch-searchbox-background, #f5f6f7);
  font-size: 0.875rem;
  font-family: var(--ifm-font-family-base);
  min-width: 200px;
  height: 36px;
  transition: all 0.15s ease-in-out;
}

.DocSearch-Button:hover {
  background: var(--docsearch-searchbox-focus-background, #ebedf0);
  border-color: var(--docsearch-searchbox-border-color, #bdc1c6);
  box-shadow: var(--docsearch-searchbox-shadow, 0 2px 4px rgba(0, 0, 0, 0.1));
}

/* Dark mode support */
[data-theme="dark"] .DocSearch-Button {
  background: var(--docsearch-searchbox-background, #2d3748);
  border-color: var(--docsearch-searchbox-border-color, #4a5568);
}

[data-theme="dark"] .DocSearch-Button:hover {
  background: var(--docsearch-searchbox-focus-background, #4a5568);
}

/* Mobile responsiveness */
@media (max-width: 996px) {
  .DocSearch-Button {
    min-width: auto;
    width: 40px;
    justify-content: center;
    padding: 0;
  }
  
  .DocSearch-Button-Placeholder,
  .DocSearch-Button-Keys {
    display: none;
  }
  
  .DocSearch-Button-Container {
    width: 100%;
    justify-content: center;
  }
}


/* Define CSS custom properties to match Docusaurus theme */
:root {
  --ifm-font-family-base: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  --ifm-font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  --ifm-font-size-base: 1rem;
  --ifm-font-weight-light: 300;
  --ifm-font-weight-normal: 400;
  --ifm-font-weight-semibold: 500;
  --ifm-font-weight-bold: 700;
  --ifm-navbar-background-color: #242526;
  --ifm-navbar-link-color: #1c1e21;
  --ifm-navbar-link-hover-color: #4a69bd;
  --ifm-color-primary: #4a69bd;
  --ifm-color-emphasis-200: rgba(0, 0, 0, 0.05);
  --docsearch-searchbox-background: #f5f6f7;
  --docsearch-searchbox-border-color: #dadde1;
  --docsearch-searchbox-focus-background: #ebedf0;
  --docsearch-placeholder-color: #969faf;
  --docsearch-muted-color: #969faf;
  --docsearch-key-border-color: #dadde1;
  --docsearch-key-gradient-color: #444950;
  --docsearch-key-shadow: #cdcde6;
}

/* Dark mode colors to match Docusaurus dark theme */
[data-theme="dark"] {
  --ifm-navbar-background-color: #181920;
  --ifm-navbar-link-color: #f5f6f7;
  --ifm-navbar-link-hover-color: #5c7bd1;
  --ifm-color-primary: #5c7bd1;
  --ifm-color-emphasis-200: rgba(255, 255, 255, 0.1);
  --docsearch-searchbox-background: #2d3748;
  --docsearch-searchbox-border-color: #4a5568;
  --docsearch-searchbox-focus-background: #4a5568;
  --docsearch-placeholder-color: #a0aec0;
  --docsearch-muted-color: #a0aec0;
  --docsearch-key-border-color: #4a5568;
  --docsearch-key-gradient-color: #e2e8f0;
  --docsearch-key-shadow: #2d3748;
}

.navbar--opaque[data-v-b9390813] {
  background-color: var(--ifm-navbar-background-color);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
}

.navbar--translucent[data-v-b9390813] {
  background-color: var(--ifm-navbar-background-color);
  opacity: 0.95;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] .navbar--opaque[data-v-b9390813] {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .navbar--translucent[data-v-b9390813] {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
}

/* Dark mode support for mobile menu */
[data-theme="dark"] .navbar__toggle {
  color: #f5f6f7;
}

[data-theme="dark"] .navbar__toggle svg {
  color: #f5f6f7;
}

[data-theme="dark"] .navbar-sidebar {
  background: var(--ifm-navbar-background-color, #181920);
  border-right-color: #444950;
}

[data-theme="dark"] .navbar-sidebar__brand {
  border-bottom-color: #444950;
}

[data-theme="dark"] .navbar-sidebar__item .navbar__link {
  color: var(--ifm-navbar-link-color, #f5f6f7);
}

[data-theme="dark"] .navbar-sidebar__item .navbar__link:hover {
  background-color: var(--ifm-color-emphasis-200, rgba(255, 255, 255, 0.1));
  color: var(--ifm-navbar-link-hover-color, #5c7bd1);
}

@media (max-width: 996px) {
  .navbar__toggle {
    display: block;
  }
  
  .navbar__items:not(.navbar__items--right) .navbar__link:not(.navbar__brand) {
    display: none;
  }
  
  .DocSearch-Button {
    min-width: auto !important;
    width: 40px !important;
    justify-content: center !important;
    padding: 0 !important;
  }
  
  .DocSearch-Button-Placeholder,
  .DocSearch-Button-Keys {
    display: none !important;
  }
  
  .DocSearch-Button-Container {
    width: 100% !important;
    justify-content: center !important;
  }
}

@media (max-width: 768px) {
  .navbar__items--right .navbar__link {
    display: none;
  }
  
  .navbar__items--right .toggle_vylO,
  .navbar__items--right .navbarSearchContainer_Bca1 {
    display: flex;
  }
}
</style>
