<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.pu_price" colon>采购单价:</t>
    <div class="flex">
      <span class="lh-30">{{payload.pu_currency}}</span>
      <x-input field="pu_price" :result="viewModel" @save="onSaveInner" :disabled="readonly || approving" class="flex-1 mr10" type="number"></x-input>
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
