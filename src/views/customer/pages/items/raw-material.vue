<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>关键原材料:</t>
    <x-input :result="vm" field="mg_raw_material" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></x-input>
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
