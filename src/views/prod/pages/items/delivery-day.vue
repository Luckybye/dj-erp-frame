<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.delivery_day" colon>交货期限:</t>
    <div class="flex">
      <x-input field="delivery_day" :result="viewModel" @save="onSaveInner" :disabled="readonly" class="flex-1" type="number" rule="integer" unit="Days">
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
