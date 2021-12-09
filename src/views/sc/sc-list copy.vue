<template>
  <div class="pi-list">
    <div class="tab-page-header">
      <el-menu :default-active="searchVm.ship_status" mode="horizontal" @select="handleSelect" class="fixed-top">
        <el-menu-item v-for="(item) in filterStatus" :key="item.en" :index="item.status">
          {{$t(item.key)}}({{statusCount[item.status || 'all'] || 0}})
        </el-menu-item>
      </el-menu>
      <more-search
        :parts="searchParts"
        :vm="searchVm"
        @confirm="getDatas()"
        @reset="getDatas()">
        <div class="flex-b mt10">
          <div class="h-left">
            <select-group-user :result="searchVm" field="busi_group_id" field2="busi_user" @change="getDatas" ></select-group-user>
            <x-select :result="searchVm" field="founder" @change="getDatas" :source="orderTypes" :map="{label: 'text', value: 'key'}" class="ml10"></x-select>
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
            <!-- <el-button type="primary" @click="onAdd()">{{$t('add')}}</el-button> -->
          </div>
        </div>
      </more-search>
    </div>

    <x-table :data="datas" :page="searchVm" @page-change="getDatas" rowKey="contract_id">
      <x-table-column>
        <t slot="header" path="sc.order">订单</t>
        <template slot-scope="{row}">
          <div class="a-link" @click="viewDetail(row)">{{ row.contract_no || "-" }}</div>
          <div class="flex between middle wrap">
            <span class="text-grey">{{row.create_date | timeFormat}}</span>
            <span class="bill-status" :class="row.show_status">{{row.show_status | billStatus}}</span>
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
        <template slot-scope="{row}">
          <span class="a-link" v-if="row.bill_status==='finish' || row.bill_status==='normal'" @click="onCopy(row)">翻单</span>
        </template>
      </x-table-column>
    </x-table>
  </div>
</template>

<script>
export default {
  options: {
    icon_text: 'List'
  },
  components: {
  },
  data() {
    return {
      datas: [],
      filterStatus: [
        {
          key: 'sc.all_orders',
          status: '',
        },
        {
          key: 'sc.to_be_ship',
          status: 'unship',
        },
        {
          key: 'sc.ship_part',
          status: 'shipping',
        },
        {
          key: 'sc.shipped',
          status: 'shipped',
        }
      ],
      searchVm: {
        page_index: 1,
        page_size: 15,
        busi_group_id: '',
        busi_user: '',
        bill_kind: 'SC',
        trade_type: '',
        bill_type: 'PI',
        need_prod: 1,
        ship_status: '',
        founder: '',
        valid_date_start: null,
        valid_date_end: null,
        shipment_date_start: null,
        shipment_date_end: null,
        seller_id: '',
        buyer_id: '',
        bill_status: 'normal',
        need_stats: 'yes' // 是否需要统计各状态数量
      },
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
      searchParts: [
        {part: 'select-our-com', span: 12, field: 'seller_id', label: '销售方', key: 'sc.seller'},
        {part: 'select-cust-com', span: 12, field: 'buyer_id', label: '客户', key: 'sc.buyer', cust_type: '2'},
        {part: 'select-date-range', span: 12, field: 'valid_date_start', field2: 'valid_date_end', label: '签约日期', key: 'sc.valid_date'},
        {part: 'select-date-range', span: 12, field: 'shipment_date_start', field2: 'shipment_date_end', label: '计划出运日期', key: 'sc.shipment_date'},
      ],
      statusCount: {}
    }
  },
  methods: {
    async getDatas (i) {
      this.searchVm.page_index = typeof i === 'number' ? i : 1
      let para = {...this.searchVm}
      let v = await this.$get('/api/business/billSearch', para._trim())
      this.datas = v.pi_contracts
      if ('count' in v) this.searchVm.count = v.count
      this.statusCount = {...v.counts, all: v.count}
      let counts = v.counts || {}
      this.statusCount.all = (counts.unship || 0) + (counts.shipping || 0) + (counts.shipped || 0)
    },
    handleSelect (status) {
      this.searchVm.ship_status = status
      this.getDatas()
    },
    getStatus ({vend_busi_status: vend, buy_busi_status: buy}) {
      // if (vend === 'open' && buy === 'open') return 'sc.'
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
    async onCopy (item) {
      await this.$confirm('确定翻单？', this.$t('dialog_tip'), {type: 'warning'})
      let v = await this.$get2('/api/business/redoContract', {contract_id: item.bill_id})
      this.viewDetail(v.pi_contract)
      this.getDatas()
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
