# API - 接口服务类
---

# HTTP库 - $http

!> axios原生请求实例，不包含任何初始化定义

```js
const axios = this.api.service.$http
// 返回的是axios请求库的对象
```

# 当前HTTP请求实例 - instance

!> 内部请求封装使用，一般不直接使用，包含拦截器、baseURL等参数定义

```js
const instance = this.api.service.instance
// 经过初始化的axios请求实例，在框架内部使用
```

> 源码解析
```js

const instance = axios.create({ baseURL })

instance.interceptors.response.use(function (response) {
  // 这里调用自定义的拦截器
  let res = instance.custom_interceptors.success(response)
  return res || response
}, function (error) {
  // 这里调用自定义的错误拦截器
  let res = instance.custom_interceptors.error(error)
  return Promise.reject(res || error)
})

```
!> `custom_interceptors`是在上层自定义的一个专门拦截处理数据的对象

# 接口基础地址 - baseURL

> 使用方式

```js
const baseURL = this.api.service.baseURL
// 生产中： https://www.jiluxinqing.com/swagger/
// 开发中： https://localhost:8080/api/swagger/
```

# 地址源属性 - origin

> 使用方式

```js
const origin = this.api.service.origin
// 生产中： https://www.jiluxinqing.com/
// 开发中： https://localhost:8080/api/
```


!> 在vue开发环境因为要使用反向代理，则需要在后面定义`/api/` 

> 源码解析
```js
// 开发环境和生产环境，使用的是不一致的
export let origin = isPro ? `${location.origin}/` : `${location.origin}/api/`
```


!> 注意 `location.origin` 在IE中是没有的，需要做兼容处理

```js
if (!location.origin) location.origin = `${location.protocol}//${location.host}`
```

# 取消请求 - cancelTokenSource
```js
const source = this.api.service.cancelTokenSource()
// source = { token: String, cancel: Function }

// 假定这个请求的时间为5秒
this.api.service.user_login({
    user: '李大胖',
    pwd: '123456'
}, null, {
    cancelToken: source.token
}).then(res=>{
    
})

// 1秒后这里会取消请求
source.cancel('用户取消了登录操作')

```


# 下载文件 - download
!> 在使用iframe时，请注意同源策略（同源下可获取当前iframe里的内容，用来判断当前下载异常情况）

> 使用方式
```js
// 直接下载
let url = 'https://xxx.com/file'
this.api.service.download(url).then(res=>{
    // 这里处理一些错误信息 
})

// 同源下载
let url = '/path/file'
this.api.service.download(url, {id: 123}).then(res=>{
    // 这里处理一些错误信息 
})
```

> 源码解析
```js

/**
  * 下载文件
  * @param {String} url
  * @param {Object} params
  */
function download(url, params = {}) {
  return new Promise((resolve) => {
    let iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    document.body.appendChild(iframe)
    iframe.onload = function () {
      let body = ''
      try {
        body = iframe.contentWindow.document.body.innerText
        let result = JSON.parse(body)
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
      iframe.src = `${baseURL}${url}?${formatParams(params)}`
    }
  })
}

```



# 测试方法 - test
```js
this.api.service.test().then(res=>{
    // 接口返回值：res
})
```

# HTTP接口请求方法和注意事项

!> 注意事项：因公司后端框架问题，默认使用`application/x-www-form-urlencoded`编码方式

```js

/** 
 * 基本调用方式
 * POST地址：/index/login
 * 参数：user=李二狗&pwd=123456
 */
this.api.service.index_login({
    user: '李二狗',
    pwd: '123456'
}).then(({code, data, msg}) => {
    if(code === 0){
        // 这里写成功后的处理逻辑
    }
    // 这里提出提示
    this.api.toast(msg)
})

```
!> 注意事项：当第二个参数不为null时，请求文档类型自动转为json格式，使用`application/json`编码方式

```js

/** 
 * 第二个参数会拼接到url上，如：/index/login?xxx=xxx
 * POST地址：/index/login
 * 参数：{user: '李二狗', pwd: '123456'}
 */
this.api.service.index_login({
    user: '李二狗',
    pwd: '123456'
}, {})


// 当发送请求为数组时，自动使用json格式发送请求
this.api.service.user_add([
    {user: '小猪猪', pwd: '123456'},
    {user: '小羊羊', pwd: '123456'},
    {user: '小狗狗', pwd: '123456'}
])

// 当参数中包含对象时，自动使用json格式发送请求
this.api.service.index_login({
    user: '李二狗',
    pwd: '123456',
    obj: {}
})
```

!> 注意事项：上传文件使用`multipart/form-data`编码方式
```js

let formData = new FormData()
formData.append('file', file)

this.api.service.upload_file(formData).then(res=>{

})
```