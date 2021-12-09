<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>付款方式:</t>
    <select-payment :result="vm" field="payment_id" width="100%" @change="selectPayment" :disabled="disabled" :disabledMap="disabledMap" :map="{ value: 'id', label: 'desc', key: 'id' }"></select-payment>
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
