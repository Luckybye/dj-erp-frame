<template>
  <div class="pi-list">
    <div class="tab-page-header">
      <el-menu :default-active="searchVm.query_type" mode="horizontal" @select="handleSelect" class="fixed-top">
        <el-menu-item v-for="(item) in filterStatus" :key="item.en" :index="item.status">
          {{$t(item.key)}}({{statusCount[item.count || item.status]}})
        </el-menu-item>
      </el-menu>
      <div class="flex-b mt10">
        <div class="h-left">
          <select-group-user :result="searchVm" field="busi_group_id" field2="busi_user" @change="getDatas" ></select-group-user>
          <x-select :result="searchVm" field="founder" @change="getDatas" :source="orderTypes" :map="{label: 'text', label_en: 'text_en', value: 'key'}" class="ml10"></x-select>
        </div>
        <div class="h-right">
          <x-input
          v-model="searchVm.fuzzy_value"
          :placeholder="$t('pls_input_search_cond')"
          prefix-icon="el-icon-search" width="250px"
          @blur-change="getDatas()"
          @enter="getDatas"
          clearable></x-input>
          <el-button type="primary" @click="onAdd()" icon="el-icon-plus"></el-button>
        </div>
      </div>
    </div>

    <x-table :data="datas" pagination :page="searchVm" @page-change="getDatas" rowKey="contract_id">
      <x-table-column>
        <t slot="header" path="sc.order">订单</t>
        <template slot-scope="{row}">
          <div class="a-link" @click="viewDetail(row)">{{ row.contract_no || "-" }}</div>
          <div class="text-grey" v-if="searchVm.query_type === 'buy_pending'">
            <t :path="getStatus(row).key">{{getStatus(row).dflt}}</t>
          </div>
        </template>
      </x-table-column>
      <x-table-column prop="x_buyer_id">
        <t slot="header" path="sc.cust_com">客户</t>
      </x-table-column>
      <x-table-column prop="x_contact">
        <t slot="header" path="sc.cust_user">买手</t>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="sc.cust_po_ship_date">客户PO/出运日</t>
        <template slot-scope="{row}">
          <div>{{ row.cust_po_no || "-" }}</div>
          <div>{{ row.shipment_date | timeFormat }}</div>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="amount">金额</t>
        <template slot-scope="{row}">
          <div>{{ row.currency | currencyFormat }} {{ row.amount | fthousands }}</div>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="sc.sup_confirm">供方确认</t>
        <template slot-scope="{row}">
          <div>{{ row.receive_date | timeFormat('YYYY-MM-DD HH:mm') }}</div>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="sc.cust_confirm">订单客户确认</t>
        <template slot-scope="{row}">
          <div>{{ row.confirm_date | timeFormat('YYYY-MM-DD HH:mm') }}</div>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="sc.busi_user_create">业务员/创建</t>
        <template slot-scope="{row}">
          <div>{{ $tt(row, 'x_busi_user') }}</div>
          <div>{{ row.create_date | timeFormat }}</div>
        </template>
      </x-table-column>
      <x-table-column width="80">
        <t slot="header" path="action">操作</t>
        <template slot-scope="{row, $index}">
          <el-button type="text" @click="onRecovery(row, $index)" v-if="row.status==='delete'"><t path="recovery">恢复</t></el-button>
          <span v-else-if="row.audit_status === 'auditing'">
            <a class="a-link text-orange lh-30" target="_bank"
              :href="`/approve-detail.html?approve_id=${row.bill_id}&field=approve_contract`">
              <t path="sc.auditing">审批中</t>
            </a>
          </span>
          <i class="el-icon-delete text-17 text-red" @click="onDelete(row, $index)" v-else-if="row.bill_status==='open' && row.status!=='delete'"></i>
        </template>
      </x-table-column>
    </x-table>
  </div>
</template>

<script>
export default {
  options: {
    icon_text: 'List',
  },
  components: {
  },
  data() {
    return {
      datas: [],
      filterStatus: [
        {
          key: 'sc.pending',
          status: 'free',
        },
        {
          key: 'sc.to_be_confirm_by_sup',
          status: 'vend_pending',
        },
        {
          key: 'sc.to_be_confirm_by_cust',
          status: 'buy_pending',
        },
        {
          key: 'sc.confirmed_by_cust',
          status: 'confirmed',
        },
        {
          key: 'sc.delete',
          status: 'delete',
          count: 'deleted'
        },
        {
          key: 'sc.cancel',
          status: 'cancel',
        },
      ],
      orderTypes: [
        {
          key: '',
          text: '全部',
          text_en: 'All',
        },
        {
          key: 'buy',
          text: '线上',
          text_en: 'Online',
        },
        {
          key: 'sell',
          text: '线下',
          text_en: 'Offline'
        },
      ],
      searchVm: {
        page_index: 1,
        page_size: 15,
        busi_group_id: '',
        busi_user: '',
        bill_kind: 'SC',
        bill_type: 'PI',
        need_prod: 1,
        query_type: 'free',
        founder: '',
        need_stats: 'yes'
      },
      statusCount: {}
    }
  },
  methods: {
    async getDatas (i) {
      this.searchVm.page_index = typeof i === 'number' ? i : 1
      let para = {...this.searchVm}._trim()
      let v = await this.$get('/api/business/billSearch', para)
      this.datas = v.pi_contracts
      if ('count' in v) this.searchVm.count = v.count
      this.statusCount = v.counts || {}
    },
    handleSelect (status) {
      this.searchVm.query_type = status
      this.getDatas()
    },
    onAdd () {
      this.$dialog.ScCreate({}, async (d) => {
        let v = await this.$post('/api/business/preBill', {
          ...d,
          bill_type: 'PI',
          trade_type: 'foreign'
        })
        this.viewDetail({bill_no: '新建订单', ...v})
      })
    },
    viewDetail (v) {
      this.$tab.open({
        title: v.bill_no,
        tab_id: v.bill_id,
        path: 'ScEdit',
        query: {
          bill_id: v.bill_id
        }
      })
    },
    async onDelete (row, i) {
      await this.$confirm(this.$t('delete_tip'), this.$t('dialog_tip'), {type: 'warning'})
      await this.$post2('/api/business/deleteBill', {
        bill_id: row.bill_id,
        bill_type: 'PI'
      })
      this.onRefresh()
    },
    getStatus ({vend_busi_status: vend, buy_busi_status: buy}) {
      if (buy === 'open' && vend === 'confirmed') return {key: 'sc.prod_status_unreply', dflt: '未回复'}
      if (buy === 'pending') return {key: 'sc.confirming', dflt: '确认中'}
      if (buy === 'discussing') return {key: 'sc.renegotiation', dflt: '再协商'}
      return {}
    },
    async onRecovery (row) {
      await this.$confirm(this.$t('recovery_tip'), this.$t('dialog_tip'), {type: 'warning'})
      await this.$post2('/api/business/recoverPiContracts', {
        contract_id: row.bill_id
      })
      this.getDatas()
    },
    async init () {
      this.getDatas()
    },
  },
  created () {
    this.searchVm = {...this.searchVm, ...(this.payload || {}).search}
    this.init()
  }
}
</script>
