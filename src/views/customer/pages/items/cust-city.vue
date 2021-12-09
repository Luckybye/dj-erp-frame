<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>所在城市:</t>
    <select-city :result="vm" field="mg_city" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></select-city>
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
