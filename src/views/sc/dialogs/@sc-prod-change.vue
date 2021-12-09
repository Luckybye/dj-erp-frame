<template>
  <el-dialog
    :visible="true"
    width="50%"
    @close="onClose"
    :close-on-click-modal="false"
  >
    <div class="" slot="title"><t path="sc.change" colon>变更</t></div>
    <div class="d-content">
      <el-row>
        <el-col :span="12">
          <x-label labelWidth="100px">
            <t slot="label" path="prod.model" colon>型号:</t>
            {{prod.model}}
          </x-label>
        </el-col>
        <el-col :span="12">
          <x-label labelWidth="100px">
            <t slot="label" path="sc.supplier_no" colon>ERP号:</t>
            {{prod.supplier_no}}
          </x-label>
        </el-col>
        <el-col :span="12">
          <x-label labelWidth="100px">
            <t slot="label" path="prod.prod_no" colon>产品货号:</t>
            {{prod.prod_no}}
          </x-label>
        </el-col>
        <el-col :span="12">
          <x-label labelWidth="100px">
            <t slot="label" path="prod.cust_prod_no" colon>客户货号:</t>
            {{prod.cust_prod_no}}
          </x-label>
        </el-col>
        <el-col :span="12">
          <x-label labelWidth="100px">
            <t slot="label" path="quantity" colon>数量:</t>
            {{prod.sell_quantity}}
          </x-label>
        </el-col>
        <el-col :span="12">
          <x-label labelWidth="100px">
            <t slot="label" path="delivery_date" colon>交货日期:</t>
            {{prod.delivery_date | timeFormat}}
          </x-label>
        </el-col>
        <el-col :span="24">
          <x-label labelWidth="100px">
            <t slot="label" path="sc.prod_status" colon>产品状态:</t>
            <el-radio label="normal" v-model="prod.busi_status">
              <t path="normal">正常</t>
            </el-radio>
            <el-radio label="delete" v-model="prod.busi_status" @change="taotai">
              <t path="sc.stop_sell">淘汰</t>
            </el-radio>
          </x-label>
        </el-col>
      </el-row>
      <el-table :data="datas" tooltip-effect="dark" style="width: 100%">
        <el-table-column width="50">
          <t slot="header" path="no">序号</t>
          <template slot-scope="scope">
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column width="100">
          <t slot="header" path="quantity">数量</t>
          <template slot-scope="scope">
            <x-input :result="scope.row" field="sell_quantity" width="100%" :disabled="isTaotai" v-input="{rule: 'integer,min=1'}"></x-input>
          </template>
        </el-table-column>
        <el-table-column>
          <t slot="header" path="sc.supplier_no">ERP号</t>
          <template slot-scope="{row}">
            <x-select :result="row" field="prod_id" :source="supplierNos" :map="{label: 'supplier_no', value: 'prod_id'}" width="100%" :disabled="isTaotai"></x-select>
          </template>
        </el-table-column>
        <el-table-column>
          <t slot="header" path="new_crd_date">实际交货日期</t>
          <template slot-scope="scope">
            <select-date :result="scope.row" field="delivery_date" width="100%" :clearable="false" :disabled="isTaotai"></select-date>
          </template>
        </el-table-column>
        <el-table-column width="100px" v-if="!isTaotai">
          <t slot="header" path="operation">操作</t>
          <template slot-scope="scope">
            <div><t class="d-link" path="delete" @click="onDelOrder(scope.$index)">删除</t></div>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="onAddOrder()"
        class="mt10" v-if="!isTaotai">{{$t('add')}}</el-button>
      <x-input
        width="100%"
        type="textarea"
        class="mt10"
        field="delay_desc"
        labelWidth="100px"
        :result="prod">
        <t slot="label" path="reason" colon>原因说明:</t>
      </x-input>
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
      preDatas: [],
      prod: {delay_desc: '', busi_status: 'normal'},
      supplierNos: []
    };
  },
  computed: {
    isTaotai () {
      return this.prod.busi_status === 'delete'
    }
  },
  methods: {
    async onConfirm() {
      let {delay_desc, busi_status} = this.prod
      let v = {delay_desc, busi_status}
      let sum = 0;
      let arr = []
      for (let i = 0; i < this.datas.length; i++) {
        let m = this.datas[i]
        if (m.sell_quantity <= 0 || !m.sell_quantity) {
          this.$message(this.$t('pls_input_positive_number'));
          return
        }
        sum += Number(m.sell_quantity);
        arr.push({quantity: m.sell_quantity, delivery_date: m.delivery_date, prod_id: m.prod_id, pi_prod_id: this.prod.bill_prod_id, seq_pi: 'seq_pi' in m ? m.seq_pi : Number(this.prod.seq_pi) || 0}._trim())
        // seq_pi: 'seq_pi' in m ? m.seq_pi : Number((this.prod.seq_pi || 0) + '.' + (i + 1))
      }
      if (sum !== this.prod.sell_quantity) {
        this.$message(this.$t('shipment_equal_quantity'));
        return;
      }
      v.pi_orders = arr;
      await this.$post2('/api/business/prodPlanDelay', v)
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
        sell_quantity: q || '',
        delivery_date: arr[arr.length - 1].delivery_date,
        prod_id: this.prod.prod_id
      };
      this.datas.push(v);
    },
    onDelOrder(index) {
      this.datas.splice(index, 1);
    },
    async getDatas () {
      this.order.delivery_date = this.order.delivery_date || null
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
      this.preDatas = this.$h.cloneDeep(this.datas)
    },
    taotai () {
      console.log(this.prod.busi_status, 'busi_statusbusi_statusbusi_status')
      if (this.prod.busi_status === 'delete') {
        this.datas = this.$h.cloneDeep(this.preDatas)
      }
    },
    queryProductByModel () {
      if (!this.order.model) return
      // , supplier_id: this.order.seller_id
      return this.$get2('/api/product/queryProductByModel', {model: this.order.model}).then(res => {
        this.supplierNos = res.prod_infos || []
      })
    },
  },
  created() {
    Promise.all([
      this.getDatas(),
      this.queryProductByModel()
    ]).then(() => {
      if (!this.supplierNos || !this.supplierNos.length) this.supplierNos = [this.prod]
    })
  },
};
</script>
<style lang="scss">
</style>
