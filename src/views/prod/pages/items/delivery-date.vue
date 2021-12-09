<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.delivery_date" colon>交货日期:</t>
    <div class="flex">
      <select-date field="delivery_date" :result="viewModel" @save="onSave2" :disabled="readonly" class="flex-1"></select-date>
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
    onSave2 (v) {
      if (this.billType === 'pu') {
        this.onSavePuOrder(v)
      } else {
        this.onSaveInner(v)
      }
    }
  },
  created () {
  },
  mixins: []
}
</script>
<style>
</style>
