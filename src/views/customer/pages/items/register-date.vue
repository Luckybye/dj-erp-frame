<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>注册日期:</t>
    <select-date :result="vm" field="mg_register_date" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></select-date>
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
