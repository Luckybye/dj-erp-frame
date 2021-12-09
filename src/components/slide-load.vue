<template>
  <div class="slide-load-page">
    <div class="loading-warp" ref="loadingWrap">
      <div class="flex-middle" style="height:100%">
        <div v-if="loading">
          正在加载
        </div>
        <div v-else>
          {{loadingText}}
        </div>
      </div>
    </div>

    <slot></slot>
  </div>
</template>
<script>
function isMobile () {
  let userAgentInfo = navigator.userAgent
  let Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
  let flag = false
  for (let i = 0; i < Agents.length; i++) {
    if (userAgentInfo.indexOf(Agents[i]) >= 0) {
      flag = true
      break
    }
  }
  return flag
}
export default {
  props: {
    top: Boolean,
    right: {
      type: Boolean,
      default: true,
    },
    bottom: Boolean,
    left: Boolean,
    offset: {
      type: Number,
      default: 100,
    },
    loadingText: {
      type: String,
      default: '下一页',
    },
    direction: {
      type: String,
      default: '', // left, top, right, bottom
    }
  },
  components: {},
  data () {
    return {
      slideOffset: 0,
      loading: false
    }
  },
  methods: {
    init () {
      if (isMobile()) {
        this.addTouchEvent()
      } else this.addDragEvent()
    },
    addTouchEvent () {},
    addDragEvent () {
      let self = this
      let {direction} = this
      let start = {
        x: null,
        y: null,
      }
      let callback = null
      let moveOffset = 0
      let handlerMousemove = e => {
        e.preventDefault()
        e.stopPropagation()
        let wrap = self.$refs.loadingWrap
        if (!self.start) return;
        let x = (e.x || e.clientX)
        let y = (e.y || e.clientY)
        let w = x - start.x
        let h = y - start.y
        // console.log(w, h, 'w, h,w, h,', direction)
        // 向左w<0，向右w>0，向上h<0，向下h>0，
        if (Math.abs(w) < 30 && Math.abs(h) < 30) return;
        if (!direction) {
          if (w < 0 && Math.abs(w) > Math.abs(h)) direction = 'left'
          if (w > 0 && Math.abs(w) > Math.abs(h)) direction = 'right'
          if (h < 0 && Math.abs(w) < Math.abs(h)) direction = 'top'
          if (h > 0 && Math.abs(w) < Math.abs(h)) direction = 'bottom'
        }
        wrap.classList.add(direction + "-loading")
        if (direction === 'left' || direction === 'right') {
          wrap.style.width = Math.abs(w) + 'px'
          wrap.style.height = '100vh'
          moveOffset = Math.abs(w)
          callback = () => {
            wrap.style.width = 0
          }
        }
        if (direction === 'top' || direction === 'bottom') {
          wrap.style.height = Math.abs(h) + 'px'
          wrap.style.width = '100vw'
          moveOffset = Math.abs(h)
          callback = () => {
            wrap.style.height = 0
          }
        }
      }
      let handlerMouseup = e => {
        let wrap = self.$refs.loadingWrap
        self.start = false;
        let className = direction + "-loading"
        direction = ''
        start = {
          x: null,
          y: null,
        }
        if (moveOffset >= self.offset) {
          self.loading = true
          self.$emit('load-more', () => {
            self.loading = false
            wrap.classList.remove(className)
            callback && callback()
          })
        } else {
          wrap.classList.remove(className)
        }
        moveOffset = 0
        document.removeEventListener('mousemove', handlerMousemove)
        document.removeEventListener('mouseup', handlerMouseup)
      }
      document.addEventListener('mousedown', e => {
        if (self.loading) return
        self.start = true
        start.x = (e.x || e.clientX)
        start.y = (e.y || e.clientY)
        document.addEventListener('mousemove', handlerMousemove)
        document.addEventListener('mouseup', handlerMouseup)
      })
    },
  },
  computed: {
  },
  watch: {
  },
  created () {
    this.init()
  },
  beforeDestroy () {
  }
}
</script>
<style lang="scss">
.slide-load-page {
  position: relative;
  .loading-warp {
    display: none;
    transition: all 0.3s;
    white-space: nowrap;
    z-index: 1;
    color: white;
    overflow: hidden;
    text-align: center;
    position: fixed;
    &:after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      border-radius: 100%;
      background-color:rgba(0,0,0,0.6);
      z-index: -1;
    }
  }
  .left-loading {
    display: block;
    max-width: 100px;
    right: 0;
    top: 0;
    height: 100vh;
    width: 0;
    &:after {
      height: 100%;
      width: 400px;
    }
  }
  .right-loading {
    @extend .left-loading;
    left: 0;
    &:after {
      left: unset;
      right: 0;
    }
  }
  .top-loading {
    display: block;
    max-height: 100px;
    left: 0;
    bottom: 0;
    width: 100vw;
    &:after {
      width: 100%;
      height: 400px;
    }
  }
  .bottom-loading {
    @extend .top-loading;
    top: 0;
    &:after {
      top: unset;
      bottom: 0;
      // left: 0;
      // right: 0;
    }
  }

}
</style>