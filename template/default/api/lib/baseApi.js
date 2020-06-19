/**
 * 存储类
 * 作者：来鸭来鸭一起来鸭
 * 创建日期：2020-6-19
 * 更新日期：
 */
export default class {

    /**
     * 生成UUID
     *
     */
    get uuid() {
        var s = []
        var hexDigits = '0123456789abcdef'
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
        }
        s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = '-'
        var uuid = s.join('')
        return uuid
    }

    /**
     * 复制数组对象，仅对不含方法的对象有效
     * @param {Array} arrObj
     */
    clone(arrObj) {
        return JSON.parse(JSON.stringify(arrObj))
    }

    /**
     * 查询url参数
     * @param {String} key 
     */
    query(key) {
        let search = new URLSearchParams(location.search)
        let value = search.get(key)
        return value ? decodeURIComponent(value) : value
    }

    /**
     * 剪切板操作
     * @param {String} text - 要复制的文本
     */
    clipboard(text) {
        let id = 'unique-id-clipboard-copyText'
        let copyText = document.getElementById(id)
        if (!copyText) {
            copyText = document.createElement('input')
            copyText.id = id
            copyText.style = 'position:absolute;left:-9999px'
            document.body.appendChild(copyText)
        }
        copyText.value = text
        copyText.select()
        copyText.setSelectionRange(0, copyText.value.length)
        document.execCommand('copy')
    }

    /**
     * 防抖
     * @param {Function} fn
     * @param {Number} wait
     */
    debounce(fn, wait) {
        let cache = this.debounce.prototype.cache || {}
        let fnKey = fn.toString()
        let timeout = cache[fnKey]
        if (timeout != null) clearTimeout(timeout)
        cache[fnKey] = setTimeout(() => {
            fn()
            // 清除内存占用
            if (Object.keys(cache).length === 0) {
                this.debounce.prototype.cache = null
            } else {
                delete this.debounce.prototype.cache[fnKey]
            }
        }, wait)
        this.debounce.prototype.cache = cache
    }

    /**
     * 节流
     * @param {Function} fn
     * @param {Number} delay
     */
    throttle(fn, delay) {
        let cache = this.throttle.prototype.cache || {}
        let fnKey = fn.toString()
        let timeout = cache[fnKey]
        // 如果正在进行中，则不做处理
        if (timeout != null) return
        cache[fnKey] = setTimeout(() => {
            fn()
            // 清除内存占用
            if (Object.keys(cache).length === 0) {
                this.throttle.prototype.cache = null
            } else {
                delete this.throttle.prototype.cache[fnKey]
            }
        }, delay)
        this.throttle.prototype.cache = cache
    }

    /**
     * 动态加载文件
     * @param {String} file - 文件路径
     * @param {Object} ops - { type: 文件类型 }
     */
    loader(file, ops = {}) {
        return new Promise((resolve) => {
            const id = `loader_${file.replace(/[^a-zA-Z0-9]/g, '')}`
            let ele = document.getElementById(id)
            if (ele !== null) {
                resolve()
                return
            }
            // 加载文件的类型
            let type = ops && ops.type
            if (file.endsWith('.js') || type === 'js' || type === 'module') {
                // 加载js文件
                ele = document.createElement('script')
                // 加载js模块
                if (type === 'module') {
                    ele.type = 'module'
                }
                ele.src = `${file}`
                document.body.appendChild(ele)
            }
            else if (file.endsWith('.css') || type === 'css') {
                // 加载css文件
                ele = document.createElement('link')
                ele.type = 'text/css'
                ele.rel = 'stylesheet'
                ele.href = `${file}`
                document.head.appendChild(ele)
            }
            ele.id = id
            // 加载完成
            ele.onload = function () {
                resolve()
            }
        })
    }

    /**
     * 获取小数点之后的数字长度
     * @param {String | Number} value 
     * @returns {Number} 小数点后面的数字长度
     */
    pointLength(value) {
        // 验证当前传入值的类型
        if (!this.validate.isNumber(value) && !this.validate.isString(value)) throw new Error(`要验证的值类型不是String | Number`)
        if (this.validate.isNumber(value)) {
            value = String(value)
        }
        let arr = value.split('.')
        if (arr.length === 2) {
            return arr[1].length
        }
        return 0
    }

    /**
     * 总和
     * @param {Array} arr - 要计算的数组
     * @param {Boolean} isSubtract - 是否采用累减计算（默认采用累加计算）
     */
    sum(arr, isSubtract = false) {
        // 判断传入arry不是数组直接返回
        if (!Array.isArray(arr)) throw new Error('【this.api.sum】传入的不是数组')
        // 储存小数点后位数
        let point = 0
        // 判断数组内部各项是否为数字 判断小数点位数
        for (let i = 0; i < arr.length; i++) {
            // 判断数组中是否为全数字
            let value = arr[i]
            if (typeof value !== 'number' || Number.isNaN(value)) throw new Error(`【this.api.sum】数组索引第${i}项不是数字`)
            // 获取小数点后位数
            let len = this.pointLength(value)
            if (point < len) point = len
        }
        // 取整放大倍数
        let maxPoint = Math.pow(10, point)
        // 累加结果字段
        let sum = arr.reduce(function (prev, cur, index) {
            if (isSubtract) {
                if (index === 0) {
                    return cur * maxPoint
                } else {
                    return prev - (cur * maxPoint)
                }
            } else {
                return (cur * maxPoint) + prev
            }
        }, 0)
        return sum / maxPoint
    }
}
