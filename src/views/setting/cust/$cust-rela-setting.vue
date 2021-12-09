<template lang="html">
  <div class="cust-settings">
    <slot></slot>
  </div>
</template>
<script>
export default {
  options: {
    icon_text: 'B2B'
  },
  data() {
    return {
      // parts: ['CustLevel', 'CustType', 'StatsArea', 'WorldArea', 'MarketState'],
      parts: ['CustLevel', 'CustType', 'WorldArea', 'WebCustDisplay'],
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
