/* eslint-disable */
export let ruleMap = {
  mail: function mail (val) {
    // if (!val) return {hint: '非法的邮箱账号'}
    let bool = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/i.test(val)
    // let bool = /^[\S]+@[\S]+(\.[\S]+)+$/.test(val)
    if (!bool) return {hint: 'illegal mail'}
  },
  float: function float (length, val) {
    if (!/^\d*\.?\d*$/i.test(val)) return {hint: ('请填写正确的数字')}
    let v = val.toString().split('.')
    if (v[1] && v[1].length > length) return {hint: ('小数点不能超过' + length + '位')}
  },
  min: function min (min, val) {
    // console.log(min, val)
    if (val !== 0 && !val) return {hint: ''}
    if (parseFloat(val) < parseFloat(min)) return {hint: ('最小值不能小于' + min)}
  },
  max: function max (max, val) {
    // console.log(max, val)
    // if (val !== 0 && !val) return {hint: ''}
    if (parseFloat(val) > parseFloat(max)) return {hint: ('最大值不能大于' + max)}
  },
  minLen: function minLen (needLen, val) {
    // if (!val) return {hint: ''}
    val = val + ''
    if (val.length < needLen) return {hint: ('字符串的长度必须大于等于' + needLen)}
  },
  maxLen: function maxLen (needLen, val) {
    // if (!val) return {hint: ''}
    val = val + ''
    if (val.length > needLen) return {hint: ('字符串的长度必须小于等于' + needLen)}
  },
  limit: function limit (reg, val) {
    // if (!val) return {hint: ('格式不正确')}
    val = val + ''
    reg = new RegExp(reg)
    // console.log(val, reg)
    if (val.search(reg) === -1) return {hint: ('格式不正确')}
  },
  phone: function phone (val) {
    let v = /^[1][3,4,5,7,8,9][0-9]{9}$/i.test(val)
    if (!v) return {hint: ('手机号格式不正确')}
  },
  // 模糊校验国内外手机，不带区号
  phone2 (val) {
    let v = /^[\d]{6,}$/i.test(val)
    if (!v) return {hint: ('手机号格式不正确')}
  },
  tel: function tel (val) {
    // 粗略校验联系方式（手机、座机）
    let v = /^[\d]+-?[\d]{3,}$/i.test(val)
    if (!v) return {hint: ('联系方式格式不正确')}
  },
  require: function require (val) {
    if (val !== 0 && !val) {
      return {hint: ('必填')}
    }
  },
  text_en: function text_en (val) {
    if (!val) return
    if (!/^[a-zA-Z][\w\s\-]*[a-zA-Z0-9]$/.test(val)) return {hint: ('请输入英文字母或数字或下划线组成的字符')}
  },
  integer: function integer (val) {
    if (!val) return
    if (!/^[+-]?\d*$/.test(val)) return {hint: ('请输入整数')}
  },
}

export function validate (type, val, next) {
  let rule = ruleMap[type]
  if (!rule) return false
  rule = rule(val)
  if (next) {
    if (rule && rule.then) {
      return rule.then(rst => {
        next(rst)
      })
    } else next(rule)
  }
  return rule
}

export function createRules (fmt) {
  let fields = Array.isArray(fmt) ? fmt : Object.keys(fmt)
  return fields.reduce((pre, k) => {
    return {
      ...pre,
      [k]: [
        {
          required: true,
          message: 'Require',
          trigger: ['blur', 'change']
        }
      ]
    }
  }, {})
}