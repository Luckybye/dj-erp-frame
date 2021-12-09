<template>
  <el-dialog
    :visible="true"
    width="50%"
    @close="onClose"
    :close-on-click-modal="false"
  >
    <div class="" slot="title"><t path="sc.in_batch" colon>分批</t></div>
    <div class="d-content">
      <x-label labelWidth="120px">
        <t slot="label" path="current_quantity" colon>当前批次数量:</t>
        {{order.quantity}}
      </x-label>
      <x-input
        type="textarea"
        class="mt10"
        :result="vm"
        field="reason"
        labelWidth="120px"
        ><t slot="label" path="reason" colon>原因说明:</t></x-input>
        <el-table :data="datas" tooltip-effect="dark" style="width: 100%">
          <el-table-column width="50">
            <t slot="header" path="no">序号</t>
            <template slot-scope="scope">
              {{scope.$index + 1}}
            </template>
          </el-table-column>
          <el-table-column>
            <t slot="header" path="quantity">数量</t>
            <template slot-scope="scope">
              <x-input type="number" :result="scope.row" field="quantity" width="100%"></x-input>
            </template>
          </el-table-column>
          <el-table-column>
            <t slot="header" path="etd_date">出运日期</t>
            <template slot-scope="scope">
              <select-date :result="scope.row" field="etd_date" width="100%" :clearable="false"></select-date>
            </template>
          </el-table-column>
          <el-table-column width="100px">
            <t slot="header" path="operation">操作</t>
            <template slot-scope="scope">
              <div><t class="d-link" path="delete" @click="onDelOrder(scope.$index)">删除</t></div>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="onAddOrder()">{{$t('add')}}</el-button>
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
      datas: [],
      vm: {
        reason: ''
      },
      prod: {}
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
      let sum = 0;
      for (let i = 0; i < this.datas.length; i++) {
        if (this.datas[i].quantity <= 0) {
          this.$message(this.$t('pls_input_positive_number'));
          return;
        }
        if (!this.datas[i].etd_date) {
          this.$message(this.$t('pls_input_etd_date'));
          return;
        }
        sum += Number(this.datas[i].quantity);
      }
      if (sum !== this.order.quantity) {
        this.$message(this.$t('shipment_equal_quantity'));
        return;
      }
      this.vm.divide_orders = this.datas;
      this.onCallback(this.vm).then(() => {
        this.onClose();
      });
    },
    onAddOrder() {
      let arr = this.datas;
      let q = this.order.quantity;
      this.datas.forEach((item) => {
        q -= item.quantity;
      });
      let v = {
        quantity: q,
        etd_date: arr[arr.length - 1].etd_date,
      };
      this.datas.push(v);
    },
    onDelOrder(index) {
      this.datas.splice(index, 1);
    },
    initialize() {
      console.log('prod', this.prod)
      this.vm.etd_date = this.order.etd_date || this.prod.delivery_date
      this.datas.push({
        quantity: this.order.quantity,
        etd_date: this.vm.etd_date,
      });
    },
    getProdInfo () {
      console.log('order:', this.order)
      this.$get('/api/business/queryPiProd', {bill_prod_id: this.order.pi_prod_id}).then(res => {
        this.prod = res.pi_prod
        this.initialize()
      })
    },
  },
  created() {
    this.getProdInfo()
  },
};
</script>
<style lang="scss">
.ship-prod {
  .ideal-form-item {
    padding-bottom: 5px !important;
  }
}
</style>
