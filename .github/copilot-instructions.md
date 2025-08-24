# GitHub Copilot Instructions for Bluefin Website

## Project Overview

This is the official website for **Project Bluefin**, a next-generation Linux workstation operating system designed for reliability, performance, and sustainability. Bluefin combines the reliability and ease of use of a Chromebook with the power of a GNOME desktop, targeting cloud-native enthusiasts and developers who need a more reliable Linux desktop experience.

**Key Characteristics:**
- Cloud-native patterns applied to desktop computing
- Container-focused workflows for developers
- Image-based updates for system stability
- Strong focus on sustainability and community
- Designed for both end users and developers

## Technology Stack

### Frontend Framework
- **Vue 3** with Composition API (`<script setup>` syntax preferred)
- **TypeScript** for type safety
- **Vite** for build tooling and development server
- **Vue i18n** for internationalization (13+ languages supported)

### Styling
- **TailwindCSS 4.x** for utility-first CSS framework
- **SCSS** for custom styling with mixins and helpers
- **Custom SCSS mixins** located in `src/style/setup/_mixins.scss`
- **Responsive design** patterns for mobile, tablet, and desktop

### Additional Libraries
- **@iconify-prerendered/vue-mdi** for icons
- **marked** for markdown parsing
- **@vueuse/core** and **@vueuse/components** for Vue utilities
- **@iframe-resizer** for embedded content

## Code Organization

### Directory Structure
```
src/
├── components/          # Vue components
│   ├── scenes/         # Major page sections (Landing, Developers, Users)
│   └── sections/       # Smaller reusable sections
├── locales/            # i18n translation files (JSON)
├── style/              # SCSS styling
│   ├── setup/          # SCSS mixins, fonts, and utilities
│   ├── app/            # Component-specific styles
│   └── overrides/      # Style overrides
├── content.ts          # Main content constants and data
├── composables.ts      # Vue composables
├── schemas.ts          # TypeScript type definitions
└── main.ts            # Vue app entry point
```

### Component Patterns

#### Preferred Component Structure
```vue
<script setup lang="ts">
// Imports
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

// Props and emits (if needed)
defineProps<{
  title?: string
}>()

// Composables
const { t } = useI18n()

// Local state and logic
const isVisible = ref(false)
</script>

<template>
  <!-- Template with semantic HTML -->
  <section class="component-name">
    <h2>{{ t('Section.Title') }}</h2>
  </template>
</template>
```

#### Component Naming
- Use PascalCase for component names
- Scene components: `Scene{Name}.vue` (e.g., `SceneLanding.vue`)
- Section components: `Section{Name}.vue` (e.g., `SectionMission.vue`)
- Utility components: descriptive names (e.g., `PageLoading.vue`, `Navigation.vue`)

## Content Management

### Internationalization Pattern
All user-facing text should be externalized to translation files:

**In content.ts:**
```typescript
export const LangSectionTitle = 'Default English Text'
```

**In locale files (e.g., en-US.json):**
```json
{
  "Section": {
    "Title": "Localized Text",
    "Subtitle": "More localized content"
  }
}
```

**In components:**
```vue
<template>
  <h2>{{ t('Section.Title') }}</h2>
</template>
```

### Content Guidelines
- Use markdown support where available (rendered with `marked.parse()`)
- Support HTML in content when necessary
- Include proper citations for quotes using `<cite>` tags
- Maintain consistent voice that reflects Bluefin's mission and character

## Styling Guidelines

### SCSS Mixins (src/style/setup/_mixins.scss)
Common mixins available for use:

```scss
@include flex($gap, $justify, $align, $direction, $wrap)  // Flexbox layouts
@include grid($gap, $columns)                             // Grid layouts
@include t($time, $type)                                  // Transitions
@include noselect()                                       // Disable text selection
@include noscrollbar()                                    // Hide scrollbars
```

### TailwindCSS Integration
- Prefer Tailwind utilities for spacing, colors, and typography
- Use custom SCSS for complex animations and component-specific styles
- Follow mobile-first responsive design principles

### Color and Theme
- Uses CSS custom properties for theming
- Dark/light theme support through CSS variables
- Ocean/aquatic color palette reflecting the Bluefin theme
- Ensure the font sizes match and are consistent across components

## Component Development Patterns

### Scene Components
Large page sections that typically include:
- Parallax effects and animations
- Character artwork integration
- Structured content with tags, titles, and descriptions
- Visibility tracking for navigation

### Responsive Design
- Mobile-first approach
- Use `IS_TABLET` composable for conditional logic
- Progressive image loading for performance
- Adaptive content based on screen size

### Performance Considerations
- Lazy loading for images: `loading="lazy"`
- WebP format for images where possible
- Conditional asset loading based on device capabilities
- Preload critical assets in `App.vue`

## Image and Asset Management

### Image Conventions
- Character artwork: `./characters/{name}.webp`
- Brand logos: `/brands/{name}.svg`
- Scene backgrounds: `./evening/{name}-min.webp`
- Use descriptive alt text for accessibility

### Asset Preloading
Critical images are preloaded in `App.vue` with conditional loading for mobile devices.

## Development Best Practices

### TypeScript
- Use strict mode and maintain type safety
- Define proper interfaces for complex data structures
- Prefer type inference where possible

### Vue 3 Composition API
- Use `<script setup>` syntax for all new components
- Prefer `ref()` and `reactive()` for state management
- Use `computed()` for derived state
- Leverage `@vueuse` utilities for common patterns

### Code Style
- Follow Prettier configuration (2 spaces, no semicolons, double quotes)
- Use ESLint with @antfu configuration
- Maintain consistent naming conventions

## Adding New Languages

To add a new language:
1. Create `{locale}.json` in `src/locales/` following the `en-US.json` schema
2. Ensure all keys match the English version
3. Update locale imports in `src/locales/schema.ts`
4. The language will be automatically available via Navigator.language detection

## Common Patterns and Conventions

### Loading States
Use the `PageLoading` component for initial page load states. Components often use local loading states:
```vue
<script setup lang="ts">
const isLoaded = ref(false)
onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
  }, 150)
})
</script>
```

### Navigation Integration
Components can integrate with the navigation system using the `visibleSection` provide/inject pattern via `SceneVisibilityChecker`.

### Smooth Scrolling
Use smooth scrolling for navigation between sections:
```typescript
function scrollToSection() {
  document.querySelector("#section-id")?.scrollIntoView({ behavior: "smooth" })
}
```

### Language Switching
Language switching uses URL parameters:
```typescript
const redirectToLang = (lang: string) => {
  const urlParams = new URLSearchParams(window.location.search)
  urlParams.set("lang", lang)
  window.location.search = urlParams
}
```

### Responsive Helpers
Use the `IS_TABLET` composable for responsive logic:
```typescript
import { IS_TABLET } from "../composables"
// IS_TABLET.value returns true for screens <= 956px
```

### Markdown Content
Use `marked.parse(t('key'))` for content that supports markdown formatting.

### External Links
Always use `target="_blank"` for external links and include proper `rel` attributes for security.

## Project-Specific Context

### Bluefin Character and Voice
- Bluefin is referred to as "she" and characterized as a predatory, adaptive creature
- Content should reflect themes of evolution, adaptation, and survival
- Technical content should emphasize cloud-native patterns and reliability
- Community-focused messaging highlighting collaboration and sustainability

### Target Audience
- **Primary**: Developers and Linux operators seeking reliable desktop experience
- **Secondary**: General users wanting Chromebook-like simplicity with Linux power
- Content should balance technical depth with accessibility

### Key Features to Highlight
- Container-focused development workflows
- Image-based updates for stability
- Developer mode transformation
- GNOME desktop with cloud-native patterns
- Community-driven development approach

Remember: When suggesting code changes, prioritize maintainability, performance, and consistency with existing patterns. Always consider the international audience and ensure proper i18n integration for any text content.