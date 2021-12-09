<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.original_prod_no" colon>原货号:</t>
    <div class="flex">
      <x-input field="original_prod_no" :result="viewModel" @save="onSaveInner" :disabled="readonly" class="flex-1"></x-input>
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
