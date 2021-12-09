<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.supplier" colon>工厂:</t>
    <div class="flex">
      <select-cust-com
        :result="viewModel"
        field="supplier_id"
        :pm="{ custType: '4' }"
        @save="onSaveInner" :disabled="readonly" class="flex-1"
        placeholder=" "
        :showValue="viewModel.x_supplier_id"
      ></select-cust-com>
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
