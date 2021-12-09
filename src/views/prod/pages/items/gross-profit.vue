<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.gross_rate" colon>毛利率:</t>
    <div class="flex">
      <x-input field="gross_rate" :result="viewModel" @save="onSaveInner" :disabled="readonly" class="flex-1" v-input="{rule: 'number,min=0,max=99'}">
        <span slot="append">%</span>
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
