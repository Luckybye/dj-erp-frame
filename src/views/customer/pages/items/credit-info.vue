<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>国家企业信息公示:</t>
    <x-select :result="vm" field="mg_credit_info" width="100%" @save="onSave" :disabled="disabled" :source="creditReport" :map="{label: 'text', value: 'text'}" :disabledMap="disabledMap"></x-select>
  </el-form-item>
</template>
<script>
export default {
  props: {
  },
  data() {
    return {
      creditReport: [
        {text: '正常'},
        {text: '有不良记录'}
      ],
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
