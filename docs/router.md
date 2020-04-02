# 全局路由
---
## 来源页面 -  referrer

> 使用方式
```js
const from = this.$router.referrer
```

> 源码解析
```js
router.beforeEach((to, from, next) => {

  //将来源页面信息保存
  router['referrer'] = from

  next()
}
```

## 重定向 -  redirect

> 使用方式
```js
// system/user.vue

this.$router.redirect({path: '/system/user', query: { id: 1}})
// 在同一个页面跳转
this.$router.redirect({path: '/system/user', query: { id: 2}})
```

!> 注意：在vue中从`当前页面传参数跳转到当前页面`不会重新执行页面的生命周期

> 源码解析
```js
// router.js

// 定义重定向的方法
router['redirect'] = (params) => router.replace({ name: "common-redirect", params })
```

```js
// redirect.vue

export default {
  created () {
    let params = this.$route.params
    this.$router.replace(params)
  }
}
```

!> 注意：`common-redirect`是`redirect.vue`的路由名称（利用这个页面中转一下）