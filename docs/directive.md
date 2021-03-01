# 全局指令
---
# 权限 - role

> 使用方式
```html
<!-- 普通用法 -->
<button v-role:system-user-add>添加用户</button>

```
```html
<!-- 验证方法，返回验证结果 -->
<el-button v-role:system-user-add = "{ validate: haveRole }">正常验证（返回参数为valid）</el-button>

<script>
    function haveRole(valid){
        if (valid) {
            console.log('有权限')
        } else {
            console.log('没有权限')
        }
    }
</script>

<!-- 验证方法，返回验证结果 -->
<el-button 
v-role:system-user-add = "{ validate: haveRole.bind(this, { msg: '你好棒棒的哦' }) }" >传参数</el-button>

<script>
    function haveRole({ msg }, valid){
        // msg = 你好棒棒的哦
        if (valid) {
            console.log('有权限')
        } else {
            console.log('没有权限')
        }
    }
</script>
```

> 源码解析

!> 注意：需要后端有对应的权限设计表，这一块有一整套设计思路，这里仅仅是使用方法

```js
/**
 * 权限指令
 * v-role:system-test-list
 * v-role:system-test-list="{validate:haveRole}"
 */
export default {
    bind: function (el, binding, vnode) {
        try {
            const { arg, value } = binding
            let role = arg
            // 判断是否以字符串形式传值
            if (!arg && Object.prototype.toString.call(value) === '[object String]') {
                role = value
            }
            // 获取所有权限
            let roleArr = []
            const store = vnode.context.$store
            if (store.state.userInfo) roleArr = store.state.userInfo.role
            // 判断是否包含权限
            let isRole = roleArr.includes(role)
            if (value) {
                // 如果传的是对象
                if (Object.prototype.toString.call(value) === '[object Object]') {
                    // 加入权限验证回调
                    if (value.validate && typeof value.validate === 'function') {
                        value.validate(isRole)
                    }
                }
            }
            // 如果当前权限不存在，则删除元素
            if (isRole === false) {
                // 如果没有父节点（无法删除，只能隐藏）
                setTimeout(() => {
                    if (el.parentNode) {
                        el.parentNode.removeChild(el)
                    } else {
                        el.innerHTML = ''
                        el.style.display = 'none'
                    }
                }, 0)
            }
        } catch (ex) {
            console.warn(ex)
        }
    }
}
```

!> 如果没有父节点，可以使用`inserted`：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。


# 点击 - click

> 使用方式
```html
<button v-click.timeout="1">点击后1秒后才能再次点击</button>
<button v-click="eventClick.bind(this, {msg: '你很棒棒的哦'})">点击后1秒后才能再次点击</button>

<script>
    function eventClick ({ msg }, callback) {
        console.log('这是传递的参数', msg)
        // 调用解除禁用
        return callback()
    }
</script>
```

> 源码解析
```js
export default {
  bind: function (el, { value, modifiers }) {
    el.handler = function (event) {
        if (el.getAttribute('disabled') === null) {
            // 禁用按钮        
            el.setAttribute('disabled', 'disabled')
            // 点击超时，防止重复点击
            if (modifiers.timeout) {
                let timeout = /^\d+$/.test(value) ? parseInt(value) : 1
                setTimeout(() => {
                    el.removeAttribute('disabled')
                }, timeout * 1000)
            }else if(typeof value === 'function'){
                value(() => {
                    el.removeAttribute('disabled')
                }, event)
            }
        }
    }
    el.addEventListener('click', el.handler)
  },
  unbind: function (el) {
    el.removeEventListener('click', el.handler)
  }
}
```

!> 推荐在`button按钮`上使用，不然效果不大