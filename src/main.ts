import { createApp } from "vue"
// @ts-ignore
import App from "./App.vue"
import "./style/index.scss"
import { i18n } from "./locales/schema"
// @ts-ignore
import IframeResizerPlugin from "@iframe-resizer/vue"

const app = createApp(App)
app.use(i18n)
app.use(IframeResizerPlugin)
app.mount("#app")
