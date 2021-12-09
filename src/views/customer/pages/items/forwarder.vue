<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>指定货代:</t>
    <select-cust :result="vm.mg_forwarder" field="cust_com_id" field2="cust_id" width="100%" @save="onSave('mg_forwarder')" :disabled="disabled" :pm="{custType: '32'}" clearable placeholder=" "></select-cust>
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
