<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>出口地区:</t>
    <x-select :result="vm" field="mg_export_region" width="100%" :source="source" :map="{label: 'text', value: 'text'}" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></x-select>
  </el-form-item>
</template>
<script>
export default {
  data() {
    return {
      source: [
        {text: '北美洲'},
        {text: '南美洲'},
        {text: '欧洲'},
        {text: '大洋洲'},
        {text: '非洲'},
        {text: '亚洲'}
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
