import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [{
    path: '/',
    name: 'dashboard',
    component: () => import('../pages/Dashboard.vue'),
    meta: {
      layout: 'App',
      isMenu: true
    }
  }],
  linkActiveClass: 'text-grey-9 text-weight-bold'
})

export default router
