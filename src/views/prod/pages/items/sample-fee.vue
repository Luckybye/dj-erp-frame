<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.sample_fee" colon>样品费:</t>
    <div class="flex">
      <x-input field="sample_fee" :result="viewModel" @save="onSaveInner" :disabled="readonly" class="flex-1 ml10" type="number" rules="min=0">
        <div slot="prepend">{{viewModel.currency | currencyFormat}}</div>
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
  },
  created () {
  },
  mixins: []
}
</script>
<style>
</style>
