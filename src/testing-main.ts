import { createApp } from "vue"
import TestingApp from "./TestingApp.vue"
import "./style/index.scss"
import { i18n } from "./locales/schema"

const app = createApp(TestingApp)
app.use(i18n)
app.mount("#app")
