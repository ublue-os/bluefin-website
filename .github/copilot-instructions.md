# GitHub Copilot Instructions for Bluefin Website

**ALWAYS follow these instructions first and only fallback to additional search and context gathering if the information here is incomplete or found to be in error.**

## Project Overview

This is the official website for **Project Bluefin**, a next-generation Linux workstation operating system designed for reliability, performance, and sustainability. Bluefin combines the reliability and ease of use of a Chromebook with the power of a GNOME desktop, targeting cloud-native enthusiasts and developers who need a more reliable Linux desktop experience.

**Key Characteristics:**
- Cloud-native patterns applied to desktop computing
- Container-focused workflows for developers
- Image-based updates for system stability
- Strong focus on sustainability and community
- Designed for both end users and developers

## Working Effectively

**Package Management:**
- **Primary:** npm (used in CI/CD and recommended for development)
- **Secondary:** Bun (bun.lockb present but not required)
- **Always use npm commands** for consistency with GitHub Actions deployment
- Both package-lock.json and bun.lockb are maintained in the repository

**Bootstrap, build, and test the repository:**

1. **Install dependencies** (takes ~6 seconds):
   ```bash
   npm install
   ```
   - Uses npm as primary package manager (Bun lockfile also present but npm preferred)
   - May show deprecation warning for @types/marked (safe to ignore)

2. **Build the project** (takes ~3 seconds):
   ```bash
   npm run build
   ```
   - **NEVER CANCEL**: Set timeout to 60+ seconds minimum
   - Outputs to `./dist/` directory
   - TypeScript compilation with vue-tsc followed by Vite build
   - May show Sass @import deprecation warning (safe to ignore, still works)

3. **Development server** (starts in ~1 second):
   ```bash
   npm run dev
   ```
   - Runs on http://localhost:5173/
   - Hot reload enabled
   - **NEVER CANCEL**: Use background mode and stop when needed

4. **Preview production build** (starts immediately):
   ```bash
   npm run preview
   ```
   - Runs on http://localhost:4173/
   - Tests the production build locally

## Validation

**ALWAYS manually validate changes through complete user scenarios:**

1. **Start development server** and navigate to http://localhost:5173/
2. **Test core functionality:**
   - Language selector in header works (try switching languages)
   - Navigation menu scrolls to sections
   - FAQ items expand/collapse
   - All external links open in new tabs
   - Download form responds to selections
3. **Test responsive design:** Resize browser to mobile/tablet widths
4. **Check console** for JavaScript errors or warnings
5. **Take screenshots** of any UI changes you make

**DO NOT** skip manual validation - the build succeeding does not guarantee functionality works correctly.

## Linting and Code Quality

**Code formatting** (takes ~3-5 seconds):
```bash
# Check formatting issues
npx prettier --check src/ --config .prettierrc

# Fix formatting issues  
npx prettier --write src/ --config .prettierrc
```
- **Note**: Prettier will show "quote-props" warning (suggest "quoteProps") but still works correctly
- Always run formatting before committing changes
- First run may install prettier@3.6.2 automatically

**ESLint** - Configured but dependencies not installed:
- .eslintrc extends @antfu but @antfu packages not in package.json
- ESLint setup appears incomplete
- Use Prettier for code formatting instead
- DO NOT attempt to fix ESLint setup during normal development tasks

## Common Commands and Timing

- `npm install`: ~6 seconds (may show @types/marked deprecation warning)
- `npm run build`: ~3 seconds (**NEVER CANCEL**, timeout: 60+ seconds, may show Sass deprecation warning)
- `npm run dev`: ~1 second to start
- `npm run preview`: Instant start
- `npx prettier --check src/`: ~3-5 seconds (may install prettier first run)
- `npx prettier --write src/`: ~3-5 seconds

**CRITICAL**: All build commands complete quickly (~3-6 seconds), but ALWAYS set 60+ second timeouts to account for slower systems or first-run installations.

## Technology Stack

### Frontend Framework
- **Vue 3** with Composition API (`<script setup>` syntax preferred)
- **TypeScript** for type safety
- **Vite** for build tooling and development server
- **Vue i18n** for internationalization (12 languages supported: de-DE, en-US, eo, fr-FR, ja-JP, nl-NL, pt-BR, ru-RU, sk-SK, vi-VN, zh-HK, zh-TW)

### Styling
- **TailwindCSS 4.1.12** for utility-first CSS framework with new Vite plugin integration
- **SCSS** for custom styling with mixins and helpers
- **Custom SCSS mixins** located in `src/style/setup/_mixins.scss`
- **Responsive design** patterns for mobile, tablet, and desktop

### Additional Libraries
- **@iconify-prerendered/vue-mdi** for Material Design icons
- **marked** for markdown parsing
- **@vueuse/core** and **@vueuse/components** for Vue utilities and composables
- **@iframe-resizer** packages for responsive iframe embedding
- **sass** for SCSS compilation

## Repository Structure

**Key directories and files:**
```
/
├── .github/workflows/         # CI/CD pipelines
│   ├── deploy.yml            # GitHub Pages deployment
│   └── pagespeed.yml         # Performance monitoring
├── public/                   # Static assets
│   ├── characters/           # Character artwork (.webp)
│   ├── brands/              # Brand logos (.svg, .png)
│   ├── evening/             # Background images
│   └── favicons/            # Site icons
├── src/
│   ├── components/          # Vue components
│   │   ├── scenes/         # Major page sections
│   │   ├── sections/       # Smaller reusable sections
│   │   └── common/         # Shared components
│   ├── locales/            # i18n translation files (JSON)
│   ├── style/              # SCSS styling
│   ├── content.ts          # Main content constants
│   ├── composables.ts      # Vue composables
│   └── main.ts            # App entry point
├── package.json            # Dependencies and scripts
├── vite.config.ts         # Vite configuration
├── tailwind.config.js     # TailwindCSS configuration
├── tsconfig.json          # TypeScript configuration
└── .prettierrc           # Code formatting rules
```

**No test infrastructure exists** - validation is done manually through browser testing.

## Code Organization

### Component Development Patterns

#### Scene Components
Large page sections that typically include:
- Parallax effects and animations
- Character artwork integration
- Structured content with tags, titles, and descriptions
- Visibility tracking for navigation

#### Responsive Design
- Mobile-first approach
- Use `IS_TABLET` composable for conditional logic
- Progressive image loading for performance
- Adaptive content based on screen size

#### Performance Considerations
- Lazy loading for images: `loading="lazy"`
- WebP format for images where possible
- Conditional asset loading based on device capabilities
- Preload critical assets in `App.vue`

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

#### Existing Components Reference
**Scenes:** `SceneLanding.vue`, `SceneDevelopers.vue`, `SceneGamers.vue`
**Sections:** Various section components in `/components/sections/`
**Common:** `Navigation.vue`, `PageLoading.vue`, `FaqItem.vue`, `ImagePicker.vue`
**Utilities:** `RssFeed.vue`, `SceneVisibilityChecker.vue`, `TextArrow.vue`

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

**Available languages:** de-DE, en-US, eo, fr-FR, ja-JP, nl-NL, pt-BR, ru-RU, sk-SK, vi-VN, zh-HK, zh-TW (12 total)

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

## Development Workflows

### Making Changes
1. **Start development server:** `npm run dev`
2. **Make your changes** to Vue components, TypeScript, or SCSS files
3. **Test functionality manually** in browser (http://localhost:5173/)
4. **Format code:** `npx prettier --write src/`
5. **Build to verify:** `npm run build`
6. **Test production build:** `npm run preview`

### Adding New Components
1. **Create component** in appropriate directory (`scenes/`, `sections/`, or `common/`)
2. **Follow naming convention** (PascalCase, descriptive names)
3. **Use `<script setup>` syntax** with TypeScript
4. **Import and register** in parent components
5. **Test responsive behavior** on mobile/tablet/desktop

### Adding New Languages
1. **Create `{locale}.json`** in `src/locales/` following `en-US.json` schema
2. **Ensure all keys match** the English version exactly
3. **Update imports** in `src/locales/schema.ts`
4. **Test language switching** via header dropdown

### Troubleshooting
- **Build failures:** Check TypeScript errors in terminal output
- **Sass deprecation warnings:** Expected and safe to ignore (@import rules deprecated)
- **@types/marked deprecation:** Expected and safe to ignore (marked provides own types)
- **Prettier quote-props warning:** Expected and safe to ignore (suggests "quoteProps" but "quote-props" works)
- **Missing images:** Verify paths relative to `public/` directory
- **Translation issues:** Ensure locale keys exist in all 12 language files
- **Styling problems:** Check for SCSS syntax errors or missing Tailwind classes
- **ESLint errors:** Use Prettier instead (ESLint setup incomplete)

## CI/CD Pipeline

**GitHub Actions workflows:**
- **deploy.yml:** Builds and deploys to GitHub Pages on push to main
- **pagespeed.yml:** Monitors site performance daily

**Deployment process:**
1. Code pushed to main branch
2. GitHub Actions runs `npm install` and `npm run build`
3. Built files from `./dist/` deployed to GitHub Pages
4. Live site updates at https://projectbluefin.io/

## Quick Reference

### Common File Locations
- **Components:** `src/components/{scenes,sections,common}/`
- **Styles:** `src/style/`
- **Translations:** `src/locales/`
- **Content:** `src/content.ts`
- **Assets:** `public/{characters,brands,evening}/`
- **Config:** `vite.config.ts`, `tailwind.config.js`, `tsconfig.json`

### Essential Commands
```bash
npm install           # Install dependencies (~6s, may show deprecation warning)
npm run dev          # Start dev server (~1s)
npm run build        # Build for production (~3s, may show Sass warning)
npm run preview      # Preview production build
npx prettier --write src/  # Format code (~3-5s, may install prettier first)
```

**CRITICAL REMINDERS:**
- ⏱️ **NEVER CANCEL builds** - Always set 60+ second timeouts
- 🧪 **ALWAYS test manually** after making changes
- 📱 **Test responsive design** on different screen sizes
- 🌍 **Consider i18n impact** for all text changes (12 languages supported)
- 📸 **Take screenshots** of UI changes for review
- ⚠️ **Ignore warnings** - Sass @import and @types/marked deprecation warnings are expected
- **Always** follow the conventional commits specification when sending pull requests: conventional-commits/conventionalcommits.org
- **Always** include screenshots of both desktop and mobile in pull requests, even in subsequent runs
- **Always** use tailwind css and do not hardcode pixel sizes
- **Always** ensure that every file passes lint at the end of the request, be especially strict with vue syntax
- **Always** ensure images are compressed appropriately, the website must be mobile friendly
