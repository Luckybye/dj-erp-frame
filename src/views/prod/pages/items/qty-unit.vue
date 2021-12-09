<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.prod_unit" colon>数量单位:</t>

    <select-prod-unit field="prod_unit" :result="viewModel" @save="onSaveInner" :disabled="readonly" :isCn="isCn" width="100%"></select-prod-unit>
  </el-form-item>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    calcCartonNw () {
    }
  },
  computed: {
  },
  created () {
  },
  mixins: []
}
</script>
<style>
</style>
