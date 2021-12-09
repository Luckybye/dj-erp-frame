<template>
  <div class="pi-list">
    <div class="tab-page-header">
      <more-search
        :parts="searchParts"
        :vm="searchVm"
        confirmChange>
        <div class="flex-b mt10">
          <div class="h-left">
            <select-group-user :result="searchVm" field="busi_group_id" field2="busi_user"></select-group-user>
            <x-select :result="searchVm" field="x_status" @change="handlerStatus" :source="billStatus" :map="{label: 'text', label_en: 'text_en', value: 'key'}" :placeholder="$t('sc.order_status')" clearable class="ml10"></x-select>
            <el-button type="primary" class="more--btn">More</el-button>
          </div>
          <div class="h-right">
            <x-input
            v-model="searchVm.fuzzy_value"
            :placeholder="$t('pls_input_search_cond')"
            prefix-icon="el-icon-search" width="250px"
            blurChange
            clearable></x-input>
            <el-button type="primary" @click="onAdd()" icon="el-icon-plus"></el-button>
          </div>
        </div>
        <x-select slot="founder" :source="orderTypes" :map="{label: 'text', value: 'key'}" slot-scope="{vmodel, change, pm}" :result="vmodel" :field="pm.field" @save="change" label="来源:" width="100%" clearable></x-select>
        <x-select slot="book-status" :source="bookStatus" :map="{label: 'text', value: 'key'}" slot-scope="{vmodel, change, pm}" :result="vmodel" :field="pm.field" @save="change" @change="handlerStatus2" label="订舱:" width="100%" clearable></x-select>
      </more-search>
    </div>

    <x-table :data="datas" :page="searchVm" :getData="getDatas" rowKey="contract_id">
      <x-table-column>
        <t slot="header" path="sc.order">订单</t>
        <template slot-scope="{row}">
          <div class="a-link" @click="viewDetail(row)">{{ row.contract_no || "-" }}</div>
          <div class="flex between middle wrap">
            <span class="text-grey">{{row.create_date | timeFormat}}</span>
            <span class="bill-status" :class="row.x_status">{{getStatus(row)}}</span>
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
        <t slot="header" path="sc.valid_date">生效日期</t>
        <template slot-scope="{row}">
          <div>{{ row.valid_date | timeFormat('YYYY-MM-DD') }}</div>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="sc.shipment_date">实际出运日</t>
        <template slot-scope="{row}">
          <div>{{ row.shipment_date | timeFormat('YYYY-MM-DD') }}</div>
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
          <span class="a-link" v-if="(row.bill_status==='finish' || row.bill_status==='normal') && row.status==='normal'" @click="onCopy(row)">
            <t path="sc.reorder">翻单</t>
          </span>
          <el-button type="text" @click="onRecovery(row, $index)" v-if="row.status==='delete'"><t path="recovery">恢复</t></el-button>
          <i class="el-icon-delete text-17 text-red" @click="onDelete(row, $index)" v-if="row.bill_status==='open' && row.status!=='delete'&&row.audit_status==='normal'"></i>
        </template>
      </x-table-column>
    </x-table>
  </div>
</template>

<script>
import {billStatus, getStatus} from './sc-widget.js'
export default {
  options: {
    icon_text: 'List'
  },
  components: {
  },
  data() {
    return {
      datas: [],
      searchVm: {
        page_index: 1,
        page_size: 15,
        busi_group_id: '',
        busi_user: '',
        bill_kind: 'SC',
        trade_type: '',
        bill_type: 'PI',
        // need_prod: 1,
        ship_status: '',
        book_status: '',
        founder: '',
        valid_date_start: null,
        valid_date_end: null,
        shipment_date_start: null,
        shipment_date_end: null,
        seller_id: '',
        buyer_id: '',
        x_status: '',
        x_searchLast: ''
      },
      orderTypes: [
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
      bookStatus: [
        {
          key: 'on_book',
          text: '未订舱',
          text_en: 'No booking',
          extend: {bill_status: 'normal'},
          book: true
        },
        {
          key: 'booked',
          text: '已订舱',
          text_en: 'Booked',
          extend: {bill_status: 'normal'},
          book: true
        },
      ],
      billStatus,
      searchParts: [
        {part: 'select-our-com', span: 12, field: 'seller_id', label: '销售方', key: 'sc.seller'},
        {part: 'select-cust-com', span: 12, field: 'buyer_id', label: '客户', key: 'sc.buyer', cust_type: '2'},
        {slot: 'founder', span: 12, field: 'founder', label: '来源', key: 'sc.founder'},
        {slot: 'book-status', span: 12, field: 'book_status', label: '订舱', key: 'sc.book_status'},
        {part: 'select-date-range', span: 12, field: 'valid_date_start', field2: 'valid_date_end', label: '签约日期', key: 'sc.valid_date'},
        {part: 'select-date-range', span: 12, field: 'shipment_date_start', field2: 'shipment_date_end', label: '计划出运日期', key: 'sc.shipment_date'},
      ],
    }
  },
  watch: {
    actived (n) {
      if (n) {
        this.$nextTick(async () => {
          this.opt = {loading: false}
          this.onRefresh()
        })
      }
    }
  },
  methods: {
    onRefresh () {
      this.searchVm.x_searchLast = 1
    },
    async getDatas () {
      if (/on_book|booked/.test(this.searchVm.book_status)) this.searchVm.x_status = ''
      let para = {...this.searchVm, ...this.extendSearch}
      let v = await this.$get('/api/business/billSearch', para._trim(), this.opt)
      this.datas = v.pi_contracts
      return v
    },
    handlerStatus (v) {
      v = v || this.billStatus.find(f => f.key === this.searchVm.x_status)
      if (v) {
        this.extendSearch = v.extend
        this.searchVm.book_status = ''
      } else this.extendSearch = ''
    },
    handlerStatus2 (v) {
      if (v) this.extendSearch = v.extend
    },
    getStatus,
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
    async onCopy (item) {
      await this.$confirm('确定翻单？', this.$t('dialog_tip'), {type: 'warning'})
      let v = await this.$get2('/api/business/redoContract', {contract_id: item.bill_id})
      this.viewDetail(v.pi_contract)
      this.onRefresh()
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
    async onRecovery (row) {
      await this.$confirm(this.$t('recovery_tip'), this.$t('dialog_tip'), {type: 'warning'})
      await this.$post2('/api/business/recoverPiContracts', {
        contract_id: row.bill_id
      })
      this.onRefresh()
    },
    async init () {
      this.onRefresh()
    },
  },
  created () {
    this.searchVm = {...this.searchVm, ...(this.payload || {}).search}
    this.handlerStatus()
    this.init()
  }
}
</script>
