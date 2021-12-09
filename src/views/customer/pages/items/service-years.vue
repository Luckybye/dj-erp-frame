<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>实际控股人从业年限:</t>
    <x-input :result="vm" field="mg_service_years" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap" type="number" v-input="{rule: 'integer'}"></x-input>
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
