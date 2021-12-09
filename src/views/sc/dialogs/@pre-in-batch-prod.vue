<template>
  <el-dialog
    :visible="true"
    width="50%"
    @close="onClose"
    :close-on-click-modal="false"
  >
    <div class="" slot="title"><t path="sc.in_batch" colon>分批</t><t path="sc.in_batch_note" style="color: gray">分批后数量合计需等于本批数量</t></div>
    <div class="d-content">
      <x-label labelWidth="120px">
        <t slot="label" path="sc.split_prod_qty" colon>分批商品数量:</t>
        {{prod.sell_quantity}}
      </x-label>
      <x-input
        type="textarea"
        class="mt10"
        :result="prod"
        field="split_desc"
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
              <x-input type="number" :result="scope.row" field="sell_quantity" width="100%"></x-input>
            </template>
          </el-table-column>
          <el-table-column>
            <t slot="header" path="delivery_date">交货日期</t>
            <template slot-scope="scope">
              <select-date :result="scope.row" field="delivery_date" width="100%" :clearable="false"></select-date>
            </template>
          </el-table-column>
          <el-table-column width="100px">
            <t slot="header" path="operation">操作</t>
            <template slot-scope="row">
              <div><t class="d-link" path="delete" @click="onDelOrder(row, $index)">删除</t></div>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="onAddOrder()" class="mt10">{{$t('add')}}</el-button>
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
      prod: {
        split_desc: ''
      },
    };
  },
  computed: {},
  methods: {
    onConfirm() {
      let v = {split_desc: this.prod.split_desc};
      // if (!v.split_desc) {
      //   this.$message(this.$t('pls_input_reason'));
      //   return;
      // }
      let sum = 0;
      let arr = []
      for (let i = 0; i < this.datas.length; i++) {
        let m = this.datas[i]
        if (m.sell_quantity <= 0) {
          this.$message(this.$t('pls_input_positive_number'));
          break;
        }
        sum += Number(m.sell_quantity);
        arr.push({quantity: m.sell_quantity, delivery_date: m.delivery_date})
      }
      if (sum !== this.prod.sell_quantity) {
        this.$message(this.$t('shipment_equal_quantity'));
        return;
      }
      v.pi_orders = arr;
      this.onCallback(v).then(() => {
        this.onClose();
      });
    },
    onAddOrder() {
      let arr = this.datas;
      let q = this.prod.sell_quantity;
      this.datas.forEach((item) => {
        q -= item.sell_quantity;
      });
      let v = {
        sell_quantity: q,
        delivery_date: arr[arr.length - 1].delivery_date,
      };
      this.datas.push(v);
    },
    onDelOrder(index) {
      this.datas.splice(index, 1);
    },
    async getDatas () {
      this.order.delivery_date = this.order.delivery_date || null
      // this.datas.push(this.order);
      let v = await this.$get2('/api/business/queryProdPlanSplit', {bill_prod_id: this.order.bill_prod_id})
      v = v.pi_prods
      if (v && v.length) {
        this.datas = v.map(m => {
          if (m.origin_id === m.bill_prod_id) {
            this.prod = {...this.prod, ...m, sell_quantity: m.origin_quantity}
          }
          return m
        })
      } else {
        this.prod = {...this.prod, ...this.order}
        this.datas.push(this.order)
      }
    },
  },
  created() {
    this.getDatas()
  },
};
</script>
<style lang="scss">
</style>
