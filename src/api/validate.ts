class Validate {
    /**
     * 验证是否整数
     * @param {Any} value
     */
    isInteger(value: any) {
        return /^\d+$/.test(value) && value != 0
    }

    /**
     * 是否浮点数
     * @param {Any} value - 验证字符串
     * @param {Integer} bit - 小数位长度
     */
    isFloat(value: any, bit = 0) {
        const bitStr = bit > 1 ? `1,${bit}` : bit.toString()
        const regStr = `^\\d+(\\.\\d{${bitStr}})?$`
        const reg = new RegExp(regStr)
        return reg.test(value)
    }

    /**
     * JS中判断值是否为空
     * @param {Any} value
     */
    isEmpty(value: any) {
        return value !== 0 && !value
    }

    /**
     * 判断是否为邮箱格式
     * @param {String} value
     */
    isEmail(value: string) {
        return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)
    }

    /**
     * 判断是否手机号码
     * @param {String|Number} value
     */
    isPhoneNumber(value: any) {
        return /^1[0-9]{10}$/.test(value)
    }

    /**
     * 验证是否可输入字符串
     * @param {String} value
     */
    isInputString(value: string) {
        // ．=_~`+……——{}|:"【】！￥（）@#$%&,，：；·‘’“”。、;'《》[]<>?-\/
        return /[^．=_~`+……——{}|:"【】！￥（）@#$%&,，：；·‘’“”。、;'\\\.\!\^\*\(\)\<\>》《\s\[\]\?\-\/A-Za-z0-9\u3300-\u9fa5]/g.test(value) === false
    }

    /**
     * 是否包含中文
     * @param {String} value
     */
    isChineseChar(value: string, isMatchAll = false) {
        // 全部匹配为中文
        if (isMatchAll) return /^[\u4E00-\u9FA5\uF900-\uFA2D]+$/.test(value)
        // 包含中文字符
        return /[\u4E00-\u9FA5\uF900-\uFA2D]/.test(value)
    }

    /* ---------------类型检测--------------- */
    /**
     * 是否String类型
     * @param {Any} value
     */
    isString(value: any) {
        return Object.prototype.toString.call(value) === '[object String]'
    }

    /**
     * 是否Number类型
     * @param {Any} value
     */
    isNumber(value: any) {
        /**
         * 注意：Infinity、NaN 也是Number类型
         */
        return Object.prototype.toString.call(value) === '[object Number]'
    }

    /**
     * 是否Boolean类型
     * @param {Any} value
     */
    isBoolean(value: any) {
        return Object.prototype.toString.call(value) === '[object Boolean]'
    }

    /**
     * 是否Null类型
     * @param {Any} value
     */
    isNull(value: any) {
        return Object.prototype.toString.call(value) === '[object Null]'
    }

    /**
     * 是否Undefined类型
     * @param {Any} value
     */
    isUndefined(value: any) {
        return Object.prototype.toString.call(value) === '[object Undefined]'
    }

    /**
     * 是否Error类型
     * @param {Any} value
     */
    isError(value: any) {
        return Object.prototype.toString.call(value) === '[object Error]'
    }

    /**
     * 是否Symbol类型
     * @param {Any} value
     */
    isSymbol(value: any) {
        return Object.prototype.toString.call(value) === '[object Symbol]'
    }

    /**
     * 是否Function类型
     * @param {Any} value
     */
    isFunction(value: any) {
        return Object.prototype.toString.call(value) === '[object Function]'
    }

    /**
     * 是否Array类型
     * @param {Any} value
     */
    isArray(value: any) {
        return Object.prototype.toString.call(value) === '[object Array]'
    }

    /**
     * 是否Object类型
     * @param {Any} value
     */
    isObject(value: any) {
        return Object.prototype.toString.call(value) === '[object Object]'
    }

}
const validate = new Validate()
export default validate