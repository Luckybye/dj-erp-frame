<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>厂房面积:</t>
    <x-select :result="vm" field="mg_place_area" width="100%" :source="source" :map="{label: 'text', value: 'text'}" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></x-select>
  </el-form-item>
</template>
<script>
export default {
  data() {
    return {
      source: [
        {text: '0-500m²'},
        {text: '500m²-1000m²'},
        {text: '1000m²-5000m²'},
        {text: '5000m²-10000m²'},
        {text: 'More than 10000m²'},
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
