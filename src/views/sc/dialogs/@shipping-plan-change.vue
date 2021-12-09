<template>
  <el-dialog
    :visible="true"
    @close="onClose"
    width="800px"
    :close-on-click-modal="false"
  >
    <div class="" slot="title"><t path="sc.change" colon>变更</t></div>
    <div class="d-content">
      <el-form label-position="left" label-width="120px">
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item>
              <t slot="label" path="prod.prod_name" colon>产品名称:</t>
              {{$tt(order, 'prod_name')}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <t slot="label" path="prod_no" colon>货号:</t>
              {{order.prod_no}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <t slot="label" path="prod.cust_prod_no" colon>客户货号:</t>
              {{order.cust_prod_no}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <t slot="label" path="prod.supplier_no" colon>工厂货号:</t>
              {{order.supplier_no}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <t slot="label" path="prod.model" colon>规格型号:</t>
              {{order.model}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <t slot="label" path="current_quantity" colon>当前批次数量:</t>
              {{order.quantity}}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
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
          <t slot="header" path="sp.etd_date">客户要求交期</t>
          <template slot-scope="scope">
            <select-date :result="scope.row" field="etd_date" width="100%" :clearable="false" :disabled="type !== 'shipping-plan'&&!!scope.row.etd_date"></select-date>
          </template>
        </el-table-column>
        <el-table-column v-if="type==='order-executive'">
          <t slot="header" path="sp.delivery_date">供方承诺交期</t>
          <template slot-scope="scope">
            {{scope.row.delivery_date | timeFormat}}
            <!-- <select-date :result="scope.row" field="delivery_date" width="100%" :clearable="false" :disabled="type === 'shipping-plan' || scope.row.delivery_date"></select-date> -->
          </template>
        </el-table-column>
        <el-table-column>
          <t slot="header" path="sp.crd_date">供方实际交期</t>
          <template slot-scope="scope">
            <select-date :result="scope.row" field="crd_date" width="100%" :clearable="false" :disabled="type === 'shipping-plan'"></select-date>
          </template>
        </el-table-column>
        <el-table-column width="100">
          <t slot="header" path="operation">操作</t>
          <template slot-scope="scope">
            <div v-if="datas.length"><t class="d-link" path="delete" @click="onDelOrder(scope.$index)">删除</t></div>
          </template>
        </el-table-column>
        <el-table-column width="100" v-if="type === 'shipping-plan'">
          <t slot="header" path="sp.cancel_ship">是否取消出运</t>
          <template slot-scope="scope">
            <el-checkbox
              label="cancel"
              key="cancel"
              @change="onChangeShip(scope.row)"
              v-model="scope.row.busi_status">
              {{$t('yes')}}
            </el-checkbox>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt10">
        <el-button type="primary" @click="onAddOrder()">{{$t('add')}}</el-button>
      </div>
      <select-stock-process :result="vm" field="process_id" labelWidth="120px" :showLabel="true" class="mt10">
        <t slot="label" path="stock_process" colon>备货进度:</t>
      </select-stock-process>
      <x-select :result="vm" field="reason" :source="reasons" :map="{label: 'reason', value: 'reason'}" labelWidth="120px" class="mt10" :clearable="true">
        <t slot="label" path="reason2" colon>变更原因:</t>
      </x-select>
      <x-input
        type="textarea"
        class="mt10"
        :result="vm"
        field="reason_detail"
        labelWidth="120px"
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
      datas: [],
      vm: {
        reason: '',
        reason_detail: '',
        process_id: ''
      },
      prod: {},
      type: 'shipping-plan',
      reasons: []
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
      this.vm.divide_orders = this.datas.map(item => {
        if (item.busi_status === true) {
          item.busi_status = 'cancel'
        } else {
          item.busi_status = 'normal'
        }
        return item
      });
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
        crd_date: arr[arr.length - 1].crd_date,
        delivery_date: arr[0].delivery_date,
      };
      this.datas.push(v);
    },
    onDelOrder(index) {
      this.datas.splice(index, 1);
    },
    initialize() {
      console.log('prod', this.prod)
      this.vm.etd_date = this.order.etd_date || this.order.delivery_date
      this.vm.reason = this.order.reason
      this.vm.reason_detail = this.order.reason_detail
      this.vm.process_id = this.order.process_id
      this.datas.push({
        quantity: this.order.quantity,
        etd_date: this.order.etd_date,
        crd_date: this.order.crd_date,
        delivery_date: this.order.delivery_date
      });
      let field = 'prod_batch_reasons'
      this.$configure.getValue(field, this.$state('me').com_id).then(res => {
        this.reasons = res[field] || []
      })
    },
    getProdInfo () {
      console.log('order:', this.order)
      this.$get('/api/business/queryPiProd', {bill_prod_id: this.order.pi_prod_id}).then(res => {
        this.prod = res.pi_prod
        this.initialize()
      })
    },
    onChangeShip(row) {
      console.log(row)
    }
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
