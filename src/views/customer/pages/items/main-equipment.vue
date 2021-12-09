<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>主要设备和仪器:</t>
    <x-input :result="vm" field="mg_main_equipment" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></x-input>
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
