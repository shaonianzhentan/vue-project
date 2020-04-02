# 全局过滤器
---

# 日期处理 - date

> 使用方式
```html
const now = '2020/03/21 10:10'

// 1.使用方式
<p>{{now | date}}</p>

// 显示结果
<p>2020-03-21</p>

// 2.使用方式
<p>{{now | date('YYYY-MM-DD')}}</p>

// 显示结果
<p>2020-03-21</p>
```

> 源码解析
```js
function date(value, format = 'YYYY-MM-DD', defaultValue = '') {
  if (!value) return defaultValue
  return Date.format(value, format)
}

```
!> `Date.format`是在全局定义的日期扩展方法

# 状态 - state

> 使用方式
```html

const status = 0

// 1.使用方式
<p>{{status | state({0: '开发中', 1: '测试中', 2: '发布中', 3: '上线中'})}}</p>

// 显示结果
<p>开发中</p>


// 2.使用方式(匹配不到,则使用默认值)
<p>{{status | state({1: '测试中', 2: '发布中', 3: '上线中'}, '默认开发中')}}</p>

// 显示结果
<p>默认开发中</p>
```

> 源码解析
```js
function state (value, obj, defaultValue = '') {
    return obj[value] || defaultValue
}
```

!> 注意: 对象值请勿使用`数字0`, 因为`数字0为false`