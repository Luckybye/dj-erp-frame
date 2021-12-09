<template lang="html">
  <div class="sc-rela-deal mb30">
    <div class="tab-page-header flex-b h-b" v-tr-dom>
      <div class="h-left self-center">
        <span class="left-border-title">{{payload.bill_no}}</span>
      </div>
      <div class="h-right">
        <el-button type="danger" @click="cancelRelaDeal" v-if="!disabled">
          <t path="sc.cancel_rela_deal">取消关联交易</t>
        </el-button>
      </div>
    </div>
    <el-form label-position="left" label-width="100px" class="text-form" v-if="isExternal">
      <div class="rela-box">
        <div class="mb10">
          <span class="text-bold">
            <t path="sc.initial_sc">对外销售订单</t>
            <span class="font-normal a-link ml10" @click="viewSc(vm)">{{vm.contract_no}}</span>
          </span>
        </div>
        <el-row type="flex">
          <el-col :span="12">
            <el-form-item>
              <t slot="label" path="sc.buyer" colon>买方:</t>
              <div class="a-link" @click="openCustInfo">{{vm.x_buyer_id}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <t slot="label" path="sc.seller" colon>卖方:</t>
              <div class="">{{vm.x_seller_id}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <t slot="label" path="currency" colon>币种:</t>
              <div>{{vm.currency}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <t slot="label" path="sc.total_gross_profit" colon>总毛利:</t>
              <span>{{vm.currency | currencyFormat}}{{getGp('all_gp')}}</span>
              <span class="ml30">{{getGp('all_gp_rate')}}%</span>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <div class="flex">
        <div class="rela-box flex-1 mr20">
          <div class="mb10">
            <span class="text-bold">
              <t path="sc.inner_po">内部采购订单</t>
              <span class="font-normal a-link ml10" @click="viewPu">{{relaPu.purchase_no}}</span>
            </span>
          </div>
          <el-row type="flex">
            <el-col :span="24">
              <el-form-item>
                <t slot="label" path="sc.pu_legal" colon>采购法人:</t>
                <div class="">{{vm.x_seller_id}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <t slot="label" path="sc.inner_sup" colon>内部供方:</t>
                <div class="">{{vm.x_rpt_legal_cust_com_id}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <t slot="label" path="sc.inner_deal_curr" colon>内部交易币种:</t>
                <select-currency :result="vm" field="in_currency" width="100px" @save="onSave" :clearable="false" v-if="!disabled"></select-currency>
                <div v-else>{{vm.in_currency}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <t slot="label" path="sc.sale_gross_profit" colon>销售方毛利:</t>
                <span>{{vm.currency | currencyFormat}}{{getGp('sell_gp')}}</span>
                <span class="ml30">{{getGp('sell_gp_rate')}}%</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="rela-box flex-1">
          <div class="mb10">
            <span class="text-bold">
              <t path="sc.inner_sc">内部销售订单:</t>
              <span class="font-normal a-link ml10" @click="viewSc(relaSc)">{{relaSc.contract_no}}</span>
            </span>
          </div>
          <el-row type="flex">
            <el-col :span="24">
              <el-form-item>
                <t slot="label" path="sc.sale_legal" colon>销售法人:</t>
                <select-our-com :result="vm" field="pu_legal_id" width="80%" @save="onSelectLegal" :clearable="false" v-if="!disabled" :optionsMethod="handlerLegalCom"></select-our-com>
                <div class="" v-else>{{vm.x_pu_legal_id}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <t slot="label" path="sc.inner_cust" colon>内部客户:</t>
                <div class="">{{vm.x_rpt_cust_com_id}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <t slot="label" path="sc.ex_pu_curr" colon>对外采购币种:</t>
                <div>{{vm.pu_currency}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <t slot="label" path="sc.pu_gross_profit" colon>采购方毛利:</t>
                <span>{{vm.currency | currencyFormat}}{{getGp('pu_gp')}}</span>
                <span class="ml30">{{getGp('pu_gp_rate')}}%</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>
    <el-form label-position="left" label-width="100px" class="text-form" v-else>

      <div class="flex">
        <div class="rela-box flex-1">
          <div class="mb10">
            <span class="text-bold">
              <t path="sc.inner_sc">内部销售订单</t>
              <span class="font-normal a-link ml10" @click="viewSc(vm)">{{vm.contract_no}}</span>
            </span>
          </div>
          <el-row type="flex">
            <el-col :span="24">
              <el-form-item>
                <t slot="label" path="sc.sale_legal" colon>销售法人:</t>
                <div class="">{{vm.x_seller_id}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <t slot="label" path="sc.inner_cust" colon>内部客户:</t>
                <div class="">{{vm.x_buyer_id}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <t slot="label" path="sc.ex_pu_curr" colon>对外采购币种:</t>
                <div>{{vm.pu_currency}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <t slot="label" path="sc.pu_gross_profit" colon>采购方毛利:</t>
                <span>{{vm.currency | currencyFormat}}{{getGp('pu_gp')}}</span>
                <span class="ml30">{{getGp('pu_gp_rate')}}%</span>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="rela-box flex-1 ml20">
          <div class="mb10">
            <span class="text-bold">
              <t path="sc.inner_po">内部采购订单</t>
              <span class="font-normal a-link ml10" @click="viewPu">{{relaPu.purchase_no}}</span>
            </span>
          </div>
          <el-row type="flex">
            <el-col :span="24">
              <el-form-item>
                <t slot="label" path="sc.pu_legal" colon>采购法人:</t>
                <div class="">{{vm.x_pu_legal_id}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <t slot="label" path="sc.inner_sup" colon>内部供方:</t>
                <div class="">{{vm.x_rpt_cust_com_id}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <t slot="label" path="sc.inner_deal_curr" colon>内部交易币种:</t>
                <div>{{vm.in_currency}}</div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <t slot="label" path="sc.sale_gross_profit" colon>销售方毛利:</t>
                <!-- <span>{{vm.currency | currencyFormat}}{{getGp('sell_gp')}}</span>
                <span class="ml30">{{getGp('sell_gp_rate')}}%</span> -->
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-form>

    <x-table :data="datas" rowKey="bill_prod_id" :tree-props="treeProps" v-if="datas.length">
      <x-table-column width="50" className="expand-td" label="#">
        <span slot-scope="{ row }">{{row.index}}</span>
      </x-table-column>
      <x-table-column  width="80" label="产品">
        <template slot-scope="{row}">
          <x-td-img :src="row.main_pic" :tao="row.is_bom==='yes'" :zi="row.is_sub_prod === 'yes'" width="50px" @click.native="viewProd(row)"></x-td-img>
        </template>
      </x-table-column>
      <x-table-column min-width="120">
        <t slot="header" path="sc.desc">描述</t>
        <template slot-scope="{row}">
          <div class="line-2">{{$tt(row, 'prod_name')}}</div>
          <div class="text-grey">{{row.prod_no}}</div>
        </template>
      </x-table-column>
      <x-table-column min-width="100">
        <t slot="header" path="sc.model">型号</t>
        <template slot-scope="{row}">
          <div>{{row.model || '-'}}</div>
          <div class="text-grey">{{row.original_prod_no}}</div>
        </template>
      </x-table-column>
      <x-table-column width="80">
        <t slot="header" path="quantity">数量</t>
        <template slot-scope="{row}">
          {{row.sell_quantity}}
        </template>
      </x-table-column>
      <x-table-column width="100" label="">
        <span slot="header">
          <t path="sc.sale_price" v-if="isExternal">外销价</t>
          <t path="sc.inner_price" v-else>内部交易价</t>
          ({{vm.currency | currencyFormat}})
        </span>
        <template slot-scope="{row}">
          <x-input :result="row" field="sell_price" width="100%" @save="onSaveProd" v-input="{rule: 'number'}" v-if="!disabled"></x-input>
          <span v-else>{{row.sell_price}}</span>
        </template>
      </x-table-column>
      <x-table-column width="100" label="">
        <span slot="header">
          <t path="sc.pu_price">采购价</t>({{vm.pu_currency | currencyFormat}})
        </span>
        <template slot-scope="{row}">
          <x-input :result="row" field="pu_price" width="100%" @save="onSaveProd" v-input="{rule: 'number'}" v-if="!disabled"></x-input>
          <span v-else>{{row.pu_price}}</span>
        </template>
      </x-table-column>
      <x-table-column width="100" v-if="isExternal">
        <span slot="header">
          <t path="sc.total_gross_profit">总毛利</t>({{vm.currency | currencyFormat}})
        </span>
        <template slot-scope="{row}">
          <div>{{getGp('all_gp', row)}}</div>
          <div class="text-grey">{{getGp('all_gp_rate', row)}}%</div>
        </template>
      </x-table-column>
      <x-table-column width="100" label="" v-if="isExternal">
        <span slot="header">
          <t path="sc.inner_price">内部交易价</t>({{vm.in_currency | currencyFormat}})
        </span>
        <template slot-scope="{row}">
          <x-input :result="row" field="in_price" width="100%" @save="onSaveProd" v-input="{rule: 'number'}" v-if="!disabled"></x-input>
          <span v-else>{{row.in_price}}</span>
        </template>
      </x-table-column>
      <x-table-column width="100" label="" v-if="isExternal">
        <span slot="header">
          <t path="sc.sale_gross_profit">销售方毛利</t>({{vm.currency | currencyFormat}})
        </span>
        <template slot-scope="{row}">
          <div>{{getGp('sell_gp', row)}}</div>
          <div class="text-grey">{{getGp('sell_gp_rate', row)}}%</div>
        </template>
      </x-table-column>
      <x-table-column width="100" label="">
        <span slot="header">
          <t path="sc.pu_gross_profit">采购方毛利</t>({{vm.currency | currencyFormat}})
        </span>
        <template slot-scope="{row}">
          <div>{{getGp('pu_gp', row)}}</div>
          <div class="text-grey">{{getGp('pu_gp_rate', row)}}%</div>
        </template>
      </x-table-column>
    </x-table>
  </div>
</template>
<script>
import GrossProfit from './gross-profit'
let fmt = {
  buyer_id: '',
  contact: '',
  seller_id: '',
  currency: '',
  pu_currency: '',
  trade_term: '',
  tran_type: '',
  load_port: '',
  unload_port: '',
  cust_po_no: '',
  shipment_date: '',
  remark: '',
  account_no: '',
  mg_payment: {
    text: ''
  },
  mg_charge: {
    discount_rate: '', // 明佣
    commission_rate: '' // 暗佣
  },
  mg_main_mark: {
    text: '',
    upload: []
  },
  mg_side_mark: {
    text: '',
    upload: []
  },
}
export default {
  options: {
    icon: 'icon-sc',
    title: '关联交易',
    title_en: 'Related transaction',
  },
  mixins: [GrossProfit],
  data() {
    return {
      vm: this.$h.cloneDeep(fmt),
      datas: [],
      treeProps: undefined,
      relaSc: {},
      relaPu: {}
    }
  },
  computed: {
    prodTotal () {
      let v = {qty: 0, ctn: 0, cbm: 0, amount: 0, discount: 0, rate: 0, adjust_fee: 0}
      v.rate = this.vm.mg_charge.discount_rate || 0
      this.datas.forEach(item => {
        v.qty += ((item.sell_quantity * 1) || 0)
        let a = (((item.sell_quantity * 1 || 0)._mul(item.sell_price) || 0).toFixed(2) * 1)
        v.amount += a
        v.adjust_fee += (item.adjust_fee * 1 || 0)
        v.discount += ((a._mul(v.rate) / 100 || 0).toFixed(2) * 1)
        item.mg_pkgs && item.mg_pkgs.forEach(m => {
          let n = (m.outer_pkg_pcs * 1 || 1) * (m.inner_pkg_pcs * 1 || 1)
          let ctn = Math.ceil(item.sell_quantity / n || 0)
          v.ctn += ctn
          v.cbm += Number((ctn * m.cbm || 0).toFixed(3))
        })
      })
      v.amount = v.amount.toFixed(2) * 1 || 0
      v.discount = v.discount.toFixed(2) * 1 || 0
      // v.adjust_fee = v.adjust_fee.toFixed(2)
      v.amount = v.amount._sub(v.discount)._add(v.adjust_fee)
      return v
    },
    isExternal () {
      return this.vm.trade_type === 'external'
    },
    disabled () {
      return this.payload.bill_status === 'normal' || (this.payload.bill_status !== 'cancel' && this.payload.buy_busi_status === 'submit') || this.payload.audit_status === 'auditing' || (this.payload.bill_status === 'cancel' && !this.terms_editable)
    },
  },
  methods: {
    async initialize () {
      this.queryBillFullInfo()
      this.queryBillProdList()
    },
    async queryBillFullInfo (opt) {
      let v = await this.$get('/api/business/queryBillFullInfo', {
        bill_type: 'PI',
        bill_id: this.payload.rpt_contract_id || this.payload.bill_id
      }, opt)
      this.vm = {...this.vm, ...v.pi_contract}
      this.vm.user_mail = (v.cm_user || {}).user_mail
      this.relaSc = v.rpt_pi_contract || {}
      this.relaPu = v.rpt_pu_purchase || {}
      this.comInfo = v.cust_company || {}
      this.vm.x_seller_id_en = (v.cm_company || {}).legal_name_en || this.vm.x_seller_id_en
      this.vm.x_seller_id = (v.cm_company || {}).legal_name || this.vm.x_seller_id
    },
    async queryBillProdList () {
      let v = await this.$get('/api/business/queryBillProdList', {
        bill_type: 'PI',
        bill_id: this.payload.rpt_contract_id || this.payload.bill_id,
        need_mg: 1,
        need_suite: 'yes',
        need_nature: 'yes',
      })
      this.datas = v.pi_prods.map((m, i) => {
        m.in_price = m.in_price || ''
        m.natureMap = (m.natures || [])._object('nature_id')
        delete m.natures
        m.index = i + 1
        m.suites && m.suites.forEach((f, ii) => {
          f.in_price = f.in_price || ''
          f.index = m.index + '-' + (ii + 1)
        })
        if (!this.treeProps && m.suites && m.suites.length) this.treeProps = {children: 'suites', hasChildren: 'hasChildren'}
        return m
      })
    },
    async cancelRelaDeal () {
      await this.$confirm(this.$t('sc.recall_sc_tip'), this.$t('dialog_tip'), {type: 'warning'})
      await this.$post2('/api/business/canncelRptBill', {bill_id: this.payload.bill_id})
      this.$tab.refresh(true)
    },
    handlerLegalCom (d) {
      return d.filter(f => f.id !== this.vm.seller_id)
    },
    async onSelectLegal (v) {
      await this.onSave(v)
      this.queryBillFullInfo({loading: false})
    },
    onSaveProd (v, {bill_prod_id}) {
      let para = {
        ...v,
        bill_prod_id
      }
      return this.$post('/api/business/updatePiProd', para, {loading: false})
    },
    async onSave (v, opt) {
      let para = {
        bill_id: this.vm.bill_id,
        bill_type: 'PI',
        bill_action: 'bill_edit',
        ...v,
      }
      await this.$post('/api/business/upsertBillMain', para, opt)
    },
    viewProd (row) {
      this.$tab.open({
        title: row.prod_no,
        tab_id: row.bill_prod_id,
        path: 'ScProdEdit',
        query: {
          bill_prod_id: row.bill_prod_id
        }
      })
    },
    openCustInfo () {
      let com = this.comInfo
      this.$tab.open({
        title: com.com_name,
        title_en: com.com_name_en,
        tab_id: com.cust_com_id,
        path: 'CustEdit',
        query: {
          cust_type: '2',
          cust_com_id: com.cust_com_id
        }
      })
    },
    viewPu () {
      let v = this.relaPu
      this.$tab.open({
        title: v.purchase_no,
        tab_id: v.purchase_id,
        path: 'PuEdit',
        query: {
          bill_id: v.purchase_id
        }
      })
    },
    viewSc (v) {
      this.$tab.open({
        title: v.contract_no,
        tab_id: v.contract_id,
        path: 'ScEdit',
        query: {
          bill_id: v.contract_id
        }
      })
    },
  },
  created () {
    this.initialize()
  },
  beforeDestroy() {}
}
</script>

<style lang="scss">
.sc-rela-deal {
  .rela-box {
    padding: 20px;
    border: 1px solid #eee;
    margin-bottom: 20px;
    border-radius: 10px;
  }
}
</style>
