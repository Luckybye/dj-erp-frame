<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>收款方式:</t>
    <select-remittance :result="vm" field="payment_id" width="100%" @change="selectPayment" :disabled="disabled" :disabledMap="disabledMap" :map="{ value: 'id', label: 'desc', key: 'id' }"></select-remittance>
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
    selectPayment (m) {
      this.vm.mg_payment = m
      let {mg_payment, payment_id} = this.vm
      this.onSave({mg_payment, payment_id})
    },
  },
  created () {
  },
  beforeDestroy() {}
}
</script>
