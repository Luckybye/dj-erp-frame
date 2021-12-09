<template lang="html">
  <div class="">
    <slot></slot>
  </div>
</template>
<script>
export default {
  data() {
    return {
      parts: ['DefineProdNature', 'DefineProdAttr', 'ProdTag'],
    }
  },
  methods: {
    async initialize () {
      let parts = this.parts
      let part = this.payload.show || parts[0]
      this.$tab.push({
        slot: true,
        parts,
        show: part,
        query: {...this.payload},
        show_menus: true,
      })
    }
  },
  created() {
    this.initialize()
  },
  beforeDestroy() {}
}
</script>
<style lang="scss">
</style>
