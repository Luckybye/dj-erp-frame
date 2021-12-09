<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>主要产品:</t>
    <x-input :result="vm" field="mg_main_prods" width="100%" type="textarea" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></x-input>
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
