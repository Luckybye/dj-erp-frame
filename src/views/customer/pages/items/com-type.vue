<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>企业类型:</t>
    <x-select :result="vm" field="mg_com_type" width="100%" @save="onSave" :disabled="disabled" :source="comType" :map="{label: 'text', value: 'text'}" :disabledMap="disabledMap"></x-select>
  </el-form-item>
</template>
<script>
export default {
  props: {
  },
  data() {
    return {
      comType: [
        {text: '有限责任公司'},
        {text: '个体工商户'},
        {text: '个人独立企业'},
        {text: '合伙企业'},
        {text: '股份有限公司'},
        {text: '外资企业'},
        {text: '离岸公司'},
        {text: '其他类型'}
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
