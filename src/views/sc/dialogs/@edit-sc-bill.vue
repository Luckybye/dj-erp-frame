<template>
  <el-dialog
    :visible="true"
    width="500px"
    @close="onClose"
    title="修改订单"
    :close-on-click-modal="false"
  >
    <el-form label-position="left" label-width="120px">
      <el-form-item label="Transporation:">
        <select-transport
          :result="vm"
          field="tran_type"
          width="100%"
          @save="onChange"
        ></select-transport>
      </el-form-item>

      <el-form-item label="Loading Port:">
        <select-port :result="vm" field="load_port" width="100%" @save="onChange"></select-port>
      </el-form-item>

      <el-form-item label="Destination Port:">
        <select-port :result="vm" field="unload_port" width="100%" @save="onChange"></select-port>
      </el-form-item>

      <el-form-item label="Shipping Date:">
        <select-date
          :result="vm"
          field="shipment_date"
          width="100%"
          @save="onChange"
        ></select-date>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="onConfirm">{{
        $t("confirm")
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
let fmt = {
  tran_type: "",
  shipment_date: "",
  unload_port: "",
  load_port: ""
};
function initialize() {
}
export default {
  data() {
    return {
      vm: {...fmt}
    };
  },
  methods: {
    onConfirm() {
      this.onCallback(this.changeModel).then(v => {
        this.onClose();
      });
    },
    onChange (v) {
      this.changeModel = {...this.changeModel, ...v}
    }
  },
  created() {
    initialize.call(this);
  }
};
</script>
