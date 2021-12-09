<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.supplier_no" colon>工厂货号:</t>
    <div class="flex">
      <x-input field="supplier_no" :result="viewModel" @save="onSaveInner" :disabled="readonly" class="flex-1"></x-input>
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
