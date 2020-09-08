# 选择框
---

!> 注意：为全局选择组件而设计

> 组件应用

```html
<!-- 
   兼容ElementUI选择器组件所有参数和事件
   事件：@data-change
   事件额外参数：:change-params
-->
<zp-select-position v-model="state" clearable filterable text="全部"  @data-change="dataChange" :change-params="1" />

<script>
export default {
  data() {
    return {
      state: ''
    }
  },
  methods: {
    dataChange (item, params) {
      console.log(item, params)
    }
  }
}
</script>
```

> 使用方式

```html
<template>
  <zp-select v-bind="$attrs" v-on="$listeners" :load="loadData" key-name="name" value-name="id" />
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    loadData() {
      return new Promise(resolve => {
        resolve([
            { id: 1, name: '名称1' },
            { id: 2, name: '名称2' },
            { id: 3, name: '名称3' }
        ])
      })
    }
  }
}
</script>
```

> 源码解析

```html
<template>
  <el-select v-bind="$attrs" v-on="$listeners" class="zp-select" v-model="select.value">
    <el-option
      v-for="(item,index) in select.data"
      :key="index"
      :label="item._name"
      :value="item._id"
    ></el-option>
  </el-select>
</template>
<script>
/* eslint-disable dot-notation */
/* eslint-disable eqeqeq */
export default {
  name: 'ZpSelect',
  props: {
    value: {},
    text: {
      type: String,
      default() {
        return ''
      }
    },
    // 状态过滤
    stateFilter: {
      type: Function
    },
    keyName: {
      type: String,
      required: true
    },
    valueName: {
      type: String,
      required: true
    },
    // 数据加载
    load: {
      type: Function,
      required: true
    },
    // 是否使用全等比较
    identity: {
      type: Boolean,
      default() {
        return false
      }
    },
    // 更新事件的额外参数
    changeParams: {}
  },
  data() {
    return {
      select: {
        data: [],
        value: ''
      }
    }
  },
  watch: {
    'select.value'(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$emit('input', newVal)
      }
    },
    value(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.select.value = newVal
        this.change(this.value)
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      const { stateFilter, keyName, valueName, load, text, value } = this
      load().then(data => {
        // 如果设置了状态过滤，则忽略可用
        if (stateFilter) {
          const type = Object.prototype.toString.call(stateFilter)
          if (type === '[object Function]') {
            data = stateFilter(data)
          }
        }
        data.map(item => {
          item['_id'] = item[valueName]
          item['_name'] = item[keyName]
          return item
        })
        // 如果text有值，则插入默认值
        if (text) {
          data.unshift({
            _id: '',
            _name: text
          })
        }
        this.select.data = data
        this.$emit('ready', this.select.data)
        if (typeof value === 'number' || value) {
          this.select.value = Number(value)
          this.change(value)
        }
      })
    },
    change(value) {
      const { identity, select, changeParams } = this
      const data =
        select.data.find(ele => {
          // 使用全等
          return identity ? ele._id === value : ele._id == value
        }) || {}
      this.$emit('input', value)
      this.$emit('data-change', data, changeParams)
    }
  }
}
</script>

```