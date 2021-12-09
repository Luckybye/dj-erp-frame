<template lang="html">
  <div class="contact-edit">
    <slot></slot>
  </div>
</template>
<script>
export default {
  data() {
    return {
      2: ['ContactInfo', 'CustSettingBrand', 'CustLikeProd', 'CustMarketingLog'],
      4: ['ContactInfo'],
      9999: ['ContactInfo'],
    }
  },
  methods: {
    async initialize () {
      let v = await this.$get2('/api/crm/queryCustUser', {cust_id: this.payload.cust_id})
      v = v.cust_user || {}
      let parts = this[this.payload.cust_type] || this[9999]
      let show = this.payload.show || parts[0]
      this.$tab.push({
        slot: true,
        parts,
        show,
        query: {...this.payload, ...v},
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
