<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>本公司所占产能比例:</t>
    <x-input :result="vm" field="mg_capacity_proportion" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap" type="number" v-input="{rule: 'integer'}" unit="%"></x-input>
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
