import { createApp } from 'vue'
import { Quasar, Dialog, Notify, Loading, LoadingBar } from 'quasar'
import router from './router'
import './style.css'
import App from './App.vue'

const app = createApp(App)

app.use(Quasar, {
    plugins: { Dialog, Notify, Loading, LoadingBar },
    config: {
      dark: false
    }
  })
  
app.use(router).mount('#app')