import { createApp, DefineComponent, App } from 'vue'
import AppVue from './App.vue'

import GlobalComponents from './components'
import router from './router/index'
import store from './store/index'
import api from './api/index'
// 样式
// import 'reset-css';
import './style/global.scss'
// Table
import VXETable from './plugins/VXETable'
// UI
import ElementPlus from './plugins/ElementPlus'
// Bootstrap辅助类
import "bootstrap/scss/bootstrap-grid.scss";
import "bootstrap/scss/bootstrap-utilities.scss";

function initApp(app: App) {
    app.config.globalProperties.api = api
    app.config.globalProperties.$dialog = (com: DefineComponent, propsData = {}): Promise<any> => {
        return new Promise((resolve, reject) => {
            const div = document.createElement('div')
            document.body.appendChild(div)
            const comApp = initApp(createApp(com, Object.assign(propsData, {
                _ok(data: any) {
                    resolve(data)
                },
                _cancel() {
                    reject()
                },
                _closed() {
                    comApp.unmount()
                    div.remove()
                }
            })))
            comApp.mount(div)
        })
    }
    return app.use(router).use(store).use(ElementPlus).use(VXETable).use(GlobalComponents)
}

initApp(createApp(AppVue)).mount('#app')