# Gemini Code Assistant Context

## Project Overview

This is the source code for the [Project Bluefin](https://projectbluefin.io/) website. It is a single-page application built with Vue.js and Vite.

The main dependencies are:
- Vue.js: The core framework for building the user interface.
- Vite: The build tool for development and production.
- Tailwind CSS: A utility-first CSS framework for styling.
- vue-i18n: For internationalization and multi-language support.

The application's entry point is `src/main.ts`, which mounts the root Vue component, `src/App.vue`. The `App.vue` component handles the main layout and routing of the application.

## Building and Running

To get started with the project, you first need to install the dependencies using `npm`:

```bash
npm install
```

Then, you can run the development server with:

```bash
npm run dev
```

This will start a local server, and you can view the website in your browser.

To build the project for production, run:

```bash
npm run build
```

This will create a `dist` directory with the optimized and minified files for deployment.

## Development Conventions

### Internationalization (i18n)

The website supports multiple languages through the `vue-i18n` library. The language files are located in the `src/locales` directory. To add a new language, create a new JSON file in this directory, following the structure of the existing language files (e.g., `en-US.json`). The new language will be automatically detected and made available in the application.

### Styling

The project uses Tailwind CSS for styling, with some additional custom styles in the `src/style` directory. The main Tailwind configuration is in `tailwind.config.js`.

### Components

The Vue components are organized in the `src/components` directory. The components are further divided into `common`, `scenes`, and `sections` to improve organization.
