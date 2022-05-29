
import PageList from './global/page-list.vue'
import MpDialog from './global/mp-dialog.vue'
import MpDrawer from './global/mp-drawer.vue'

const components = {
    PageList,
    MpDialog,
    MpDrawer
}

export default {
    install(app: import("vue").App<any>) {
        for (const [key, value] of Object.entries(components)) {
            app.component(key, value)
        }
    }
}