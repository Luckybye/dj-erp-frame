<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>日利率:</t>
    <x-input :result="vm" field="interest_rate" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap" unit="‱" type="number"></x-input>
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
