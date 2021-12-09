<template lang="html">
  <div class="sc-dg-list">
    <dg-list :payload="{search: {contract_id: payload.bill_id, query_type: ''}}" @on-add="onAdd" ref="dgList"></dg-list>
  </div>
</template>
<script>
export default {
  data() {
    return {
      datas: []
    }
  },
  computed: {
  },
  methods: {
    async initialize () {
    },
    onAdd () {
      let d = this.payload
      this.$dialog.SelectShippingOrders({
        selected: [],
        searchVm: {
          bill_kind: 'SC',
          busi_group_id: d.busi_group_id,
          busi_user: d.busi_user,
          com_legal: d.seller_id,
          buyer_id: d.buyer_id,
          is_delivery: 'no',
          is_order: 'no',
          contract_id: this.payload.contract_id
        },
        disabledMap: {
          busi_group_id: true,
          busi_user: true,
          com_legal: true,
          buyer_id: true
        }
      }, async data => {
        if (!data.length) return
        let v = await this.$post('/api/business/editDelivery', {
          legal_id: d.seller_id,
          sell_cust_com_id: d.buyer_id,
          sell_cust_user_id: d.contact,
          contract_id: d.contract_id,
          pi_orders: data.map(({bill_prod_id}) => ({bill_prod_id}))
        })
        this.viewDetail({...v.pi_delivery})
        this.$refs.dgList.getDatas()
      })
    },
    viewDetail (v) {
      this.$tab.open({
        title: v.delivery_no,
        tab_id: v.delivery_id,
        path: 'DgEdit',
        query: {
          bill_id: v.delivery_id
        }
      })
    },
  },
  created() {
    this.initialize()
  },
  beforeDestroy() {}
}
</script>
<style lang="scss">
.sc-dg-list {}
</style>
