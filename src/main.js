import { createApp } from 'vue'
import { Quasar, Dialog, Notify, Loading, LoadingBar } from 'quasar'
import router from './router'
import { createPinia } from 'pinia'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
import '@quasar/extras/material-icons-round/material-icons-round.css'
import '@quasar/extras/material-icons-sharp/material-icons-sharp.css'
import 'quasar/src/css/index.sass'
import './assets/custom.css'

import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(Quasar, {
  plugins: { Dialog, Notify, Loading, LoadingBar },
  config: {
    dark: false
  }
})

app.use(router)
app.use(pinia)
app.mount('#app')