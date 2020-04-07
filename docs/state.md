# 状态管理
---
?> 为统一全局状态而设计，方便拓展与管理


> 定义方式

***文件：/src/config/state/consultation.js***

```js
import { State } from './index'

// 预约状态
export const state_reserveStatus = new State([
    {
        name: '排队中',
        value: 0
    }, {
        name: '已取消',
        value: 1
    }, {
        name: '不合适',
        value: 2
    }, {
        name: '服务中',
        value: 3
    }, {
        name: '已完成',
        value: 4
    }, {
        name: '删除',
        value: 5
    }
])
```

!> 所有状态相关文件统一放在`state文件夹`中管理，使用时导出相关常量即可

> 使用方式

```js
import { state_reserveStatus } from '@/config/state/consultation.js'

// 获取指定状态对象
let obj = state_reserveStatus.state(0)

// 返回包含指定值的数组对象
let arr = state_reserveStatus.includes(1,2,3)

// 排除包含指定值的数组对象
let arr = state_reserveStatus.excludes(1,2,3)

// 返回指定状态的名称
let name = state_reserveStatus.name(1)

```

> 源码解析
```js
// 状态配置管理

export class State {
    constructor(source) {
        this.source = source
    }

    /**
     * 获取指定状态对象
     * @param {Number} val 
     */
    state(val) {
        return this.source.find(ele => ele.value === val)
    }

    /**
     * 包含指定状态值
     * @param  {...any} args 
     */
    includes(...args) {
        return this.source.filter(ele => args.includes(ele.value))
    }

    /**
     * 排除指定状态值
     * @param  {...any} args 
     */
    excludes(...args) {
        return this.source.filter(ele => !args.includes(ele.value))
    }

    /**
     * 获取指定状态值的名称
     * @param {Number} val 
     */
    name(val, defaultValue = '') {
        let obj = this.state(val)
        return obj ? obj.name : defaultValue
    }
}
```

