<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>明佣:</t>
    <x-input :result="vm.mg_charge" field="discount_rate" width="100%" @save="onSave('mg_charge')" :disabled="disabled" :disabledMap="disabledMap" type="number" unit="%"></x-input>
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
