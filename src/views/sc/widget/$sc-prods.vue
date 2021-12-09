<template lang="html">
  <div class="sc-prods">
    <div class="tab-page-header clearfix mb0" v-tr-dom>
      <x-select :result="searchVm" field="prod_status" :source="prodStatus" :map="{label: 'text', label_en: 'text_en', value: 'key'}" class="float-left" width="100px"></x-select>
      <x-input :result="searchVm" field="filter" class="float-left ml10" width="200px" clearable :placeholder="$t('sc.sc_filter_prod_tip')" :title="$t('sc.sc_filter_prod_tip')"></x-input>
      <select-pm-prod :selectdList="scConfig.select_sameprod === 'yes' ? [] : datas" class="float-left ml10" width="250px" @change="v => addBillProd([v])"></select-pm-prod>

      <el-button type="primary" @click="onSort">
        <t path="sort">排序</t>
      </el-button>
      <el-button type="danger" @click="onBatchDelete">
        <t path="batch_delete">批量删除</t>
      </el-button>
      <el-button type="primary" @click="onPriceUpdate(null)">
        <t path="qu.batch_update_price">批量更新价格</t>
      </el-button>
      <el-button type="primary" @click="showProdsView=!showProdsView">
        <t path="change_viewport">切换视图</t>
      </el-button>
      <el-dropdown placement="bottom" @command="handleCommand" class="ml10">
        <el-button type="primary">
          <i class="el-icon-plus"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown" class="text-center">
          <el-dropdown-item command="addProd" v-if="!disabled">
            <el-button type="text">
              <t path="sc.catalog">Catalog</t>
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item command="selectOrder">
            <el-button type="text">
              <t path="qu.ordered">Shipping Plan</t>
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item command="selectQuProd">
            <el-button type="text">
              <t path="qu.quotation">Quotation</t>
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item command="selectCustProd">
            <el-button type="text">
              <t path="qu.customer">Customer</t>
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item command="uploadExcel" v-if="!disabled">
            <el-button type="text">
              <t path="sc.excel">Excel</t>
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item command="addSpareProd" v-if="!disabled">
            <el-button type="text">
              <t path="sc.sparepart">Spare Part</t>
            </el-button>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- <span class="ml10">{{payload.bill_no}}</span> -->
    </div>

    <sc-prod-list v-if="showProdsView" :datas="datas2" :payload="payload" :disabled="disabled" :mgCharge="mgCharge" ref="prodTables" :scConfig="scConfig" @refresh="getDatas({loading: false})"></sc-prod-list>

    <template v-else>
      <el-collapse v-model="openedSups" :accordion="accordion">
        <el-collapse-item v-for="item in supGroups" :key="item.seller_id || 1" :name="item.seller_id || 1">
          <span slot="title" class="sup-info" @click.stop>
            <span class="text-bold a-link" style="width:25%" @click="viewSup(item)">{{item.x_seller_id || '—'}}</span>
            <span style="width:100px"><t path="sku" colon>SKU:</t> {{item.prods.length}}</span>
            <t  style="width:100px" :path="getStatus(item).key" :class="'text-' + getStatus(item).class">{{getStatus(item).dflt}}</t>
            <span style="width:25%">
              <div><t path="sc.sup_contact" colon>供方联系人:</t> {{item.x_contact}}</div>
              <div><t path="sc.busi_user2" colon>跟单员:</t> {{$tt(item, 'x_busi_user')}}</div>
            </span>
            <span style="width:150px">
              <div><t path="sc.notice" colon>notice:</t> {{ item.publish_date | timeFormat }}</div>
              <div><t path="sc.reply" colon>reply:</t> {{ item.receive_date | timeFormat }}</div>
            </span>
            <span class="a-link text-right" style="width:60px">
              <span v-if="item.seller_id">
                <t path="notice" @click="onNotice(item)" v-if="!item.is_pu">通知</t>
                <t path="view" @click="onNotice(item, 'view')" v-else>查看</t>
              </span>
              <!-- <t path="sc.send_mail" @click="sendMail(row)" v-if="!item.is_pu">通知</t> -->
            </span>
          </span>
          <sc-prod-list :datas="item.prods" :payload="payload" :disabled="disabled" @refresh="getDatas({loading: false})" ref="prodTables" :mgCharge="mgCharge" :scConfig="scConfig"></sc-prod-list>
        </el-collapse-item>
      </el-collapse>
      <div class="nodata" v-if="!supGroups.length">{{$t('nodata')}}</div>
    </template>

  </div>
</template>
<script>
import prodMixins from './sc-prods-mixins'
const prodStatus = [
  {
    key: '',
    text: '全部',
    text_en: 'All',
    filter: v => true
  },
  {
    key: 'delay',
    text: '延期',
    text_en: 'Delay',
    filter: v => v.is_plan_delay === 'delay'
  },
  {
    key: 'split',
    text: '分批',
    text_en: 'In Batches',
    filter: v => v.is_plan_split === 'yes'
  },
  {
    key: 'normal',
    text: '正常',
    text_en: 'Normal',
    filter: v => v.is_plan_delay !== 'delay' && v.is_plan_split !== 'yes'
  },
]
export default {
  mixins: [prodMixins],
  data() {
    return {
      datas: [],
      puDataMap: {},
      mgCharge: {},
      showProdsView: true, // 默认产品视图
      openedSups: [],
      searchVm: {prod_status: '', filter: ''},
      prodStatus,
      prodStatusMap: prodStatus._object('key'),
      scConfig: {},
    }
  },
  components: {
    ScProdList: require('./sc-prod-list.vue').default
  },
  computed: {
    disabled () {
      return this.payload.bill_status === 'normal' || this.payload.buy_busi_status === 'submit' || this.payload.audit_status === 'auditing'
    },
    datas2 () {
      let state = this.searchVm.prod_status
      let filter = this.searchVm.filter
      if ((!state || !this.prodStatusMap[state]) && !filter) return this.datas
      let fun = this.prodStatusMap[state].filter
      return this.datas.filter(f => {
        let isExit = false
        if (filter) {
          let text = [f.prod_name_en, f.prod_name, f.model, f.prod_no, f.cust_prod_no, f.supplier_no, f.x_seller_id, f.original_prod_no].join('~')
          let reg = new RegExp(filter, 'i')
          isExit = reg.test(text)
        }
        return fun(f) &&
          ((filter && isExit) || !filter)
      })
    },
    supGroups () {
      let obj = {}
      for (let i = 0; i < this.datas2.length; i++) {
        const m = this.datas2[i];
        const k = m.seller_id || 'no_pu'
        if (!obj[k]) {
          let {x_seller_id, seller_id} = m
          let {publish_date, receive_date, x_contact, x_busi_user, x_busi_user_en, bill_id, vend_busi_status = 'free', is_plan_delay, is_plan_split} = (this.puDataMap[k] || {})
          let extend = {vend_busi_status, x_seller_id, is_plan_delay, is_plan_split, seller_id, publish_date, receive_date, x_contact, x_busi_user, x_busi_user_en, bill_id}
          obj[k] = {is_pu: true, ...extend, prods: []}
        }
        // obj[k].sku += m.sell_quantity
        obj[k].is_pu &= (!!m.purchase_id)
        obj[k].prods.push(m)
      }
      let noPu = obj.no_pu
      delete obj.no_pu
      let arr = Object.values(obj)
      arr.sort((a, b) => a.x_seller_id > b.x_seller_id ? -1 : 1)
      if (noPu) arr.unshift(noPu)
      return arr
    },
    accordion () {
      return this.supGroups.length > 5
    }
  },
  watch: {
    actived (n) {
      // console.log(n, 'nnnnnnn')
      if (n) this.tabShow()
    }
  },
  methods: {
    async initialize () {
      this.getDatas()
      this.billSearch()
      this.getDiscount()
      this.getScConfig()
    },
    async getDatas (opt) {
      let para = {
        bill_type: 'PI',
        bill_id: this.payload.bill_id,
        need_mg: 1,
        need_nature: 'yes',
        need_suite: 'yes'
      }
      let v = await this.$get('/api/business/queryBillProdList', para._trim(), {...opt})
      this.datas = (v.pi_prods || []).map((m, i) => {
        let natureMap = (m.natures || [])._object('nature_id')
        delete m.natures
        if (m.is_bom === 'yes') {
          m.seller_id = ''
          m.x_seller_id = ''
        }
        return {
          x_index: i + 1,
          prod_source: '',
          // hasChildren: m.suites && m.suites.length,
          delivery_date: null, etd_date: null, sell_quantity: '', sell_price: '',
          ...m,
          natureMap
        }
      })
      this.$nextTick(() => {
        this.openedSups = this.accordion ? ((this.supGroups[0] || {}).seller_id || 1) : this.supGroups.map(item => item.seller_id || 1)
      })
    },
    async billSearch () {
      if (!this.payload.bill_id) return []
      let para = {
        bill_type: 'PU',
        contract_id: this.payload.bill_id,
        need_prod: 1
      }
      let v = await this.$get('/api/business/billSearch', para._trim(), {loading: false})
      this.puDataMap = (v.pu_purchases || [])._object('seller_id')
    },
    viewSup (item) {
      if (!item.seller_id) return
      this.$tab.open({
        path: 'CustEdit',
        tab_id: item.seller_id,
        title: item.x_seller_id || '供应商',
        query: {
          cust_com_id: item.seller_id,
          cust_type: '4'
        }
      })
    },
    tabShow () {
      this.getDatas({loading: false})
      this.billSearch()
      // console.log('active-tabactive-tabactive-tab')
    },
    getStatus ({vend_busi_status: vend, is_plan_delay: delay, is_plan_split: split}) {
      if (vend === 'free') return {key: 'sc.prod_status_unnotice', dflt: '未通知'}
      if (vend === 'pending') return {key: 'sc.prod_status_unreply', dflt: '未回复', class: 'yellow'}
      if (split === 'yes') return {key: 'sc.prod_status_split', dflt: '分批', class: 'orange'}
      if (delay === 'delay') return {key: 'sc.prod_status_delay', dflt: '延期', class: 'orange'}
      if (delay === 'normal' || delay === 'forward') return {key: 'sc.prod_status_normal', dflt: '正常', class: 'green'}
      if (vend === 'confirmed') return {key: 'sc.prod_status_normal', dflt: '正常', class: 'green'}
      return {}
    },
    async onNotice (row, view) {
      let {x_seller_id, seller_id, contact, busi_user, busi_group_id, bill_id, vend_busi_status} = row
      this.$dialog.SupConfirmCrd({
        vm: {
          x_seller_id, seller_id, contact, busi_user, busi_group_id,
          contract_id: this.payload.bill_id
        },
        prods: row.prods,
        payload: {bill_id, vend_busi_status}
      }, d => {
        this.getDatas({loading: false})
        this.billSearch()
      })
      // this.$tab.push('SupConfirmCrd', {bill_id: row.bill_id})
    },
    async onBatchDelete () {
      let selectArr = this.showProdsView ? [this.$refs.prodTables] : this.$refs.prodTables
      let ids = selectArr.flatMap(m => m.selection).map(m => m.bill_prod_id)
      if (!ids.length) return this.$message(this.$t('pls_select_prod'))
      // let arr = this.checkboxValue
      // if (!arr.length) return this.$message('请选择商品')
      await this.$confirm(this.$t('delete_tip'), this.$t('dialog_tip'), {type: 'warning'})
      await this.$get2('/api/business/deleteBillProds', {bill_prod_ids: ids}, {loading: true})
      this.getDatas({loading: false})
    },
    onPriceUpdate (row) {
      let vm = {
        bill_id: this.payload.bill_id,
        bill_type: 'PI'
      }
      if (row) {
        if (!row.hs_code) {
          this.$message('HSCode is empty!')
          return
        } else if (!row.seller_id) {
          this.$message('Supplier is empty!')
          return
        } else if (!row.pu_price) {
          this.$message('Cost is empty!')
          return
        }
        vm.bill_prod_id = row.bill_prod_id
      } else {
        if (!this.isHaveHSCode()) {
          return
        }
      }
      this.$dialog.ProdPriceUpdate({vm, payload: this.payload}, (data) => {
        this.getDatas()
      })
    },
    isHaveHSCode () {
      let flag = true
      for (var i = 0; i < this.datas.length; i++) {
        let item = this.datas[i]
        if (!item.hs_code) {
          this.$message('HSCode is empty!')
          flag = false
          break
        }
        if (!item.seller_id) {
          this.$message('Supplier is empty!')
          flag = false
          break
        }
        if (!item.pu_price) {
          this.$message('Cost is empty!')
          flag = false
          break
        }
      }
      return flag
    },
  },
  created() {
    this.$tab.on('refresh-prod', this.tabShow)
    this.initialize()
  },
  beforeDestroy() {
    this.$tab.remove('refresh-prod', this.tabShow)
  }
}
</script>
<style lang="scss">
.sc-prods {
  .el-collapse {
    .el-collapse-item__header {
      height: 65px;
      background:rgba(241,243,248,1);
      padding-left: 20px;
      padding-right: 10px;
      .sup-info {
        line-height: 20px;
        flex: 1;
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        margin-right: 30px;
        &>span{
          display: inline-block;
          height: auto;
          margin-right: 20px;
        }
      }
    }
  }
}
</style>
