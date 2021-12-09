<template lang="html">
  <div class="constant-remittance">
    <div class="tab-page-header flex between">
      <span class="left-border-title">收款方式</span>
      <div>
        <el-button
          type="primary"
          icon="el-icon-plus"
          v-if="isOperate"
          @click="onPaymentEdit()"
        ></el-button>
      </div>
    </div>
    <x-table :data="datas">
      <x-table-column label="No." width="50" type="index"></x-table-column>
      <x-table-column label="收款方式" width="">
        <span slot-scope="{ row, $index }">
          {{ row.payment_desc || row.payment_text }}{{ $index === 0 ? '(默认收款方式)' : '' }}
        </span>
      </x-table-column>
      <x-table-column label="操作" width="150" v-if="isOperate">
        <template slot-scope="{ row }">
          <i
            class="el-icon-edit-outline text-17 text-blue mr10 vm-imp"
            @click="onPaymentEdit(row)"
          ></i>
          <el-switch
            class="vm"
            v-model="row.busi_status"
            active-value="normal"
            inactive-value="stop"
            @change="changeStatus(row)">
          </el-switch>
          <span class="text-grey vm ml5">{{row.busi_status === 'stop' ? '已禁用' : '已启用'}}</span>
        </template>
      </x-table-column>
    </x-table>
  </div>
</template>

<script>
let fmt = {
  payment_text: '',
  payment_desc: '',
  payment_params: '',
  payment_type: 'ar',
  busi_status: 'normal',
  id: '',
  is_credit: 'yes',
  credit_limit: 'yes'
}
function initialize() {
  this.queryCmPayment()
}
export default {
  options: { title: '收款方式', icon: 'icon-set' },
  data() {
    return {
      datas: [],
    }
  },
  methods: {
    async queryCmPayment() {
      let v = await this.$get2('/api/crm/queryCmPayment', { payment_type: 'ar' })
      this.datas = (v.cm_payments || [])._fmt(fmt)
    },
    editCmPayment(row) {
      let para = Object._merge(fmt, row)._trim()
      return this.$post2('/api/crm/editCmPayment', para, {loading: true})
    },
    onPaymentEdit(item) {
      this.$dialog.RemittanceEdit({vm: item || fmt}, async (data) => {
        item && Object.assign(item, data)
        await this.editCmPayment(item || data)
        item || this.queryCmPayment()
      })
    },
    async changeStatus(row) {
      // await this.$confirm(this.$t("delete_tip"), this.$t("dialog_tip"), {
      //   type: "warning",
      // });
      await this.editCmPayment(row)
      // this.queryCmPayment()
    },
  },
  computed: {
    isOperate () {
      let role = this.$state('me').role
      return role === '1' || role === '2'
    }
  },
  created() {
    initialize.call(this)
  },
}
</script>
