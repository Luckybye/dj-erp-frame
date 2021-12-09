<template>
  <div class="pm-list">
    <more-search
      class="tab-page-header fixed-top"
      :parts="searchParts"
      :vm="searchModel"
      @confirm="refresh()"
      @reset="refresh()">
      <div class="flex-b pv5">
        <div class="h-left">
        </div>
        <div class="h-right">
          <el-button type="primary" @click="onDownload()">Download</el-button>
          <el-button type="primary" class="more--btn">More</el-button>
        </div>
      </div>
      <x-select
        slot="ship-status"
        :source="shipStatus"
        :map="{ value: 'key', label: $i18n.locale === 'cn' ? 'text' : 'text_en', }"
        :result="searchModel"
        field="is_bl"
        clearable
        label-width="80px"
        width="100%"
      ><t slot="label" path="cust_comm.status" colon>Ship Status</t></x-select>
      <x-select
        slot="cust-coms"
        :source="custComs"
        :map="{ value: 'cust_com_id', label: 'x_cust_com_id', }"
        :result="searchModel"
        field="buyer_ids"
        clearable
        label-width="80px"
        width="100%"
        multiple
      ><t slot="label" path="cust_comm.buyer" colon>Buyer</t></x-select>
    </more-search>

    <x-table :data="datas" tooltip-effect="dark" :row-style="getStyle" :page="searchModel" @page-change="refresh" @sort-change="sortChange" :height="height" rowKey="bill_prod_id" :stripe="false">
      <x-table-column width="40" type="index">
      </x-table-column>
      <x-table-column width="120">
        <t slot="header" path="cust_comm.cust_com">Customer</t>
        <div slot-scope="{row}">
            {{row.x_buyer_id}}
        </div>
      </x-table-column>
      <x-table-column width="120">
        <t slot="header" path="cust_comm.sc_no">GHT SC NO.</t>
        <div slot-scope="{row}">
          <el-button type="text" @click="onDownload(row, 'sc')">
            {{row.contract_no}}
          </el-button>
        </div>
      </x-table-column>
      <x-table-column width="150">
        <t slot="header" path="cust_comm.payment">Payment</t>
        <div slot-scope="{row}">{{row.payment_term}}</div>
      </x-table-column>
      <x-table-column width="100" prop="create_date" sortable="custom">
        <t slot="header" path="cust_comm.sc_date">SC Date</t>
        <div slot-scope="{row}">{{row.create_date | timeFormat}}</div>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="cust_comm.po_no">PO NO.</t>
        <div slot-scope="{row}">{{row.cust_po_no}}</div>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="cust_comm.item_no">Cust Item NO.</t>
        <div slot-scope="{row}">{{row.cust_prod_no}}</div>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="cust_comm.item">Item</t>
        <div slot-scope="{row}">{{row.prod_name_en || row.prod_name}}</div>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="cust_comm.unit_price">Unit Price</t>
        <div slot-scope="{row}">{{row.currency | currencyFormat}}{{row.sell_price}}</div>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="cust_comm.quantity">Quantity</t>
        <div slot-scope="{row}">
          <div v-if="row.is_bl === 'no'">{{row.quantity}}</div>
          <div v-else>{{row.load_quantity}}</div>
        </div>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="cust_comm.reorder">Reorder (is this item a reorder)</t>
        <div slot-scope="{row}">{{(row.is_re_order && row.is_re_order === 'yes') ? 'YES' : ''}}</div>
      </x-table-column>
      <x-table-column width="120">
        <t slot="header" path="cust_comm.inv_no">GHT Invoice NO.</t>
        <div slot-scope="{row}">
          <div v-for="item in row.pi_settles" :key="item.settle_id">
            <el-button type="text" @click="onDownload(item, 'inv')">
              {{item.batch_no}}
            </el-button>
          </div>
        </div>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="cust_comm.country">Country</t>
        <div slot-scope="{row}">{{row.x_country_id_en}}</div>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="cust_comm.amount">Amount</t>
        <div slot-scope="{row}">
          <div>{{row.amount}}</div>
        </div>
      </x-table-column>
      <x-table-column prop="shipment_date" sortable="custom" width="100">
        <t slot="header" path="cust_comm.shipment_date">ETD</t>
        <div slot-scope="{row}">{{row.shipment_date | timeFormat}}</div>
      </x-table-column>
      <x-table-column prop="etd_date" sortable="custom" width="130">
        <t slot="header" path="cust_comm.etd_date">Delivery Date</t>
        <div slot-scope="{row}">{{row.etd_date | timeFormat}}</div>
      </x-table-column>
      <x-table-column width="100">
        <t slot="header" path="cust_comm.order_status">Order Status</t>
        <div slot-scope="{row}">
          <div v-if="row.is_bl === 'no'">{{$t('cust_comm.unship')}}</div>
          <div v-else>{{$t('cust_comm.shipped')}}</div>
        </div>
      </x-table-column>
      <x-table-column width="100">
        <t slot="header" path="cust_comm.payment_status">Payment Status</t>
        <div slot-scope="{row}">{{row.payment_status}}</div>
      </x-table-column>
      <x-table-column width="100">
        <t slot="header" path="cust_comm.receive_date">Receive Date</t>
        <div slot-scope="{row}">{{row.acc_pay_date | timeFormat}}</div>
      </x-table-column>
      <x-table-column width="100">
        <t slot="header" path="cust_comm.commission_status">Commission Status</t>
        <div slot-scope="{row}">{{row.commission_status}}</div>
      </x-table-column>
      <x-table-column width="100">
        <t slot="header" path="cust_comm.paid_date">Paid Date</t>
        <div slot-scope="{row}">{{row.commission_pay_date | timeFormat}}</div>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="cust_comm.commission">Commission</t>
        <div slot-scope="{row}">{{row.commission}}</div>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="cust_comm.invoice">Invoice</t>
        <div slot-scope="{row}">{{ row.receive_invoice_date | timeFormat }}</div>
      </x-table-column>
    </x-table>
  </div>
</template>

<script>
let search = {
  page_index: 1,
  page_size: 10,
  com_legals: [],
  buyer_ids: [],
  busi_group_ids: [],
  busi_users: [],
  create_date_start: null,
  create_date_end: null,
  etd_date_start: null,
  etd_date_end: null,
  shipment_date_start: null,
  shipment_date_end: null,
  currency: "USD",
  is_bl: '',
  order_by: 'shipment_date',
  order_type: 'desc',
}
export default {
  options: {
    icon_text: 'Comm'
  },
  components: {},
  data() {
    return {
      datas: [],
      searchModel: this.$h.clone(search),
      parts: [
        {part: 'select-our-com', span: 12, field: 'com_legals', multiple: true, label: "Seller", key: "cust_comm.com_legal", filter: "saas"},
        {part: 'select-cust-com', span: 12, custType: '2', field: 'buyer_ids', multiple: true, label: 'Customer', key: "cust_comm.cust_com", filter: "saas"},
        {part: 'select-group', span: 12, field: "busi_group_ids", multiple: true, label: 'Busi Group', key: "cust_comm.busi_group", filter: "saas"},
        {part: 'select-staff', span: 12, field: "busi_users", multiple: true, label: 'Busi User', key: "cust_comm.busi_user", filter: "saas"},
        {part: 'select-date-range', span: 12, field: 'create_date_start', field2: 'create_date_end', label: 'SC Date', key: 'cust_comm.sc_date', filter: "saas,cust"},
        {part: 'select-date-range', span: 12, field: 'etd_date_start', field2: 'etd_date_end', label: 'Delivery Date', key: 'cust_comm.etd_date', filter: "saas,cust"},
        {part: 'select-date-range', span: 12, field: 'shipment_date_start', field2: 'shipment_date_end', label: 'ETD', key: 'cust_comm.shipment_date', filter: "saas,cust"},
        {slot: 'ship-status', span: 12, field: 'is_bl', label: 'Ship Status', key: "cust_comm.status", filter: "saas,cust"},
        {slot: 'cust-coms', span: 12, field: 'buyer_ids', label: 'Buyer_ids', key: "cust_comm.buyer", filter: "cust"},
      ],
      shipStatus: [
        {text: 'All', text_en: 'All', key: ''},
        {text: 'Shipped', text_en: 'Shipped', key: 'yes'},
        {text: 'Unship', text_en: 'Unship', key: 'no'},
      ],
      custComs: [],
      token: ''
    };
  },
  computed: {
    isSaas () {
      return this.$root.login_domain === 'saas'
    },
    searchParts () {
      return this.parts.filter(m => m.filter && m.filter.indexOf(this.$root.login_domain) >= 0)
    }
  },
  methods: {
    async refresh (i) {
      console.log(this.searchModel)
      this.searchModel.page_index = typeof i === 'number' ? i : 1
      let search = this.$h.clone2(this.searchModel);
      console.log(search)
      search = search._trim();
      console.log(search)
      return this.$get('/api/business/queryCommissionSaas', search).then((d) => {
        this.datas = d.pi_orders;
        if ('count' in d) this.searchModel.count = d.count
        return d;
      });
    },
    async init() {
      this.refresh()
      if (!this.isSaas) {
        this.getCustComList()
      }
    },
    getCustComList () {
      this.$get('/api/system/queryPartner', {user_id: this.$state('me').user_id}).then((d) => {
        let custID = (d.user_partner || {}).cust_id
        this.$get('/api/crm/queryAscription', {cust_id: custID}).then((res) => {
          this.custComs = res.cust_companies || []
          if (d.user_partner) {
            this.custComs.push(d.user_partner)
          }
        })
      })
    },
    sortChange(val) {
      this.searchModel.order_by = val.prop
      if (val.order === 'ascending') {
        this.searchModel.order_type = 'asc'
      } else {
        this.searchModel.order_type = 'desc'
      }
      this.refresh()
    },
    async onDownload (row, type) {
      await this.createAuthToken()
      let field = 'customer_commission'
      let bill_id = 'customer_commission'
      let file_name = '客户佣金表'
      let file_type = 'xlsx'
      let search = this.$h.clone2(this.searchModel);
      let v = {}
      if (row) {
        if (type === 'sc') {
          field = 'bill_contract'
          file_type = 'pdf'
          bill_id = row.contract_id
          file_name = row.contract_no
          v.language = 'en'
        } else if (type === 'inv') {
          field = 'bill_cipl'
          bill_id = row.bookorder_id
          file_name = row.batch_no
          v.cipl_id = row.settle_id
        }
        v.field = field
        v.bill_id = bill_id
        v = v._trim()
        let data = await this.$get('/x/r.json', v, {loading: true})
        let url = data.url.replace('.json', '.' + file_type)
        this.$h.download(url, file_name + '.' + file_type)
      } else {
        delete search.page_index
        delete search.page_size
        // search.token = this.token
        search.ext_type = 'customer_commission'
        v = search
        this.$post('/api/manage/createExpExcell', v).then(res => {
          this.$tab.open({
            title: '下载列表',
            title_en: 'Export list',
            tab_id: 'export_list',
            path: 'ExportList',
          })
        })
      }
      // v.field = field
      // v.bill_id = bill_id
      // v = v._trim()
      // let data = await this.$get('/x/r.json', v, {loading: true})
      // let url = data.url.replace('.json', '.' + file_type)
      // // let url = `/x/r.${file_type}?${Object.entries(v).map(([k, val]) => `${k}=${typeof val === 'string' ? val : JSON.stringify(val)}`).join('&')}`
      // this.$h.download(url, file_name + '.' + file_type)
      // // console.log(url, file_type, file_name)
    },
    async createAuthToken () {
      if (this.token) return
      let v = await this.$get('/api/system/createAuthToken')
      this.token = v.token
    },
    getStyle ({row: {commission_status: status, commission_pay_date: pay_date}}) {
      if (status !== 'Not yet' && !pay_date) {
        console.log('ljj', status, '    ', pay_date)
        return {background: 'rgba(245,34,45,0.15)'}
      }
      return {}
    }
  },
  created() {
    this.height = window.innerHeight - 200
    this.init();
  }
};
</script>
<style lang="scss">
</style>
