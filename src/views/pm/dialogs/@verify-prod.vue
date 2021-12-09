<template>
  <el-dialog
    :visible="true"
    width="660px"
    @close="onClose"
    :close-on-click-modal="false"
  >
    <div class="text-left text-bold" slot="title">
      商品校验
      <span class="cursor ml15 text-blue">
        <span v-if="cancelSelectAll" @click="selectAll(false)">取消全选</span>
        <span v-else @click="selectAll(true)">全选</span>
      </span>
    </div>
    <div class="ideal-verify-prod">
      <div v-for="item in verifyField" class="prod-item" :key="item.id">
        <el-checkbox
          v-model="item.x_checked"
          v-if="item.field.indexOf('mg_pkgs') <= 0"
        >
          {{ item.text }}
        </el-checkbox>
      </div>
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
function initialize() {
  let fields = window._g.getVerifyFields("prod", "pm");
  this.verifyField = fields._assign({ x_checked: false });
}
export default {
  data() {
    return {
      verifyField: [],
      cancelSelectAll: false,
    };
  },
  methods: {
    onConfirm() {
      let selected = this.verifyField._selected("x_checked");
      let params = selected.map((m) => m.field);
      let verifyResult = selected.map((m) => m.text).join("，");
      params = {
        ...this.search,
        verify_columns: params.join(","),
        verify_type: "prod",
        status: "normal",
        prod_type: "company",
      };
      this.$pull.startVerify(params).then((data) => {
        data.verifyResult = verifyResult;
        this.onCallback(data).then(() => {
          this.onClose();
        });
      });
    },
    selectAll(bool) {
      console.log(bool);
      this.verifyField.forEach((item) => {
        item.x_checked = bool;
      });
      this.cancelSelectAll = bool;
    },
  },
  created() {
    initialize.call(this);
  },
};
</script>
<style lang="scss">
.ideal-verify-prod {
  display: -webkit-flex;
  display: flex;
  flex-wrap: wrap;
  .prod-item {
    width: 33%;
    text-align: left;
  }
}
</style>
