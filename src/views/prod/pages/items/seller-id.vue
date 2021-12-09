<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.seller_id" colon>供应商:</t>
    <div class="flex">
      <select-cust-com field="seller_id" :result="viewModel" @save="onSaveInner" :disabled="readonly" class="flex-1" :pm="{custType: '4'}"></select-cust-com>
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
