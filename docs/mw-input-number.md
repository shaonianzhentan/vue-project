# 数字文本输入框
---
> 使用方式

```html
<mw-input-number :placeholder="placeholder('请输入')" v-model="formData.storeCount" />
```

> 源码解析

```html
<template>
  <el-input-number
    class="mw-input-number"
    ref="elInputNumber"
    v-bind="Object.assign(defaultAttrs, $attrs)"
    v-on="$listeners"
  ></el-input-number>
</template>
<script>
export default {
  data() {
    return {
      defaultAttrs: {
        placeholder: "请输入",
        controls: false,
        min: 1,
        max: 999999999
      }
    };
  },
  watch: {
    ["$attrs.value"](val) {
      // 如果当前值为空，则设置为undefined
      if (!val) {
        let elInputNumber = this.$refs["elInputNumber"];
        if (elInputNumber) {
          elInputNumber.$emit("input", undefined);
        }
      }
    }
  },
  created() {
    let { value } = this.$attrs;
    if (this.api.validate.isEmpty(value)) {
      this.$attrs["value"] = undefined;
    }
  },
  mounted() {
    this.$nextTick(function() {
      let { maxlength } = this.$attrs;
      if (!maxlength || maxlength > 9) {
        maxlength = 9;
      }
      let input = this.$el.querySelector("input");
      input.setAttribute("maxlength", maxlength);
    });
  },
  methods: {}
};
</script>
<style lang="less">
.mw-input-number {
  width: auto;
  .el-input__inner {
    text-align: left;
  }
}
</style>
```
