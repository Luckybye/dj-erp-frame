<template lang="html">
  <el-form-item :label="isCn ? '后加工工艺:' : 'Post-Processing:'">
    <x-select width="100%" field="post_proc" :result="viewModel" :source="postProcessTypes" @save="onSaveInner" :disabled="readonly" clearable></x-select>
  </el-form-item>
</template>
<script>
export default {
  data () {
    return {
      postProcessTypes: ['喷色+刻花', '喷色', '电镀', '刻花', '花纸', '手绘', '描金', '电光水', '酸洗', '喷沙', '离子镀', '贴金箔', '立线', '激光刻', '丝网印']
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
