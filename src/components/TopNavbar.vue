<script setup lang="ts">
// Left side navigation
const leftNavLinks = [
  { name: 'Documentation', href: 'https://docs.projectbluefin.io/introduction' },
  { name: 'Ask Bluefin', href: 'https://ask.projectbluefin.io', external: true }
]

// Right side navigation
const rightNavLinks = [
  { name: 'Blog', href: 'https://docs.projectbluefin.io/blog' },
  { name: 'Changelogs', href: 'https://docs.projectbluefin.io/changelogs' },
  { name: 'Community', href: 'https://github.com/ublue-os/bluefin/discussions', external: true },
  { name: 'Feedback', href: 'https://feedback.projectbluefin.io/', external: true },
  { name: 'Store (US Only)', href: 'https://store.projectbluefin.io', external: true }
]
</script>

<template>
  <nav class="docusaurus-navbar navbar navbar--fixed-top">
    <div class="navbar__inner">
      <div class="navbar__items">
        <a href="https://projectbluefin.io" class="navbar__brand">
          <div class="navbar__logo">
            <img src="/img/logo.svg" alt="Bluefin" />
          </div>
          <b class="navbar__title text--truncate">Bluefin</b>
        </a>
        <a
          v-for="link in leftNavLinks"
          :key="link.name"
          :href="link.href"
          class="navbar__item navbar__link"
          :target="link.external ? '_blank' : undefined"
          :rel="link.external ? 'noopener noreferrer' : undefined"
        >
          {{ link.name }}
        </a>
      </div>
      
      <div class="navbar__items navbar__items--right">
        <a
          v-for="link in rightNavLinks"
          :key="link.name"
          :href="link.href"
          class="navbar__item navbar__link"
          :target="link.external ? '_blank' : undefined"
          :rel="link.external ? 'noopener noreferrer' : undefined"
        >
          {{ link.name }}
        </a>
      </div>
    </div>
  </nav>
</template>

<style scoped lang="scss">
// Docusaurus navbar styles - matching the docs site exactly
.docusaurus-navbar {
  --ifm-navbar-background-color: #242526;
  --ifm-navbar-link-color: rgba(255, 255, 255, 0.9);
  --ifm-navbar-link-hover-color: #4a69bd;
  --ifm-navbar-height: 60px;
  --ifm-navbar-padding-horizontal: 1rem;
  --ifm-navbar-padding-vertical: calc((var(--ifm-navbar-height) - var(--ifm-navbar-item-height)) / 2);
  --ifm-navbar-item-height: 32px;
  
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--ifm-navbar-height);
  background-color: var(--ifm-navbar-background-color);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.navbar__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1440px;
  margin: 0 auto;
  padding: var(--ifm-navbar-padding-vertical) var(--ifm-navbar-padding-horizontal);
  height: 100%;
}

.navbar__items {
  display: flex;
  align-items: center;
  gap: 0;
  height: 100%;
}

.navbar__brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  margin-right: 1rem;
  height: var(--ifm-navbar-item-height);
  
  &:hover {
    opacity: 0.8;
  }
}

.navbar__logo {
  display: flex;
  align-items: center;
  height: 100%;
  
  img {
    height: 2rem;
    width: auto;
    display: block;
  }
}

.navbar__title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--ifm-navbar-link-color);
  line-height: 1;
}

.text--truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.navbar__item {
  display: inline-flex;
  align-items: center;
}

.navbar__link {
  color: var(--ifm-navbar-link-color);
  text-decoration: none;
  font-size: 1rem;
  font-weight: 400;
  padding: calc(var(--ifm-navbar-padding-vertical) / 2) 0.75rem;
  line-height: 1.5;
  display: flex;
  align-items: center;
  height: var(--ifm-navbar-item-height);
  transition: color 0.2s ease;
  
  &:hover {
    color: var(--ifm-navbar-link-hover-color);
  }
}

.navbar__items--right {
  flex: 1;
  justify-content: flex-end;
}

// Mobile responsive - matching Docusaurus breakpoints
@media (max-width: 996px) {
  .docusaurus-navbar {
    --ifm-navbar-padding-horizontal: 0.5rem;
  }
  
  .navbar__link {
    font-size: 0.9rem;
    padding: calc(var(--ifm-navbar-padding-vertical) / 2) 0.5rem;
  }
  
  .navbar__brand {
    margin-right: 0.5rem;
  }
}

@media (max-width: 768px) {
  .navbar__items {
    a:not(.navbar__brand) {
      display: none;
    }
  }
  
  .navbar__brand {
    margin: 0 auto;
  }
  
  .navbar__items--right {
    display: none;
  }
}
</style>
</style>
