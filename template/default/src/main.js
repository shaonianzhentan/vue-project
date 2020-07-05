import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

import Api from './api/index'
Vue.use(Api, {store, router})

Vue.config.productionTip = false

new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app')
