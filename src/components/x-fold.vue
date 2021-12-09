<template>
  <div class="x-fold" :class="{reverse, 'icon-trigger': trigger === 'icon', 'x-fold--open': open}">
    <template v-if="showHeader">
      <div class="fold--header _bottom text-primary" @click="opOpen('all')" :class="{'fixed-bottom': open}"  v-if="reverse">
        <slot name="header" v-if="$slots.header"></slot>
        <template v-else>
          <span v-if="!open">
            <t path="unfold">展开</t>
            <i class="el-icon-caret-bottom ml10"></i>
          </span>
          <span v-else>
            <t path="fold">收起</t>
            <i class="el-icon-caret-top ml10"></i>
          </span>
        </template>
      </div>
      <div class="fold--header _top dflt-skin" @click="opOpen()" v-else :class="{sticky}" :style="{top: (parseInt(sticky)||0)+'px'}">
        <slot name="header"></slot>
        <div class="h-right lh-n self-center" ref="trDom">
        </div>
        <i class="h-icon" :class="[open ? 'el-icon-arrow-down' : 'el-icon-arrow-right']" @click.stop="opOpen('icon')"></i>
      </div>
    </template>
    <el-collapse-transition>
      <div class="fold--content" v-show="open" :class="{'card': !reverse}">
        <slot></slot>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
export default {
  components: {
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    reverse: {
      type: Boolean,
      default: false
    },
    // 触发方式是icon的时候，点击icon才能收起展开，为空的时候点击header
    trigger: {
      type: String,
      default: 'icon'
    },
    sticky: [String, Boolean, Number],
    showHeader: {
      type: Boolean,
      default: true
    },
  },
  data () {
    return {
      open: false
    }
  },
  watch: {
    show (n) {
      this.open = this.show
    }
  },
  computed: {
  },
  methods: {
    opOpen (t) {
      if (this.trigger === t || t === 'all') this.open = !this.open
      this.$emit('update:show', this.open)
    },
  },
  mounted () {
    this.open = this.show
    this.$slots.default.forEach(m => {
      if (m.componentInstance) {
        m.componentInstance.$on('transfer-dom', ({scope, cb}) => {
          cb && cb(this.$refs.trDom)
        })
      }
    })
  },
  beforeDestroy () {
  }
}
</script>

<style lang="scss">
  .x-fold {
    // transition: height 0.3s ease;
    display: flex;
    flex-direction: column;
    // transition: all 3s;
    // will-change: height;
    &.reverse {
      flex-direction: column-reverse;
      .fold--header {
        text-align: center;
        height: 40px;
        line-height: 40px;
        cursor: pointer;
      }
    }
    .fold--header._top {
      position: relative;
      z-index: 1;
      &.dflt-skin {
        background: var(--bg-color);
        padding-right: 35px;
        padding-left: 15px;
        line-height: 30px;
        min-height: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      &.sticky {
        position: sticky;
        z-index: 10;
        // top: 40px;
      }
      .h-icon {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 16px;
        cursor: pointer;
      }
    }
    .fold--content {
      &.card {
        padding: 10px 15px;
        border: 1px solid rgb(252, 250, 250);
      }
      // will-change
    }
    &.full {
      .fold--header {
        margin-left: -15px;
        margin-right: -15px;
        line-height: 40px;
        min-height: 40px;
      }
      .fold--content {
        padding: 10px 0;
        border: 0;
      }
    }
  }
</style>
