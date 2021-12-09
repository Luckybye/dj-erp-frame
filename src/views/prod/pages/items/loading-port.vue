<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.load_port" colon>起运港:</t>
    <div class="flex">
      <select-port field="load_port" :result="viewModel" @save="onSaveInner" :disabled="readonly" class="flex-1" :isCn="isCn"></select-port>
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
