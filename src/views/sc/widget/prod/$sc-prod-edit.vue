<template lang="html">
  <div class="sc-prod-edit">
    <slot></slot>
  </div>
</template>
<script>
export default {
  options: {
    icon: 'icon-prod',
  },
  data() {
    return {
      parts: ['ScProdInfo']
    }
  },
  methods: {
    async initialize () {
      // let type = 'sc'
      let v = await this.$get2('/api/business/queryPiProd', {bill_prod_id: this.payload.bill_prod_id})
      v = v.pi_prod || {}
      if (v.contract_id) {
        let bill = await this.$get2('/api/business/querySimpleBill', {
          bill_id: v.contract_id,
          bill_type: 'PI'
        })
        bill = bill.pi_contract || {}
        this.payload.currency = bill.currency
      }
      let parts = await this.$cache.getProdTabs('sc')
      // 子件不显示BOM页签
      if (v.is_sub_prod === 'yes') parts = parts.filter(f => f !== 'ScBom')
      // let parts = this.parts
      let part = this.payload.part || parts[0]
      let {contract_id, is_bom, sell_quantity} = v
      // if (is_bom === 'yes') parts.push('ScBom')
      this.$tab.push({
        slot: true,
        parts,
        show: part,
        query: {...this.payload, contract_id, is_bom, sell_quantity, isSuite: v.is_sub_prod === 'yes'},
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
