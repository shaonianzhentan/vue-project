// 兼容IE10
import axios from 'axios'
import qs from 'qs'
import Cache from './cache'

// 格式化参数
function formatParams(data) {
  return qs.stringify(data, {
    skipNulls: true
  })
}

class BaseHTTP {
  constructor({ baseURL }) {
    const http = axios.create({ baseURL })
    http.interceptors.response.use(function (response) {
      // 如果没有定义，则不使用
      if (http.custom_interceptors) {
        const res = http.custom_interceptors.success(response)
        if (res) {
          return res
        }
      }
      return response
    }, function (error) {
      // 如果没有定义，则不使用
      if (http.custom_interceptors) {
        const res = http.custom_interceptors.error(error)
        if (res) {
          error = res
        }
      }
      // 这里做错误处理
      return Promise.reject(error)
    })

    this.baseURL = baseURL
    this.http = http
  }

  static getInstance({ baseURL }) {
    let instance = this.instance
    if (!instance) {
      instance = new BaseHTTP({ baseURL })
      this.instance = instance
    }
    return instance
  }

  download(url, params = {}) {
    return new Promise((resolve) => {
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      document.body.appendChild(iframe)
      iframe.onload = function () {
        let body = ''
        try {
          body = iframe.contentWindow.document.body.innerText
          const result = JSON.parse(body)
          resolve(result)
        } catch (ex) {
          // 如果网关超时，则提示错误
          if (body.includes('504 Gateway Time-out')) {
            resolve({
              code: 1,
              msg: '请求超时，请重试'
            })
          } else if (body.includes('HTTP Status 404')) {
            resolve({
              code: 1,
              msg: '当前文件不存在'
            })
          } else if (body.includes('HTTP Status 401')) {
            resolve({
              code: 1,
              msg: '登录状态失效，请重新登录'
            })
          }
        }
        iframe.parentNode.removeChild(iframe)
      }
      // 如果传入的是一个链接，则直接下载
      if (url.indexOf('http') === 0) {
        iframe.src = url
      } else {
        iframe.src = `${this.baseURL}${url}?${formatParams(params)}`
      }
    })
  }
}

export default class {
  constructor({ baseURL, origin }) {
    const HTTP = BaseHTTP.getInstance({ baseURL })
    // 当前请求实例
    this.instance = HTTP.http
    // 基础API地址
    this.baseURL = baseURL
    // 原始地址
    this.origin = origin
    // 返回原始的axios对象
    this.$http = axios
    // 取消标记源，用来取消请求
    this.cancelTokenSource = () => axios.CancelToken.source()
    /**
      * 下载文件
      * @param {String} url
      * @param {Object} params
      */
    this.download = HTTP.download
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
    let query = null
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
        return this.instance({
          method: 'POST',
          url: url,
          data: data,
          ...extendParams
        })
      }
    })
  }

  /**
   * GET请求
   * @param {String} url - 接口地址
   * @param {Object} query - url参数
   * @param {Object} extendParams - axios拓展参数
   */
  get() {
    const url = arguments[0]
    let params = Object.create(null)
    let extendParams = Object.create(null)

    if (arguments.length > 1) params = arguments[1]
    if (arguments.length > 2) {
      extendParams = arguments[2]
      if (extendParams === 'download') {
        return this.download(url, params)
      } else if (extendParams === 'link') {
        return Promise.resolve(url.indexOf('http') === 0 ? url : `${this.baseURL}${url}?${formatParams(params)}`)
      } else if (Object.prototype.toString.call(extendParams) === '[object Object]' && 'DownloadID' in extendParams.headers) {
        // 如果DownloadID标识出现在了headers中，则判断为使用Blob方式下载
        return this.$http({
          method: 'GET',
          url: `${this.baseURL}${url}`,
          params: params,
          responseType: 'blob',
          ...extendParams
        }).then(async res => {
          if (res.status === 200) {
            const headers = res.headers
            const blobData = new Blob([res.data])
            // 判断当前返回文档类型的格式，如果是json格式，则返回错误信息
            if (headers['content-type'].includes('application/json')) {
              return new Promise((resolve) => {
                const fr = new FileReader()
                fr.readAsText(blobData)
                fr.onload = function () {
                  resolve(JSON.parse(fr.result))
                }
              })
            } else {
              // 获取文件名称
              const filename = headers['content-disposition'].replace('attachment; filename=', '')
              const url = window.URL.createObjectURL(blobData);
              const link = document.createElement('a');
              link.style.display = 'none';
              link.href = url;
              // 自定义下载文件名
              link.setAttribute('download', decodeURIComponent(filename));
              document.body.appendChild(link);
              link.click();
              return {
                code: 0,
                msg: '导出成功'
              }
            }
          } else {
            return {
              code: 1,
              msg: '出现异常，请刷新重试'
            }
          }
        })
      }
    }

    return this.instance({
      method: 'GET',
      url: url,
      params: params,
      ...extendParams
    })
  }
}
