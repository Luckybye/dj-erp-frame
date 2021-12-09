<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.cust_prod_barcode" colon>客户条码:</t>
    <div class="flex">
      <x-input field="cust_prod_barcode" :result="viewModel" @save="onSaveInner" :disabled="readonly" class="flex-1"></x-input>
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
  },
  created () {
  },
  mixins: []
}
</script>
<style>
</style>
