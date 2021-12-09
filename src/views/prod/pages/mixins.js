
export default {
  props: {
    viewModel: {
      type: Object,
      default () {
        return {}
      }
    },
    payload: {
      type: Object,
      default () {
        return {}
      }
    },
    disabledMap: {
      type: Object,
      default () {
        return {}
      }
    },
    readonly: {
      type: Boolean,
      default: false
    },
    isCn: {
      type: Boolean,
      default: false
    },
    isSuite: {
      type: Boolean,
      default: false
    },
    billType: {
      type: String,
      default: 'pm'
    },

    billId: {
      type: String,
      default: ''
    },
    approving: {
      type: Boolean,
      default: false
    },
    collection: {
      type: String,
      default: 'pi_prods'
    },
    prodSetting: {
      type: Object,
      default () {
        return {}
      }
    },
    extendArr: {
      type: Array,
      default () {
        return []
      }
    },
    natureid: {
      type: String,
      default: ''
    },
    labelWidth: {
      type: String,
      default: '80px'
    },
    isEdit: Boolean,
  },
  data () {
    const i18n = this.$t.bind(this)
    return {
      prodSetting2: {},
      i18n
    }
  },
  methods: {
    onSaveInner (v) {
      let {decl_name, decl_name_en} = this.viewModel
      // 给报关中英文名赋初值
      if (v.prod_name && !decl_name) {
        v.decl_name = v.prod_name
        Object.assign(this.viewModel, v)
      }
      if (v.prod_name_en && !decl_name_en) {
        v.decl_name_en = v.prod_name_en
        Object.assign(this.viewModel, v)
      }

      this.$emit('on-save', v)
    },
    onSavePuOrder (v) {
      // let v = {pu_order_id: row.pu_order_id}
      // v[field] = row[field]
      v.pu_order_id = this.viewModel.pu_order_id
      return this.$pull.updatePuOrder(v)
    },
    onTranslate (f1, f2, v, cb) {
      if (this.readonly || this.approving) return
      v = v || this.viewModel
      if (this.isCn) {
        let a = f1
        f1 = f2
        f2 = a
      }
      // if (!v[f1]) return
      let newValue = {
        query: v[f1],
        rst: ''
      }
      this.$dialog.Translator({newValue}, data => {
        v[f1] = data.query
        v[f2] = data.rst
        cb && cb(v)
        this.onSaveInner({[f1]: v[f1], [f2]: v[f2]})
      })
    },
    onCalcPrice (type) {
      if (this.readonly || this.approving) return
      let row = this.viewModel
      if (!row.pu_price || row.pu_price === '0') {
        this.$message('成本价不存在或不能为0')
        return
      }
      let v = this.viewModel.mg_pkgs || []
      if (!v.every(m => !!m.cbm)) {
        this.$message('包装体积CBM不存在')
        return
      }
      if (!v.every(m => !!m.outer_pkg_pcs)) {
        this.$message('Outer不存在或为0')
        return
      }
      let func = this.$dialog.ProdPricing
      if (type === 'bill') func = this.$dialog.QuProdPricing
      func({prod: row}, data => {
        Object.assign(this.viewModel, data)
        this.onSaveInner()
      })
    },
    async queryProdSetting () {
      this.prodSetting2 = await this.$cache.getProdSetting2()
      return this.prodSetting2
    },
  },
  created () {
    this.$t = (str, val) => {
      return this.i18n(str, this.isCn ? 'cn' : 'en', val)
    }
  }
}
