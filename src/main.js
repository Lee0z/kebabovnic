import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const options = {
  // You can set your default options here
}

const app = createApp(App)

app.use(router)
app.use(Toast, options)

app.mount('#app')
