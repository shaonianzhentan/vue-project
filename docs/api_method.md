# API - 接口方法
---

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

# 小数位长度 - pointLength

> 使用方式
```js
let val = this.api.pointLength(0.0003)
// val = 4
```

> 源码解析
```js
  pointLength(value) {
    // 验证当前传入值的类型
    if (!this.validate.isNumber(value) && !this.validate.isString(value)) {
      throw new Error(`要验证的值类型不是String | Number`)
    }
    // 如果是数字，则转为字符串
    if (this.validate.isNumber(value)) {
      value = String(value)
    }
    let arr = value.split('.')
    if (arr.length === 2) {
      return arr[1].length
    }
    return 0
  }

```

# 数组累加 - sum

> 使用方式
```js
// 解决小数位数字运算的问题
let val = this.api.sum([0.0001, 0.0002, 0.0003])
// val = 0.0006

```

!> 注意：在js中小数的运算操作会有精度问题`0.0001 + 0.0002 + 0.0003 = 0.0006000000000000001`

> 源码解析
```js
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

```

# 动态引入组件 - component

> 使用方式
```js
// 引入组件
import UserEdit from '@/components/system/UserEdit'

// 方式一：传入props参数
this.api.component(UserEdit, {
    type: "我是props参数"
  }).then(() => {
    console.log('一般是弹窗点击确认或啥的')
  }).catch(()=>{
    console.log('弹窗关闭啦!!!')
  })

// 方式二：使用vue组件原生参数
this.api.component(UserEdit, {
    type: "我是props参数"
  }, {
    mounted(){
      console.log('生命周期：mounted')
    }
  }).then(() => {
    console.log('一般是弹窗点击确认或啥的')
  }).catch(()=>{
    console.log('弹窗关闭啦!!!')
  })
```

> 源码解析
```js
async _component(component, propsData = {}, constructorArgs = {}) {
    let _constructor = Vue.extend(component)
    return new Promise((resolve, reject) => {
      let instance = new _constructor({
        ...constructorArgs,
        propsData,
      }).$mount(document.createElement('div'))
      instance.$on('done', data => resolve(data))
      instance.$on('close', data => reject(data))
    })
  }
```

!> 以上`_component`是核心方法，进行了二次封装后的是`component`方法，注入了`router`、`store`