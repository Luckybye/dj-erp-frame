<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.quantity" colon>数量:</t>
    <div class="flex">
      <x-input field="quantity" :result="viewModel" @save="onSaveInner" :disabled="readonly || approving" class="flex-1 mr10" type="number" rule="integer"></x-input>
      <span class="lh-30">{{viewModel.prod_unit || 'PCS'}}</span>
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
