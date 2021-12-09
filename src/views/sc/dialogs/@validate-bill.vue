<template>
  <el-dialog
    :visible="isShow"
    width="50%"
    @close="onClose"
    :close-on-click-modal="false"
  >
    <div class="" slot="title">
      <t path="verify_result">校验结果</t>
      <!-- <span class="text-12 text-grey">（点击蓝色链接可以跳转到对应页面）</span> -->
    </div>
    <div v-for="(item, i) in validates" :key="i">
      <div class="text-left lh-30">
        <span class="text-semibold">
          <span v-if="item.status === 'yes'">{{ item.item_name }}: </span>
          <span v-else class="a-link" @click="onClick(item)">
            {{ item.item_name }}:
          </span>
        </span>
        <span v-if="item.status === 'yes'" class="text-blue">√</span>
        <span v-else class="text-red">{{ item.result }}</span>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">{{ $t("close") }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      isShow: false,
      validates: [],
    };
  },
  methods: {
    initialize() {
      let params = {
        bill_type: this.bill_type,
        bill_id: this.bill_id,
      };
      this.$pull.validateBill(params, { loading: true }).then((data) => {
        console.log(data);
        if (data.status === "no") {
          this.isShow = true;
          this.validates = data.validate_items;
        } else {
          this.onCallback().then(() => {
            this.onClose();
          });
          this.onClose();
        }
      });
    },
    onClick(item) {
      this.onCallback(item).then(() => {
        this.onClose();
      });
    },
  },
  created() {
    this.initialize();
  },
  computed: {},
};
</script>
