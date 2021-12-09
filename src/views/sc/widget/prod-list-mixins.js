
import Vue from 'vue'

function calc (row) {
  let pkg = (row.mg_pkgs || [])[0] || {}
  pkg = (pkg.inner_pkg_pcs * 1 || 1) * (pkg.outer_pkg_pcs * 1 || 1)
  let ctn = row.sell_quantity / pkg
  let qty = Math.ceil(row.sell_quantity / pkg) * pkg
  return {
    value: !/^\+?[0-9]*$/.test(ctn),
    text: `商品数量不是整箱,每箱${pkg}个,建议数量${qty}个`,
    qty
  }
}
let validate = [
  {value: 'prod_no', text: '公司货号'},
  // {value: 'main_pic', text: '图片'},
  {value: 'prod_name', text: '商品中文名'},
  {value: 'prod_name_en', text: '商品英文名'},
  {value: 'sell_price', text: '销售价格', filter: 'suite'},
  {value: 'sell_quantity', text: '产品数量'},
  {value: 'hs_code', text: '海关编码'},
  // {value: 'pu_price', text: '成本', filter: 'main'},
  {value: row => !(((row.mg_pkgs || [])[0] || {}).cbm * 1), text: '体积', filter: 'suite'},
  {value: row => calc(row).value, text: row => calc(row).text, filter: 'suite'},
  {value: row => row.is_bom === 'yes' && row.suites && row.suites.length < 2, text: '套件的子件数量必须≥2', filter: 'suite'}
]

function handlerRest (gw, cbm, v) {
  if (cbm <= 28) {
    v.gp20.percent = max(gw / 22, cbm / 28) * 100
    v.gp20.value = `${cbm}CBM/${gw}MT`
    v.gp20.count = v.gp20.count + 1
  }
  if (cbm > 28 && cbm <= 58) {
    v.gp40.percent = max(gw / 22, cbm / 58) * 100
    v.gp40.value = `${cbm}CBM/${gw}MT`
    v.gp40.count = v.gp40.count + 1
  }
  if (cbm > 58 && cbm <= 68) {
    v.hq40.percent = max(gw / 22, cbm / 68) * 100
    v.hq40.value = `${cbm}CBM/${gw}MT`
    v.hq40.count = v.hq40.count + 1
  }
}

const {floor, ceil, max} = Math
export default {
  props: {
    datas: {
      type: Array,
      default () {
        return []
      }
    },
    payload: {
      type: Object,
      default () {
        return {}
      }
    },
    mgCharge: {
      type: Object,
      default () {
        return {}
      }
    },
    scConfig: {
      type: Object,
      default () {
        return {}
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    disabledMap: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data() {
    return {
      selection: []
    }
  },
  computed: {
    prodTotal () {
      let v = {qty: 0, ctn: 0, cbm: 0, amount: 0, discount: 0, rate: 0, adjust_fee: 0}
      v.rate = this.mgCharge.discount_rate || 0
      this.datas.forEach(item => {
        v.qty += ((item.sell_quantity * 1) || 0)
        let a = (((item.sell_quantity * 1 || 0)._mul(item.sell_price) || 0).toFixed(2) * 1)
        v.amount += a
        v.adjust_fee += (item.adjust_fee * 1 || 0)
        v.discount += ((a._mul(v.rate) / 100 || 0).toFixed(2) * 1)
        item.mg_pkgs && item.mg_pkgs.forEach(m => {
          let n = (m.outer_pkg_pcs * 1 || 1) * (m.inner_pkg_pcs * 1 || 1)
          let ctn = Math.ceil(item.sell_quantity / n || 0)
          v.ctn += ctn
          v.cbm += Number((ctn * m.cbm || 0).toFixed(3))
        })
      })
      v.amount = v.amount.toFixed(2) * 1 || 0
      v.discount = v.discount.toFixed(2) * 1 || 0
      // v.adjust_fee = v.adjust_fee.toFixed(2)
      v.amount = v.amount._sub(v.discount)._add(v.adjust_fee)
      return v
    },
    loadInfoMap () {
      let vm = this.prodTotal
      let gw = ((vm.gw / 1000) || 0).toFixed(5) * 1
      let cbm = (vm.cbm || 0).toFixed(3) * 1
      let v = {
        gp20: {text: '20GP', value: '', limit: '28.00CBM / 22MT', percent: 0, count: 0},
        gp40: {text: '40GP', value: '', limit: '58.00CBM / 22MT', percent: 0, count: 0},
        hq40: {text: '40HQ', value: '', limit: '68.00CBM / 22MT', percent: 0, count: 0}
      }
      if (!gw && !cbm) return v

      if (gw <= 22 && cbm <= 68) {
        handlerRest(gw, cbm, v)
        return v
      }

      let n = floor(gw / 22)
      let ny = (gw % 22).toFixed(5) * 1
      let m = floor(cbm / 68)
      let my = (cbm % 68).toFixed(3) * 1 || 0
      let showValue = (m, my, n, ny, c) => `${m ? `${m}*${c}` : ''}${m && my ? '+' : ''}${my || ''}CBM/${n ? n + '*22' : ''}${n && ny ? '+' : ''}${ny || ''}MT`
      if (n > m) {
        v.gp20 = {
          ...v.gp20,
          percent: max(ny / 22, my / 28) * 100,
          value: showValue(m, my, n, ny, 28),
          count: max(ceil(gw / 22), ceil(cbm / 28))
        }
      } else {
        v.hq40 = {
          ...v.hq40,
          count: m,
          percent: 100,
          value: showValue(m, 0, n, ny, 68)
        }
        if (my > 0) handlerRest(0, my, v)
        if (my > 58) v.hq40.value = showValue(m, my, n, ny, 68)
      }
      return v
    },
    loadInfo () {
      return Object.values(this.loadInfoMap).reduce((pre, val) => {
        // console.log(val, 'val')
        if (val.count) pre.push(val.text + '*' + val.count)
        return pre
      }, []).join(', ')
    }
  },
  methods: {
    selectSup (v) {
      this.$dialog.SelectCustCom({pm: {custType: '4'}, vm: {cust_com_id: v.seller_id}}, (d, com) => {
        v.seller_id = d.cust_com_id || ''
        Vue.set(v, 'x_seller_id', com.com_name)
        this.onSave({seller_id: v.seller_id}, v)
      })
    },
    async onEditEtd (v, row) {
      let res = await this.onSave(v, row)
      // Object.assign(row, res.pi_prod)
      row.delivery_date = res.pi_prod.delivery_date || row.delivery_date
    },
    async onDelete ({bill_prod_id, contract_id: bill_id}) {
      await this.$confirm(this.$t('delete_tip'), this.$t('dialog_tip'), {type: 'warning'})
      await this.$get2('/api/business/deleteBillProd', {
        bill_prod_id,
        bill_type: 'PI',
        bill_id
      })
      this.$emit('refresh')
    },
    viewProd (v, part, disabledMap) {
      this.$tab.open({
        title: v.prod_name_en || v.prod_name,
        title_en: v.prod_name_en,
        tab_id: v.bill_prod_id,
        path: 'ScProdEdit',
        query: {...v, part, disabledMap}
      })
    },
    onValidate (item, filter) {
      // item.x_disabled = false
      filter = filter || (item.is_sub_prod === 'yes' ? 'suite' : '')
      let err = validate.reduce((pre, val) => {
        if (val.filter && val.filter === filter) return pre
        let bool, text
        if (typeof val.value === 'function') {
          bool = val.value(item)
        } else {
          bool = !item[val.value] || item[val.value] === '0'
        }
        if (typeof val.text === 'function') {
          text = val.text(item)
        } else {
          text = val.text
        }
        bool && pre.push(text)
        return pre
      }, [])
      // err.length && (item.x_disabled = true)
      err = err.join('；')
      return err
    },
    onSort (v, f) {
      return new Date(v[f]).getTime()
    },
    onEditQuantity (row, bom) {
      let para = {sell_quantity: row.sell_quantity}
      if (this.scConfig.fill_up === 'yes' && row.is_sub_prod !== 'yes') para.sell_quantity = calc(row).qty
      if (bom && bom.is_bom === 'yes') para.sub_rate = (para.sell_quantity / bom.sell_quantity).toFixed(2) * 1
      // 主件修改数量时，改掉子件的数量
      if (row.is_bom === 'yes') {
        row.suites.map(m => {
          m.sell_quantity = para.sell_quantity * m.sub_rate
        })
      }
      Object.assign(row, para)
      this.onSave(para, row)
    },
  },
  created() {
  },
  beforeDestroy() {}
}