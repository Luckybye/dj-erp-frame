<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>币种:</t>
    <select-currency :result="vm" field="currency" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></select-currency>
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
