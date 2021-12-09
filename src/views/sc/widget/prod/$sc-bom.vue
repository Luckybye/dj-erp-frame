<template lang="html">
  <div class="pm-bom">
    <div class="mb15 text-right">
      <span class="text-bold mr20">
        主件数量
        {{viewModel.sell_quantity}}
      </span>
      <!-- <ideal-icon-btn
        skin="blue"
        icon="refresh"
        @click="refresh()"
      ></ideal-icon-btn> -->
      <x-input
        width="150px"
        field="pu_price"
        :result="viewModel"
        @save="updatePiProd"
        :disabled="readonly"
        label="预估成本:"
        label-width="70px"
      ></x-input>
      <select-currency
        class="ml10"
        width="170px"
        field="pu_currency"
        :result="viewModel"
        @save="updatePiProd"
        :disabled="readonly"
        label="成本币种:"
        label-width="70px"
      ></select-currency>
      <el-button
        type="primary"
        @click="selectBom()"
        icon="el-icon-plus"
        class="ml10"
      >
      </el-button>
    </div>

    <prod-suites
      :view-model="viewModel"
      :payload="payload"
      @open-prod="viewProd"
      bill-type="qu"
      @on-edit="editBom"
      @on-refresh="initialize"
    ></prod-suites>
  </div>
</template>
<script>
import ProdSuites from '@/views/prod/common/prod-suites.vue'
import Vue from 'vue'
let fmt = {
  x_suites: [],
  pu_price: '',
  pu_currency: 'CNY',
}
function initialize() {
  let v = this.payload
  let ps = [
    this.$get('/api/business/queryPiboms', {
      contract_id: v.contract_id,
      main_pi_prod_id: v.bill_prod_id,
    }),
    this.$pull.queryPiProd({ bill_prod_id: v.bill_prod_id }),
    // this.$configure.getValue('constant_currency', this.$state('me').com_id)
  ]
  return this.$Promise.when(ps).then((bom, main, curr) => {
    this.viewModel = {
      ...this.viewModel,
      ...main.pi_prod,
      x_suites: (bom.prod_boms || [])._fmt({seller_id: ''}),
    }
    // this.currencyTypes = curr.constant_currency || []
    // this.modelReset(this.viewModel);
  })
}

export default {
  options: { title: 'Bom' },
  data() {
    return {
      viewModel: this.$h.clone2(fmt),
      readonly: false,
    }
  },
  methods: {
    initialize,
    updatePiProd(v) {
      let para = { ...v, bill_prod_id: this.viewModel.bill_prod_id }
      return this.$pull.updatePiProd(para)
    },
    refresh() {
      this.initialize().then(() => {
        this.editBom()
      })
    },
    selectBom() {
      if (!this.payload.prod_id) return
      this.$dialog.SelectPmProd(
        { searchVm: { is_bom: 'no' }, selected: this.viewModel.x_suites },
        prods => {
          prods = prods.map(m => {
            return { prod_id: m.prod_id }
          })
          this.saveBom(prods).then(async d => {
            if (this.viewProd.is_bom !== 'yes') {
              await this.updatePiProd({is_bom: 'yes'})
              this.viewProd.is_bom = 'yes'
              this.$tab.emit('refresh-prod')
            }
          })
        }
      )
    },
    saveBom(boms) {
      let para = {
        contract_id: this.payload.contract_id,
        main_pi_prod_id: this.payload.bill_prod_id,
        sub_prods: boms,
      }
      return this.$post('/api/business/addPiBomProds', para).then(() => {
        this.refresh()
      })
    },
    editBom() {
      let v = this.viewModel
      let price = v.x_suites.reduce((pre, val) => {
        pre += val.sub_rate * (1 + val.loss_rate / 100) * val.pu_price || 0
        return pre
      }, 0)
      price = (price || 0).toFixed(2)
      console.log(price, 'pu_price')
      Vue.set(v, 'pu_price', price)
      this.updatePiProd({ pu_price: price })
    },
    viewProd(v) {
      this.$tab.open({
        title: v.prod_name,
        title_en: v.prod_name_en,
        tab_id: v.bill_prod_id,
        path: 'ScProdEdit',
        query: { ...v },
      })
    },
    onActive() {
      // this.pageEventer.emit("open-suite-part", true);
      // initialize.call(this);
    },
    createProd(item) {
      Object.assign(this.payload, item)
    },
  },
  components: {
    ProdSuites,
  },
  created() {
    initialize.call(this)
    // this.pageEventer.on("create-prod", this.createProd);
  },
  beforeDestroy() {
    // this.pageEventer.remove("create-prod", this.createProd);
  },
}
</script>
