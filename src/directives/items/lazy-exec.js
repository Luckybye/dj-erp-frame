export default function () {
  return {
    id: 'lazy-exec',
    bind (el, data, vnode) {
      let fun = data.value
      fun(el)
      // vnode.handler = (e) => {
      //   if (!el.contains(e.target) && vnode.context) {
      //     let fun = vnode.context[data.expression]
      //     if (typeof fun === 'function') fun(false)
      //   }
      // }
      // document.addEventListener('click', vnode.handler)
    },
    unbind (el, data, vnode) {
      // let self = this
      // document.removeEventListener('click', vnode.handler)
    }
  }
}
