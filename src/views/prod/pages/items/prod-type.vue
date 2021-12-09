<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.prod_type" colon>产品类型:</t>
    <div class="flex">
      <select-prod-type field="type" :result="viewModel" @save="onSaveInner" :disabled="readonly" class="flex-1" placeholder=" " :isCn="isCn"></select-prod-type>
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
