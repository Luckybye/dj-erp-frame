<template lang="html">
  <el-form-item :label="isCn ? '其他尺寸:' : 'Other Size:'">
    <x-input rules="" width="100%" field="other_size" :result="viewModel" @save="onSaveInner" :disabled="readonly"></x-input>
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
    // this.initialize()
  },
  mixins: []
}
</script>
<style>
</style>
