# 全局指令
---
# 权限 - role

> 使用方式
```html
<!-- 普通用法 -->
<button v-role.system-user-add>添加用户</button>

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

```html
<!-- 多个权限 -->
<el-button v-role:system-user-edit = "{ or: [ 'system-user-add' ] }">包含其他权限（满足其中一项）</el-button>
<el-button v-role:system-user-edit = "{ and: [ 'system-user-add' ] }">包含其他权限（满足所有项）</el-button>
```

> 源码解析
```js

```
!> 注意：需要后端有对应的权限设计表，这一块有一整套设计思路，这里仅仅是使用方法


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