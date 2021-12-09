export default function () {
  return {
    id: 'clickoutside2',
    bind (el, data, vnode) {
      vnode.handler = (e) => {
        // console.log(e.target, el, el.contains(e.target), 'el.contains(e.target)')
        if (!el.contains(e.target) && vnode.context) {
          let fun = vnode.context[data.expression]
          if (typeof fun === 'function') fun(false)
        }
      }
      document.addEventListener('click', vnode.handler)
    },
    unbind (el, data, vnode) {
      // let self = this
      document.removeEventListener('click', vnode.handler)
    }
  }
}
