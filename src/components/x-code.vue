<template>
  <div class="x-code">
    <iframe ref="editIframe" width="100%" :height="height" src="/ace.html" frameborder="1"></iframe>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // url: '/ace.html?time=' + Date.now(),
    }
  },
  props: {
    value: [String],
    result: {
      type: Object,
      default() {
        return {}
      },
    },
    field: String,
    // readonly: [Boolean],
    disabled: [Boolean],
    height: {
      type: String,
      default: '500px'
    }
  },
  watch: {
    vmodel (n) {
      if (!this.stopWatchVmodel) this.postMessage({html: n, disabled: this.disabled})
    },
    disabled (n) {
      // console.log(n, 'nnnnnnnnnn')
      this.postMessage({disabled: n})
    }
  },
  computed: {
    vmodel: {
      get: function() {
        let { value, result, field } = this
        let val = value
        if (field) val = result[field]
        // this.postMessage({html: val, disabled: this.disabled})
        return val
      },
      set: function(val) {
        this.stopWatchVmodel = true
        let { result, field } = this
        this.$emit('input', val)
        if (field) result[field] = val
        setTimeout(() => {
          this.stopWatchVmodel = false
        })
      },
    },
  },
  methods: {
    async init() {
      this.$refs.editIframe.onload = () => {
        console.log('onloadonloadonload')
        this.postMessage({html: this.vmodel, disabled: this.disabled})
      }
    },
    postMessage(v, type) {
      if (!this.$refs.editIframe) return
      let iframeWin = this.$refs.editIframe.contentWindow
      iframeWin.postMessage(v, '*')
    },
    receiveMessage (e) {
      if (!this.$refs.editIframe) return
      let iframeWin = this.$refs.editIframe.contentWindow
      if (iframeWin !== e.source) return
      let {type, value, isChange} = e.data
      if (!type) return
      this.vmodel = value
      this.$emit('change')
      if (type === 'blur') this.$emit('blur')
      if (type === 'blur' && isChange) {
        this.$emit('blur-change')
        if (this.result && this.field) this.$emit('save', {[this.field]: this.result[this.field]})
      }
    }
  },
  mounted() {
    this.init()
    window.addEventListener("message", this.receiveMessage, false);
  },
}
</script>

<style lang="scss">
.x-code {
}
</style>
