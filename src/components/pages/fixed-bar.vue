<template>
  <div
    class="fixed-bar"
    :class="{'fixed': isFixed, [position]: true}"
    :bar-name="ignore ? 'ignoreBar' : ''"
  >
    <div
      class="bar"
      :style="isFixed ? barStyle : {}"
      :class="tclass"
    >
      <slot></slot>
    </div>
    <div
      class="bar-fill"
      :style="{width: barStyle.width, height: fillHeight}"
      v-if="isFixed && isFill"
    ></div>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    tclass: String,
    ignore: false,
    footer: '',
    zindex: {
      type: String,
      default: '101'
    },
    width: {
      type: [String, Function],
      default: '100%'
    },
    top: [String, Number],
    position: {
      type: String,
      default: 'top'
    },
    isFill: {
      type: Boolean,
      default: true
    },
    offsetTop: ''
  },
  data() {
    return {
      isFixed: false,
      scrollEl: window,
      fillHeight: 0,
      fixedY: 0,
      parentWidth: null,
      refresh: null,
      update: null,
      footerCross: 0
    }
  },
  methods: {
    toFixedBar() {
      console.log('toFixedBar', 11111111)
      let { position, footer, isFixed } = this
      this.$nextTick(() => {
        let rect = this.$el.getBoundingClientRect()
        let bar = this.$el.querySelector('.bar').getBoundingClientRect()
        let h = this.getPreBarsHeight(rect)
        let offset = rect[position]
        if (position === 'bottom') offset = window.innerHeight - offset
        if (footer && isFixed) {
          let f = document.body
            .querySelector('.ml-footer')
            .getBoundingClientRect()
          let wh = window.innerHeight
          let footerVh = wh - f.top + Number(footer)
          // let b = bar.bottom - bar.height
          // console.log(wh, f.top, footerVh, h, footerVh + h + bar.height, 33333333333)
          if (footerVh > 0 && footerVh + h + bar.height > wh) {
            this.footerCross = footerVh
          } else this.footerCross = 0
        }
        this.isFixed = offset <= h
        this.fillHeight = bar.height + 'px'
        this.setCurrentBarPosition()
      })
    },
    setCurrentBarPosition() {
      if (this.top) {
        this.fixedY = this.top
        return
      }
      if (this.isFixed) {
        if (parseFloat(this.fixedY)) return
        this.fixedY = this.getPreBarsHeight() + 'px'
      } else this.fixedY = 0
    },
    updateCurrentBarPosition() {
      if (this.isFixed) {
        if (this.top) return
        this.fixedY = this.getPreBarsHeight() + 'px'
      } else this.fixedY = 0
    },
    getPreBarsHeight() {
      if (this.position === 'bottom') return 0
      if (this.offsetTop) return this.offsetTop
      let bars = [...document.body.querySelectorAll('.fixed-bar.fixed.top')]
      let h = 0
      for (let i = 0; i < bars.length; i++) {
        const m = bars[i]
        if (m === this.$el) break
        if (m.getAttribute('bar-name') !== 'ignoreBar') h += m.clientHeight
      }
      return h
    }
  },
  watch: {
    $route() {
      this.refresh && this.refresh()
    },
    isFixed (n) {
      this.$emit('fixed-change', n)
    }
  },
  computed: {
    barStyle() {
      let { width, zindex, fixedY, position, footerCross } = this
      if (typeof width === 'function') width = width.call(this.$parent)
      let v = {
        width: width,
        top: 'auto',
        bottom: 'auto',
        [position]: fixedY,
        'z-index': zindex
      }
      if (position !== 'bottom' && footerCross) {
        v.top = 'auto'
        v.bottom = footerCross + 'px'
      }
      return v
    }
  },
  mounted() {
    this.refresh = this.$h.throttle(this.toFixedBar, 10)
    this.update = this.$h.throttle(this.updateCurrentBarPosition, 10)
    this.$event.$on('scroll', this.refresh )
    // this.scrollEl.addEventListener('scroll', this.refresh)
    window.addEventListener('resize', this.update)
    this.$nextTick(() => {
      this.refresh()
      // this.$el && this.$el.addEventListener('DOMSubtreeModified', this.refresh, false)
    })
  },
  beforeDestroy() {
    this.$event.$off('scroll', this.refresh )
    // this.scrollEl.removeEventListener('scroll', this.refresh)
    window.removeEventListener('resize', this.update)
    // this.$el && this.$el.removeEventListener('DOMSubtreeModified', this.refresh, false)
  }
}
</script>
<style lang="scss">
.fixed-bar {
  &.fixed {
    .bar {
      position: fixed;
      // top: 0;
      background: inherit;
    }
  }
}
</style>
