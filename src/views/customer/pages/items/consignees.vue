<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>收货人:</t>
    <x-input-tabs :result="vm" field="mg_consignees" field2="text" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap">
      <span slot="header" slot-scope="{index}">{{index}}</span>
    </x-input-tabs>
  </el-form-item>
</template>
<script>
export default {
  props: {
  },
  data() {
    return {
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
