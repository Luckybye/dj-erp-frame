<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>正唛:</t>
    <x-input :result="vm.mg_main_mark" field="text" width="100%" @save="onSave('mg_main_mark')" :disabled="disabled" :disabledMap="disabledMap" type="textarea"></x-input>
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
