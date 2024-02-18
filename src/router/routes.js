const routes = [
    {
        path: '/',
        name: 'dashboard',
        component: () => import('../pages/Dashboard.vue'),
        meta: {
            layout: 'App',
            isMenu: true
        }
    },

    // Always leave this as last one,
    // but you can also remove it
    // {
    //    path: '/:catchAll(.*)*',
    //    component: () => import('pages/ErrorNotFound.vue')
    //}
]

export default routes