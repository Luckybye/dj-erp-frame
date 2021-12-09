<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.prod_no" colon>货号:</t>
    <div class="flex">
      <x-input field="prod_no" :result="viewModel" @save="onSaveInner" :disabled="prodSetting.prod_no_create_type!=='input' || readonly" class="flex-1"></x-input>
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
