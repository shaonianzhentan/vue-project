/* eslint-disable */
// 微信封装类
export default class {
  // 是否电脑版微信
  get isWindowsWechat() {
    return navigator.userAgent.includes('WindowsWechat')
  }

  // 配置
  config(data) {
    return new Promise((resolve, reject) => {
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appId, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名，见附录1
        jsApiList: ['getLocation', 'chooseImage', 'getLocalImgData', 'previewImage', 'getNetworkType'] // 必填，需要使用的JS接口列表
      });

      wx.ready(() => {
        console.log('wx ready...')
        resolve()
      });

      wx.error((res) => {
        console.log('wx出现错误', res);
        reject(res)
      });
    })
  }

  // 支付
  pay(data) {
    return new Promise((resolve, reject) => {
      const WeixinJSBridge = window.WeixinJSBridge

      function onBridgeReady() {
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest',
          data,
          function (res) {
            if (res.err_msg == 'get_brand_wcpay_request:ok') {
              resolve()
              // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
            } else {
              console.log(res);
              reject(res)
            }
          }
        );
      }

      if (typeof WeixinJSBridge === 'undefined') {
        if (document.addEventListener) {
          document.addEventListener(
            'WeixinJSBridgeReady',
            onBridgeReady,
            false
          );
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
          document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
        }
      } else {
        onBridgeReady();
      }
    })
  }

  /**
  * 选择图片，返回FormData
  * @param {String} name - 上传的参数名称
  */
  async selectImage(name = 'file') {
    // 选择相片
    const res = await this.chooseImage();
    const localId = res.localIds[0]; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
    // 读取图片信息
    const blob = await this.getLocalImgData(localId, 'image');
    const fd = new FormData();
    fd.append(name, blob, `${Date.now()}.jpg`);
    return fd
  }

  // 获取位置
  getLocation() {
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
      });
    })
  }

  // 选择图片
  chooseImage(count = 1) {
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
      });
    })
  }

  // 获取本地图片接口
  getLocalImgData(localId, fileType) {
    return new Promise((resolve, reject) => {
      wx.getLocalImgData({
        localId: localId, // 图片的localID
        success: function (res) {
          var localData = res.localData; // localData是图片的base64数据，可以用img标签显示
          if (fileType == 'image') {
            if (window.__wxjs_is_wkwebview) {
              // 如果是IOS，需要去掉前缀
              localData = localData.replace('jgp', 'jpeg');
            } else {
              localData = 'data:image/jpg;base64,' + localData;
            }
            console.log(localData.substr(0, 50))
            try {
              const base64String = localData;
              const bytes = window.atob(base64String.split(',')[1]);
              const ab = new ArrayBuffer(bytes.length);
              const ia = new Uint8Array(ab);
              for (let i = 0; i < bytes.length; i++) {
                ia[i] = bytes.charCodeAt(i); // 这里有点疑惑，ia是怎么改变ab的？注：①
              }
              const blob = new Blob([ab], { type: 'image/jpeg' }); // type为图片的格式
              // let blob = dataURLtoFile(localData,`${Date.now()}.jpg`)
              resolve(blob)
            } catch (ex) {
              console.error(ex);
              reject(ex);
            }
          } else {
            resolve(localData)
          }
        },
        fail: (err) => {
          reject(err)
        }
      });
    })
  }

  // 预览图片接口
  previewImage(src, srcList = []) {
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: srcList // 需要预览的图片http链接列表
    });
  }

  // 获取网络状态
  getNetworkType() {
    return new Promise((resolve, reject) => {
      wx.getNetworkType({
        success: function (res) {
          resolve(res.networkType);
        },
        fail: function (res) {
          reject(JSON.stringify(res));
        }
      });
    })
  }
}
