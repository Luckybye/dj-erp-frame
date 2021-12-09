export default {
  data() {
    return {
      scConfig: {},
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
    async getScConfig () {
      let config = await this.$configure.getValue('sc_config', this.$state('me').com_id)
      this.scConfig = config.sc_config || {}
    },
    handleCommand (c) {
      this[c] && this[c]()
    },
    uploadExcel () {
      let para = {
        bill_id: this.payload.bill_id,
        bill_type: 'PI',
        imp_para: {
          contract_id: this.payload.bill_id,
          imp_type: 'impOrder'
        }
      }
      this.$dialog.ImpProdInOrder(para, (data) => {
        this.getDatas()
      })
    },
    addProd () {
      let v = {
        selected: this.scConfig.select_sameprod === 'yes' ? [] : this.datas,
      }
      this.$dialog.SelectPmProd(v, async data => {
        if (!data.length) return
        this.addBillProd(data)
      })
    },
    async addBillProd (data, type = 'catalog') {
      let para = {
        bill_id: this.payload.bill_id,
        bill_type: "PI",
        origin_type: type,
        pi_prods: data.map(m => {
          if (type === 'order') return {bill_prod_id: m.pi_prod_id}
          if (type === 'quote') return {bill_prod_id: m.bill_prod_id}
          return {prod_id: m.prod_id}
        })
      }
      await this.$post('/api/business/addBillProd', para, {loading: true})
      this.getDatas({loading: false})
    },
    addSpareProd () {
      this.$dialog.SelectPmProd({
        selected: this.datas,
        type: 'sparepart',
        bill_id: this.payload.bill_id,
        bill_type: "PI",
      }, async data => {
        this.getDatas({loading: false})
      })
    },
    getDiscount () {
      let v = {
        collection: 'pi_bills',
        id: this.payload.bill_id,
        field: 'mg_charge'
      }
      this.$get('/api/support/getMgbField', v, {loading: false}).then(data => {
        this.mgCharge = data.mg_charge || {}
      })
    },
    onSort () {
      this.$dialog.SortProd({datas: this.datas}, (data, type) => {
        this.datas = data
        type === 'save' && this.onDrop()
      })
    },
    onDrop () {
      let list = this.datas.map((m, index, arr) => {
        m.seq_pi = arr.length - index
        return {
          bill_prod_id: m.bill_prod_id,
          seq_pi: m.seq_pi
        }
      })
      this.$post2('/api/business/updateProdSeqNo', {pi_prods: list})
    },
    selectOrder () {
      this.onSelectQuoteProd('ordered', 'order', 'Order')
    },
    selectCustProd () {
      this.onSelectQuoteProd('cust', 'cust_prod', 'Customer')
    },
    selectQuProd () {
      this.onSelectQuoteProd('quoted', 'quote', 'Quoted')
    },
    onSelectQuoteProd (prod_type, origin_type, title) {
      let v = {
        title,
        prod_type,
        bill_id: this.payload.bill_id,
        bill_type: 'PI',
        buyer_id: this.payload.buyer_id,
        selected: this.datas || []
      }
      this.$dialog.SelectQuoteProd(v, (prods) => {
        if (!prods) return
        this.addBillProd(prods, origin_type || prod_type)
      })
    },
  },
  created() {
  },
  beforeDestroy() {
  }
}
