<p align="center">
  <a href="https://projectbluefin.io/"><img src="/public/meta.webp?raw=true" alt="Bluefin"/></a>
</p>

# Website for [Bluefin](https://github.com/ublue-os/bluefin)

<p align="center">
  <img src="/metrics.plugin.pagespeed.svg?raw=true" alt="Google Pagespeed Metrics"/>
</p>

## Development

This website is built with [Vite](https://vitejs.dev/) and [Vue](https://vuejs.org/). npm is the primary package manager; `just` is optional to simplify common commands.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)
- [just](https://github.com/casey/just)

### Getting Started

First, install the dependencies:

```bash
npm install
```

Then, you can use `just` to run the common commands:

-   `just serve`: Run the development server
-   `just build`: Build for production

<details>
<summary>Don't have `just`? Use npm</summary>

-   `npm run dev`: Run the development server
-   `npm run build`: Build for production

</details>

## Contributing

If you want to add another language to this website, add a json file to [src/locales](src/locales) with your language file named following [Navigator.language](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/language) and it should be good to go!

Your new language will follow the schema from `enUS`, so make sure the fields and everything are the same. Some fields may contain markdown support or HTML support, that really depends and there is just no way I can document this here.
