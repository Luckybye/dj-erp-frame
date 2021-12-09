<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>返利率:</t>
    <x-input :result="vm" field="profit_rate" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap" unit="%" type="number"></x-input>
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
