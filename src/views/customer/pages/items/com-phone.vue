<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>公司电话:</t>
    <x-input :result="vm" field="com_phone" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap" type="number"></x-input>
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
