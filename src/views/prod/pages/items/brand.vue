<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.brand_id" colon>品牌:</t>
    <div class="flex">
      <select-brand field="brand_id" :result="viewModel" @save="onSaveInner" :disabled="readonly" class="flex-1" placeholder=" " :isCn="isCn"></select-brand>
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
