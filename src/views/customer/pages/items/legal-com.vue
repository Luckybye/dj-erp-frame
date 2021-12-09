<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>法人公司:</t>
    <select-our-com :result="vm" field="legal_id" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap" placeholder="Select..."></select-our-com>
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
