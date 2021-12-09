<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.remark" colon>备注:</t>
    <div class="flex">
      <x-input field="remark" :result="viewModel" @save="onSaveInner" :disabled="readonly" class="flex-1" type="textarea">
      </x-input>
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
