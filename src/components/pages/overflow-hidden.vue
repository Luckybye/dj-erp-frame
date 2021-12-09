<template>
  <div class="overflow-hidden" ref="contentPanel">
    <div class="o-content" :style="{'-webkit-line-clamp': row}" ref="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
// 多行文字溢出，隐藏并显示...，解决文字被切问题
export default {
  components: {
  },
  props: {
    lh: {
      type: [Number, String],
      default: 16
    }
  },
  data () {
    return {
      row: 1
    }
  },
  computed: {
  },
  methods: {
    onCalc () {
      let panel = this.$refs.contentPanel
      let content = this.$refs.content
      if (!panel || !content) return
      let min = content.childElementCount || 1
      this.row = Math.floor(panel.clientHeight / this.lh) || min
      // console.log(panel.clientHeight, 6666666666)
      let dis = () => {
        this.row > min && this.$nextTick(() => {
          if (panel.clientHeight < content.clientHeight) {
            this.row--
            dis()
          }
        })
      }
      dis()
    }
  },
  mounted () {
    window.addEventListener('resize', this.onCalc)
    this.$nextTick(() => {
      setTimeout(() => {
        this.onCalc()
        this.$el && this.$el.addEventListener('DOMSubtreeModified', this.onCalc, false)
      })
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onCalc)
    this.$el.removeEventListener('DOMSubtreeModified', this.onCalc, false)
  }
}
</script>

<style lang="scss">
  .overflow-hidden {
    .o-content {
      -webkit-line-clamp: 1;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      // word-break: break-all;
    }
  }
</style>
