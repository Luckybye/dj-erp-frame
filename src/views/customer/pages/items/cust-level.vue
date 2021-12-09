<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>客户等级:</t>
    <div class="flex-b">
      <select-cust-level :result="vm" field="cust_level" width="calc(100% - 40px)" @save="onSave" :disabled="disabled" :disabledMap="disabledMap" @get-data="getDatas"></select-cust-level>
      <span>{{(sourceMap[vm.cust_level] || {}).pricing_factor || '-'}}</span>
    </div>
  </el-form-item>
</template>
<script>
export default {
  data() {
    return {
      sourceMap: {}
    }
  },
  computed: {
  },
  methods: {
    async getDatas (v) {
      this.sourceMap = v._object('level_id')
    },
  },
  created () {
  },
  beforeDestroy() {}
}
</script>
