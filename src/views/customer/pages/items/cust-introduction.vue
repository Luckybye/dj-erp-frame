<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>公司简介:</t>
    <x-input :result="vm" field="mg_introduction" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap" type="textarea"></x-input>
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
