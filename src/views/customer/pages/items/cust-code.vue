<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>代码:</t>
    <x-input :result="vm" field="cust_code" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></x-input>
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
