/**
 * 存储类
 * 作者：来鸭来鸭一起来鸭
 * 创建日期：2020-6-19
 * 更新日期：
 */
export default class {

    /**
     * 初始实例
     * @param {String} prefix - 键名前缀
     * @param {Array} constant - 预声明存储键名
     */
    constructor({ prefix, constant }) {
        this.prefix = prefix
        this.constant = constant
    }

    /**
     * 获取实际存储的key值
     * @param {String} key 
     */
    getKey(key) {
        return `${this.prefix}${key}`
    }

    /**
     * 获取本地存储的值
     * @param {String} key 
     */
    get(key) {
        try {
            let result = JSON.parse(localStorage.getItem(this.getKey(key)))
            return result.value
        } catch (ex) {
            // console.log(ex)
            return null
        }
    }

    /**
     * 设置本地存储的值
     * @param {String} key 
     * @param {Any} value 
     */
    set(key, value) {
        // 判断当前给的键，是否预定义过
        if (!this.constant.includes(key)) {
            throw new Error(`${key}在storage的常量中未定义`)
        }
        localStorage.setItem(this.getKey(key), JSON.stringify({
            key: key,
            value: value
        }))
    }

    /**
     * 移除本地储存的值
     * @param {String} key 
     */
    remove(key) {
        localStorage.removeItem(this.getKey(key))
    }

    /**
     * 获取临时存储的值
     * @param {String} key 
     */
    getSession(key) {
        try {
            let result = JSON.parse(sessionStorage.getItem(this.getKey(key)))
            return result.value
        } catch (ex) {
            // console.log(ex)
            return null
        }
    }

    /**
     * 设置临时存储的值
     * @param {String} key 
     * @param {Any} value 
     */
    setSession(key, value) {
        // 判断当前给的键，是否预定义过
        if (!this.constant.includes(key)) {
            throw new Error(`${key}在storage的常量中未定义`)
        }
        sessionStorage.setItem(this.getKey(key), JSON.stringify({
            key: key,
            value: value
        }))
    }

    /**
     * 移除临时存储的值
     * @param {String} key 
     */
    removeSession(key) {
        sessionStorage.removeItem(this.getKey(key))
    }

    /**
     * 获取cookie值
     * @param {String} key  - cookie名称
     */
    getCookie(name) {
        var str = '(^| )' + name + '=([^;]+)(;|$)'
        var reg = new RegExp(str)
        var arr = document.cookie.match(reg)
        if (!arr) return null
        return arr[2]
    }

    /**
     * 设置cookie值
     * @param {String} name - 名称
     * @param {String} value - 值
     * @param {Object} day - 参数
     */
    setCookie(name, value, { domain, path, expires }) {
        let arr = []
        if (domain) arr.push('domain=' + domain)
        if (path) arr.push('path=' + domain)
        if (expires) arr.push('expires=' + expires)
        let str = arr.length > 0 ? arr.join('; ') : ''

        document.cookie = name + '=' + value + '; ' + str
    }

    /**
     * 删除cookie
     * @param {String} name - 名称
     */
    removeCookie(name) {
        let today = new Date()
        today.setDate(today.getDate() - 1)
        this.setCookie(name, '', {
            expires: today
        })
    }
}
