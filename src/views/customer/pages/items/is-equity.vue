<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>内部客商:</t>
    <check-yes-no :result="vm" field="is_equity" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></check-yes-no>
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
