<template lang="html">
  <div class="pm-edit">
    <slot></slot>
  </div>
</template>
<script>
export default {
  options: {
    icon: 'icon-prod',
  },
  data() {
    // , 'PmFactory', PmRemark
    return {
      parts: ['PmInfo', 'PmBom', 'PmFeature', 'PmCustomer'],
      // s_parts: ['PmInfo'],
      // extend_parts: ['PmRelaProd', 'PmCanView', 'PmCanSell', 'PmPrice', 'PmParts'],
    }
  },
  methods: {
    async initialize () {
      // let v = await this.$pull.queryProdInfo({prod_id: this.payload.prod_id})
      // v = v.prod_info || {}
      let type = 'pm'
      if (this.payload.status === 'research') type = 'ps'
      let parts = await this.$cache.getProdTabs(type)
      let mode = await this.$cache.getTabsMode(type)
      let part = this.payload.show || parts[0]
      let opt = {
        slot: true,
        parts,
        show: part,
        query: {...this.payload},
        show_menus: true,
        mode,
      }
      this.$tab.push(opt)
      // this.$tab.setTitle(v.prod_no)
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
