<template>
  <el-dialog
    :visible="true"
    width="auto"
    @close="onClose"
    :close-on-click-modal="false"
  >
    <div class="" slot="title"><t path="contract_no" colon>订单号</t></div>
    <div class="d-content">
      <x-input
        field="contract_no"
        labelWidth="80px"
        :result="vm">
        <t slot="label" path="contract_no" colon>订单号:</t>
      </x-input>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="onConfirm">{{
        $t("confirm")
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  computed: {},
  methods: {
    onConfirm() {
      this.onCallback(this.vm).then(() => {
        this.onClose();
      });
    },
  },
  created() {
  },
};
</script>
<style lang="scss">
</style>
