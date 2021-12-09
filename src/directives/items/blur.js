const ruleMap = {
  integer (e) {
    if (/^[+-]?\d*$/.test(e.target.value)) return
    // if (e.target.value === '+' || e.target.value === '-') return
    e.target.value = parseInt(e.target.value) || ''
  },
  number (e) {
    if (/^[+-]?\d*\.?\d*$/.test(e.target.value)) return
    // if (/^[+-]?\d+\.$/.test(e.target.value)) return
    e.target.value = parseFloat(e.target.value) || ''
  },
  max (e, val) {
    // if (val < 0 && e.target.value === '+') {
    //   e.target.value = ''
    // }
    // if (val * 1 >= 0 && (e.target.value === '-')) {
    //   e.target.value = ''
    //   return
    // }
    if (e.target.value * 1 > val * 1) e.target.value = val
    e.target.value = e.target.value * 1 || val
  },
  min (e, val) {
    // if (val > 0 && e.target.value === '-') {
    //   e.target.value = ''
    // }
    // if (val < 0 && e.target.value === '-') {
    //   e.target.value = ''
    // }
    // if (val * 1 < 0 && (e.target.value === '+')) {
    //   e.target.value = ''
    //   // return
    // }
    if (e.target.value * 1 < val * 1) e.target.value = val
    e.target.value = e.target.value * 1 || val
  }
}

export default function () {
  return {
    id: 'blur',
    bind (el, data, vnode) {
      let input
      let para = data.value
      if (/INPUT|TEXTAREA/.test(el.tagName)) {
        input = el
      } else {
        input = el.querySelector('input') || el.querySelector('textarea')
      }
      if (!input) return
      let rules = (para.rule || '').split(',')
      vnode.handlerInput = e => {
        e.preventDefault()
        e.stopPropagation()
        input.removeEventListener('blur', vnode.handlerInput)
        for (let i = 0; i < rules.length; i++) {
          const rule = rules[i];
          let [fun, val] = rule.split('=')
          ruleMap[fun] && ruleMap[fun](e, val)
        }
        input.blur()
        setTimeout(() => {
          input.addEventListener('blur', vnode.handlerInput, true)
        })
      }
      para.rule && input.addEventListener('blur', vnode.handlerInput, true)
    },
    unbind (el, data, vnode) {
      let input
      if (/INPUT|TEXTAREA/.test(el.tagName)) {
        input = el
      } else {
        input = el.querySelector('input') || el.querySelector('textarea')
      }
      if (!input) return
      input.removeEventListener('blur', vnode.handlerInput)
    }
  }
}
