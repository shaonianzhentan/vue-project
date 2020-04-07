# 编辑器
---
> 使用方式

```html
<mw-editor v-model="formData.content" />
```

> 源码解析

```js
<template>
  <div ref="editor" class="mw-editor"></div>
</template>
<script>
import E from "wangeditor";
// import filterXSS from 'xss'
export default {
  props: {
    value: {
      type: [String, Number],
      default() {
        return "";
      }
    },
    // 禁用
    disabled: {
      type: Boolean,
      default() {
        return false;
      }
    },
    height: {
      type: [String, Number],
      default() {
        return "500px";
      }
    },
    config: {
      type: Object
    }
  },
  data() {
    return {
      editor: null,
      editorContent: ""
    };
  },
  watch: {
    disabled(val) {
      this.editor && this.editor.$textElem.attr("contenteditable", !val);
    },
    height() {
      this.setHeight();
    },
    value(val, oldVal) {
      if (val && !oldVal) {
        this.editor.txt.html(val);
      }
    }
  },
  mounted() {
    var editor = new E(this.$refs.editor);
    // 自定义菜单配置
    editor.customConfig.menus = [
      "head", // 标题
      "bold", // 粗体
      "fontSize", // 字号
      // 'fontName',  // 字体
      "italic", // 斜体
      "underline", // 下划线
      "strikeThrough", // 删除线
      "foreColor", // 文字颜色
      "backColor", // 背景颜色
      "link", // 插入链接
      // 'list', // 列表
      "justify", // 对齐方式
      "quote", // 引用
      "emoticon", // 表情
      "image", // 插入图片
      "table", // 表格
      // 'video', // 插入视频
      "code", // 插入代码
      "undo", // 撤销
      "redo" // 重复
    ];
    // 表情面板可以有多个 tab ，因此要配置成一个数组。数组每个元素代表一个 tab 的配置
    editor.customConfig.emotions = [
      {
        // tab 的标题
        title: "emoji",
        type: "emoji",
        content: [
          "😀",
          "😃",
          "😄",
          "😁",
          "😆",
          "😅",
          "😂",
          "😊",
          "😇",
          "🙂",
          "🙃",
          "😉",
          "😓",
          "😪",
          "😴",
          "🙄",
          "🤔",
          "😬",
          "🤐"
        ]
      }
    ];

    editor.customConfig.zIndex = 100;

    this.configUploadImage(editor);

    // 使用自定义配置
    let { config } = this;
    if (this.api.validate.isObject(config)) {
      Object.keys(config).forEach(key => {
        editor.customConfig[key] = config[key];
      });
    }

    // 文本改变
    editor.customConfig.onchange = html => {
      // 防止xss攻击
      this.editorContent = html;
      // 这里可以验证内容，然后重置
      this.$emit("input", this.editorContent);
    };
    // 关闭粘贴样式的过滤
    // editor.customConfig.pasteFilterStyle = false
    // 忽略粘贴内容中的图片
    // editor.customConfig.pasteIgnoreImg = true
    // 自定义处理粘贴的文本内容
    editor.customConfig.pasteTextHandle = function(content) {
      //  清除注释块
      content = content.replace(/<!--[\w\W\r\n]*?-->/gim, "");
      //  清除<w:xxx> 这样的标签
      content = content.replace(/<(w.*).+?>/gim, "");
      return content;
    };
    editor.create();
    this.editor = editor;
    editor.txt.html(this.value);
    editor.$textElem.attr("contenteditable", !this.disabled);
    this.setHeight();
  },
  methods: {
    // 设置高度
    setHeight() {
      let height = this.height;
      if (isNaN(height) === false) {
        height = `${height}px`;
      }
      this.editor &&
        (this.$refs["editor"].querySelector(
          ".w-e-text-container"
        ).style.height = height);
    },
    // 配置上传图片功能
    configUploadImage(editor) {
      editor.customConfig.uploadFileName = "upfile"; //设置文件上传的参数名称
      editor.customConfig.uploadImgServer = "自定义上传，没啥用"; //设置上传文件的服务器路径
      editor.customConfig.uploadImgMaxSize = 10 * 1024 * 1024; // 将图片大小限制为 10M
      editor.customConfig.uploadImgMaxLength = 1;
      editor.customConfig.customUploadImg = (files, insertLinkImg) => {
        // console.log(files, insertLinkImg);
        this.api.ossReady().then(ossService => {
          //ossService是上传实例
          ossService.upload(files[0]).then(res => {
            insertLinkImg(res.url);
          });
        });
      };
    }
  }
};
</script>

```
