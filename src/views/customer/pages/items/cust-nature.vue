<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>客户类型:</t>
    <select-cust-type :result="vm" field="cust_nature" width="100%" @change="onSelect" :disabled="disabled" :disabledMap="disabledMap"></select-cust-type>
  </el-form-item>
</template>
<script>
export default {
  props: {
  },
  data() {
    return {
      source: []
    }
  },
  computed: {
  },
  methods: {
    onSelect (item) {
      this.vm.cust_profit = item.value
      let {cust_nature, cust_profit} = this.vm
      this.onSave({cust_nature, cust_profit})
    }
  },
  created () {
  },
  beforeDestroy() {}
}
</script>
