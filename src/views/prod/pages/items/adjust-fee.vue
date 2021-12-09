<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.adjust_fee" colon>调整费:</t>
    <div class="flex">
      <span class="lh-30 mr10">{{payload.currency || 'USD'}}</span>
      <x-input field="adjust_fee" type="number" :result="viewModel" @save="onSaveInner" :disabled="readonly" class="flex-1"></x-input>
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
