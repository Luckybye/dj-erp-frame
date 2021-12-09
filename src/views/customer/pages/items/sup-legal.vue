<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>法人代表:</t>
    <x-input :result="vm" field="mg_legal" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></x-input>
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
