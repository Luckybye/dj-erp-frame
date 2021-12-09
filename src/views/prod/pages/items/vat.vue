<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.vat" colon>增值税:</t>
    <div class="flex">
      <x-input field="vat" :result="viewModel" @save="onSaveInner" :disabled="readonly" class="flex-1" type="number"></x-input>
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
