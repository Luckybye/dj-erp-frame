<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.prod_source" colon>备货方式:</t>
    <div class="flex">
      <select-stock-type field="prod_source" :result="viewModel" :disabled="readonly || viewModel.is_bom === 'yes' || disabledMap.prod_source" class="flex-1" @save="onSaveInner"></select-stock-type>
    </div>
  </el-form-item>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  computed: {
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
