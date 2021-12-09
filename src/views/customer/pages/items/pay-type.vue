<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>第三方产品质量认证:</t>
    <x-select :result="vm" field="mg_quality" width="100%" :source="source" :map="{label: 'text', value: 'text'}" @save="onSave" :disabled="disabled" :disabledMap="disabledMap" multiple></x-select>
  </el-form-item>
</template>
<script>
export default {
  data() {
    return {
      source: [
        {text: 'CE认证'},
        {text: 'LFGB认证'},
        {text: 'roHS'},
        {text: 'DGCCRF'},
        {text: 'FDA'},
        {text: 'GRAS'},
        {text: 'UL'},
        {text: 'GS'},
        {text: 'TUV'},
        {text: '日本'},
        {text: '澳洲'}
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
