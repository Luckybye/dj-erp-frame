<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>注册资本:</t>
    <x-input :result="vm" field="mg_registered_capital" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap" type="number" unit="万元"></x-input>
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
