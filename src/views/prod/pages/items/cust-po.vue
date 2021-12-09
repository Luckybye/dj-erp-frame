<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.cust_po_no" colon>客户PO:</t>
    <div class="flex">
      <x-input field="cust_po_no" :result="viewModel" @save="onSaveInner" :disabled="readonly" class="flex-1"></x-input>
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
