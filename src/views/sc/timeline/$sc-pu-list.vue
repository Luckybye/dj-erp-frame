<template lang="html">
  <div class="sc-pu-list">
    <div class="tab-page-header">
      <span class="left-border-title">{{$t('cmpt.'+componentName)}}</span>
    </div>
    <x-fold :show="!!pendProds.length" class="full">
      <div class="flex-b" slot="header">
        <div class="h-left">
          <t path="sc.un_order" class="text-bold">未下单</t>
          ({{pendProds.length}})
        </div>
      </div>
      <x-table :data="pendProds" colKey="sc_pu_prod_table_header">
        <x-table-column  width="80" slot="th_main_pic" slot-scope="{col}">
          <t slot="header" path="title" :vm="col" tt>产品</t>
          <template slot-scope="{row}">
            <x-td-img :src="row.main_pic" width="50px" :zi="row.is_sub_prod === 'yes'"></x-td-img>
          </template>
        </x-table-column>
        <x-table-column width="80" slot="th_action" slot-scope="{col}">
          <t slot="header" path="title" :vm="col" tt>操作</t>
          <div slot-scope="{row}" class="lh-30">
            <div><t class="a-link" path="sc.to_order" @click="onAddPiPuProds(row)">下单</t></div>
            <div v-if="row.inve_quantity>=row.plan_qty"><t class="a-link" path="sc.use_stock" @click="onUseStock(row)">用库存</t></div>
          </div>
        </x-table-column>
      </x-table>
    </x-fold>

    <x-fold class="full mt20" show>
      <div class="flex-row lh-40" slot="header">
        <div class="h-left">
          <span class="">
            <t path="sc.ordered" class="text-bold">已下单</t>
          </span>
          <span v-if="!showPu" class="ml10 text-12">
            <span class="ml20 pointer" v-for="item in prodSources" :key="item.key" @click="tempVm.prod_source=item.key" :class="{'a-link': tempVm.prod_source===item.key}">{{$tt(item, 'text')}}({{getLength(item.field)}})</span>
          </span>
        </div>
        <div class="h-right">
          <el-button type="primary" @click="showPu = true" v-if="!showPu">
            <t path="sc.pu_viewport">采购视图</t>
          </el-button>
          <el-button type="primary" @click="showPu = false" v-else>
            <t path="sc.prod_viewport">商品视图</t>
          </el-button>
        </div>
      </div>

      <keep-alive>
        <x-table :data="puDatas" v-if="showPu" key="puDatas">
          <x-table-column min-width="130">
            <t slot="header" path="sc.pu_order">采购订单</t>
            <template slot-scope="{row}">
              <div class="a-link" @click="viewPuDetail(row)">
                {{ row.purchase_no || '-' }}
              </div>
              <div class="flex between middle">
                <div class="text-grey">{{row.create_date | timeFormat}}</div>
                <span class="bill-status" :class="row.show_status">{{row.show_status | billStatus}}</span>
              </div>
            </template>
          </x-table-column>
          <x-table-column min-width="130" prop="x_seller_id">
            <t slot="header" path="supplier">供应商</t>
          </x-table-column>
          <x-table-column width="" prop="prod_count">
            <t slot="header" path="sc.sku_num">SKU数</t>
          </x-table-column>
          <x-table-column min-width="100" prop="x_contact">
            <t slot="header" path="sc.contact">联系人</t>
          </x-table-column>
          <x-table-column min-width="100">
            <t slot="header" path="sc.busi_user2">跟单员</t>
            <template slot-scope="{row}">
              <div>{{$tt(row, 'x_busi_user')}}</div>
            </template>
          </x-table-column>
          <x-table-column width="">
            <t slot="header" path="sc.lastet_update">最近更新</t>
            <template slot-scope="{row}">
              <div>{{row.update_date | timeFormat}}</div>
            </template>
          </x-table-column>
          <x-table-column width="">
            <t slot="header" path="status">状态</t>
            <template slot-scope="{row}">
              <t :path="getStatus(row).key" :class="'text-' + getStatus(row).class">{{getStatus(row).dflt}}</t>
            </template>
          </x-table-column>
          <x-table-column width="">
            <t slot="header" path="action">操作</t>
            <div slot-scope="{row, $index}" class="lh-30">
              <div><t class="a-link" path="sc.trace_order" @click="onNotice(row)">跟单</t></div>
              <div v-if="row.bill_status.indexOf('open') > -1 && row.show_status!=='auditing'" @click="onDelete(row, $index)"><t class="d-link" path="delete">删除</t></div>
              <span v-if="row.show_status==='auditing'">
                <a class="a-link" target="_bank"
                  :href="`/approve-deatil.html?approve_id=${row.bill_id}&field=approve_purchase`">
                  <t path="sc.view_approve">查看审批</t>
                </a>
              </span>
            </div>
          </x-table-column>
        </x-table>
        <x-table :data="dealtprods2" colKey="sc_pued_prod_table_header" v-else key="dealtprods2">
          <x-table-column  width="80" slot="th_main_pic" slot-scope="{col}">
            <t slot="header" path="title" :vm="col" tt>产品</t>
            <template slot-scope="{row}">
              <x-td-img :src="row.main_pic" width="50px" :zi="row.is_sub_prod === 'yes'"></x-td-img>
            </template>
          </x-table-column>
          <x-table-column width="100" slot="th_sc_pu_link" slot-scope="{col}">
            <t slot="header" path="title" :vm="col" tt>采购订单</t>
            <template slot-scope="{row}">
              <div class="a-link" @click="viewPuDetail(row)" v-if="row.purchase_id">
                {{ row.purchase_no || '-' }}
              </div>
              <div class="text-red text-12" v-if="row.pu_status==='abandon'">
                <t path="sc.abandoned">已作废</t>
              </div>
            </template>
          </x-table-column>
        </x-table>
      </keep-alive>
    </x-fold>
  </div>
</template>
<script>
import Vue from 'vue'
export default {
  data() {
    return {
      dealtprods: [],
      pendProds: [],
      showPu: false,
      puDatas: [],
      prodSources: [
        // {key: '', text: '全部', text_en: 'all'},
        {key: 'purchase', text: '采购', text_en: 'Purchase', field: 'dealtprods'},
        {key: 'inventory', text: '库存', text_en: 'Inventory', field: 'stockProds'},
        {key: 'undo', text: '不处理', text_en: 'Undo', field: 'undoProds'}
      ],
      tempVm: {prod_source: 'purchase'},
      stockProds: [],
      undoProds: [],
    }
  },
  computed: {
    dealtprods2 () {
      let s = this.tempVm.prod_source
      if (s === 'inventory') return this.stockProds
      if (s === 'undo') return this.undoProds
      return this.dealtprods
    }
  },
  methods: {
    async initialize () {
      this.queryPuOrders()
      this.billSearch()
      this.queryBillProdList()
    },
    async queryPuOrders () {
      // prod_source: 'purchase'
      console.log(this.payload, 'this.payloadthis.payload')
      let para = {contract_id: this.payload.bill_id}
      if (this.payload.make_id) para = {make_id: this.payload.make_id}
      let v = await this.$get('/api/business/queryPuOrders', para)
      v = v.pu_orders || []
      this.dealtprods = []
      this.pendProds = []
      v.forEach(m => {
        if (!m.purchase_id && m.prod_source === 'purchase') {
          this.pendProds.push(m)
        } else this.dealtprods.push(m)
      })
    },
    async queryBillProdList () {
      let v = await this.$get('/api/business/queryBillProdList', {
        bill_type: 'PI',
        bill_id: this.payload.bill_id,
        need_mg: 1,
        need_suite: 'yes',
      })
      let arr = v.pi_prods.flatMap(f => {
        let suites = f.suites || []
        delete f.suites
        f.plan_qty = f.sell_quantity
        f.quantity = f.sell_quantity
        suites.forEach(m => {
          m.plan_qty = m.sell_quantity
          m.quantity = m.sell_quantity
        })
        if (suites.length) return suites
        return [f]
      })
      this.stockProds = arr.filter(f => f.prod_source === 'inventory')
      this.undoProds = arr.filter(f => f.prod_source === 'undo')
    },
    async billSearch () {
      let para = {
        bill_type: 'PU',
        contract_id: this.payload.bill_id,
        need_prod: 1
      }
      if (!para.contract_id) return
      let v = await this.$get('/api/business/billSearch', para)
      this.puDatas = v.pu_purchases || []
    },
    selectSup (v) {
      this.$dialog.SelectCustCom({pm: {custType: '4'}, vm: {cust_com_id: v.seller_id}}, (d, com) => {
        v.seller_id = d.cust_com_id
        Vue.set(v, 'x_seller_id', com.com_name)
        this.onSave({seller_id: v.seller_id}, v)
      })
    },
    async onSave (v, item) {
      v = {...v, pu_order_id: item.pu_order_id}
      await this.$get('/api/business/updatePuOrder', v)
    },
    onAddPiPuProds (row) {
      let para = {
        make_id: this.payload.make_id,
        contract_id: this.payload.bill_id,
        prod: row,
        pu_currency: this.payload.pu_currency,
        com_legal: this.payload.seller_id,
        page_size: Math.max(this.pendProds.length, 15)
      }
      this.$dialog.SelectPuProd(para, (data) => {
        let v = {
          bill_type: 'PU',
          pi_id: this.payload.bill_id,
          com_legal: this.payload.seller_id,
          ...data
        }
        return this.$pull.preBill(v).then(d => {
          this.initialize()
          this.viewPuDetail(d)
        })
      })
    },
    onUseStock (row) {
      // let para = {
      //   prod_id: row.prod_id,
      //   com_legal: row.com_legal
      // }
      // // this.$request('api/business/queryInveQuntity', para, {loading: true}).then(data => {
      // let text = '当前产品库存量充足，确认则本产品不再采购'
      // // if (data.quantity < row.quantity) {
      // //   this.$message('当前产品库存量不足')
      // //   return
      // // }
      // this.$confirm(text).then(data => {
      //   this.$request('/api/business/userInve4PurOrder', {pu_order_id: row.pu_order_id}).then(res => {
      //     this.queryPuOrders()
      //   })
      // })
      // })
    },
    async onDelete ({purchase_id}, i) {
      await this.$confirm(this.$t('delete_tip'), this.$t('dialog_tip'), {type: 'warning'})
      await this.$post2('/api/business/deleteBill', {
        purchase_id,
        bill_type: 'PU'
      })
      this.datas.splice(i, 1)
    },
    viewPuDetail (v) {
      console.log(v, 'vvvvvvvvvv')
      v.bill_id = v.bill_id || v.purchase_id
      v.bill_no = v.bill_no || v.x_purchase_id || '新建采购'
      this.$tab.open({
        tab_id: v.purchase_id,
        title: v.bill_no,
        path: 'PuEdit',
        query: {
          bill_id: v.bill_id,
          pi_id: this.payload.bill_id || ''
        }
      })
    },
    getStatus ({vend_busi_status: vend, is_plan_delay: delay, is_plan_split: split}) {
      if (vend === 'free') return {key: 'sc.prod_status_unnotice', dflt: '未通知'}
      if (vend === 'pending') return {key: 'sc.prod_status_unreply', dflt: '未回复', class: 'yellow'}
      if (split === 'yes') return {key: 'sc.prod_status_split', dflt: '分批', class: 'orange'}
      if (delay === 'yes') return {key: 'sc.prod_status_delay', dflt: '延期', class: 'orange'}
      if (vend === 'confirmed') return {key: 'sc.prod_status_normal', dflt: '正常', class: 'green'}
      return {}
    },
    onNotice ({bill_id, bill_no}) {
      this.$tab.push('SupConfirmCrd', {bill_id, bill_no})
    },
    getLength (field) {
      return this[field].length
    }
  },
  created() {
    this.initialize()
  },
  beforeDestroy() {}
}
</script>
<style lang="scss">
.sc-pu-list {}
</style>
