# 阿里云存储服务
---

## 初始化 - ossReady
> 使用方式
```js
this.api.ossReady(ossapi => {
    // ossapi是自定义的阿里云上传的实例，调用方法参考文档
})
```

> 源码解析
```js
  // 阿里OSS上传
  async ossReady() {
    // 如果视频点播上传和OSS上传没有定义，则加载对应的js库
    if (typeof window.AliyunUpload === 'undefined' || typeof window.OSS === 'undefined') {
      // 异步加载相关的js库
      await this.loader('./js/aliyun-oss-sdk-5.2.0.min.js')
      await this.loader('./js/aliyun-upload-sdk-1.4.0.min.js')
    }
    // 获取参数    
    const ossService = new OssService()
    ossService.config({
      accessKeyId: '密钥ID',
      accessKeySecret: '密钥',
      bucket: 'bucket',
      endpoint: 'https://xxx.com',
      path: '这里是/存放的/路径/哦'
    })
    ossService.onsuccess = (data) => {
      // 这里请求接口，通知后端上传成功了
      // data: 是回传的参数哦
    }
    return ossService
  }
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