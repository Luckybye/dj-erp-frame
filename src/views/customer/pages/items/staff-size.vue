<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>员工规模:</t>
    <x-select :result="vm" field="mg_staff_size" width="100%" :source="source" :map="{label: 'text', value: 'text'}" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></x-select>
  </el-form-item>
</template>
<script>
export default {
  data() {
    return {
      source: [
        {text: '0-20人'},
        {text: '20-300人'},
        {text: '300-1000人'},
        {text: '1000人以上'}
      ]
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
