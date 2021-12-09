
export default function () {
  return {
    id: 'focus',
    bind (el, data, vnode) {
      let input
      if (/INPUT|TEXTAREA/.test(el.tagName)) {
        input = el
      } else {
        input = el.querySelector('input') || el.querySelector('textarea')
      }
      if (!input) return
      vnode.onBlur = function () {
        console.log(vnode.SCROLLTOP, 66666)
        // alert()
        document.body.scrollTop = document.documentElement.scrollTop = vnode.SCROLLTOP || 0.1
      }
      input.onfocus = function () {
        vnode.SCROLLTOP = document.body.scrollTop || document.documentElement.scrollTop
        // 解决苹果手机键盘收起空白问题
        const isIOS = /(iPhone|iPod|iPad);?/i.test(navigator.userAgent)
        if (isIOS) input.addEventListener('blur', vnode.onBlur)
      }
      vnode.onClick = el.onclick = function (e) {
        input.focus()
      }
    },
    unbind (el, data, vnode) {
      el.removeEventListener('click', vnode.onClick)
      let input
      if (/INPUT|TEXTAREA/.test(el.tagName)) {
        input = el
      } else {
        input = el.querySelector('input') || el.querySelector('textarea')
      }
      if (!input) return
      input.removeEventListener('blur', vnode.onBlur)
    }
  }
}
