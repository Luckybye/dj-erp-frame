<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.prod_size" colon>产品尺寸:</t>
    <div class="flex">
      <span class="text-blue width-15 text-right lh-30 mr5">L:</span>
      <x-input width="calc(33% - 20px)" field="length" type="number" :result="viewModel.mg_prod_size" @blur-change="onSave"
        :disabled="readonly" class="flex-1"></x-input>
      <span class="text-blue width-15 text-right lh-30 mr5 ml10">W:</span>
      <x-input width="calc(33% - 20px)" field="width" type="number" :result="viewModel.mg_prod_size" @blur-change="onSave"
        :disabled="readonly" class="flex-1"></x-input>
      <span class="text-blue width-15 text-right lh-30 mr5 ml10">H:</span>
      <x-input width="calc(34% - 20px)" field="height" type="number" :result="viewModel.mg_prod_size" @blur-change="onSave"
        :disabled="readonly" class="flex-1"></x-input>
      <span class="prod-unit">cm</span>
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
    onSave () {
      this.onSaveInner({mg_prod_size: this.viewModel.mg_prod_size})
    }
  },
  created () {
  },
  mixins: []
}
</script>
<style>
</style>
