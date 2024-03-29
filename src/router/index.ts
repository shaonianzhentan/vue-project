import { createRouter, createWebHashHistory } from 'vue-router'

import routes from './routes/index'

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    
    next()
})
export default router