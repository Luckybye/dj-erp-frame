<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.pu_quantity" colon>采购单价:</t>
    <div class="flex">
      <!-- <span class="lh-30">{{viewModel.quantity || 0}}</span> -->
      <!-- <span class="lh-30 flex-1">{{viewModel.prod_unit}}</span> -->
      <x-input field="quantity" :result="viewModel" @save="updatePuOrder" :disabled="readonly" class="flex-1">
        <div slot="append">{{viewModel.prod_unit}}</div>
      </x-input>
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
    updatePuOrder(v, {pu_order_id}) {
      this.$pull.updatePuOrder({...v, pu_order_id})
    }
  },
  created () {
  },
  mixins: []
}
</script>
<style>
</style>
