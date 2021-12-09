<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.pu_price" colon>采购单价:</t>
    <div class="flex">
      <!-- <span class="lh-30">{{payload.pu_currency}}</span> -->
      <!-- <span class="flex-1 lh-30">{{viewModel.pu_price}}</span> -->
      <x-input field="pu_price" :result="viewModel" @save="updatePuOrder" :disabled="readonly" class="flex-1" width="80%">
        <div slot="prepend">{{payload.pu_currency}}</div>
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
