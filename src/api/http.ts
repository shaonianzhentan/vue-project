import axios from 'axios'
import qs from 'qs'
import Cache from './cache'

// 格式化参数
function formatParams(data: object) {
    return qs.stringify(data, {
        skipNulls: true
    })
}

const http = axios.create({
    baseURL: import.meta.env.VUE_APP_BASE_URL,

})
// 请求拦截器
http.interceptors.request.use(
    config => {
        return config
    },
    error => {
        Promise.reject(error)
    }
)
// 响应拦截器
http.interceptors.response.use(function (response) {
    // console.log(response)
    if (response.status === 200) {
        return response.data
    }
    return response
}, function (err) {
    // 这里做错误处理
    return Promise.reject(err)
})

interface HttpService {
    post(url: string, data: object | FormData, query?: object, extendParams?: object): Promise<any>;
}
class HttpService {

    // 取消标记源，用来取消请求
    get cancelTokenSource() {
        return axios.CancelToken.source()
    }

    /**
   * POST请求
   * @param {String} url - 接口地址
   * @param {Object} data - 当query不为空时，data为RequestPayload请求方式的值
   * @param {Object} query - url参数，在RequestPayload请求方式时使用
   * @param {Object} extendParams - axios拓展参数
   */
    post() {
        let url = arguments[0]
        let data = Object.create(null)
        let query = {}
        let extendParams = Object.create(null)

        if (arguments.length > 1) data = arguments[1]
        if (arguments.length > 2) query = arguments[2]
        if (arguments.length > 3) extendParams = arguments[3]

        // 如果传了query参数，则代码为request payload请求
        if (query != null) {
            url += '?' + formatParams(query)
        } else {
            if (['[object FormData]', '[object HTMLFormElement]'].includes(Object.prototype.toString.call(data))) {
                // 如果是FormData格式，则不进行编码
            } else {
                // 如果传的是数组，则不处理
                if (Array.isArray(data) === false) {
                    // 检测是否对象里包含对象
                    let isCheckObject = false
                    for (const key of Object.keys(data)) {
                        if (data[key] && typeof data[key] === 'object') {
                            isCheckObject = true
                            break
                        }
                    }
                    // 如果对象里不包括对象，则使用urlencoded模式请求
                    if (isCheckObject === false) {
                        // 格式转换，如果为null，则不传
                        data = formatParams(data)
                    }
                }
            }
        }

        // 判断是否定义缓存时间
        let cacheTimeout = 0
        if (Object.prototype.toString.call(extendParams) === '[object Object]') {
            if ('cache' in extendParams) {
                cacheTimeout = extendParams.cache
                delete extendParams.cache
            }
        }

        return Cache.action({
            timeout: cacheTimeout,
            key: `${url}${JSON.stringify(data)}`,
            value: () => {
                return http({
                    method: 'POST',
                    url: url,
                    data: data,
                    ...extendParams
                })
            }
        })
    }
}

const httpService = new HttpService()
export default httpService