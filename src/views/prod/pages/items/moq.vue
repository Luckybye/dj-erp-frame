<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.moq" colon>起订量:</t>
    <div class="flex">
      <x-input field="moq" :result="viewModel" @save="onSaveInner" :disabled="readonly" class="flex-1" type="number" rule="integer"></x-input>
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
