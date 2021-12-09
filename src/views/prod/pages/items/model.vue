<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.model" colon>规格型号:</t>
    <div class="flex">
      <x-input field="model" :result="viewModel" @save="onSaveInner" :disabled="readonly" class="flex-1"></x-input>
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
