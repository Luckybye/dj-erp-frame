<template>
  <div class="pi-list">
    <more-search
      :parts="searchParts"
      :vm="searchVm"
      confirmChange
      class="mb10"
      >
      <div class="flex-b">
        <div class="h-left">
          <el-button type="primary" class="more--btn">More</el-button>
        </div>
        <div class="h-right">
        </div>
      </div>
      <x-select
        slot="select-founder"
        label-width="80px"
        width="100%"
        field="founder"
        :result="vmodel"
        slot-scope="{vmodel, change}"
        @save="change"
        :source="orderTypes"
        clearable
        :map="{label: 'text', value: 'key'}">
        <t slot="label" path="sc.founder" colon>类型</t>
        </x-select>
      <x-select
        slot="select-notice-status"
        label-width="80px"
        width="100%"
        field="notice_status"
        :result="vmodel"
        slot-scope="{vmodel, change}"
        @save="change"
        :source="statusTypes"
        clearable
        :map="{label: 'text', value: 'key'}">
        <t slot="label" path="sc.notice_status" colon>状态</t>
        </x-select>
    </more-search>

    <x-table :data="datas" :page="searchVm" :getData="refresh">
      <x-table-column>
        <t slot="header" path="sc.order">订单</t>
        <template slot-scope="{row}">
          <div class="a-link" @click="viewDetail(row)">{{ row.contract_no || "-" }}</div>
          <div>{{row.create_date | timeFormat}}</div>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="sc.founder_status">类型/状态</t>
        <template slot-scope="{row}">
          <div><t :path="getFounder(row).key">{{getFounder(row).dflt}}</t></div>
          <div><t :path="getStatus(row).key">{{getStatus(row).dflt}}</t></div>
        </template>
      </x-table-column>
      <x-table-column prop="x_buyer_id">
        <t slot="header" path="sc.cust_com">客户</t>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="amount">金额</t>
        <template slot-scope="{row}">
          <div>{{ row.currency | currencyFormat }} {{ row.amount | fthousands }}</div>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="sc.shipment_date">ETD</t>
        <template slot-scope="{row}">
          <div>{{ row.shipment_date | timeFormat }}</div>
        </template>
      </x-table-column>
      <x-table-column prop="x_seller_id">
        <t slot="header" path="sc.seller_id">法人</t>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="sc.busi_user_notice">业务员/通知</t>
        <template slot-scope="{row}">
          <div>{{ $tt(row, 'x_busi_user') }}</div>
          <div>{{ row.notice_date | timeFormat }}</div>
        </template>
      </x-table-column>
      <x-table-column width="80">
        <t slot="header" path="action">操作</t>
        <template slot-scope="{row, $index}">
          <el-button type="text" @click="onRecovery(row, $index)" v-if="row.status==='delete'"><t path="recovery">恢复</t></el-button>
          <span v-else-if="row.audit_status === 'auditing'">
            <a class="a-link lh-30" target="_bank"
              :href="`/approve-detail.html?approve_id=${row.bill_id}&field=approve_contract`">
              <t path="sc.auditing">审批中</t>
            </a>
          </span>
          <i class="el-icon-delete text-17 text-red" @click="onDelete(row, $index)" v-else-if="row.bill_status!=='normal' && row.status!=='delete'"></i>
        </template>
      </x-table-column>
    </x-table>
  </div>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
      datas: [],
      orderTypes: [
        { key: '', text: '全部', text_en: 'All', },
        { key: 'buy', text: '线上', text_en: 'Online', },
        { key: 'sell', text: '线下', text_en: 'Offline' },
      ],
      statusTypes: [
        { key: '', text: '全部', text_en: 'All', },
        { key: 'open', text: '未通知', text_en: 'Open', },
        { key: 'noticed', text: '已通知', text_en: 'Noticed' },
      ],
      searchVm: {
        x_searchLast: 0,
        page_index: 1,
        page_size: 15,
        busi_group_id: '',
        busi_user: '',
        // trade_type: 'foreign',
        bill_type: 'PI',
        bill_status: 'open',
        need_prod: 1,
        query_type: 'mall',
        founder: '',
        notice_status: '',
        seller_id: '',
        create_date_start: '',
        create_date_end: '',
        notice_date_start: '',
        notice_date_end: '',
      },
      searchParts: [
        {part: 'select-our-com', span: 12, field: 'seller_id', label: '法人公司', key: 'legal_ids'},
        {part: 'select-group-user', span: 12, field: 'busi_group_id', field2: 'busi_user', label: '工作组', key: 'group'},
        {slot: 'select-founder', span: 12, field: 'founder', label: '类型', key: 'sc.founder'},
        {slot: 'select-notice-status', span: 12, field: 'notice_status', label: '状态', key: 'sc.notice_status'},
        {part: 'select-date-range', span: 12, field: 'create_date_start', field2: 'create_date_end', label: '创建时间', key: 'create_date'},
        {part: 'select-date-range', span: 12, field: 'notice_date_start', field2: 'notice_date_end', label: '通知时间', key: 'sc.notice_date'},
      ]
    }
  },
  methods: {
    async refresh () {
      console.log(this.searchVm)
      let para = this.$h.cloneDeep(this.searchVm)._trim()
      let v = await this.$get('/api/business/billSearch', para)
      this.datas = v.pi_contracts
      return v
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
      this.datas.splice(i, 1)
    },
    getStatus ({notice_status}) {
      if (notice_status === 'open') return {key: 'sc.notice_status_open', dflt: '未通知'}
      if (notice_status === 'noticed') return {key: 'sc.notice_status_noticed', dflt: '已通知'}
      return {}
    },
    getFounder ({founder}) {
      if (founder === 'sell') return {key: 'sc.founder_sell', dflt: '线下'}
      if (founder === 'buy') return {key: 'sc.founder_buy', dflt: '线上'}
      return {}
    },
    async init () {
      this.searchVm.x_searchLast = 1
    },
  },
  created () {
    this.searchVm = {...this.searchVm, ...(this.payload || {}).search}
    this.init()
  }
}
</script>
