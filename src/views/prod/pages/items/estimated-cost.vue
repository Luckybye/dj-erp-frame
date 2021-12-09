<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.estimate_price" colon>预估成本价:</t>
    <div class="flex">
      <span class="lh-30 text-blue inline-block">
        {{viewModel.at_stock==='no' ? isCn?'出厂价':'EXW' : isCn?'入仓价':'FOB'}}
        {{viewModel.pu_currency || 'CNY'}}</span>
      <div class="query-price-select flex-1" style="width:calc(100% - 161px)" @click="getQueryPrice">
        <x-input rules=""  width="100%" field="pu_price" :result="viewModel" @save="onSaveInner" :disabled="readonly" class="vt mr0" type="number"></x-input>
        <x-select width="100%" field="pu_price" :result.sync="viewModel" :source="queryPrice" :map="{label:'x_text',value:'pu_price'}"  @change="onSelectQueryPrice"></x-select>
      </div>
      <el-button @click="onQueryPrice">
        {{isCn ? '询价' : 'Inquiry'}}
      </el-button>
    </div>
  </el-form-item>
</template>
<script>
export default {
  data () {
    return {
      queryPrice: []
    }
  },
  methods: {
    getQueryPrice () {
      if (!this.billId) return
      let params = { prod_id: this.billId }
      return this.$pull.queryProdFactoryByProdId(params).then(data => {
        this.queryPrice = (data.prod_factorys || []).map(m => {
          m.x_text = `${m.pu_currency || '-'}${m.pu_price || '-'}-moq${m.pu_quantity || '-'}-${m.supplier_name || '-'}`
          return m
        })
      })
    },
    onQueryPrice () {
      let params = {
        supplier: { prod_id: this.billId },
        unit: this.viewModel.prod_unit
      }
      this.$dialog.EditSupplier(params, (data) => {
        data.is_default = 'yes'
        let other = this.queryPrice.find(m => m.is_default === 'yes')
        this.onSaveFactory(data).then(() => {
          if (other) {
            other.is_default = 'no'
            this.onSaveFactory(other)
          }
          this.onSelectQueryPrice(data)
          this.getQueryPrice()
        })
      })
    },
    onSelectQueryPrice (item) {
      if (!item) return
      let v = {}
      v.pu_price = item.pu_price
      v.pu_currency = item.pu_currency
      v.moq = item.pu_quantity || this.viewModel.moq
      v.supplier_id = item.supplier_id || ''
      v.supplier_no = item.supplier_no || ''
      v.delivery_day = item.delivery_day || ''
      v.at_stock = item.at_stock || 'yes'
      Object.assign(this.viewModel, v)
      this.onSaveInner(v)
    },
    onSaveFactory (data) {
      let url = data.factory_id ? '/api/product/upsertProdFactory' : '/api/product/addProdFactory'
      return this.$request2(url, data).then(data => {})
    }
  },
  created () {
    // this.initialize()
  },
  mixins: []
}
</script>
<style lang="scss">
.query-price-select {
  position: relative;
  // display: inline-block;
  vertical-align: top;
  .x-select {
    position: absolute;
    left: 0;
    opacity: 0;
    top: 0;
  }
}
</style>
