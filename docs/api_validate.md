# API - 验证类
---
> 各种常见的验证方法与属性

## 是否IE浏览器 - isIE
> 使用方式
```js
const b = this.api.validate.isIE
// 返回值：b = true
```

> 源码解析
```js
!!window.ActiveXObject || "ActiveXObject" in window
```

## 是否iOS系统 - isIOS
> 使用方式
```js
const b = this.api.validate.isIOS
// 返回值：b = true
```

> 源码解析
```js
/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)
```

## 是否正整数 - isInteger
> 使用方式
```js
const b = this.api.validate.isInteger(1)
// 返回值：b = true
```

> 源码解析
```js
isInteger(value) {
    return /^\d+$/.test(value) && value != 0
}
```

!> 注：这里只判断 `正整数`，不包含`负整数` 和 `0`

## 是否为空 - isEmpty
> 使用方式
```js
// 这里只解决了在js中0值判断的问题
const val = ''
const b = this.api.validate.isEmpty(val) 
// 返回值：b = true
```
> 源码解析
```js
value !== 0 && !value
```

## 是否邮箱格式 - isEmail
> 使用方式
```js
const val = 'jiluxinqing@qq.com'
const b = this.api.validate.isEmail(val) 
// 返回值：b = true
```

> 源码解析
```js
/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)
```



## 是否身份证号 - isIDCard
> 使用方式
```js
const val = '429005199101014258'
const b = this.api.validate.isIDCard(val) 
// 返回值：b = true
```

> 源码解析
```js

// 函数参数必须是字符串，因为二代身份证号码是十八位，而在javascript中，十八位的数值会超出计算范围，造成不精确的结果，导致最后两位和计算的值不一致，从而该函数出现错误。
// 详情查看javascript的数值范围
function checkIDCard(idcode){
    // 必须是字符串
    if(Object.prototype.toString.call(idcode) != '[object String]') return false;
    // 必须是18位
    if(idcode.length != 18) return false;

    // 加权因子
    var weight_factor = [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];
    // 校验码
    var check_code = ['1', '0', 'X' , '9', '8', '7', '6', '5', '4', '3', '2'];

    var code = idcode + "";
    var last = idcode[17];//最后一位

    var seventeen = code.substring(0,17);

    // ISO 7064:1983.MOD 11-2
    // 判断最后一位校验码是否正确
    var arr = seventeen.split("");
    var len = arr.length;
    var num = 0;
    for(var i = 0; i < len; i++){
        num = num + arr[i] * weight_factor[i];
    }
    
    // 获取余数
    var resisue = num%11;
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


验证方法来源：https://blog.csdn.net/gqzydh/article/details/90295842
```


## 是否手机号码 - isPhoneNumber
> 使用方式
```js
const val = '13212345678'
const b = this.api.validate.isPhoneNumber(val) 
// 返回值：b = true
```

> 源码解析
```js
// 这里仅仅做了以1开始的十一位数字验证
/^[1][0-9]{10}$/.test(value)
```

## 是否可输入字符串 - isInputString
> 使用方式
```js
const val = '指定输入一些已知字符，控制未知字符输入。'
const b = this.api.validate.isInputString(val) 
// 返回值：b = true
```
> 源码解析
```js
function isInputString(value){
    // =_~`+……——{}|:"【】！￥（）@#$%&,，：；·‘’“”。、;'《》[]<>?-\/
    return /[^=_~`+……——{}|:"【】！￥（）@#$%&,，：；·‘’“”。、;'\\\.\!\^\*\(\)\<\>》《\s\[\]\?\-\/A-Za-z0-9\u3300-\u9fa5]/g.test(value) === false
}
```
!> 注意：可以根据系统的`数据库的字符`设计，有部分奇怪的字符`𠂆`无法输入，可以自己修改控制

## 是否包含中文字符 - isChineseChar
> 使用方式
```js
const val = '✌嘻嘻'
const b = this.api.validate.isChineseChar(val) 
// 返回值：b = true
```

> 源码解析
```js
function isChineseChar(value){
    return /[\u4E00-\u9FA5\uF900-\uFA2D]/.test(value)
}
```

## 是否包含表情符号 - isEmoji
> 使用方式
```js
const val = '😂笑哭'
const b = this.api.validate.isEmoji(val) 
// 返回值：b = true
```

> 源码解析
```js
function isEmoji (value) {
    if(value){
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

```


## 是否String类型 - isString
> 使用方式
```js
const val = ''
const b = this.api.validate.isString(val) 
// 返回值：b = true
```

> 源码解析
```js
Object.prototype.toString.call(value) === '[object String]'
```


## 是否Number类型 - isNumber
> 使用方式
```js
const val = -1
const b = this.api.validate.isNumber(val) 
// 返回值：b = true
```

> 源码解析
```js
Object.prototype.toString.call(value) === '[object Number]'
```


## 是否Boolean类型 - isBoolean
> 使用方式
```js
const val = !'a'
const b = this.api.validate.isBoolean(val) 
// 返回值：b = true
```

> 源码解析
```js
Object.prototype.toString.call(value) === '[object Boolean]'
```


## 是否Null类型 - isNull
> 使用方式
```js
const val = null
const b = this.api.validate.isNull(val) 
// 返回值：b = true
```

> 源码解析
```js
Object.prototype.toString.call(value) === '[object Null]'
```


## 是否Undefined类型 - isUndefined
> 使用方式
```js
const val;
const b = this.api.validate.isUndefined(val) 
// 返回值：b = true
```

> 源码解析
```js
Object.prototype.toString.call(value) === '[object Undefined]'
```

## 是否Symbol类型 - isSymbol
> 使用方式
```js
const val = Symbol()
const b = this.api.validate.isSymbol(val) 
// 返回值：b = true
```

> 源码解析
```js
Object.prototype.toString.call(value) === '[object Symbol]'
```


## ~~是否Array类型 - isArray~~
!> 建议直接使用js内置方法`Array.isArray(value)`

> 使用方式
```js
const val = []
const b = this.api.validate.isArray(val) 
// 返回值：b = true
```

> 源码解析
```js
Object.prototype.toString.call(value) === '[object Array]'
```

## 是否Function类型 - isFunction
> 使用方式
```js
const val = () => {}
const b = this.api.validate.isFunction(val) 
// 返回值：b = true
```

> 源码解析
```js
Object.prototype.toString.call(value) === '[object Function]'
```

## 是否Object类型 - isObject

> 使用方式
```js
const val = {}
const b = this.api.validate.isObject(val) 
// 返回值：b = true
```

> 源码解析
```js
Object.prototype.toString.call(value) === '[object Object]'
```