import Vue from 'vue'
import BaseApi from './lib/baseApi'
import Storage from './lib/baseStorage'
import Validate from './lib/baseValidate'


const storage = new Storage({
    prefix: 'prefix',
    constant: [
    ]
})
const validate = new Validate()
class API {
    
    get storage() { return storage }
    get validate() { return validate }

    loading(text) {

    }

    toast(msg, options = {}) {

    }

    alert(msg, options, title = "提示") {

    }

    confirm(msg, options, title = "提示") {

    }

    prompt(msg, options, title = "提示") {

    }

    async _component(component, propsData = {}, constructorArgs = {}) {
        let _constructor = Vue.extend(component)
        return new Promise((resolve, reject) => {
            let instance = new _constructor({
                ...constructorArgs,
                propsData,
            }).$mount(document.createElement('div'))
            instance.$on('done', data => resolve(data))
            instance.$on('close', data => reject(data))
        })
    }
}


export default {
    install(Vue, { router, store }) {
        if (this.installed) return
        this.installed = true

        Vue.api = Vue.prototype.api = Object.setPrototypeOf(API.prototype, BaseApi.prototype)
        //将api属性设置为不可写，为了防止某些插件冲突
        Object.defineProperty(Vue, 'api', {
            configurable: false,   // 不可删除
            writable: false, // 不可写
        });
        Object.defineProperty(Vue.prototype, 'api', {
            configurable: false,   // 不可删除
            writable: false, // 不可写
        });



        Vue.api.component = async (component, propsData = {}, constructorArgs = {}) => {
            if (typeof component === 'string') {
                let obj = {
                    // 'TaskList': () => import('@/components/common/TaskList')
                }
                let com = obj[component]
                if (com !== null) {
                    component = (await com()).default
                } else {
                    throw new Error('组件未定义')
                }
            }
            return Vue.api._component(component, propsData, {
                router,
                store,
                ...constructorArgs
            })
        }
    }
}