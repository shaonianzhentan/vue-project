# 上传图片
---

> 使用方式
```html
<!-- 一个 90x90 的图件上传组件 -->
<mw-upload-image v-model="formData.face" :disabled="disabled" size="90px" />
```

> 源码解析
```html
<template>
  <div class="mw-upload-image">
    <div
      class="upload-image uploader"
      :style="`background-image:url(${item});width:${w};height:${h};`"
      v-for="(item,index) in list"
      :key="index"
    >
      <div class="el-upload-list__item-actions">
        <span class="el-upload-list__item-preview">
          <i class="el-icon-zoom-in" @click="previewClick(item)"></i>
          <i class="el-icon-delete" @click="removeClick(item)" v-if="!disabled"></i>
        </span>
      </div>
    </div>
    <el-upload
      v-if="list.length < limit && !disabled"
      class="avatar-uploader uploader"
      :style="`width:${w};height:${h};`"
      :show-file-list="false"
      action
      :http-request="uploadSectionFile"
      :before-upload="beforeUpload"
      v-loading="loading"
    >
      <span>
        <i class="el-icon-plus avatar-uploader-icon"></i>
        上传图片
      </span>
    </el-upload>
  </div>
</template>
<script>
export default {
  props: {
    value: {},
    limit: {
      type: Number,
      default: 1
    },
    width: {
      type: String,
      default: '160px'
    },
    height: {
      type: String,
      default: '120px'
    },
    // 设置为正方形时，使用这个参数（避免写宽高麻烦）
    size: {
      type: String,
      default: ''
    },
    disabled:{
      type:Boolean,
      default: false
    }
  },
  data() {
    let { width, height } = this
    return {
      w: width,
      h: height,
      loading: false,
      list: []
    }
  },
  watch: {
    value(val, oldVal) {
      if (val && !oldVal) {        
        this.initData()
      }
    }
  },
  created() {
    let { size } = this
    if (size) {
      this.h = size
      this.w = size
    }
    this.initData()
  },
  methods: {
    async initData() {
      let { value } = this
      if (this.api.validate.isArray(value)) {
        this.list = value
      } else if (this.api.validate.isString(value) && value) {
        this.list = value.split(',')
      }
    },
    change() {
      let { value } = this
      if (this.api.validate.isArray(value)) {
        this.$emit('input', this.list)
      } else if (this.api.validate.isString(value)) {
        this.$emit('input', this.list.join(','))
      }
    },
    uploadSectionFile({ file }) {
      this.loading = true
      /* 这里也可以使用FormData提交方式
      let formData = new FormData()
      formData.append('upfile', file)
      this.api.service.$http.post('后端上传文件接口地址', formData).then(res => {
        // 后端返回的URL
        let url = res.url
        this.list.push(url)
        this.change()
      }).finally(() => {
        this.loading = false
      })
      */

      // 这里使用了oss上传
      this.api.ossReady().then((ossapi) => {
        ossapi.upload(file).then(res => {
          this.list.push(res.url)
          this.change()
        }).finally(() => {
          this.loading = false
        })
      })
    },
    previewClick(src) {
      this.api.previewImage(src)
    },
    removeClick(item) {
      let index = this.list.indexOf(item)
      this.list.splice(index, 1)
      this.change()
    },
    beforeUpload() {

    }
  }
}
</script>
<style lang="less">
.mw-upload-image{
  display:flex;
  .uploader{
    display: block;
    margin-right: 20px;

    &.upload-image{
      background-size:cover;
      .el-upload-list__item-actions{
        width: 100%;
        height: 100%;
        display:flex;
        align-items: center;
        cursor: default;
        text-align: center;
        color: #fff;
        opacity: 0;
        font-size: 20px;
        background-color: rgba(0,0,0,.5);
        transition: opacity .3s;
        .el-upload-list__item-preview{
            flex:1;
            i{
                cursor:pointer;
                margin:0 10px;
            }
        }
      }
      &:hover{
        .el-upload-list__item-actions{
          opacity: 1;
        }
      }
    }

    .el-upload{
      width:100%;
      height:100%;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      color:#bbb;
      display:flex;
      align-items: center;
      span{flex:1;}
      .avatar-uploader-icon {
        font-size: 34px;
        text-align: center;
        display:block;
      }
    }
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }



  &.mw-upload-image-border{
    .upload-image{
      border-radius:5px;
      border:1px solid #d9d9d9;
    }
  }
}
</style>
```