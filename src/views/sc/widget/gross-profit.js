
export default {
  props: {},
  components: {},
  data () {
    return {
    }
  },
  methods: {
    getGp (f, v) {
      return v ? (this.grossProfit[v.bill_prod_id] || {})[f] : this.grossProfit[f]
    },
    async getCurrency () {
      this.currencyMap = (await this.$cache.getCurrency())._object('key')
    },
    async getAllHsCode () {
      this.hscodeMap = (await this.$cache.getAllHsCode())._object('hs_code')
    },
  },
  computed: {
    grossProfit () {
      let obj = {all_gp: 0, all_gp_rate: 0, sell_gp: 0, sell_gp_rate: 0, pu_gp: 0, pu_gp_rate: 0}
      if (!this.datas.length) return obj
      let amt = 0
      let {currency, pu_currency, in_currency, income_crate, cost_crate, in_currency_rate, bill_status, mg_charge} = this.vm
      if (bill_status === 'open') {
        // 未生效时，实时取汇率
        let {currencyMap} = this
        income_crate = currencyMap[currency].value || income_crate
        cost_crate = currencyMap[pu_currency].value || cost_crate
        in_currency_rate = currencyMap[in_currency].value || in_currency_rate
      }
      this.datas.forEach(m => {
        let v = {}
        let {sell_price, pu_price, in_price} = m
        // 有折扣的时候，销售价减去折扣
        if (mg_charge) {
          let d = mg_charge.discount_rate || 0
          let c = mg_charge.commission_rate || 0
          sell_price = sell_price * (100 - d) / 100 * (100 - c) / 100
        }
        if (pu_currency === 'CNY') {
          // 人民币的时候考虑退税和增值税
          let rebate_rate = (this.hscodeMap[m.hs_code] || {}).rebate_rate / 100 || 0
          let vat = m.vat / 100 || 0
          pu_price = pu_price * [1 - rebate_rate / (1 + vat)] / income_crate
          console.log('rebate_rate %s, vat %s', rebate_rate, vat, m.hs_code)
          // 价格全部换算为销售价币种
        } else if (pu_currency !== currency) pu_price = pu_price * cost_crate / income_crate
        if (in_currency !== currency) in_price = in_price * in_currency_rate / income_crate

        v.all_gp = ((sell_price - pu_price) * m.sell_quantity || 0).toFixed(2) * 1
        v.all_gp_rate = ((sell_price - pu_price) / sell_price * 100 || 0).toFixed(2) * 1
        v.pu_gp = ((in_price - pu_price) * m.sell_quantity || 0).toFixed(2) * 1
        v.pu_gp_rate = ((in_price - pu_price) / sell_price * 100 || 0).toFixed(2) * 1
        v.sell_gp = ((sell_price - in_price) * m.sell_quantity || 0).toFixed(2) * 1
        v.sell_gp_rate = ((sell_price - in_price) / sell_price * 100 || 0).toFixed(2) * 1
        obj[m.bill_prod_id] = v

        obj.all_gp += v.all_gp
        obj.sell_gp += v.sell_gp
        obj.pu_gp += v.pu_gp
        amt += ((sell_price * m.sell_quantity).toFixed(2) * 1 || 0)
      })
      obj.all_gp_rate = (obj.all_gp / amt * 100).toFixed(2)
      obj.sell_gp_rate = (obj.sell_gp / amt * 100).toFixed(2)
      obj.pu_gp_rate = (obj.pu_gp / amt * 100).toFixed(2)
      obj.all_gp = obj.all_gp.toFixed(2) * 1
      obj.sell_gp = obj.sell_gp.toFixed(2) * 1
      obj.pu_gp = obj.pu_gp.toFixed(2) * 1
      return obj
    }
  },
  watch: {
  },
  created () {
    this.getCurrency()
    this.getAllHsCode()
  },
  beforeDestroy () {
  }
}