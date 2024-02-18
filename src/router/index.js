import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
  linkActiveClass: 'text-grey-9 text-weight-bold'
})

export default router

