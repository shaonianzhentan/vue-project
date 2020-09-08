# API - 接口方法
---


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
            close: loading.close.bind(loading)
          })
        }, options['delay'])
      })
    } else {
      let loading = Loading.service(params)
      return {
        instance: loading,
        close: loading.close.bind(loading)
      }
    }
  }

```
!> 这里使用的是`Element UI`的加载组件，具体参数请参考官方文档


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