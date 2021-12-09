<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.estimate_price" colon>预估成本:</t>
    <div class="flex">
      <select-currency :result="viewModel" field="estimate_price_currency" width="80px" @save="onSaveInner" :disabled="readonly"></select-currency>
      <x-input field="estimate_price" :result="viewModel" @save="onSaveInner" :disabled="readonly" class="flex-1 ml10" type="number"></x-input>
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
