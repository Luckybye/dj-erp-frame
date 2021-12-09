<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>贸易方式:</t>
    <select-terms :result="vm" field="trade_term" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></select-terms>
  </el-form-item>
</template>
<script>
export default {
  props: {
  },
  data() {
    return {
    }
  },
  computed: {
  },
  methods: {
  },
  created () {
  },
  beforeDestroy() {}
}
</script>
