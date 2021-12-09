<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>质量认证:</t>
    <x-select :result="vm" field="mg_pay_type" width="100%" :source="source" :map="{label: 'text', value: 'text'}" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></x-select>
  </el-form-item>
</template>
<script>
export default {
  data() {
    return {
      source: [
        {text: '电汇'},
        {text: '承兑'},
        {text: '现金'}
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
