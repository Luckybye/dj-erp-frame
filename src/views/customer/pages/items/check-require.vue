<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>验货要求:</t>
    <x-select :result="vm" field="mg_inspection_request" width="100%" :source="source" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></x-select>
  </el-form-item>
</template>
<script>
export default {
  data() {
    return {
      source: ['Pre-Production Inspection', 'Online Inspection', 'Final Inspection']
    }
  },
  computed: {
  },
  methods: {
    onSave2 () {
      // this.onSave({mg_assess: this.vm.mg_assess}, this.vm)
    }
  },
  created () {
  },
  beforeDestroy() {}
}
</script>
