<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>月产能:</t>
    <x-input :result="vm" field="mg_year_capacity" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap" type="number" v-input="{rule: 'integer'}" unit="万元"></x-input>
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
