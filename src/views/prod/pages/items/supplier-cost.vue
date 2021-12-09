<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.sup_info" colon>工厂信息:</t>
    <el-dropdown placement="bottom" @command="onSelectQueryPrice">
      <div class="lh-30 a-link flex" @click="getQueryPrice">
        <div v-if="viewModel.x_supplier_id"
        class="text-overflow ver-t">
          {{viewModel.x_supplier_id}}
        </div>
        <div>
          ，
          <!-- {{viewModel.at_stock==='no' ? isCn?'出厂价':'EXW' : isCn?'入仓价':'FOB'}} -->
          {{viewModel.pu_currency | currencyFormat}} {{viewModel.pu_price || 0}}
        </div>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item :command="item" v-for="(item, i) in queryPrice" :key="i">{{item.x_text}}</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
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
          m.x_text = `${m.supplier_name || '-'}，${m.pu_currency || '-'}${m.pu_price || '-'}，moq${m.pu_quantity || '-'}，Lead time ${m.delivery_day} Days`
          return m
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
    }
  },
  created () {
    // this.initialize()
  },
  mixins: []
}
</script>
<style lang="scss">
.prod-supplier-info {
    transform-origin: left center 0px;
    background: #fff;
    border-radius: 2px;
    border: 1px solid #d1dbe5;
    font-size: 12px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
    position: relative;
    min-width: 200px;
    padding: 5px 0;
    .s-item {
      cursor: pointer;
      white-space: nowrap;
      padding: 10px;
      &:hover {
        background: #d8dbf0
      }
    }
  }
</style>
