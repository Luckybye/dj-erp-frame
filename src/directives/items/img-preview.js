
export default function () {
  return {
    id: 'img-preview',
    bind (el, data, vnode) {
      const value = data.value || {}
      // console.log(data, vnode, 8888)
      // let _self = vnode.context
      let event = value.event || 'dblclick'
      vnode.event = event
      vnode.onClick = function (e) {
        let url = value.url || el.src.split('?')[0]
        if (!url) return
        // 图片
        let img = document.createElement('img')
        img.src = url
        img.style.margin = 'auto'
        img.style.display = 'block'
        img.style.userSelect = 'none'
        img.style.position = 'relative'
        img.style.top = '50%'
        img.style.transform = 'translateY(-50%)'
        img.style.maxWidth = '100%'
        img.style.minWidth = '10%'
        img.style.maxHeight = '100%'
        img.style.objectFit = 'contain'
        // 关闭按钮
        let close = document.createElement('div')
        close.style.position = 'absolute'
        close.style.right = 0
        close.style.top = 0
        close.style.width = '30px'
        close.style.height = '30px'
        close.style.color = 'white'
        close.style.fontSize = '25px'
        close.style.cursor = 'pointer'
        close.style.textAlign = 'center'
        close.style.lineHeight = '30px'
        close.innerText = '×'
        // 遮罩
        let mask = document.createElement('div')
        mask.appendChild(img)
        mask.appendChild(close)
        mask.style.position = 'fixed'
        mask.style.left = 0
        mask.style.top = 0
        mask.style.width = '100%'
        mask.style.height = '100%'
        mask.style.background = 'rgba(0, 0, 0, 0.8)'
        mask.style.zIndex = 5000

        document.body.appendChild(mask)

        // 点击图片或按钮关闭
        close.onclick = img.onclick = function (e) {
          e.stopPropagation()
          document.body.removeChild(mask)
        }
      }
      el.addEventListener(event, vnode.onClick)
    },
    unbind (el, data, vnode) {
      el.removeEventListener(vnode.event, vnode.onClick)
    }
  }
}
