<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.etd_date" colon>出运日期:</t>
    <div class="flex">
      <select-date field="etd_date" :result="viewModel" @save="onSaveInner" :disabled="readonly" class="flex-1"></select-date>
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
