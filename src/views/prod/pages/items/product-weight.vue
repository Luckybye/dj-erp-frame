<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.net_weight" colon>产品重量:</t>
    <div class="flex">
      <x-input field="net_weight" :result="viewModel" @save="onSaveInner" :disabled="readonly" class="flex-1 mr10" type="number"></x-input>
      <x-select field="net_weight_unit" :result="viewModel" @save="onSaveInner" :disabled="readonly" class="flex-1" :source="weightUnits"></x-select>
    </div>
  </el-form-item>
</template>
<script>
export default {
  data () {
    return {
      weightUnits: ['g', 'KGS', 'T']
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
