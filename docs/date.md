# 日期处理
---

# 日期格式化

> 使用方式
```js
  /**
   * 当前时间格式化
   * @param {String | Int} date 
   * @param {String} formatter 
   */
  Date.format(date, formatter)
```

```js
  // 当前时间格式化
  new Date().format('YYYY-MM-DD HH:mm:ss')  // 2018-11-27 23:21:59
  new Date().format('YYYY年MM月DD hh时mm分ss秒')  // 2018年11月27日 11时21分59秒
  // 指定时间格式化
  Date.format('Tue Nov 27 2018 11:28:37 GMT+0800 (中国标准时间)', 'YYYY-MM-DD HH:mm:ss') // 2018-11-27 11:28:37
  // 13位时间戳
  Date.format(1542700440000, 'YYYY-MM-DD HH:mm:ss')
  // 当传入10位数字时会自动加上000，补成13位的时间戳
  Date.format(1542700440, 'YYYY-MM-DD HH:mm:ss')
```
!> 注意大小写，`HH`：24小时制，`hh`：12小时制

# 日期相差

> 使用方式
```js
   /**
    * 日期相减
    * @param {String | Array} date 传一个则与当前时间计算，数组则两个计算
    * @param {String} formatter 计算时间差的格式day | month
    */
  Date.diff(date, formatter = 'day')

  //当前日期 减去 2018-11-11（返回相差的天数）
  let day = Date.diff('2018-11-10')

  //传入数组，第一个日期减去第二个日期（返回相差的天数）
  let day = Date.diff(['2018-11-10', '2018-10-10'])

  //传入数组，第一个日期减去第二个日期（返回相差的月数）
  let month = Date.diff(['2018-11-10', '2018-10-10'], 'month')

```

> 源码解析
```js

```


# 判断是否日期格式

> 使用方式
```js
  /**
   * 判断是否日期
   * @param {Any} str - 需要验证的字符串
   */   
  Date.isDate(str)

  Date.isDate('sdfsdfsdfds') //false
  Date.isDate('2018-10-10') //true
  Date.isDate('2018年10月10') //false
  Date.isDate('2018.10.10') //true
  Date.isDate('123.456.123') //false
  Date.isDate('123.456') //false

  /**友情提醒：验证数字时，请小心里面的坑**/

  //大于275760，都为false，我也不知道为啥
  Date.isDate('275760') //true
  Date.isDate('275761') //false

  //如果是纯数字，不论小数整数一律返回true  
  Date.isDate(123.456) //true
  Date.isDate(-123.456) //true
```

# 月底的日期

> 使用方式
```js
  /**
   * 月底的日期
   * @param {String} formatter 
   */

  //当前月份的最后一天日期
  new Date().endOfMonth('YYYY-MM-DD')
```

# 提取身份证生日

> 使用方式
```js
 /**
  * 提取身份证生日
  * 返回：日期对象
  * @param {String} idCard - 身份证
  */
  Date.IDCardBirthday(idCard)

  Date.IDCardBirthday('220281199601012222') //1996-01-01
```
!> 注意：这里不校验身份证的格式

> 源码解析
```js
    /**
     * 提取身份证生日
     * 返回：日期对象
     * @param {String} idCard - 身份证
     */
    Object.getPrototypeOf(Date).IDCardBirthday = function(idCard) {
        let birthday = '';
        if (idCard && (idCard.length == 15 || idCard.length == 18)) {
            if (idCard.length == 15) {
                birthday = '19' + idCard.substr(6, 6);
            } else if (idCard.length == 18) {
                birthday = idCard.substr(6, 8);
            }
            birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-');
            if (Date.isDate(birthday) === false) birthday = ''
        }
        return birthday;
    }
```
!> 注意：这里使用了`Date.isDate方法`判断是否正确的日期格式

# 日期字符类型转换

> 使用方式
```js
let today = '2020-03-22'
let todayDateType = today.toDate()
// 返回一个Date类型的值
```


> 源码解析
```js
  String.prototype.toDate = function () {
    return new Date(Date.parse(this.replace(/-/g, '/')));
  }

```

!> 使用`-`分隔符在某些浏览器上有兼容问题，所以要转成`/`