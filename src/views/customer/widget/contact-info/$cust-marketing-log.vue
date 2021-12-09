<template lang="html">
  <div class="cust-marketing-info">
    <div class="flex-b mb10">
      <div>
        <x-select v-model="searchModel.busi_type" :source="allTypes" :map="{label: 'text', value: 'key'}" @change="queryCustMarketLog"></x-select>
      </div>
      <div v-if="!disabled">
        <el-button @click="m.func" v-for="m in menu" :key="m.title" type="primary">{{m.title}}</el-button>
      </div>
    </div>

    <x-table :data="datas" :page="searchModel" @page-change="queryCustMarketLog">
      <x-table-column>
        <t slot="header" path="cust.event">事件</t>
        <template slot-scope="{row}">
          {{row.comment}}
          <span class="ml20" v-if="row.busi_type === 'record'">
            <i class="el-icon-edit-outline text-17 text-blue" @click="onChangeShorthand(row)" v-if="!disabled"></i>
          </span>
          <span @click="handlerEvent(row)" class="a-link" :class="{'dd-link': disabled}" v-else>{{row.x_show_id || '-'}}</span>
        </template>
      </x-table-column>
      <x-table-column width="150">
        <t slot="header" path="cust.time">时间</t>
        <template slot-scope="{row}">
          {{row.create_date | timeFormat('YYYY-MM-DD HH:mm:ss')}}
        </template>
      </x-table-column>
    </x-table>
  </div>
</template>
<script>
import Auth from '../components/auth-mixins';
export default {
  options: {title: '营销日志'},
  mixins: [Auth],
  data() {
    return {
      menu: [
        {title: '营销', func: this.onChangeMarket},
        {title: '报价', func: this.onQuote},
        {title: '速记', func: this.onChangeShorthand},
        {title: '订单', func: this.onOrder},
        {title: '客户偏好', func: this.viewPreference}
      ],
      allTypes: [
        {text: '全部', key: ''},
        {text: '营销', key: 'edm', fun: this.viewEcatalog},
        {text: '浏览', key: 'browse', fun: this.viewEcatalog},
        {text: '报价', key: 'quote', fun: this.viewQuote},
        {text: '订单', key: 'order'},
        {text: '询价', key: 'inquiry', fun: this.inquiry},
        {text: '速记', key: 'record'}
      ],
      datas: [],
      searchModel: {
        page_size: 15,
        page_inex: 1,
        busi_type: '',
        sell_cust_user_id: ''
      },
    }
  },
  components: {
  },
  computed: {
    disabled () {
      return this.isDisableEdit
    },
  },
  methods: {
    init () {
      this.searchModel.sell_cust_user_id = this.payload.cust_id
      this.getCustInfo()
      this.queryCustMarketLog()
    },
    queryCustMarketLog () {
      let para = {...this.searchModel}._trim()
      this.$get('/api/marking/QueryCustMarketLog', para).then((trace) => {
        let q = trace.cust_market_logs || []
        this.datas = q
      })
    },
    getCustInfo () {
      let {cust_id} = this.payload
      if (!cust_id) return
      this.$pull.queryCustUser({cust_id, need_mg: 1}).then(user => {
        this.vm = {...this.vm, ...user.cust_user}
      })
    },
    handlerEvent (row) {
      let v = this.allTypes.find(f => f.key === row.busi_type)
      if (!v || !v.fun) return
      v.fun(row)
    },
    viewQuote (row) {
      this.$tab.open({
        path: 'QuEdit',
        tab_id: row.show_id,
        title: row.x_show_id || '报价单',
        query: {bill_id: row.show_id}
      })
    },
    inquiry (row) {
      if (!this.disabled) return
      this.$dialog.InquiryDetail({quote_id: row.quote_id}, data => {
        data && this.$tab.open({
          path: 'QuEdit',
          tab_id: data.quote_id,
          title: data.quote_no || '报价单',
          query: {bill_id: data.quote_id}
        })
      })
    },
    viewEcatalog (row) {
      let url = this.getUrl(row.show_id)
      window.open(url)
    },
    getUrl (id) {
      let user = this.$state('me').user_id
      let url = window.location.origin + '/e-catalog.html?catalog_id=' + id
      url = url + `&sharer_id=${user}&last_cm_user=${user}`
      return url
    },
    onChangeMarket () {
      let {user_mail, cust_id, cust_user_id, user_name: cust_name} = this.vm
      let para = {user_mail, cust_id, cust_user_id, cust_name}
      this.$dialog.MarketingCustomerMarket(para, () => {
        this.queryCustMarketLog()
      })
    },
    onQuote () {
      let val = {
        cust_com_id: this.vm.cust_com_id,
        cust_id: this.vm.cust_id,
        seller_id: this.$state('me').legal_id
      }
      return this.$get('/api/marking/createQuote', val, {loading: true}).then((data) => {
        data = data.quotation
        this.queryCustMarketLog()
        this.$tab.open({
          path: 'QuEdit',
          tab_id: data.quote_id,
          title: data.quote_no || '报价单',
          query: {bill_id: data.quote_id}
        })
      })
    },
    onOrder () {
      let val = {
        buyer_id: this.vm.cust_com_id,
        contact: this.vm.cust_id,
        seller_id: this.$state('me').legal_id,
        bill_type: 'PI',
        trade_type: 'foreign'
      }
      return this.$get('/api/business/preBill', val, {loading: true}).then(({bill_id}) => {
        this.$tab.open({
          path: 'ScEdit',
          tab_id: bill_id,
          title: 'Contract',
          query: {bill_id, x_line_type: 'PI'}
        })
      })
    },
    viewPreference () {
      let row = this.vm
      this.$tab.open({
        path: 'CustPreference',
        tab_id: row.cust_id + 'CustPreference',
        title: row.user_name + '偏好',
        query: {
          cust: row, cust_id: row.cust_id, country: this.$state('com').country
        }
      })
    },
    onChangeShorthand (item) {
      let v = {
        record_id: item.show_id,
        cust_type: this.payload.cust_type,
        cust_id: this.vm.cust_id,
        cust_user_id: this.vm.cust_user_id,
        disabled: this.disabled
      }
      this.$dialog.MarketingCustomerShorthand(v, () => {
        this.queryCustMarketLog()
      })
    },
  },
  created () {
    this.init()
  },
  beforeDestroy() {}
}
</script>
