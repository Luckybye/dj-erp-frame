/* eslint-disable */
import moment from 'dayjs'
import {fthousands} from './filters.js'

// 数字千分位 123,466,895,465， 同时继承toFixed
Number.prototype.fthousands = function (...arg) {
  return fthousands(this, ...arg)
}
String.prototype.fthousands = function (...arg) {
  return fthousands(this, ...arg)
}

Object._clone = (v) => {
  if (!v) return v
  return JSON.parse(JSON.stringify(v))
}

Object._of = (v, val) => {
  if (!v) return v
  return Object.keys(v).reduce((pre, key) => {
    pre[key] = typeof val === 'function' ? val(v[key]) : val
    return pre
  }, {})
}

// 对象合并，以第一个对象的字段为准，多余字段的值不要
Object._merge = (oldV, newV) => {
  if (!newV) return {...oldV}
  return Object.keys(oldV).reduce((pre, key) => {
    if (newV.hasOwnProperty(key)) pre[key] = newV[key]
    return pre
  }, {...oldV})
}

String.prototype.substringb = function (len) {
  var l = this.length;
  var blen = 0;
  var i = 0;
  for (; i < l;) {
    if ((this.charCodeAt(i) & 0xff00) != 0) {
      blen++;
    }
    blen++;
    i++
    if (blen > len) {
      i--
      break;
    } else if (blen === len) {
      break;
    }
  }
  return this.substring(0, i);
}
String.prototype.parse = function () {
  let str = this
  if (!str) return str
  try {
    str = JSON.parse(str)
  } catch (error) {
  }
  return str
}
function isNaN(value) {
  return (typeof value) === 'number' && window.isNaN(value);
}
function isInvalidDate(date) {
  return date instanceof Date && isNaN(date.getTime())
}

// 待定，后面去掉
Object.defineProperties(Object.prototype, {
  _trim: {
    get () {
      return function () {
        var item = this
        for (var key in item) {
          if (item.hasOwnProperty(key)) {
            if (item[key] === undefined || item[key] === '' || item[key] === null || isNaN(item[key]) || isInvalidDate(item[key])) delete item[key]
            if (Array.isArray(item[key]) && item[key].length === 0) delete item[key]
            // 删除最外一层对象里面的x_开头的字段
            if (/^x_/.test(key)) delete item[key]
          }
        }
        return item
      }
    }
  }
})
Array.prototype._sum = function (f) {
  let t = 0
  for (var i = 0; i < this.length; i++) {
    let m = f ? this[i][f] : this[i]
    t += (m * 1 || 0)
  }
  return t
}
Array.prototype.contains = function (obj) {
  var isFunction = typeof obj === 'function'
  var i = this.length;
  while (i--) {
    var item = this[i]
    if (isFunction) {
      if (obj(item)) {
        return item;
      }
    } else {
      if (item === obj) {
        return item;
      }
    }
  }
}
//数组转对象
Array.prototype._object = function (field, val) {
  var obj = {}
  for (var i = 0; i < this.length; i++) {
		var item = this[i]
		var key, value
		// 确定对象的key
    if (field) {
			key = item[field] + ''
		} else key = item + ''
		// 确定对象的value
    if (typeof val === 'function') {
      value = val(item, i)
    } else if (typeof val !== 'undefined') {
			value = val
		} else value = item
    obj[key] = value
  }
  return obj
}

Array._of = function (n, val) {
  let arr = []
  if (!n) return arr
  for (var i = 0; i < n; i++) {
    if (typeof val === 'function') {
      arr.push(val(i))
    } else arr.push(val || i)
  }
  return arr
}

//得到选中的
Array.prototype._selected = function (field, eq) {
  var arr = []
  typeof eq === 'undefined' && (eq = true)
  if (!field) return arr
  for (var i = 0; i < this.length; i++) {
    var item = this[i]
    if (item[field] === eq) arr.push(item)
  }
  return arr
}
Array.prototype._push = function (arr) {
  if (!arr) return
  for (var i = 0; i < arr.length; i++) {
    this.push(arr[i])
  }
  return this
}
Array.prototype._assign = function (ext) {
  if (!ext) return
  for (var i = 0; i < this.length; i++) {
    Object.assign(this[i], ext)
  }
  return this
}
Array.prototype._fmt = function (ext) {
  if (!ext) return
  for (var i = 0; i < this.length; i++) {
    this[i] = {...ext, ...this[i]}
  }
  return this
}
Array.prototype._flat = function (f) {
  if (!f) return this.flat(Infinity)
  let arr = []
  let flateen = d => {
    for (let i = 0; i < d.length; i++) {
      let v = d[i]
      if (v[f] && v[f].length) {
        flateen(v[f])
      } else arr.push(v)
    }
  }
  flateen(this)
  return arr
}
Array.prototype.toGroup = function (field) {
  var obj = {}
  if (!field) return obj
  for (var i = 0; i < this.length; i++) {
    var item = this[i]
    var v = obj[item[field]]
    if (!v) {
      v = []
      obj[item[field]] = v
    }
    v.push(item)
  }
  return obj
}
Array.prototype.find || (Array.prototype.find = Array.prototype.contains)
Array.prototype._filter = function (ext, back) {
  if (!ext) return []
  let arr = []
  let isFun = typeof ext === 'function'
  let isFun2 = typeof back === 'function'
  for (var i = 0; i < this.length; i++) {
    let rst = isFun ? ext(this[i]) : this[i][ext]
    if (!rst) continue
    if (back) {
      rst && arr.push(isFun2 ? back(this[i]) : this[i][back])
    } else arr.push(rst)
  }
  return arr
}

Array.prototype.findLast = function (cb) {
  let rst
  for (let i = this.length - 1; i >= 0; i--) {
    const m = this[i];
    if (cb(m)) {
      rst = m
      break
    }
  }
  return rst
}
Array.prototype.findLastIndex = function (cb) {
  let index = -1
  for (let i = this.length - 1; i >= 0; i--) {
    const m = this[i];
    if (cb(m)) {
      index = i
      break
    }
  }
  return index
}
Date.prototype.toTime = function (format = 'YYYY-MM-DD') {
  let time = new Date(this)
  if (time) return moment(time).format(format)
}

const nativeToFixed = Number.prototype.toFixed
//重载toFixed, 四舍五入
Number.prototype.toFixed = function (decimal, unFillZero) {
  let digit = Math.pow(10, decimal)
  let num = Math.round(this._mul(digit)) / digit
  return nativeToFixed.call(num, decimal)
}
//挂载toFixed
String.prototype.toFixed = function (decimal) {
  //判断浮点数
  if (!/^(-?\d+)(\.\d+)?$/.test(this)) {
    return 0
  }
  return Number.prototype.toFixed.call(parseFloat(this), decimal)
}
String.prototype._split = function (t) {
  if (!this) return []
  return (this + '').split(t)
}
// 日期，在原有日期基础上，增加days天数，默认增加1天
function addDate (date, days) {
  if (days == undefined || days == '') {
    days = 1
  }
  var date = new Date(date)
  date.setDate(date.getDate() + days)
  var month = date.getMonth() + 1
  var day = date.getDate()
  return date.getFullYear() + '-' + getFormatDate(month) + '-' + getFormatDate(day)
}

// 日期月份/天的显示，如果是1位数，则在前面加上'0'
function getFormatDate (arg) {
  if (arg == undefined || arg == '') {
    return ''
  }
  var re = arg + ''
  if (re.length < 2) {
    re = '0' + re
  }
  return re
}

String.prototype._addDays = Date.prototype._addDays = function (days) {
  try {
    return addDate(new Date(this), days)
  } catch (e) {
    return this
  }
}

String.prototype._compareDate = Date.prototype._compareDate = function (date) {
  try {
    return ((new Date(this.replace(/-/g,"\/"))) > (new Date(date.replace(/-/g,"\/"))));
  }catch (e) {
    return false
  }
}

String.prototype._eval = function (...arg) {
  if (!this) return ''
  let str = this
  let r = /^([^{]+){([\s\S]+)}[^}]*$/g;
  let match = r.exec(str) || [];
  let head = match[1];
  let body = match[2];
  let r2 = /\(([^()]+)\)/
  match = r2.exec(head) || [];
  let argNames = (match[1] || '').split(',');
  if (!head || !body) {
    if (!arg.length) return str
    arg.forEach(m => {
      str = str.replace('%s', m)
    })
    return str
  }
  argNames.push(body)
  let fn = Function.apply(null, argNames);
  return fn.apply(null, arg);
}

/**
 * [_mul 乘法]
 * @param  {[type]} multiplier [description]
 * @return {[type]}            [description]
 */
Number.prototype._mul = function(multiplier) {
  var decimal = 0,
    m1 = this.toString(),
    m2 = multiplier.toString(),
    arr1 = [],
    arr2 = [];
  try {
    arr1 = m1.split(".");
    decimal += arr1.length > 1 ? arr1[1].length : 0;
  } catch (e) {
    console.log(e);
  }
  try {
    arr2 = m2.split(".");
    decimal += arr2.length > 1 ? arr2[1].length : 0;
  } catch (e) {
    console.log(e);
  }
  return Number(m1.replace(".", "")) * Number(m2.replace(".", "")) / Math.pow(10, decimal);
}

/**
 * [_div 除法]
 * @param  {[type]} dividend [description]
 * @return {[type]}          [description]
 */
Number.prototype._div = function(dividend) {
  var d1 = 0,
    d2 = 0,
    arr1 = [],
    arr2 = [],
    divisor = this.toString(),
    dividend = dividend.toString();
  try {
    arr1 = divisor.split(".")
    d1 = arr1.length > 1 ? arr1[1].length : 0;
  } catch (e) {
    console.log(e);
  }
  try {
    arr2 = dividend.split(".")
    d2 = arr2.length > 1 ? arr2[1].length : 0;
  } catch (e) {
    console.log(e);
  }
  return divisor = Number(divisor.replace(".", "")), dividend = Number(dividend.replace(".", "")), divisor / dividend * Math.pow(10, d2 - d1)
}

/**
 * [_add 加法]
 * @param {[type]} addend [description]
 */
Number.prototype._add = function(addend) {
  var d1 = 0,
    d2 = 0,
    arr1 = [],
    arr2 = [],
    summand = this,
    dMax;
  try {
    arr1 = summand.toString().split(".");
    d1 = arr1.length > 1 ? arr1[1].length : 0;
  } catch (e) {
    console.log(e);
  }
  try {
    arr2 = addend.toString().split(".");
    d2 = arr2.length > 1 ? arr2[1].length : 0;
  } catch (e) {
    console.log(e);
  }
  dMax = Math.pow(10, Math.max(d1, d2));
  return (summand._mul(dMax) + addend._mul(dMax)) / dMax;
};

/**
 * [_sub 减法]
 * @param  {[type]} subtrahend [description]
 * @return {[type]}            [description]
 */
Number.prototype._sub = function(subtrahend) {
  var d1 = 0,
    d2 = 0,
    arr1 = 0,
    arr2 = 0,
    minuend = this,
    dMax;
  try {
    arr1 = minuend.toString().split(".");
    d1 = arr1.length > 1 ? arr1[1].length : 0;
  } catch (e) {
    console.log(e);
  }
  try {
    arr2 = subtrahend.toString().split(".");
    d2 = arr2.length > 1 ? arr2[1].length : 0;
  } catch (e) {
    console.log(e);
  }
  dMax = Math.pow(10, Math.max(d1, d2));
  // console.log((minuend._mul(dMax) - (subtrahend * 1)._mul(dMax)) / dMax)
  return (minuend._mul(dMax) - (subtrahend * 1)._mul(dMax)) / dMax;
};




// /**
//  * [pow 位数转换]
//  * @param  {Number} decimal [description]
//  * @return {Number}         [description]
//  */
// function pow (decimal) {
//   return Number(Math.pow(10, decimal).toFixed(Math.abs(decimal)))
// }

// /**
//  * [浮点数加法计算]
//  * @param  {Number} v1 [description]
//  * @param  {Number} v2 [description]
//  * @return {[type]}    [description]
//  */
// function mul (v1, v2) {
//   let decimal = 0
//   let m1 = v1.toString()
//   let m2 = v2.toString()
//   try {
//     decimal += (m1.split('.')[1] || '').length
//     decimal += (m2.split('.')[1] || '').length
//   } catch (e) {
//     console.log(e)
//   }
//   return Number(m1.replace('.', '')) * Number(m2.replace('.', '')) / pow(decimal)
// }

// /**
//  * [浮点数除法计算]
//  * @param  {Number} v1 [description]
//  * @param  {Number} v2 [description]
//  * @return {[type]}    [description]
//  */
// function div (v1, v2) {
//   let decimal = 0
//   let m1 = v1.toString()
//   let m2 = v2.toString()
//   decimal = (m2.split('.')[1] || '').length - (m1.split('.')[1] || '').length
//   return Number(m1.replace('.', '')) / Number(m2.replace('.', '')) * pow(decimal)
// }

// /**
//  * [浮点数加法计算]
//  * @param  {Number} v1 [description]
//  * @param  {Number} v2 [description]
//  * @return {[type]}    [description]
//  */
// function add (v1, v2) {
//   let decimal = 0
//   let m1 = v1.toString()
//   let m2 = v2.toString()
//   decimal = pow(10, Math.max((m1.split('.')[1] || '').length, (m2.split('.')[1] || '').length))
//   return (mul(Number(v1), decimal) + mul(Number(v2), decimal)) / decimal
// }

// /**
//  * [浮点数减法计算]
//  * @param  {Number} v1 [description]
//  * @param  {Number} v2 [description]
//  * @return {[type]}    [description]
//  */
// function sub (v1, v2) {
//   let decimal = 0
//   let m1 = v1.toString()
//   let m2 = v2.toString()
//   decimal = pow(10, Math.max((m1.split('.')[1] || '').length, (m2.split('.')[1] || '').length))
//   return (mul(Number(v1), decimal) - mul(Number(v2), decimal)) / decimal
// }


// /**
//  * [pow 位数转换]
//  * @param  {Number} x [底数]
//  * @param  {Number} y [幂数]
//  * @return {Number}   [description]
//  */
// function pow (x=10, y) {
//   return Number(Math.pow(x, y).toFixed(Math.abs(y)))
// }

// /**
//  * [浮点数加法计算]
//  * @param  {Number} v1 [description]
//  * @param  {Number} v2 [description]
//  * @return {[type]}    [description]
//  */
// function mul (v1, v2) {
//   let decimal = 0
//   let m1 = v1.toString()
//   let m2 = v2.toString()
//   try {
//     decimal += (m1.split('.')[1] || '').length
//     decimal += (m2.split('.')[1] || '').length
//   } catch (e) {
//     console.log(e)
//   }
//   return Number(m1.replace('.', '')) * Number(m2.replace('.', '')) / pow(undefined, decimal)
// }

// /**
//  * [浮点数除法计算]
//  * @param  {Number} v1 [description]
//  * @param  {Number} v2 [description]
//  * @return {[type]}    [description]
//  */
// function div (v1, v2) {
//   let decimal = 0
//   let m1 = v1.toString()
//   let m2 = v2.toString()
//   decimal = (m2.split('.')[1] || '').length - (m1.split('.')[1] || '').length
//   return Number(m1.replace('.', '')) / Number(m2.replace('.', '')) * pow(undefined, decimal)
// }

// /**
//  * [浮点数加法计算]
//  * @param  {Number} v1 [description]
//  * @param  {Number} v2 [description]
//  * @return {[type]}    [description]
//  */
// function add (v1, v2) {
//   let decimal = 0
//   let m1 = v1.toString()
//   let m2 = v2.toString()
//   decimal = pow(undefined, Math.max((m1.split('.')[1] || '').length, (m2.split('.')[1] || '').length))
//   return (mul(Number(v1), decimal) + mul(Number(v2), decimal)) / decimal
// }

// /**
//  * [浮点数减法计算]
//  * @param  {Number} v1 [description]
//  * @param  {Number} v2 [description]
//  * @return {[type]}    [description]
//  */
// function sub (v1, v2) {
//   let decimal = 0
//   let m1 = v1.toString()
//   let m2 = v2.toString()
//   decimal = pow(undefined, Math.max((m1.split('.')[1] || '').length, (m2.split('.')[1] || '').length))
//   return (mul(Number(v1), decimal) - mul(Number(v2), decimal)) / decimal
// }
