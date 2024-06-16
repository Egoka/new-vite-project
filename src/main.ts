import "./assets/main.css"
// import './assets/style.css'
// import '@egorkas/vite-components/dist/style.css'

import { createApp } from "vue"
// import { createPinia } from 'pinia'
// import CodeBlock from 'vue3-code-block';

import App from "./App.vue"
// import router from './router'

const app = createApp(App)

// app.use(createPinia())
// app.use(router)
// @ts-ignore
// app.use(CodeBlock)

app.mount("#app")
