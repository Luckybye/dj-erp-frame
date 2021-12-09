<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>信用等级:</t>
    <x-select :result="vm.mg_credit" field="mg_rating" width="100%" :source="source" :map="{label: 'text', value: 'text'}" @save="onSave2" :disabled="disabled" :disabledMap="disabledMap"></x-select>
  </el-form-item>
</template>
<script>
export default {
  data() {
    return {
      source: [
        {text: 'AAA'},
        {text: 'AA'},
        {text: 'A'},
        {text: 'BBB'},
        {text: 'BB'},
        {text: 'B'},
        {text: 'CCC'},
        {text: 'CC'},
        {text: 'C'},
        {text: 'NR'}
      ]
    }
  },
  computed: {
  },
  methods: {
    onSave2 () {
      this.onSave({mg_credit: this.vm.mg_credit}, this.vm)
    }
  },
  created () {
  },
  beforeDestroy() {}
}
</script>
