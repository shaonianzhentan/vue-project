# API - 接口服务类
---

# HTTP库 - $http

!> axios原生请求实例，不包含任何初始化定义

```js
const axios = this.api.http.$http
// 返回的是axios请求库的对象
```

# 当前HTTP请求实例 - instance

!> 内部请求封装使用，一般不直接使用，包含拦截器、baseURL等参数定义

```js
const instance = this.api.http.instance
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
const baseURL = this.api.http.baseURL
// 生产中： https://www.jiluxinqing.com/swagger/
// 开发中： https://localhost:8080/api/swagger/
```

# 地址源属性 - origin

> 使用方式

```js
const origin = this.api.http.origin
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

# 域名 - domain

> 使用方式

```js
const domain = this.api.http.domain
// 当前配置域名： https://www.jiluxinqing.com/
```