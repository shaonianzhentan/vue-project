/**
 * 验证类
 * 作者：来鸭来鸭一起来鸭
 * 创建日期：2020-6-19
 * 更新日期：
 */
export default class {

  /**
   * 是否IE浏览器
   */
  get isIE() {
    return !!window.ActiveXObject || "ActiveXObject" in window
  }

  /**
   * 是否iOS系统浏览器
   */
  get isIOS() {
    return /(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)
  }

  /**
   * 验证是否整数
   * @param {Any} value 
   */
  isInteger(value) {
    return /^\d+$/.test(value) && value != 0
  }

  /**
   * JS中判断值是否为空
   * @param {Any} value 
   */
  isEmpty(value) {
    return value !== 0 && !value
  }


  /**
   * 判断是否为邮箱格式
   * @param {String} value 
   */
  isEmail(value) {
    return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)
  }


  /**
   * 判断是否身份证号
   * @param {String|Number} idcode
   */
  isIDCard(idcode) {
    // 必须是字符串
    if (Object.prototype.toString.call(idcode) != '[object String]') return false;
    // 必须是18位
    if (idcode.length != 18) return false;

    // 加权因子
    var weight_factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    // 校验码
    var check_code = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

    var code = idcode + "";
    var last = idcode[17];//最后一位

    var seventeen = code.substring(0, 17);

    // ISO 7064:1983.MOD 11-2
    // 判断最后一位校验码是否正确
    var arr = seventeen.split("");
    var len = arr.length;
    var num = 0;
    for (var i = 0; i < len; i++) {
      num = num + arr[i] * weight_factor[i];
    }

    // 获取余数
    var resisue = num % 11;
    var last_no = check_code[resisue];

    // 格式的正则
    // 正则思路
    /*
    第一位不可能是0
    第二位到第六位可以是0-9
    第七位到第十位是年份，所以七八位为19或者20
    十一位和十二位是月份，这两位是01-12之间的数值
    十三位和十四位是日期，是从01-31之间的数值
    十五，十六，十七都是数字0-9
    十八位可能是数字0-9，也可能是X
    */
    var idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;

    // 判断格式是否正确
    var format = idcard_patter.test(idcode);

    // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
    return last === last_no && format ? true : false;
  }

  /**
   * 判断是否手机号码
   * @param {String|Number} value
   */
  isPhoneNumber(value) {
    return /^[1][0-9]{10}$/.test(value)
  }

  /**
   * 验证是否可输入字符串
   * @param {String} value 
   */
  isInputString(value) {
    // =_~`+……——{}|:"【】！￥（）@#$%&,，：；·‘’“”。、;'《》[]<>?-\/
    // eslint-disable-next-line
    return /[^=_~`+……——{}|:"【】！￥（）@#$%&,，：；·‘’“”。、;'\\\.\!\^\*\(\)\<\>》《\s\[\]\?\-\/A-Za-z0-9\u3300-\u9fa5]/g.test(value) === false
  }

  /**
   * 是否包含中文
   * @param {String} value 
   */
  isChineseChar(value) {
    return /[\u4E00-\u9FA5\uF900-\uFA2D]/.test(value)
  }

  /**
   * 是否包含emojo表情符号
   * @param {String} value 
   */
  isEmoji(value) {
    if (value) {
      //验证是否emoji表情符号
      let flags = (function (substring) {
        for (var i = 0; i < substring.length; i++) {
          var hs = substring.charCodeAt(i);
          if (0xd800 <= hs && hs <= 0xdbff) {
            if (substring.length > 1) {
              var rs = substring.charCodeAt(i + 1);
              var uc = ((hs - 0xd800) * 0x400) + (rs - 0xdc00) + 0x10000;
              if (0x1d000 <= uc && uc <= 0x1f77f) {
                return true;
              }
            }
          } else if (substring.length > 1) {
            var ls = substring.charCodeAt(i + 1);
            if (ls == 0x20e3) {
              return true;
            }
          } else {
            if (
              (hs >= 0x2100 && hs <= 0x27ff)
              || (hs >= 0x2b05 && hs <= 0x2b07)
              || (hs >= 0x2934 && hs <= 0x2935)
              || (hs >= 0x3297 && hs <= 0x3299)
              || (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
                || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b || hs == 0x2b50)
            ) {
              return true
            }
          }
        }
        return false;
      })(value);

      return flags
    }
    return false
  }

  /* ---------------类型检测--------------- */
  /**
   * 是否String类型
   * @param {Any} value 
   */
  isString(value) {
    return Object.prototype.toString.call(value) === '[object String]'
  }

  /**
   * 是否Number类型
   * @param {Any} value 
   */
  isNumber(value) {
    /**
     * 注意：Infinity、NaN 也是Number类型
     */
    return Object.prototype.toString.call(value) === '[object Number]'
  }

  /**
   * 是否Boolean类型
   * @param {Any} value 
   */
  isBoolean(value) {
    return Object.prototype.toString.call(value) === '[object Boolean]'
  }

  /**
   * 是否Null类型
   * @param {Any} value 
   */
  isNull(value) {
    return Object.prototype.toString.call(value) === '[object Null]'
  }

  /**
   * 是否Undefined类型
   * @param {Any} value 
   */
  isUndefined(value) {
    return Object.prototype.toString.call(value) === '[object Undefined]'
  }

  /**
   * 是否Symbol类型
   * @param {Any} value 
   */
  isSymbol(value) {
    return Object.prototype.toString.call(value) === '[object Symbol]'
  }

  /**
   * 是否Function类型
   * @param {Any} value 
   */
  isFunction(value) {
    return Object.prototype.toString.call(value) === '[object Function]'
  }

  /**
   * 是否Array类型
   * @param {Any} value 
   */
  isArray(value) {
    return Object.prototype.toString.call(value) === '[object Array]'
  }
  /**
   * 是否Object类型
   * @param {Any} value 
   */
  isObject(value) {
    return Object.prototype.toString.call(value) === '[object Object]'
  }
}
