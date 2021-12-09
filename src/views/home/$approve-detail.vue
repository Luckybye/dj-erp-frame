<template>
  <div class="">
    <iframe :src="payload.url" frameborder="0" width="100%" style="height: calc(100vh - 200px)" @load="onLoad" ref="iframe"></iframe>
  </div>
</template>
<script>
export default {
  options: {
    icon_text: 'Appr'
  },
  props: {},
  components: {},
  data () {
    return {
    }
  },
  methods: {
    onLoad () {
      // let el = this.$refs.iframe.contentWindow.document.querySelector('.header')
      // el.style.display = "none"
    }
  },
  computed: {
  },
  watch: {
  },
  created () {
  },
  beforeDestroy () {
  }
}
</script>
<style lang="scss">
</style>