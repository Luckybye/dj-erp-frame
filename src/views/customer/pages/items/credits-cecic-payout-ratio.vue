<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>中信保赔付比例:</t>
    <x-input :result="vm" field="mg_credits_cecic_payout_ratio" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap" type="number" unit="%"></x-input>
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
