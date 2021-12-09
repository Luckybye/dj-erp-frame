<template>
  <div class="sign-contract-list">
    <div class="tab-page-header">
      <more-search
        :parts="searchParts"
        :vm="searchVm"
        confirmChange>
        <div class="flex-b mt10">
          <div class="h-left">
            <el-button type="primary" class="more--btn">More</el-button>
          </div>
          <div class="h-right">
            <x-input
            v-model="searchVm.fuzzy_value"
            :placeholder="$t('pls_input_search_cond')"
            prefix-icon="el-icon-search" width="250px"
            blurChange
            clearable></x-input>
          </div>
        </div>
      <x-select
        slot="select-ship-status"
        label-width="80px"
        width="100%"
        :source="shipStatus"
        :map="{ label: 'text', value: 'value' }"
        :field="'ship_status'"
        :result="vmodel"
        clearable
        slot-scope="{vmodel, change}"
        @save="change"
      ><t slot="label" path="sc.ship_status" colon>发货状态</t></x-select>
      </more-search>
    </div>

    <x-table :data="datas" :page="searchVm" :getData="refresh">
      <x-table-column type="index"></x-table-column>
      <x-table-column>
        <t slot="header" path="sc.order">订单</t>
        <template slot-scope="{row}">
          <div class="a-link" @click="viewDetail(row)">{{ row.contract_no || "-" }}</div>
          <div>
            <span class="bill-status" :class="row.ship_status">{{row.ship_status | billStatus}}</span>
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
          <div>{{ row.currency | currencyFormat }} {{ row.amt1_sell | fthousands }}</div>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="sc.valid_date">签约日期</t>
        <template slot-scope="{row}">
          <div>{{ row.valid_date | timeFormat('YYYY-MM-DD HH:mm') }}</div>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="sc.busi_user_create">业务员/创建</t>
        <template slot-scope="{row}">
          <div>{{ $tt(row, 'x_busi_user') }}</div>
          <div>{{ row.create_date | timeFormat }}</div>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="sc.is_sign">回签状态</t>
        <template slot-scope="{row}">
          <div>{{ row.is_sign === 'yes' ? '已回签' : '未回签' }}</div>
          <div v-if="row.is_sign === 'yes'">{{ row.sign_date | timeFormat }}</div>
        </template>
      </x-table-column>
      <x-table-column width="80">
        <t slot="header" path="action">操作</t>
        <template slot-scope="{row}">
          <el-button type="text" @click="onSign(row)" v-if="row.is_sign!=='yes'">回签</el-button>
          <el-button type="text" @click="onSign(row)" v-else>详情</el-button>
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
      shipStatus: [
        {value: '', text: '所有', text_en: 'All'},
        {value: 'unship', text: '未发货', text_en: 'Unship'},
        {value: 'shipping', text: '部分发货', text_en: 'Shipping'},
        {value: 'shipped', text: '已发货', text_en: 'Shipped'},
      ],
      searchVm: {
        x_searchLast: 0,
        page_index: 1,
        page_size: 15,
        busi_group_id: '',
        busi_user: '',
        trade_type: 'foreign',
        bill_type: 'PI',
        need_prod: 1,
        ship_status: '',
        founder: '',
        valid_date_start: null,
        valid_date_end: null,
        shipment_date_start: null,
        shipment_date_end: null,
        legal_id: '',
        cust_com_id: '',
        bill_status: 'normal',
        is_sign: '',
        sign_date_start: '',
        sign_date_end: '',
      },
      searchParts: [
        {part: 'select-our-com', span: 12, field: 'legal_id', label: '销售方', key: 'sc.seller'},
        {part: 'select-cust-com', span: 12, field: 'cust_com_id', label: '客户', key: 'sc.buyer', cust_type: '2'},
        {part: 'select-group-user', span: 12, field: 'busi_group_id', field2: 'busi_user', label: '工作组', key: "group"},
        {slot: 'select-ship-status', span: 12, field: 'ship_status', label: '发货状态', key: 'sc.ship_status'},
        {part: 'select-date-range', span: 12, field: 'valid_date_start', field2: 'valid_date_end', label: '签约日期', key: 'sc.valid_date'},
        {part: 'select-date-range', span: 12, field: 'shipment_date_start', field2: 'shipment_date_end', label: '计划出运日期', key: 'sc.shipment_date'},
        {part: 'select-yes-no', span: 12, field: 'is_sign', label: '回签状态', key: 'sc.is_sign'},
        {part: 'select-date-range', span: 12, field: 'sign_date_start', field2: 'sign_date_end', label: '回签日期', key: 'sc.sign_date'},
      ],
      statusCount: {}
    }
  },
  methods: {
    async refresh (i) {
      let para = {...this.searchVm}
      let v = await this.$get('/api/business/signContractList', para._trim())
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
    async init () {
      this.searchVm.x_searchLast = 1
    },
    onSign(row) {
      this.$dialog.EditSign({vm: row}, attachment => {
        let is_sign = attachment.files.length ? 'yes' : 'no'
        this.$post2('/api/business/signContract', {is_sign, contract_id: row.bill_id}).then(res => {
          this.searchVm.x_searchLast = 1
        })
      })
    },
  },
  created () {
    this.searchVm = {...this.searchVm, ...(this.payload || {}).search}
    this.init()
  }
}
</script>
