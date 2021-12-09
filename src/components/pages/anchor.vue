<template>
  <el-timeline class="anchor">
    <el-timeline-item
      v-for="(item, index) in links"
      :key="index"
      :color="activeLink === index ? 'var(--color-primary)' : ''"
      >
      <div class="pointer text-overflow" :class="{active: activeLink === index, 'disabled': item.disabled}" @click="scrollTo(item, index)">
        <slot name="title" :item="item"></slot>
      </div>
    </el-timeline-item>
  </el-timeline>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    links: {
      type: Array,
      default () {
        return []
      }
    },
    mapper: {
      type: Object,
      default () {
        return {
          href: 'href',
          name: 'name',
          id: false
        }
      }
    },
    top: {
      type: [Number, String],
      default: 111
    },
    parent: '',
    tabId: ''
  },
  data () {
    return {
      activeLink: '',
      stopLocation: false
    }
  },
  methods: {
    getEl (item) {
      const {href, id} = this.mapper
      const {parent} = this
      if (id) {
        return (parent || document.body).querySelector('#' + item[href])
      } else return (parent || document.body).querySelector('.' + item[href])
    },
    scrollTo (item, i) {
      let anchor = this.getEl(item)
      if (anchor) {
        this.activeLink = i
        this.stopLocation = true
        anchor.scrollIntoView()
        this.$nextTick(() => {
          setTimeout(() => {
            this.stopLocation = false
          }, 500)
        })
      } else {
        this.$emit('show-tab', item, d => {
          this.scrollTo(item, i)
        })
      }
    },
    toLocation () {
      const {top, links, stopLocation} = this
      if (stopLocation) return
      let activeLink = ''
      let distance = 30
      for (let i = 0; i < links.length; i++) {
        const m = links[i]
        let anchor = this.getEl(m)
        // console.log(parent, anchor, 5555555, m[href])
        if (!anchor) continue
        let rect = anchor.getBoundingClientRect()
        let {y, height, bottom} = rect
        if (y + distance > top && i <= activeLink && activeLink) {
          // console.log('滑到最上面了', i)
          this.$emit('scroll-top', i - 1)
        }
        if (bottom - distance < window.innerHeight && i >= activeLink && activeLink >= 0) {
          // console.log('滑到最下面了，↓↓↓↓↓↓↓↓↓↓', i)
          this.$emit('scroll-bottom', i + 1)
        }
        if (y + height > top && activeLink === '' ) {
          activeLink = i
          this.activeLink = activeLink
        }
      }
    }
  },
  watch: {
  },
  computed: {
  },
  mounted () {
    this.scrollEl = window
    if (this.tabId) this.scrollEl = document.getElementById('pane-' + this.tabId)
    this.refresh = this.$h.throttle(this.toLocation, 10)
    this.scrollEl.addEventListener('scroll', this.refresh)
    // window.addEventListener('resize', this.update)
    this.$nextTick(() => {
      this.refresh()
      // this.$el && this.$el.addEventListener('DOMSubtreeModified', this.refresh, false)
    })
  },
  beforeDestroy () {
    this.scrollEl.removeEventListener('scroll', this.refresh)
    // window.removeEventListener('resize', this.update)
    // this.$el && this.$el.removeEventListener('DOMSubtreeModified', this.refresh, false)
  }
}
</script>
<style lang="scss">
  .anchor {
    padding: 10px;
    .active {
      color: var(--color-primary);
    }
    .disabled {
      color: var(--color-grey);
      cursor: not-allowed;
      pointer-events: none;
    }
    .el-timeline-item {
      padding-bottom: 0.1rem;
      &:last-child {
        padding-bottom: 0;
      }
      // .el-timeline-item__wrapper {
      //   top: 0;
      // }
    }
  }
</style>
