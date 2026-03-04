import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/styles/main.css'
import { setupGuards } from './router/guards'

const app = createApp(App)
app.use(createPinia())
app.use(router)
setupGuards(router)
app.mount('#app')
