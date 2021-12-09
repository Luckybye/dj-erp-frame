<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>我方银行:</t>
    <select-bank :result="vm" field="receive_bank_id" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></select-bank>
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
