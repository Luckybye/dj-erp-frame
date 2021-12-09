import fields from './fields'
import {ruleMap} from '@/utils/validate-rule.js'

function check (data, obj) {
  // field最多两层，两层以上不处理
  let f = obj.key.split('.')
  let rules = obj.rules.split(',')
  if (/^\$/.test(f[0])) {
    let f1 = f[0].replace('$', '')
    if (!data[f1]) return '不存在'
    return data[f1].reduce((pre, item, i) => {
      validate(item[f[1]]) && (pre += `(${i + 1})` + validate(item[f[1]]) + ';')
      return pre
    }, '')
  } else if (f[1]) {
    if (!data[f[0]]) return '不存在'
    return validate(data[f[0]][f[1]])
  } else {
    return validate(data[f])
  }

  function validate (val) {
    let errs = []
    for (let i = 0; i < rules.length; i++) {
      let rule = rules[i]
      let err = ''
      if (/=/.test(rule)) {
        rule = rule.split('=')
        ruleMap[rule[0]] && (err = ruleMap[rule[0]](rule[1], val))
      } else {
        ruleMap[rule] && (err = ruleMap[rule](val))
      }
      if (err && err.hint) errs.push(err.hint)
    }
    errs = errs.join('，')
    console.log(obj.value, val, errs, 1111111111)
    errs && (errs = obj.value + errs)
    return errs
  }
}

// 加载一些全局的方法
window._g = {
  check,
  ...fields
}