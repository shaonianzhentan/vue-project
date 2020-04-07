# 阿里云视频点播
---

## 初始化 - vodReady
> 使用方式
```js
this.api.vodReady(vodapi => {
    // vodapi是自定义的阿里云上传的实例，调用方法参考文档

})
```

## 上传文件 - upload
> 使用方式
```js
// 默认上传
vodapi.upload(file).then(({ ossPath, url }) => {
    // ossPath: 上传后的路径
    // url: 可访问的URL链接
})
```

## 取消上传 - cancel
> 使用方式
```js
vodapi.cancel()
```

> 源码解析

!> `onsuccess方法`可以在初始化的时候声明，每次上传成功后，都可以通知后端记录本次上传的文件

```js
// 视频点播服务
export default class {
  // 默认传入标签与分类
  constructor ({ Tags, CateId }) {
    this.userData = {
      Tags, CateId
    }
  }

  // 配置参数
  config ({ accessKeyId, accessKeySecret, stsToken, expireTime, path }) {
    this._config = {
      accessKeyId, accessKeySecret, stsToken, expireTime, path
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
    const { _config } = this
    return new Promise((resolve, reject) => {
      let uid = `${Date.now()}${Math.random().toString(32).substr(4, 4)}`
      let uploadFileSize = 0
      var uploader = new window.AliyunUpload.Vod({
        'onUploadFailed': (uploadInfo, code, message) => {
          reject(new Error({
            type: 'fail',
            msg: `【上传失败】文件名称：${uploadInfo.file.name}，错误码：${code}，错误信息：${message}`
          }))
        },
        'onUploadSucceed': (uploadInfo) => {
          // 文件上传完成
          let client = new window.OSS({
            region: uploadInfo.endpoint,
            endpoint: uploadInfo.endpoint,
            accessKeyId: _config.accessKeyId,
            accessKeySecret: _config.accessKeySecret,
            bucket: uploadInfo.bucket
          })
          // 生成可访问URL地址
          let url = client.signatureUrl(uploadInfo.object, { expires: 31536000000 })

          // 上传完成后，将当前上传的videoId发送到后端
          if ((typeof this.onsuccess).toLocaleLowerCase() === 'function') { this.onsuccess({ ...args, videoId: uploadInfo.videoId }) }

          resolve({
            ossPath: uploadInfo.object,
            videoId: uploadInfo.videoId,
            url: url
          })
        },
        'onUploadProgress': (uploadInfo, totalSize, loadedPercent) => {
          // 文件上传进度
          if ((typeof cb).toLocaleLowerCase() === 'function') {
            let checkpoint = uploadInfo.checkpoint
            if (!checkpoint) return
            // 已上传的文件大小
            uploadFileSize += checkpoint.partSize
            // 每次上传的文件大小
            let speed = checkpoint.partSize / 1024 / 1024
            // 当前文件大小
            let fileSize = checkpoint.fileSize / 1024 / 1024
            // 已上传的文件大小
            let upSize = uploadFileSize / 1024 / 1024
            // 剩余上传文件大小
            let spSize = Math.floor((checkpoint.fileSize - uploadFileSize) / 1024 / 1024)
            if (spSize < 0) spSize = 0

            speed = speed >= 1 ? `${speed}MB/s` : `${speed * 1024}KB/s`
            fileSize = fileSize >= 1 ? `${fileSize}MB` : `${fileSize * 1024}KB`
            upSize = upSize >= 1 ? `${upSize}MB` : `${uploadFileSize / 1024}KB`
            spSize = spSize >= 1 ? `${spSize}MB` : `${spSize * 1024}KB`
            let result = {
              uid: uid,
              progress: Math.floor(loadedPercent * 100), // 进度速度
              ossFileName: uploadInfo.object, // oss文件名称
              sourceFileName: file.name, // 源文件名称
              speed: speed, // 速度1MB
              fileSize: fileSize, // 源文件大小
              uploadFileSize: upSize, // 已上传文件大小
              surplusFileSize: spSize // 剩余文件大小
            }
            cb(result)
          }
        },
        // STS临时账号会过期，过期时触发函数
        'onUploadTokenExpired': async (uploadInfo) => {
          console.log(uploadInfo)
          // 重新获取Token
          this.onexpired && this.onexpired().then(({ accessKeyId, accessKeySecret, stsToken, expireTime }) => {
            this._config.accessKeyId = accessKeyId
            this._config.accessKeySecret = accessKeySecret
            this._config.stsToken = stsToken
            this._config.expireTime = expireTime
            uploader.resumeUploadWithSTSToken(accessKeyId, accessKeySecret, stsToken, expireTime)
          })
        },
        onUploadCanceled: function (uploadInfo) {
          reject(new Error({
            type: 'cancel',
            msg: `取消上传文件：${uploadInfo.file.name}`
          }))
        },
        // 开始上传
        'onUploadstarted': (uploadInfo) => {
          uploader.setSTSToken(uploadInfo, _config.accessKeyId, _config.accessKeySecret, _config.stsToken)
        },
        'onUploadEnd': (uploadInfo) => {
          console.log('onUploadEnd: uploaded all the files', uploadInfo)
          // 上传完成后，client重置
          this.client = null
        }
      })

      setTimeout(() => {
        let userData = { 'Vod': { 'StorageLocation': '', 'Title': file.name, 'Description': file.name, ...this.userData } }
        uploader.addFile(file, null, null, null, JSON.stringify(userData))
        uploader.startUpload()
        this.client = uploader
      }, 0)
    })
  }

  // 取消上传
  async cancel () {
    if (this.client !== null) {
      this.client.cancelFile(0)
      this.client = null
    }
  }
}

```
