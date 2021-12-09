<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>出口国家:</t>
    <select-country :result="vm" field="mg_export_country" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap" multiple></select-country>
  </el-form-item>
</template>
<script>
export default {
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
