<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>目的港:</t>
    <select-port :result="vm" field="mg_port" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></select-port>
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
