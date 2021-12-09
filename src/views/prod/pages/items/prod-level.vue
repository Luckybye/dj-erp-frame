<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.prod_level" colon>产品等级:</t>
    <div class="flex">
      <select-prod-level field="prod_level" :result="viewModel" @save="onSaveInner" :disabled="readonly" class="flex-1" :isCn="isCn"></select-prod-level>
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
