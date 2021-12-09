<template lang="html">
  <div class="order-status-list">
    <more-search
      class="tab-page-header mt10"
      :parts="searchParts"
      :vm="searchModel"
      @confirm="refresh"
      @reset="refresh"
      >
      <div class="flex-b">
        <div class="h-left">
          <el-button type="primary" class="more--btn">More</el-button>
        </div>
        <div class="h-right">
          <el-button type="primary" @click="onDownload()">{{$t('download')}}</el-button>
          <el-button type="primary" @click="refresh()">{{$t('refresh')}}</el-button>
        </div>
      </div>
    </more-search>
    <x-table :data="datas">
      <x-table-column>
        <t slot="header" path="sc.month">Month</t>
        <div slot-scope="{row}">
          <div>{{row.month}}</div>
        </div>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="sc.new_orders_amount">New Orders Amount</t>
        <div slot-scope="{row, $index}">
          <span class="a-link line-2" @click="onOpenShippingPlan(row, $index, 'create_date', {title: 'NOA_'+row.month, panel_name: 'New Orders Amount '+row.month})" v-if="$index !== datas.length - 1">{{((row.new_orders_amount || 0) * 1.0).fthousands(0)}}</span>
          <span v-else>{{((row.new_orders_amount || 0) * 1.0).fthousands(0)}}</span>
        </div>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="sc.sales_monthly_shipping_plan">Sales Monthly Shipping Plan</t>
        <div slot-scope="{row, $index}">
          <span class="a-link line-2" @click="onOpenShippingPlan(row, $index, 'etd_date', {title: 'SMSP_'+row.month, panel_name: 'Sales Monthly Shipping Plan '+row.month})" v-if="$index !== datas.length - 1">{{((row.sales_monthly_shipping_plan || 0) * 1.0).fthousands(0)}}</span>
          <span v-else>{{((row.sales_monthly_shipping_plan || 0) * 1.0).fthousands(0)}}</span>
        </div>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="sc.sales_shipped_amount">Sales Shipped Amount</t>
        <div slot-scope="{row, $index}">
          <span class="a-link line-2" @click="onOpenShippingPlan(row, $index, 'shipment_date', {searchModel: {is_bl: 'yes'}, title: 'SSA_'+row.month, panel_name: 'Sales Shipped Amount '+row.month})" v-if="$index !== datas.length - 1">{{((row.sales_shipped_amount || 0) * 1.0).fthousands(0)}}</span>
          <span v-else>{{((row.sales_shipped_amount || 0) * 1.0).fthousands(0)}}</span>
        </div>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="sc.sales_outstanding_amount">Sales Outstanding Amount</t>
        <div slot-scope="{row, $index}">
          <span class="a-link line-2" @click="onOpenShippingPlan(row, $index, 'etd_date', {searchModel: {is_bl: 'no'}, title: 'SOA_'+row.month, panel_name: 'Sales Outstanding Amount '+row.month})" v-if="$index !== datas.length - 1">{{((row.sales_outstanding_amount || 0) * 1.0).fthousands(0)}}</span>
          <span v-else>{{((row.sales_outstanding_amount || 0) * 1.0).fthousands(0)}}</span>
        </div>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="sc.with_so">With SO</t>
        <div slot-scope="{row, $index}">
          <span class="a-link line-2" @click="onOpenShippingPlan(row, $index, 'etd_date', {searchModel: {is_bl: 'no', is_stock: 'yes'}, title: 'WSO_'+row.month, panel_name: 'With SO '+row.month})" v-if="$index !== datas.length - 1">{{((row.with_so || 0) * 1.0).fthousands(0)}}</span>
          <span v-else>{{((row.with_so || 0) * 1.0).fthousands(0)}}</span>
        </div>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="sc.without_so">Without SO</t>
        <div slot-scope="{row}">
          {{((row.without_so || 0) * 1.0).fthousands(0)}}
        </div>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="sc.po_monthly_shipping_plan">PO Monthly Shipping Plan</t>
        <div slot-scope="{row}">
          {{((row.po_monthly_shipping_plan || 0) * 1.0).fthousands(0)}}
        </div>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="sc.po_shipped_amount">PO Shipped Amount</t>
        <div slot-scope="{row}">
          {{((row.po_shipped_amount || 0) * 1.0).fthousands(0)}}
        </div>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="sc.po_outstanding_amount">PO Outstanding Amount</t>
        <div slot-scope="{row}">
          {{((row.po_outstanding_amount || 0) * 1.0).fthousands(0)}}
        </div>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="sc.shipped_amount_gm">Shipped Amount GM</t>
        <div slot-scope="{row}">
          {{((row.shipped_amount_gm || 0) * 1.0).fthousands(2)}}%
        </div>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="sc.outstanding_gm">Outstanding GM</t>
        <div slot-scope="{row}">
          {{((row.outstanding_gm || 0) * 1.0).fthousands(2)}}%
        </div>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="sc.to_supply_amount">To Supply Amount</t>
        <div slot-scope="{row, $index}">
          <span class="a-link line-2" @click="onOpenShippingPlan(row, $index, 'create_date', {title: 'TSA_'+row.month, panel_name: 'To Supply Amount '+row.month})" v-if="$index !== datas.length - 1">{{((row.to_supply_amount || 0) * 1.0).fthousands(0)}}</span>
          <span v-else>{{((row.to_supply_amount || 0) * 1.0).fthousands(0)}}</span>
        </div>
      </x-table-column>
    </x-table>
    <div class="mt10" v-if="datas.length">
      <el-form label-width="300px" >
        <el-form-item>
          <t slot="label" path="sc.total_new_orders_amount" colon align="right">Total new orders amount</t>
          <div class="lh-30">{{ ((datas[datas.length - 1].new_orders_amount || 0) * 1.0).fthousands(0) }}</div>
        </el-form-item>
        <el-form-item>
          <t slot="label" path="sc.total_shipped_amount" colon align="right">Shipped amount</t>
          <div class="lh-30">{{ ((datas[datas.length - 1].sales_shipped_amount || 0) * 1.0).fthousands(0) }}</div>
        </el-form-item>
        <el-form-item>
          <t slot="label" path="sc.total_outstanding_amount" colon align="right">Outstanding amount of shipping plan</t>
          <div class="lh-30">{{ ((datas[datas.length - 1].sales_outstanding_amount || 0) * 1.0).fthousands(0) }}</div>
        </el-form-item>
        <el-form-item>
          <t slot="label" path="sc.total_bs_ratio" colon align="right">B/S ratio</t>
          <div class="lh-30">{{ (((datas[datas.length - 1].new_orders_amount || 0) * 1.0) / ((datas[datas.length - 1].sales_shipped_amount || 0) * 1.0)).fthousands(2) }}</div>
        </el-form-item>
        <el-form-item>
          <t slot="label" path="sc.total_profit_margin" colon align="right">Total profit margin</t>
          <div class="lh-30">{{ (((((datas[datas.length - 1].sales_monthly_shipping_plan || 0) * 1.0)-((datas[datas.length - 1].po_monthly_shipping_plan || 0) * 1.0))/((datas[datas.length - 1].sales_monthly_shipping_plan || 0) * 1.0)) * 100).fthousands(2) }}%</div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import moment from 'dayjs'
export default {
  data () {
    return {
      searchModel: {
        x_searchLast: 0,
        page_index: 1,
        page_size: 10,
        com_legals: [],
        busi_group_ids: [],
        busi_users: [],
        buyer_ids: [],
        currency: 'USD',
        start_month: '',
        end_month: '',
        trade_type: '',
        is_delivery: '',
        is_order: ''
      },
      datas: [],
      searchParts: [
        {part: 'select-our-com', span: 12, multiple: true, field: 'com_legals', label: "销售方", key: "com_legal"},
        {part: 'select-cust-com', span: 12, multiple: true, custType: '2', field: 'buyer_ids', label: '客户', key: "buyer"},
        {part: 'select-group', span: 12, multiple: true, field: 'busi_group_ids', label: '工作组', key: "stats.busi_group"},
        {part: 'select-staff', span: 12, multiple: true, field: 'busi_users', label: '业务员', key: "busi_user"},
        // {part: 'select-date-range', span: 12, field: 'start_month', field2: 'end_month', label: '日期', key: 'date'},
        {part: 'select-date', span: 12, field: 'start_month', label: '开始日期', key: 'sc.start_month', type: 'month'},
        {part: 'select-date', span: 12, field: 'end_month', label: '结束日期', key: 'sc.end_month', type: 'month'},
        {part: 'select-currency', span: 12, field: 'currency', label: '统计币种', clearable: false, key: "stats.currency"},
        {part: 'select-trade-type', span: 12, field: 'trade_type', label: '交易类型', key: "stats.trade_type"},
      ]
    }
  },
  methods: {
    initialize () {
      this.refresh()
    },
    refresh () {
      console.log(this.searchModel)
      let search = this.$h.cloneDeep(this.searchModel)._trim()
      if (search.start_month && search.start_month !== '') {
        search.start_month = moment(this.searchModel.start_month).format("YYYYMM")
      }
      if (search.end_month && search.end_month !== '') {
        search.end_month = moment(this.searchModel.end_month).format("YYYYMM")
      }
      this.$get('/api/business/queryOrderStatus', search).then(data => {
        this.datas = data.datas
      })
    },
    onOpenShippingPlan (row, index, field, param) {
      let searchModel = this.$h.cloneDeep(this.searchModel)._trim()
      searchModel[field + '_end'] = new Date(moment(row.month, 'YYYYMM').endOf('month'))
      if (index !== 0) {
        searchModel[field + '_start'] = new Date(moment(row.month, 'YYYYMM').startOf('month'))
      }
      searchModel = Object.assign(searchModel, param.searchModel)
      searchModel.is_delivery = ""
      searchModel.is_order = ""
      this.$tab.open({
        title: '销售明细',
        tab_id: param.title || 'OrderList',
        path: 'ShippingPlanList',
        query: {
          search: searchModel,
          colKey: 'stats_pm_prod_table_header'
        }
      })
    },
    onDownload () {
      console.log(this.searchModel)
      let search = this.$h.cloneDeep(this.searchModel)
      if (search.start_month && search.start_month !== '') {
        search.start_month = moment(search.start_month).format("YYYYMM")
      }
      if (search.end_month && search.end_month !== '') {
        search.end_month = moment(search.end_month).format("YYYYMM")
      }
      let v = {
        field: 'stats_preview',
        bill_id: 'stats_preview',
        ...search._trim()
      }
      console.log('v', v)
      this.$post('/x/r.json', v, {loading: true}).then(data => {
        this.$h.download(data.url.replace('.json', '.xlsx'), '订单状态-' + new Date().getTime() + '.xlsx')
      })
    }
  },
  created () {
    this.initialize()
  }
}
</script>
