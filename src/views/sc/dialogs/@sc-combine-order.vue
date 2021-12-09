<template>
  <el-dialog
    :visible="true"
    @close="onClose"
    width="800px"
    :close-on-click-modal="false"
  >
    <div class="" slot="title"><t path="sc.combine">合并</t></div>
    <div class="d-content">
      <el-table :data="datas" tooltip-effect="dark" @selection-change="handleSelectionChange" style="width: 100%">
        <el-table-column type="selection" width="30" :selectable="selectable">
        </el-table-column>
        <el-table-column width="50">
          <t slot="header" path="no">序号</t>
          <template slot-scope="scope">
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column>
          <t slot="header" path="quantity">数量</t>
          <template slot-scope="scope">
            {{scope.row.quantity}}
          </template>
        </el-table-column>
        <el-table-column>
          <t slot="header" path="sc.etd_date">计划出运日</t>
          <template slot-scope="scope">
            {{scope.row.etd_date | timeFormat}}
          </template>
        </el-table-column>
        <el-table-column>
          <t slot="header" path="sc.crd_date">实际交货日</t>
          <template slot-scope="scope">
            {{scope.row.crd_date | timeFormat}}
          </template>
        </el-table-column>
        <el-table-column>
          <t slot="header" path="sc.is_delay">出运状态</t>
          <template slot-scope="scope">
            {{getStatus(scope.row, 'is_delay')}}
          </template>
        </el-table-column>
        <el-table-column>
          <t slot="header" path="sc.is_pu_delay">交货状态</t>
          <template slot-scope="scope">
            {{getStatus(scope.row, 'is_pu_delay')}}
          </template>
        </el-table-column>
      </el-table>
      <el-form label-position="left" label-width="120px" class="mt20">
        <el-row type="flex">
          <el-col :span="8">
            <el-form-item>
              <t slot="label" path="sc.old_quantity" colon>原批次数量:</t>
              {{order.quantity}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <t slot="label" path="sc.etd_date" colon>原计划出运:</t>
              {{order.etd_date | timeFormat}}
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <t slot="label" path="sc.new_quantity" colon>合并后数量:</t>
              {{totalQTY}}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
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
      selected: [],
    };
  },
  computed: {
    totalQTY () {
      let num = this.order.quantity * 1
      this.selected.forEach(item => {
        num += (item.quantity * 1) || 0
      })
      return num
    },
  },
  methods: {
    handleSelectionChange(val) {
      this.selected = val
    },
    selectable (val) {
      if (val.bill_prod_id === this.order.bill_prod_id) {
        return false
      }
      return true
    },
    onConfirm() {
      let arr = this.selected.map(item => item.bill_prod_id) || []
      arr.unshift(this.order.bill_prod_id)
      this.onCallback(arr).then(() => {
        this.onClose();
      });
    },
    initialize() {
    },
    getProdInfo () {
      console.log('order:', this.order)
      this.$get2('/api/business/queryCombineOrders', {bill_prod_id: this.order.bill_prod_id}).then(res => {
        this.datas = res.pi_orders || []
        this.datas.push(this.order)
        this.initialize()
      })
    },
    getStatus(row, type) {
      let status = row[type]
      if (status === 'normal') return '正常'
      if (status === 'delay') return '延期'
      if (status === 'forward') return '提前'
      return ''
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
