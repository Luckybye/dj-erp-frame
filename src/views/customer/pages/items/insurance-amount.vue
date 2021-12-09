<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>中信保额度:</t>
    <x-input :result="vm.mg_assess" field="insurance_amount" width="100%" @save="onSave('mg_assess')" :disabled="disabled" :disabledMap="disabledMap" type="number" unit="元"></x-input>
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
