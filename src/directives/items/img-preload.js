export default function () {
  return {
    id: 'img-preload',
    bind (el, data) {
      if (data.value.pre) el.src = data.value.pre
      if (!data.value.src) return
      let img = new Image()
      img.src = data.value.src
      img.onload = () => {
        el.src = data.value.src
      }
      img.onerror = () => {
        el.src = data.value.error
      }
    }
  }
}
