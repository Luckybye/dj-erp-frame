<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>中信保额度有效期:</t>
    <select-date width="100%" :result="vm" field="mg_credits_cecic_valid_date" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></select-date>
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
