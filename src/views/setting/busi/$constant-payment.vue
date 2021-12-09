<template lang="html">
  <div>
    <div class="mb15">
      <div>
        <span class="left-border-title mb10"
          >付款要求文本设置</span
        >
      </div>
      <x-table :data="payment_text">
        <x-table-column label="No." width="50" type="index"></x-table-column>
        <x-table-column label="币种" width="80" prop="currency"> </x-table-column>
        <x-table-column label="付款要求文本" width="" prop="text">
        </x-table-column>
        <x-table-column label="操作" width="80">
          <template slot-scope="{ row, $index }">
            <i
              class="el-icon-edit-outline text-17 text-blue"
              @click="onPayTextEdit(row, $index)"
              v-if="isOperate"
            ></i>
          </template>
        </x-table-column>
      </x-table>
    </div>

    <div class="mt20">
      <div class="flex between mb10">
        <span class="left-border-title">付款方式</span>
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
        <div slot="nodata">暂无记录</div>
        <x-table-column label="No." width="50" type="index"></x-table-column>
        <x-table-column label="付款方式" width="">
          <span slot-scope="{ row, $index }">
            {{ row.payment_desc || row.payment_text }}{{ $index === 0 ? '(默认付款方式)' : '' }}
          </span>
        </x-table-column>
        <x-table-column label="操作" width="150" v-if="isOperate">
          <template slot-scope="{ row }">
            <i
              class="el-icon-edit-outline text-17 text-blue mr10 vm-imp"
              @click="onPaymentEdit(row)"
            ></i>
            <!-- <i
              class="el-icon-delete text-17 text-red ml10"
              @click="onDelete(row, $index)"
            ></i> -->
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
  </div>
</template>

<script>
let fmt = {
  payment_text: '',
  payment_desc: '',
  payment_params: '',
  payment_type: 'ap',
  busi_status: 'normal',
  pu_st_type: 'ship',
  id: ''
}
function initialize() {
  this.queryCmPayment()
  Promise.when([this.getValue('payment_text'), this.getCurrency()]).then(() => {
    if (this.payment_text && this.payment_text.length) return
    this.payment_text = this.currencyTypes.map(m => {
      return {
        currency: m.key,
        text:
          '供方提供按需方要求开具的增值税发票，合同正本及正本装箱单或者正本进仓回执单',
      }
    })
    this.setValue('payment_text')
  })
}
export default {
  options: { title: '付款方式', icon: 'icon-set' },
  data() {
    return {
      currencyTypes: [],
      instance: '',
      payment_text: [],
      datas: [],
    }
  },
  methods: {
    async queryCmPayment() {
      let v = await this.$get2('/api/crm/queryCmPayment', { payment_type: 'ap' })
      this.datas = (v.cm_payments || [])._fmt(fmt)
    },
    editCmPayment(row) {
      let para = Object._merge(fmt, row)._trim()
      return this.$post2('/api/crm/editCmPayment', para, {loading: true})
    },
    async getValue(field) {
      let v = await this.$configure.getValue(field, this.instance)
      this[field] = v[field] || this[field]
    },
    async setValue(field) {
      await this.$configure.setValue(field, {[field]: this[field]}, this.instance)
    },
    async getCurrency() {
      this.currencyTypes = await this.$cache.getCurrency()
    },
    onPaymentEdit(item) {
      this.$dialog.PaymentEdit({vm: item || fmt}, async (data) => {
        item && Object.assign(item, data)
        await this.editCmPayment(item || data)
        item || this.queryCmPayment()
      })
    },
    onPayTextEdit(row) {
      this.$dialog.PayTextEdit({ vm: row || {} }, data => {
        let v = this.payment_text
        if (row) {
          Object.assign(row, data)
        } else {
          v.push(data)
        }
        this.setValue('payment_text')
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
    this.instance = this.payload.instance || this.$state('me').com_id
    initialize.call(this)
  },
}
</script>
