<template>
  <div class="view-more" style="">
    <div class="v-row" ref="viewRow" :class="{'v-more': viewMore, 'show-more-icon': showMoreIcon}">
      <slot></slot>

      <span class="v-icon pointer" v-if="showMoreIcon" @click="switchShow">
        <i class="el-icon-arrow-down" v-if="viewMore"></i>
        <i class="el-icon-arrow-right" v-else></i>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  props: {
  },
  data () {
    return {
      viewMore: false,
      showMoreIcon: false
    }
  },
  computed: {
  },
  methods: {
    onshowMoreIcon () {
      let row = this.$refs.viewRow
      if (!row) return
      this.showMoreIcon = row.scrollWidth > row.clientWidth || this.viewMore
    },
    switchShow () {
      this.viewMore = !this.viewMore
      this.$emit('switch-show')
    }
  },
  mounted () {
    window.addEventListener('resize', this.onshowMoreIcon)
    this.$nextTick(() => {
      setTimeout(() => {
        this.onshowMoreIcon()
        this.$el && this.$el.addEventListener('DOMSubtreeModified', this.onshowMoreIcon, false)
      })
    })
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onshowMoreIcon)
    this.$el.removeEventListener('DOMSubtreeModified', this.onshowMoreIcon, false)
  }
}
</script>

<style lang="scss">
  .view-more {
    white-space: nowrap;
    .v-row {
      position: relative;
      overflow: hidden;
      .v-icon {
        position: absolute;
        right: 0;
        z-index: 1;
        top: 0px;
      }
      &.show-more-icon {
        padding-right: 30px;
        &:after {
          content: "";
          height: 100%;
          position: absolute;
          right: 0;
          top: 0;
          background: white;
          width: 30px;
        }
      }
      &.v-more {
        white-space: normal;
        &>* {
          white-space: normal;
        }
      }
    }
  }
</style>
