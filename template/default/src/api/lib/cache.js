// 请求缓存
const cacheMap = new Map()

export default class {
  /**
   * 执行缓存操作
   * @param {Object} { key: 主键, value: 要缓存的值, timeout: 超时时间}
   */
  static action({ key, value, timeout }) {
    let isCache = false
    // 判断timeout是否为数字，且大于0
    if (typeof timeout === 'number' && timeout > 0) {
      isCache = true
    }
    // 如果缓存，则执行操作
    if (isCache) {
      if (cacheMap.has(key)) {
        return cacheMap.get(key)
      }
    }
    // 判断存储的值为什么类型
    let res = null
    if (typeof value === 'function') {
      res = value()
    } else {
      res = value
    }
    // 如果缓存，则执行操作
    if (isCache) {
      cacheMap.set(key, res)
      // 定时删除
      setTimeout(() => {
        cacheMap.delete(key)
      }, timeout)
    }
    return res
  }
}
