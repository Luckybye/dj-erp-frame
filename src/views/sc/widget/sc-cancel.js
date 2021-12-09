import Vue from 'vue'
export default {
  components: {
  },
  data () {
    return {
      disabledMap: {
        sell_price: false,
        sell_quantity: false,
      },
      terms_editable: null
    }
  },
  props: {
  },
  methods: {
    async getEditable() {
      // 查询已撤销销售订单是否可编辑
      if (this.payload.bill_status !== 'cancel') return
      let para = {
        contract_id: this.payload.bill_id,
      }
      let v = await this.$get2('/api/business/queryCanceledPIEditable', para)
      console.log('this.payload.buy_busi_status:', this.payload.buy_busi_status)
      this.payload.buy_busi_status = 'open'
      console.log('this.payload.buy_busi_status:', this.payload.buy_busi_status)
      Vue.set(this.payload, 'buy_busi_status', 'open')
      this.terms_editable = v.is_editable === 'yes'
      return v
    },
    async onSaveCancelTerms (v, opt) {
      // 撤销状态销售订单变更条款
      if (this.payload.bill_status !== 'cancel') return
      let para = {
        contract_id: this.payload.bill_id,
        ...v,
      }
      await this.$post2('/api/business/updateCanceledContract', para, opt)
    },
    async getCanceledPiProds() {
      // 撤销状态销售订单产品列表
      if (this.payload.bill_status !== 'cancel') return
      let para = {
        contract_id: this.payload.bill_id,
      }
      let v = await this.$get2('/api/business/queryCanceledPiProds', para)
      return v
    },
    async onSaveCancelProds (v, bill_prod_id) {
      // 撤消状态销售订单变更产品单价、数量时处理：
      if (this.payload.bill_status !== 'cancel') return
      let para = {
        bill_prod_id,
        ...v,
      }
      await this.$post2('/api/business/updateCanceledProd', para)
    },
    async onDeleteCancelProds (v, bill_prod_id) {
      // 撤销状态销售订单产品列表删除产品
      if (this.payload.bill_status !== 'cancel') return
      let para = {
        bill_prod_id,
        ...v,
      }
      await this.$post2('/api/business/deletePiProd', para)
    },
  }
}