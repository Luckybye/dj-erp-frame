<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>中信保买家代码:</t>
    <x-input :result="vm" field="edi_buyer_no" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></x-input>
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
