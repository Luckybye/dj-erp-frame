<template lang="html">
  <div class="com-info">
    <x-fold show sticky="40" class="full">
      <t slot="header" class="left-border-title" path="cust.basic_info" colon>基础信息:</t>
      <basic-info :vm="vm" @save="onSave" :disabled="disabled" :payload="payload"></basic-info>
    </x-fold>
    <x-fold show sticky="40" class="full">
      <t slot="header" class="left-border-title" path="cust.sup_terms" colon>合作条款:</t>
      <main-info :vm="vm" @save="onSave" :disabled="disabled" :payload="payload"></main-info>
    </x-fold>
    <x-fold show sticky="40" class="full">
      <t slot="header" class="left-border-title" path="cust.sup_bank" colon>银行信息:</t>
      <sup-bank :vm="vm" @save="onSave" :disabled="disabled" :payload="payload"></sup-bank>
    </x-fold>
  </div>
</template>
<script>
import Mixins from "../../pages/mixins";
export default {
  mixins: [Mixins],
  components: {
    BasicInfo: require('./basic-info').default,
    MainInfo: require('./main-info').default,
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
