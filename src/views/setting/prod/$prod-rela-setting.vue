<template lang="html">
  <div class="">
    <slot></slot>
  </div>
</template>
<script>
export default {
  options: {
    desc: 'WebProdDisplay,web端产品卡;ProdSearchConfig,web端高级搜索;ProdExport,产品导出;ProdTheadSetting,产品列表配置;',
    icon: 'icon-set',
  },
  data() {
    return {
      parts: ['WebProdDisplay', 'ProdSearchConfig', 'ProdExport', 'ProdTheadSetting'],
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
