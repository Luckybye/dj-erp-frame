<template>
  <el-dialog
    visible
    width="1000px"
    @close="onClose"
    :close-on-click-modal="false"
    :title="$t('qu.qu_price_update')">

    <div class="flex-b">
      <x-input type="number" :result="vm" width="200px" field="sell_rate" label="销售汇率:"></x-input>
      <x-input type="number" :result="vm" width="200px" field="pu_rate" label="采购汇率:" :disabled="payload.pu_currency==='CNY'"></x-input>
      <x-input type="number" :result="vm" width="200px" field="add_price" label="采购加成:"></x-input>
    </div>
    <div class="text-bold mt20 mb10">
      计算公式:
    </div>
    <div>
      <x-check :result="vm" field="profit_rate_type" width="100%" expect="supplier" :disabled="payload.is_agent==='yes'">
        <span class="text-bold">供应商利润率加成</span>
        <div class="text-grey">
          人民币采购：{ [ 1 - 退税率 / ( 1 + 增值税率 ) ] × 含税采购价 × ( 1 + 供应商利润率 ) + 采购加成 } ÷ 销售汇率
          <br>
          外币采购：[ 采购价 ×  ( 1 + 供应商利润率 ) + 采购加成  ] × 采购汇率  ÷ 销售汇率
        </div>
      </x-check>
      <x-check :result="vm" field="profit_rate_type" width="100%" expect="customize" class="mt20" :disabled="payload.is_agent==='yes'">
        <span class="text-bold">
          设定利润率加成
          <x-input type="number" :result="vm" width="100px" field="profit_rate" unit="%" class="ml10"></x-input>
        </span>
        <div class="text-grey">
          人民币采购：{ [ 1 - 退税率 / ( 1 + 增值税率 ) ] × 含税采购价 × ( 1 + 设定利润率 ) + 采购加成 } ÷ 销售汇率
          <br>
          外币采购：[ 采购价 ×  ( 1 + 设定利润率 ) + 采购加成  ] × 采购汇率  ÷ 销售汇率
        </div>
      </x-check>
      <x-check :result="vm" field="profit_rate_type" width="100%" expect="cust_add" class="mt20" :disabled="payload.is_agent==='yes'">
        <span class="text-bold">客户目标利润率加成</span>
        <div class="text-grey">
          人民币采购：{ [ 1 - 退税率 / ( 1 + 增值税率 ) ] × 含税采购价 × ( 1 + 客户目标利润率 ) } ÷ 销售汇率
          <br>
          外币采购：[ 采购价 ×  ( 1 + 客户目标利润率 )  ]  × 采购汇率 ÷ 销售汇率
        </div>
      </x-check>
      <x-check :result="vm" field="profit_rate_type" width="100%" expect="cust" class="mt20" :disabled="payload.is_agent==='yes'">
        <span class="text-bold">客户目标利润率扣减</span>
        <div class="text-grey">
          人民币采购： { [ 1 - 退税率 / ( 1 + 增值率税 ) ] × 含税采购价 ÷ ( 1 - 客户利润率 ) } ÷ 销售汇率
          <br>
          外币采购： 采购价 ÷  ( 1 - 客户目标利润率 )  × 采购汇率 ÷ 销售汇率
        </div>
      </x-check>
    </div>

    <span
      slot="footer"
      class="dialog-footer">
      <el-button @click="onClose">{{$t('cancel')}}</el-button>
      <el-button
        type="primary"
        @click="onConfirm"
      >{{$t('confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      vm: {
        bill_id: '',
        bill_prod_id: '',
        profit_rate_type: 'supplier', // supplier;cust;cust_add,customize
        profit_rate: '',
        sell_rate: '',
        pu_rate: '',
        add_price: 0,
      },
      payload: {}
    }
  },
  computed: {},
  methods: {
    async onConfirm() {
      let para = {...this.vm}._trim()
      if (para.profit_rate_type !== 'customize') para.profit_rate = ''
      let url = '/api/marking/evaluateProdsPrice'

      if (para.bill_prod_id) url = '/api/marking/evaluateProdPrice'

      if (para.bill_type === 'PI') {
        url = '/api/marking/evaluatePiProdsPrice'
        para.contract_id = para.bill_id
      }
      if (para.bill_type === 'QU') {
        para.quote_id = para.bill_id
      }

      await this.$get2(url, para)
      await this.saveConfig()
      this.onCallback(para).then(() => {
        this.onClose()
      })
    },
    saveConfig () {
      let conifgID = this.vm.bill_id
      let field = 'evaluateProdsPrice'
      if (this.vm.bill_prod_id) {
        conifgID = this.vm.bill_prod_id
        field = 'evaluateProdPrice'
      }
      let para = {...this.vm}._trim()
      delete para.bill_prod_id
      delete para.bill_id
      delete para.bill_type
      return this.$configure.setValue(field, {[field]: para}, conifgID)
    },
    init () {
      this.$configure.getValue('constant_currency', this.$state('me').com_id).then((res) => {
        let currMap = (res.constant_currency || [])._object('key')
        this.vm.sell_rate = (currMap[this.payload.currency] || {}).value
        this.vm.pu_rate = (currMap[this.payload.pu_currency] || {}).value
        this.getConfig()
      })
    },
    async queryCustAgentPrice () {
      if (this.payload.is_agent !== 'yes') return
      let v = await this.$get2('/api/crm/queryCustCompany', {cust_com_id: this.payload.buyer_id}, {loading: false})
      v = v.cust_company || {}
      if (v.agent_price === 'pu_multiply') this.vm.profit_rate_type = 'cust_add'
      if (v.agent_price === 'pu_divide') this.vm.profit_rate_type = 'cust'
    },
    getConfig () {
      let conifgID = this.vm.bill_id
      let field = 'evaluateProdsPrice'
      if (this.vm.bill_prod_id) {
        conifgID = this.vm.bill_prod_id
        field = 'evaluateProdPrice'
      }
      this.$configure.getValue(field, conifgID).then((res) => {
        this.vm = {...this.vm, ...res[field]}
        this.queryCustAgentPrice()
      })
    },
  },
  created() {
    this.init()
  },
};
</script>

<style lang="scss">
.qu-create-dialog {
}
</style>
