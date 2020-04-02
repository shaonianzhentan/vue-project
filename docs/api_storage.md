# API - 存储类
---

# localStorage
> 使用方式
```js

// 设置
this.api.storage.set('name', '这里是要存储的值')

// 读取
let val = this.api.storage.get('name')

// 移除
this.api.storage.remove('name')

// 获取实际的key
let key = this.api.storage.getKey('name')

```
!> `getKey方法`返回的值，是加上前缀的值，也就是本地储存的原始名称


> 源码解析
```js

  // 设置
  set (key, value) {
    // 判断当前给的键，是否预定义过
    if (!super.constant.includes(key)) {
      throw new Error(`${key}在storage的常量中未定义`)
    }
    localStorage.setItem(this.getKey(key), JSON.stringify({
      key: key,
      value: value
    }))
  }

```


# sessionStorage
> 使用方式
```js

// 设置
this.api.storage.setSession('name', '这里是要存储的值')

// 读取
let val = this.api.storage.getSession('name')

// 移除
this.api.storage.removeSession('name')

// 获取实际的key
let key = this.api.storage.getKey('name')

```
!> `getKey方法`返回的值，是加上前缀的值，也就是本地储存的原始名称

# cookie
> 使用方式
```js

// 设置
this.api.storage.setCookie('name', '这里是要存储的值')

// 可选参数
this.api.storage.setCookie('name', '这里是要存储的值', { domain, path, expires })


// 读取
let val = this.api.storage.getCookie('name')

// 移除
this.api.storage.removeCookie('name')

```

!> `cookie`的存储名称没有经过任何处理