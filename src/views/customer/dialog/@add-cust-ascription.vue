<template>
  <el-dialog
    :visible="true"
    width="50%"
    @close="onClose"
    :close-on-click-modal="false"
  >
    <div class="current-menu" slot="title">
      <span>将当前联系人加入到其它客商公司</span>
    </div>
    <div>
      <select-cust-com
        :result="vm"
        field="cust_com_id"
        width="100%"
        :pm="{custType: cust_type}"></select-cust-com>
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
        cust_com_id: ''
      },
      cust_type: "2",
    };
  },
  computed: {
  },
  methods: {
    init() {
    },
    onConfirm() {
      let self = this;
      if (self.vm.cust_com_id === '') {
        self.$message("请选择客商公司");
        return;
      }
      self.onCallback(self.vm).then(function() {
        self.onClose();
      });
    },
  },
  created() {
    this.init();
  },
};
</script>
