<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.supplier" colon>工厂名:</t>
    <div class="lh-30 flex" @click="onEditPoPrice(viewModel)" :class="{'a-link cursor':!approving}">
      <div v-if="viewModel.is_bom!=='yes' && viewModel.x_seller_id"
      class="text-overflow ver-t">
        {{viewModel.x_seller_id}}
      </div>
      <div>
        ，
        <!-- {{viewModel.at_stock==='no' ? isCn?'出厂价':'EXW' : isCn?'入仓价':'FOB'}} -->
        {{payload.pu_currency | currencyFormat}} {{viewModel.pu_price || 0}}
      </div>
    </div>
  </el-form-item>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    onEditPoPrice (item) {
      if (this.approving) return
      this.$dialog.EditPoPrice({prod: item, currency: this.payload.pu_currency}, data => {
        Object.assign(this.viewModel, data)
        this.onSaveInner(data)
      })
    }
  },
  created () {
    // this.initialize()
  },
  mixins: []
}
</script>
<style>
</style>
