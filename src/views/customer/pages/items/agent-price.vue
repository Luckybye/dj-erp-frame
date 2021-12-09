<template lang="html">
  <el-form-item v-show="vm.is_agent !== 'no'">
    <t slot="label" :path="path" colon>销售价格:</t>
    <x-check :result="vm" field="agent_price" expect="pu_divide" @save="onSave" :disabled="disabled" :disabledMap="disabledMap">
      目标利润率扣减：采购价 ÷ （1- 目标利润率）
    </x-check>
    <x-check :result="vm" field="agent_price" expect="pu_multiply" @save="onSave" :disabled="disabled" :disabledMap="disabledMap" class="ml20">
      目标利润率加成：采购价 × （1+ 目标利润率）
    </x-check>
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
