// import Vue from 'vue'
let homes = new Map();
export default function () {
  return {
    id: 'tr-dom',
    inserted (el, data, vnode) {
      // console.log('insertedinserted', data, vnode)
      let {value = {}} = data
      if (value.disabled) return
      let self = vnode.context
      let scope = self.componentName || (self.$vnode || {}).tag
      let parentNode = el.parentNode;
      let home = document.createComment('');

      el.classList.add('fadeInUp')
      let cb = (node) => {
        // el.classList.remove('nodisplay')
        if (!node) return
        parentNode.replaceChild(home, el);
        node.innerHTML = ''
        node.appendChild(el)
        homes.set(el, {scope, parent: node})
        setTimeout(() => {
          el.classList.remove('fadeInUp')
        }, 1000)
      }

      self.$nextTick(() => {
        self.$emit('transfer-dom', {scope, cb})
      })
    },
    componentUpdated (el, data, vnode) {
      // console.log('componentUpdatedcomponentUpdated', el, homes)
      let {value = {}} = data
      if (value.disabled) return
      let ref = homes.get(el)
      let self = vnode.context
      let scope = self.componentName || (self.$vnode || {}).tag
      // console.log(scope, el, 'scopescope')
      if (ref && ref.parent.contains(el)) return
      let cb = (node) => {
        // el.classList.remove('nodisplay')
        if (!node) return
        node.innerHTML = ''
        node.appendChild(el)
      }
      self.$nextTick(() => {
        self.$emit('transfer-dom', {scope, cb})
      })
    },
    unbind (el) {
      homes.delete(el);
    },
  }
}
