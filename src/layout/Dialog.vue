<template>
  <div class="dialog-wrap" ref="dialog"></div>
</template>

<script>
export default {
  name: 'x-dialog',
  props: {
    path: {
      type: String,
      required: true
    }
  },
  components: {
  },
  methods: {
    open (d) {
      if (!d.data || d.data.type !== 'dialog_data') return
      let {path} = this
      // console.log(path, 'pathpathpathpath')
      path && this.$dialog[path] && this.$dialog[path](d.data.data, (...arg) => {
        console.log('argargarg', arg)
        window.postMessage({
          type: 'dialog_confirm',
          data: arg
        }, '*')
      })
    }
  },
  mounted () {
  },
  created () {
    console.log('createdcreatedcreated')
    window.postMessage({
      type: 'dialog_get_data',
    }, '*')
    window.addEventListener('message', this.open)
  },
  beforeDestroy () {
    window.removeEventListener('message', this.open)
  }
}
</script>
<style lang="scss">
.dialog-wrap {
  .el-dialog {
    // width: 100% !important;
  }
}
</style>
