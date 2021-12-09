<template>
  <div class="pi-list">
    <div class="tab-page-header">
      <more-search
        :parts="searchParts"
        :vm="searchVm"
        @confirm="getDatas()"
        @reset="getDatas()">
        <div class="flex-b mt10">
          <div class="h-left">
            <x-select :result="searchVm" field="trade_type" @change="getDatas" :source="orderTypes" :map="{label: 'text', label_en: 'text_en', value: 'key'}" class="ml10"></x-select>
            <el-button type="primary" class="more--btn">More</el-button>
          </div>
          <div class="h-right">
            <x-input
            v-model="searchVm.fuzzy_value"
            :placeholder="$t('pls_input_search_cond')"
            prefix-icon="el-icon-search" width="250px"
            @blur-change="getDatas()"
            @enter="getDatas"
            clearable></x-input>
          </div>
        </div>
      </more-search>
    </div>

    <x-table :data="datas" :page="searchVm" @page-change="getDatas" rowKey="contract_id">
      <x-table-column type="index"></x-table-column>
      <x-table-column>
        <t slot="header" path="sc.initial_sc">初始销售订单</t>
        <template slot-scope="{row}">
          <div class="a-link" @click="viewDetail(row)">{{ row.contract_no || "-" }}</div>
          <div class="flex between middle wrap">
            <span class="text-grey">{{row.create_date | timeFormat}}</span>
            <span class="bill-status" :class="row.x_status">{{getStatus(row)}}</span>
          </div>
        </template>
      </x-table-column>
      <x-table-column prop="x_seller_id">
        <t slot="header" path="sc.sale_legal">销售法人</t>
      </x-table-column>
      <x-table-column prop="x_buyer_id">
        <t slot="header" path="sc.cust_com">客户</t>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="sc.inner_po">内部采购订单</t>
        <template slot-scope="{row}">
          <div class="a-link" @click="viewPu(row)">{{ row.rpt_pu_no || "-" }}</div>
        </template>
      </x-table-column>
      <x-table-column prop="">
        <t slot="header" path="sc.inner_sup">内部供方</t>
        <template slot-scope="{row}">
          <div v-if="row.trade_type === 'external'">{{ row.x_rpt_legal_cust_com_id}}</div>
          <div v-else>{{ row.x_rpt_cust_com_id}}</div>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="sc.inner_sc">内部销售订单</t>
        <template slot-scope="{row}" v-if="row.trade_type === 'external'">
          <div class="a-link" @click="viewSc(row)">{{ row.rpt_sc_no || "-" }}</div>
        </template>
      </x-table-column>
      <x-table-column prop="x_rpt_cust_com_id">
        <t slot="header" path="sc.inner_cust">内部客户</t>
        <template slot-scope="{row}" v-if="row.trade_type === 'external'">
          <div>{{ row.x_rpt_cust_com_id}}</div>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="sc.valid_date">生效日期</t>
        <template slot-scope="{row}">
          <div>{{ row.valid_date | timeFormat('YYYY-MM-DD') }}</div>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="sc.busi_user_create">业务员/创建</t>
        <template slot-scope="{row}">
          <div>{{ $tt(row, 'x_busi_user') }}</div>
          <div>{{ row.create_date | timeFormat }}</div>
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
      billStatus,
      datas: [],
      searchVm: {
        page_index: 1,
        page_size: 15,
        busi_group_id: '',
        busi_user: '',
        bill_kind: 'SC',
        trade_type: 'external',
        bill_type: 'PI',
        ship_status: '',
        founder: '',
        valid_date_start: null,
        valid_date_end: null,
        shipment_date_start: null,
        shipment_date_end: null,
        seller_id: '',
        buyer_id: '',
        is_related: 'yes',
      },
      orderTypes: [
        {
          key: '',
          text: '全部',
          text_en: 'All',
        },
        {
          key: 'external',
          text: '对外销售',
          text_en: 'External',
        },
        {
          key: 'internal',
          text: '对内销售',
          text_en: 'Internal'
        },
      ],
      searchParts: [
        {part: 'select-our-com', span: 12, field: 'seller_id', label: '销售方', key: 'sc.seller'},
        {part: 'select-cust-com', span: 12, field: 'buyer_id', label: '客户', key: 'sc.buyer', cust_type: '2'},
        {part: 'select-date-range', span: 12, field: 'valid_date_start', field2: 'valid_date_end', label: '签约日期', key: 'sc.valid_date'},
      ]
    }
  },
  methods: {
    getStatus,
    async getDatas (i) {
      this.searchVm.page_index = typeof i === 'number' ? i : 1
      let para = {...this.searchVm}
      let v = await this.$get('/api/business/billSearch', para._trim())
      this.datas = v.pi_contracts
      if ('count' in v) this.searchVm.count = v.count
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
    viewPu (v) {
      this.$tab.open({
        title: v.rpt_pu_no,
        tab_id: v.rpt_pu_id,
        path: 'PuEdit',
        query: {
          bill_id: v.rpt_pu_id
        }
      })
    },
    viewSc (v) {
      this.$tab.open({
        title: v.rpt_sc_no,
        tab_id: v.rpt_sc_id,
        path: 'ScEdit',
        query: {
          bill_id: v.rpt_sc_id
        }
      })
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
