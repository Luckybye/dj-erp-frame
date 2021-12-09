<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>年销售额:</t>
    <x-select :result="vm.mg_assess" field="mg_sales" width="100%" :source="source" :map="{label: 'text', value: 'text'}" @save="onSave2" :disabled="disabled" :disabledMap="disabledMap"></x-select>
  </el-form-item>
</template>
<script>
export default {
  data() {
    return {
      source: [
        {text: '0-1000万'},
        {text: '1000-5000万'},
        {text: '5000-40000万'},
        {text: '40000万以上'}
      ]
    }
  },
  computed: {
  },
  methods: {
    onSave2 () {
      this.onSave({mg_assess: this.vm.mg_assess}, this.vm)
    }
  },
  created () {
  },
  beforeDestroy() {}
}
</script>
