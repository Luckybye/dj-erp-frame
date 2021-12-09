<template>
  <el-dialog
    :visible="true"
    width="50%"
    @close="onClose"
    :close-on-click-modal="false"
  >
    <div class="" slot="title"><t path="sc.update_prod_etd">更新出运日期</t></div>
    <div class="d-content">
      <select-date :result="vm" field="etd_date" labelWidth="120px" :showLabel="true" width="100%">
        <t slot="label" path="sc.new_etd_date" colon>最新出运日期:</t>
      </select-date>
      <x-input
        class="mt15"
        type="textarea"
        :result="vm"
        field="reason"
        labelWidth="120px"
        width="100%"
        ><t slot="label" path="reason" colon>原因说明:</t></x-input>
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
      vm: {
        reason: "",
        etd_date: null
      },
    };
  },
  computed: {},
  methods: {
    onConfirm() {
      // let v = this.vm;
      // if (!v.reason) {
      //   this.$message(this.$t('pls_input_reason'));
      //   return;
      // }
      this.onCallback(this.vm).then(() => {
        this.onClose();
      });
    }
  },
  created() {
  },
};
</script>
<style lang="scss">
</style>
