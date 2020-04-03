# 微信接口

## 初始化 - wxReady
---
> 使用方式
```js
this.api.wxReady(wxapi => {
    // wxapi是微信api的实例，调用方法使用Promise方式
})
```

## 是否微信客户端 - isWechat
> 使用方式
```js
const b = wxapi.isWechat
// 返回值：b = true
```

> 源码解析
```js
get isWechat () {
    return navigator.userAgent.includes('MicroMessenger')
}
```

## 是否电脑版微信 - isWindowsWechat
> 使用方式
```js
const b = wxapi.isWindowsWechat
// 返回值：b = true
```

> 源码解析
```js
get isWindowsWechat () {
    return navigator.userAgent.includes('WindowsWechat')
}
```


## 选择图片 - selectImage
?> 返回一个处理好的`FormData对象`，可以直接使用上传到后端
> 使用方式
```js
wxapi.selectImage().then(formData => {
    // 上传文件...
})
```

> 源码解析
```js
 async selectImage (name = 'file') {
    // 选择相片
    let res = await this.chooseImage()
    let localId = res.localIds[0] // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
    // 读取图片信息
    let blob = await this.getLocalImgData(localId, 'image')
    let fd = new FormData()
    fd.append(name, blob, `${Date.now()}.jpg`)
    return fd
  }
```

## 选择图片 - chooseImage
> 使用方式
```js
wxapi.chooseImage().then(res => {
    // 详细请参考 selectImage 方法源码
})
```

> 源码解析
```js
chooseImage (count = 1) {
    return new Promise((resolve, reject) => {
      wx.chooseImage({
        count: count, // 选择图片的数量，默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res) => {
          // var localIds = res.localIds;
          resolve(res)
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  }
```

## 获取本地图片 - getLocalImgData
> 使用方式
```js
// 详细请参考 selectImage 方法源码
```

> 源码解析
```js
getLocalImgData (localId, fileType) {
    return new Promise((resolve, reject) => {
      wx.getLocalImgData({
        localId: localId, // 图片的localID
        success: function (res) {
          var localData = res.localData // localData是图片的base64数据，可以用img标签显示
          if (fileType == 'image') {
            if (window.__wxjs_is_wkwebview) {
              // 如果是IOS，需要去掉前缀
              localData = localData.replace('jgp', 'jpeg')
            } else {
              localData = 'data:image/jpg;base64,' + localData
            }
            // console.log(localData.substr(0, 50))
            try {
              let base64String = localData /* base64图片串 */
              let bytes = window.atob(base64String.split(',')[1])
              let ab = new ArrayBuffer(bytes.length)
              let ia = new Uint8Array(ab)
              for (let i = 0; i < bytes.length; i++) {
                ia[i] = bytes.charCodeAt(i) // 这里有点疑惑，ia是怎么改变ab的？注：①
              }
              let blob = new Blob([ab], { type: 'image/jpeg' }) // type为图片的格式
              // let blob = dataURLtoFile(localData,`${Date.now()}.jpg`)
              resolve(blob)
            } catch (ex) {
              console.error(ex)
              reject(ex)
            }
          } else {
            resolve(localData)
          }
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  }
```

## 预览图片 - previewImage
> 使用方式
```js
// 看源码解析
wxapi.previewImage('图片链接', [ '图片链接数组' ])
```

> 源码解析
```js
previewImage (src, srcList = []) {
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: srcList // 需要预览的图片http链接列表
    })
  }
```

## 获取网络状态 - getNetworkType
> 使用方式
```js
wxapi.getNetworkType().then(res => {
    // res = 2g，3g，4g，wifi
})
```
!> 返回值：`2g`、`3g`、`4g`、`wifi`

> 源码解析
```js
getNetworkType () {
    return new Promise((resolve, reject) => {
      wx.getNetworkType({
        success: function (res) {
          resolve(res.networkType)
        },
        fail: function (res) {
          reject(JSON.stringify(res))
        }
      })
    })
  }
```

## 获取位置 - getLocation
> 使用方式
```js
wxapi.getLocation().then(res => {
    let latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
    let longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
    let speed = res.speed; // 速度，以米/每秒计
    let accuracy = res.accuracy; // 位置精度
})
```

> 源码解析
```js
 getLocation () {
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
        success: res => {
          resolve(res)
        },
        fail: err => {
          reject('fail', err)
        },
        cancel: err => {
          reject('cancel')
        }
      })
    })
  }
```