<template lang="html">
  <el-form-item :label="isCn ? '产品工艺:' : 'Processing:'">
    <x-select width="100%" field="process" :result="viewModel" :source="processTypes" @save="onSaveInner" :disabled="readonly" clearable></x-select>
  </el-form-item>
</template>
<script>
export default {
  data () {
    return {
      processTypes: ['插棱', '撒气泡', '缠丝', '珍珠点', '套瓷', '云彩粉', '色点', '撒粉', '印边', '色边', '底部气泡', '烤白', '插丝', '贴片', '印章', '规律气泡', '冰花']
    }
  },
  methods: {
  },
  created () {
    // this.initialize()
  },
  mixins: []
}
</script>
<style>
</style>
