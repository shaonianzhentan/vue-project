# 图标
---
> 使用方式

```html
<!-- 默认字体图标 -->
<mw-icon name="icon-add" size="20" />
<!-- 使用symbol图标 -->
<mw-icon name="icon-add" type="symbol" size="20" />
```

!> `symbol`为彩色图标，`font`为单色图标

> 源码解析

```html
<template>
  <i v-if="type==='font'" :class="['iconfont', name]" :style="`font-size:${size}px;`"></i>
  <svg v-else class="mw-icon" aria-hidden="true" :style="`width:${size}px;height:${size}px;`">
    <use :xlink:href="`#${name}`" />
  </svg>
</template>
<script>
export default {
  props: {
    name: {
      type: String
    },
    type: {
      type: String,
      default: 'font',
      validator (val) {
        return ['font', 'symbol'].includes(val)
      }
    },
    size: {
      type: [Number, String],
      default () {
        return '18'
      },
      validator (val) {
        return /^\d+$/.test(val)
      }
    }
  },
  data () {
    return {

    }
  }
}
</script>
<style>
.mw-icon {
  fill: currentColor;
  overflow: hidden;
}
</style>

```


!> 使用的是`iconfont图标`，图标来源：https://www.iconfont.cn/