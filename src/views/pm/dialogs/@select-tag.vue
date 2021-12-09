<template>
  <el-dialog
    :visible="true"
    width="500px"
    @close="onClose"
    :close-on-click-modal="false"
  >
    <h3 class="text-left text-bold" slot="title">
      选择商品标签
    </h3>
    <div class="text-left">
      <div class="mb10">
        <span v-if="cancelSelectAll" @click="selectAll(false)" class="a-link"
          >取消全选</span
        >
        <span v-else @click="selectAll(true)" class="a-link">全选</span>
      </div>
      <div class="flex-wrap flex-b">
        <div
          v-for="item in datas"
          style="width: 50%"
          class="mb20"
          :key="item.tag_id"
        >
          <el-checkbox v-model="item.x_checked">
            <x-prod-tag :map="item"></x-prod-tag>
          </el-checkbox>
        </div>
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
  this.querySysTag();
}
export default {
  data() {
    return {
      datas: [],
      cancelSelectAll: false,
    };
  },
  methods: {
    querySysTag() {
      return this.$get("/api/system/querySysTag", {
        com_id: this.$state("me").com_id,
      }).then((d) => {
        d = d.sys_tags || [];
        this.datas = d._assign({ x_checked: false });
      });
    },
    onConfirm() {
      let selected = this.datas._selected("x_checked");
      if (!selected.length) return this.$message("请选择标签");
      this.onCallback(selected).then(() => {
        this.onClose();
      });
    },
    selectAll(bool) {
      this.datas.forEach((item) => {
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
<style lang="scss"></style>
