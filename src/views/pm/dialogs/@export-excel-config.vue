<template>
  <el-dialog
    :visible="true"
    width="660px"
    @close="onClose"
    :close-on-click-modal="false"
  >
    <div class="text-left text-bold" slot="title">
      选择导出字段
      <span class="ml15 a-link">
        <span v-if="cancelSelectAll" @click="selectAll(false)">取消全选</span>
        <span v-else @click="selectAll(true)">全选</span>
      </span>
    </div>
    <div class="ideal-verify-prod">
      <div v-for="item in config" class="prod-item" :key="item.value.key">
        <el-checkbox v-model="item.x_checked">
          <span class="text-black">{{
            item.title || item.value.text
          }}</span>
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
function initialize() {}
export default {
  data() {
    return {
      config: [],
      cancelSelectAll: true,
    };
  },
  methods: {
    onConfirm() {
      let selected = this.config._selected("x_checked");
      if (!selected.length) return;
      this.onCallback(selected).then(() => {
        this.onClose();
      });
    },
    selectAll(bool) {
      this.config.forEach((item) => {
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
