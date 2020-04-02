# API - 接口方法
---
# 微信接口 - wxReady

```js

this.api.wxReady(wxapi => {
    // wxapi是微信api的实例，调用方法使用Promise方式
})

```


# 阿里云上传 - ossReady

```js

this.api.ossReady(ossapi => {
    // ossapi是自定义的阿里云上传的实例，调用方法参考文档
})

```


# 防抖 - debounce

```js

this.api.debounce(() => {
    console.log('1秒后执行，如果调用多次，则在最后一次调用后1秒后执行')
}, 1000)

```

# 节流 - throttle

```js

this.api.throttle(() => {
    console.log('不管调用多少次，在第一次调用后的1秒后执行')
}, 1000)

```

!> 注意：防抖与节流因为以函数体为key，所以函数内容如果一致，会出现问题，请知悉

> 源码解析

```js
 /**
   * 节流
   * @param {Function} fn
   * @param {Number} delay
   */
  throttle (fn, delay) {
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
```

# 剪切板操作 - clipboard

> 使用方式
```js
this.api.clipboard('复制到剪切板的文本内容')
```

> 源码解析
```js
function clipboard (text) {
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

```

# 深度克隆 - clone

!> 注意：这里是基础版，涉及到`Buffer、DataView、RegExp等类型`的克隆，需要使用高级算法，推荐使用`lodash函数库`

> 使用方式
```js
let obj = {
  a: 1, 
  b: {     
    b1: { b2: '第三层'},
    b2: '第二层'
  }, 
  c: []
}
const result = this.api.clone(obj)
// result 与 obj 完全不存在引用关系啦

```

> 源码解析
```js

function clone(obj){
  return JSON.parse(JSON.stringify(obj))
}

```

# 弹窗-消息提示 - toast

> 使用方式
```js
this.api.toast('发送成功啦！几秒后消失')

```

> 源码解析
```js
 /**
   * 消息提示
   * @param {string} msg 
   * @param {object}} options 
   */
  toast(message, options = {}) {
    return Message({type: "toast", message, ...options})
  }

```
!> 这里使用的是`Element UI`的提示组件，具体参数请参考官方文档

# 弹窗-提示确认 - alert

```js
this.api.alert('是否删除用户？').then(()=>{
  console.log('确认删除')
}).catch(()=>{
  console.log('取消')
})

```
!> 为了保证风格统一，代码内部使用什么方式都可以，与UI组件无关


# 弹窗-确认消息 - confirm

> 使用方式
```js

this.api.confirm('是否删除用户？').then(()=>{
  console.log('确认删除')
}).catch(()=>{
  console.log('取消')
})

```
!> 因为设计风格问题，这里可以使用自定义的`confirm组件`
> 源码解析
```js
  /**
   * 确认消息
   * @param {string} msg 
   * @param {object} options 
   */
  confirm(msg, options = {}) {
    return new Promise((resolve, reject) => {
      // 这里有多种实现方式，按自己的设计风格来搞
    })
  }
```


# 弹窗-提交内容 - prompt

> 使用方式
```js
this.api.prompt('嘻嘻嘻！你的银行卡号是多少？').then(({ value }) => {
  console.log(`你输入的内容是：${value}`)
}).catch(() => {
  console.log('取消输入')
})
```

> 源码解析
```js
  /**
   * 提交内容
   * @param {string} msg 
   * @param {object} options 
   */
  prompt(msg, options = {}) {
    let title = 'title' in options ? options.title : '提示'
    return MessageBox.prompt(msg, title, {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      ...options
    })
  }
```
!> 这里使用的是`Element UI`的弹框组件，具体参数请参考官方文档

# 加载中 - loading

> 使用方式
```js

// 正常使用
const loading = this.api.loading()
// loading = { instance: UI加载组件实例, close: Function}
loading.close()

// 加载延时关闭
(async () => {
  const loading = await this.api.loading('加载中', { delay: 1000})
  console.log('1秒后执行关闭方法')
  loading.close()
})()

```
!> 如果请求过快会导致加载遮罩一闪而过，体验很糟糕，所以加上延时，看起来会好一点

> 源码解析
```js

 /**
   * 加载提示
   * @param {string} msg
   * @param {object} options
   */
  loading(text = '加载中...', options = {}) {
    const params = {
      text,
      background: 'rgba(0, 0, 0, .8)',
      ...options
    }
    // 如果加上延时参数，则返回Promise对象
    if ('delay' in options) {
      return new Promise((resolve) => {
        let loading = Loading.service(params)
        setTimeout(() => {
          resolve({
            instance: loading,
            close: loading.close
          })
        }, options['delay'])
      })
    } else {
      let loading = Loading.service(params)
      return {
        instance: loading,
        close: loading.close
      }
    }
  }

```
!> 这里使用的是`Element UI`的加载组件，具体参数请参考官方文档

# 动态加载文件 - loader

> 使用方式
```js
// 加载js、css文件
let file = 'https://www.jiluxinqing.com/index.js'
// file = 'https://www.jiluxinqing.com/index.css'
this.api.loader(file).then(()=>{
    console.log('加载完成')
})

```

> 源码解析
```js
function loader (file, ops = {}) {  
  return new Promise((resolve) => {
    let ext = file.substr(file.lastIndexOf('.'))
    const id = `loader_${file.replace(/[^a-zA-Z0-9]/g, '')}`    
    let ele = document.getElementById(id)
    if (ele !== null) {
      resolve()
      return
    }
    // 加载文件的类型
    let type = ops && ops.type
    if (ext === '.js' || type === 'js' || type === 'module'){        
      // 加载js文件
      ele = document.createElement('script')
      // 加载js模块
      if(type === 'module'){
        ele.type = 'module'
      }
      ele.src = `${file}`
      document.body.appendChild(ele)
    }
    else if (ext === '.css' || type === 'css'){
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
```
!> 不支持带有参数的资源链接

# URL参数查询 - query

> 使用方式
```js

// https://www.jiluxinqing.com/?name=123
let name = this.api.query('name')
// name = 123
```

> 源码解析
```js

function query (key) {
    let search = new URLSearchParams(location.search)
    let value = search.get(key)
    return value ? decodeURIComponent(value) : value
}

```

# 动态引入组件 - component

```
// 正在整理中...
```