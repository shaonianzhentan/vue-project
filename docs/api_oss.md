# 阿里云存储服务
---

## 初始化 - ossReady
> 使用方式
```js
this.api.ossReady(ossapi => {
    // ossapi是自定义的阿里云上传的实例，调用方法参考文档
})
```

## 上传文件 - upload
> 使用方式
```js
// 默认上传
ossapi.upload(file).then(({ ossPath, url }) => {
    // ossPath: 上传后的路径
    // url: 可访问的URL链接
})
```

## 取消上传 - cancel
> 使用方式
```js
ossapi.cancel()
```

> 源码解析

!> `onsuccess方法`可以在初始化的时候声明，每次上传成功后，都可以通知后端记录本次上传的文件

```js
// 阿里云oss服务
export default class {
  constructor () {
    this.client = null
  }
  // 配置参数
  config ({ accessKeyId, accessKeySecret, bucket, endpoint, path }) {
    this._config = {
      accessKeyId, accessKeySecret, bucket, endpoint, path
    }
  }

  // 上传成功后的事件（自定义事件）
  // onsuccess (args): void

  /**
   * 上传文件
   * @param {File} file - 文件
   * @param {Function} cb - 上传进度事件（可选）
   * @param {Object} args - 每次上传成功后，需要带给后端的参数（可选）
   */
  async upload (file, cb, args) {
    // 一次只能上传一个文件
    if (this.client !== null) {
      throw new Error({
        code: 1,
        msg: '正在上传中，请勿重复上传'
      })
    }
    const { _config } = this
    // 加上文件后缀名
    let ossPath = `${_config.path}/${Date.now()}${Math.random().toString(34).substr(-4)}${file.name}`

    try {
      // 实例上传对象
      let client = new window.OSS.Wrapper({
        secure: true,
        ..._config
      })
      this.client = client
      // 自定义参数
      client.__extern_params__ = {}
      // 开始上传
      await client.multipartUpload(
        ossPath,
        file, {
          progress: async (p, checkpoint) => {
            if (!checkpoint) return
            client.__extern_params__['checkpoint'] = checkpoint
            if ((typeof cb).toLocaleLowerCase() === 'function') {
              let result = {
                progress: Math.floor(p * 100), // 进度速度
                ossPath: ossPath, // oss文件名称
                sourceFileName: file.name // 源文件名称
              }
              cb(result)
            }
          }
        }
      )
      // 生成可访问URL地址
      let url = client.signatureUrl(ossPath, { expires: 31536000000 })
      if ((typeof this.onsuccess).toLocaleLowerCase() === 'function') { this.onsuccess(args) }
      // 如果成功，则将client重置
      this.client = null

      return {
        ossPath: ossPath,
        url: url.substr(0, url.indexOf('?')) // 将生成的签名截断
      }
    } catch (ex) {
      // 如果出错，则将client重置
      this.client = null
      throw new Error({
        code: 1,
        msg: ex
      })
    }
  }

  // 取消上传
  async cancel () {
    if (this.client !== null) {
      this.client.cancel()
      this.client = null
    }
  }
}

```