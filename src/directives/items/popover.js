/* eslint-disable */
export default function () {
  return {
    id: 'popover',
    terminal: true,
    inserted (el ,data, vnode) {
      const _this = vnode
      const triggerBtn = vnode.context.$refs[data.value] || el
      //编译绑定作用域
      el.style.position = 'absolute'
      el.style.zIndex = 999
      el.style.display = 'none'

      let arrow = document.createElement('div')
      arrow.className = 'popper__arrow'
      el.appendChild(arrow)


      document.body.appendChild(el)

      //操作方法
      let parents = []
      const show = () => {
        el.style.display = 'block'
        arrow.style.left = triggerBtn.offsetWidth / 2 - 8 + 'px'
        document.addEventListener('click', clickOutside)
        window.addEventListener('resize', update)
        let parent = vnode.context.$el.parentNode
        while (1) {
          if (parent && parent.scrollHeight !== parent.offsetHeight) {
            parents.push(parent)
          }
          if (parent === document.body) break
          parent = parent.parentNode
        }
        parents.forEach(node => {
          node.addEventListener('scroll', update)
        })
        update()
      }
      const hide = () => {
        el.style.display = 'none'
        triggerBtn.className = triggerBtn.className.replace('active', '').trim()
        parents.forEach(node => {
          node.removeEventListener('scroll', update)
        })
        window.removeEventListener('resize', update)
        document.removeEventListener('click', clickOutside)

        // if (document.body.contains(el)) document.body.removeChild(el)
      }
      const update = () => {
        //判断top弹出还是bottom弹出
        const {top, left} = triggerBtn.getBoundingClientRect()
        let {height, lineHeight} = window.getComputedStyle(triggerBtn)
        height = parseInt(height) || lineHeight
        const popElementHeight = window.getComputedStyle(el).height
        const offsetTop = top + (parseInt(popElementHeight) || 0) + (parseInt(height) || 0)
        const clientHeight = document.documentElement.clientHeight
        const clientWidth = document.documentElement.clientWidth
        if (offsetTop > clientHeight) {
          //top弹出
          el.style.top = `${top - (parseInt(popElementHeight) || 0)}px`
        } else {
          //bottom弹出
          el.style.top = `${top + (parseInt(height) || 0)}px`
        }
        el.style.left = `${left}px`
        //pop元素超出屏幕左右的调整
        vnode.context.$nextTick(() => {
          const popElementStyle = window.getComputedStyle(el)
          const left = popElementStyle.left
          const width = popElementStyle.width
          if (left < 0) { el.style.left = 0 }
          if (parseInt(left) + parseInt(width) > clientWidth) { el.style.left = parseInt(el.style.left) - parseInt(left) - parseInt(width) + parseInt(clientWidth) - 10 + 'px' }
        })
      }

      const clickEl = () => {
        if (el.style.display === 'none') {
          update()
          show()
        } else hide()
      }
      const clickOutside = (e) => {
        if (vnode.context && !el.contains(e.target) && !triggerBtn.contains(e.target)) hide()
      }
      triggerBtn.addEventListener('click', clickEl)
      // triggerBtn.addEventListener('mouseover', clickEl)
      // triggerBtn.addEventListener('mouseout', clickEl)
    },
    unbind (el, data, vnode) {
    }
  }
}
