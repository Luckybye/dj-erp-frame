<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>中信保买方名称:</t>
    <x-input :result="vm" field="mg_edi_buyer_name" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></x-input>
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
