<template lang="html">
  <div class="sc-terms mb30">
    <div class="tab-page-header flex-b fixed-top h-b">
      <div class="h-left lh-30">
        <span class="bill-no">{{vm.bill_no}}</span>
        <span class="ml5">({{vm.x_busi_group_id}}/{{vm.x_busi_user}})</span>
        <span class="text-red ml10" v-if="/abandon/i.test(payload.show_status)">{{$t('sc.abandoned')}}</span>
      </div>
      <div class="h-right">
        <span class="lh-30" v-if="!/abandon/i.test(payload.show_status)">
          <a class="a-link" target="_bank" :href="approveUrl">
            <t path="sc.auditing" v-if="/auditing/i.test(payload.show_status)">审批中</t>
            <t path="sc.view_approve" v-else>查看审批</t>
          </a>
          <el-button type="danger" @click="push2Erp" class="ml10" :disabled="!showPushBtn" v-if="$state('me').isQianCheng">
            推送至畅想
          </el-button>
          <el-dropdown placement="bottom" @command="handleCommand" class="mh10">
            <el-button type="primary" icon="el-icon-more">
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="onRecall" v-if="payload.bill_status === 'normal' && payload.ship_status === 'unship'" >
                <t path="sc.recall">撤销</t>
              </el-dropdown-item>
              <el-dropdown-item command="onAbandon">
                <t path="sc.abandon">作废</t>
              </el-dropdown-item>
              <el-dropdown-item command="onEditBill" v-if="isEdit">
                <t path="edit">修改</t>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
        <el-button type="primary" @click="onShowAnalysis">
          <t path="sc.approve_sc">预审单</t>
        </el-button>
        <el-button type="primary" @click="onPreview">
          <t path="sc.preview">预览</t>
        </el-button>
      </div>
    </div>
    <el-form label-position="left" label-width="90px" class="text-form">
      <el-row type="flex">
        <el-col :span="12">
          <el-form-item>
            <t slot="label" path="sc.buyer" colon>客户:</t>
            <div class="a-link" :class="{'dd-link': payload.isDisabled}" @click="openCustInfo">{{vm.x_buyer_id}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <t slot="label" path="sc.seller" colon>销售方:</t>
            <div>{{vm.x_seller_id_en}}</div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <t slot="label" path="sc.contact" colon>联系人:</t>
            {{custInfo.user_name}} / {{custInfo.user_mail}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <t slot="label" path="sc.busi_user" colon>业务员:</t>
            {{$tt(vm.x_busi_user_en)}} / {{vm.user_mail}}
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item>
            <t slot="label" path="sc.trade_term" colon>贸易条款:</t>
            {{vm.trade_term}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <t slot="label" path="sc.load_port" colon>起运港:</t>
            {{vm.x_load_port_en}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <t slot="label" path="sc.unload_port" colon>目的港:</t>
            {{vm.x_unload_port_en}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="100px">
            <t slot="label" path="sc.tran_type" colon>运输方式:</t>
            {{vm.tran_type}}
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item>
            <t slot="label" path="sc.shipment_date" colon>出运日期:</t>
            {{vm.shipment_date | timeFormat}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <t slot="label" path="sc.cust_po_no" colon>客户PO:</t>
            {{vm.cust_po_no}}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <t slot="label" path="sc.sc_curr" colon>销售币种:</t>
            {{vm.currency}}
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="vm.is_agent === 'yes'">
          <el-form-item>
            <t slot="label" path="sc.operate_fee" colon>操作费:</t>
            {{vm.cust_profit || '-'}}%
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label-width="100px">
            <t slot="label" path="sc.disc_other" colon>折扣/费用:</t>
            {{vm.mg_charge.discount_rate || '-'}}% / {{vm.mg_charge.commission_rate || '-'}}%
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item>
            <t slot="label" path="sc.shipment_range_date" colon>出运时段:</t>
            {{vm.shipment_desc}}
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item>
            <t slot="label" path="sc.pay_cond" colon>付款条件:</t>
            {{vm.mg_payment.text}}
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item>
            <t slot="label" path="sc.remark" colon>订单备注:</t>
            {{vm.remark}}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <x-table :data="datas" colKey="sc_prod_table_header" rowKey="bill_prod_id" :tree-props="treeProps" v-if="datas.length" hasIndex>
      <x-table-column width="50" className="expand-td" label="#">
        <span slot-scope="{ row }">{{row.index}}</span>
      </x-table-column>
      <x-table-column  width="80" slot="th_main_pic" slot-scope="{col}">
        <t slot="header" path="title" :vm="col" tt>产品</t>
        <template slot-scope="{row}">
          <x-td-img :src="row.main_pic" :tao="row.is_bom==='yes'" :zi="row.is_sub_prod === 'yes'" width="50px" @click.native="viewProd(row)"></x-td-img>
        </template>
      </x-table-column>
      <!-- <x-table-column min-width="120">
        <t slot="header" path="sc.desc">描述</t>
        <template slot-scope="{row}">
          <div class="line-2">{{$tt(row, 'prod_name')}}</div>
          <div class="text-grey">{{row.prod_no}}</div>
        </template>
      </x-table-column> -->
      <!-- <x-table-column min-width="100">
        <t slot="header" path="sc.model">型号</t>
        <template slot-scope="{row}">
          <div>{{row.model || '-'}}</div>
          <div class="text-grey">{{row.original_prod_no}}</div>
        </template>
      </x-table-column> -->
      <!-- <x-table-column width="80">
        <t slot="header" path="quantity">数量</t>
        <template slot-scope="{row}">
          {{row.sell_quantity}}
        </template>
      </x-table-column> -->
      <!-- <x-table-column width="80">
        <t slot="header" path="price">价格</t>
        <template slot-scope="{row}">
          {{vm.currency | currencyFormat}}
          {{row.sell_price}}
        </template>
      </x-table-column> -->
      <x-table-column width="100" slot="th_amount" slot-scope="{col}">
        <t slot="header" path="title" :vm="col" tt>金额</t>
        <template slot-scope="{row}">
          {{vm.currency | currencyFormat}}
          {{(row.sell_quantity * row.sell_price || 0).fthousands(2)}}
        </template>
      </x-table-column>
      <!-- <x-table-column width="160">
        <t slot="header" path="sc.etd_d_date">出运日/交货日</t>
        <template slot-scope="{row}">
          <div>{{row.etd_date | timeFormat}}</div>
          <div class="text-grey">{{row.delivery_date | timeFormat}}</div>
        </template>
      </x-table-column> -->
      <x-table-column slot="th_gw_ctn_cbm" slot-scope="{col}">
        <t slot="header" path="title" :vm="col" tt>毛件体</t>
        <div slot-scope="{row}" v-html="getPkgInfo(row)">
        </div>
      </x-table-column>
      <div slot="append" class="text-right lh-30">
        <span class="mr15" v-if="prodTotal.rate > 0">
          <span class="text-main">C{{prodTotal.rate}}: </span>
          <span class="underline">{{payload.currency | currencyFormat}} {{prodTotal.discount.fthousands(2)}}</span>
        </span>
        <span class="mr15" v-if="prodTotal.adjust_fee > 0">
          <t class="text-main" path="sc.adjust" colon>Adjust: </t>
          <span class="underline">{{currency | currencyFormat}} {{prodTotal.adjust_fee.fthousands(2)}}</span>
        </span>
        <t class="text-main" path="sc.total" colon>Total: </t>
        <span>
          <span class="underline mr10">{{prodTotal.qty}} UNITS</span>
          <span class="underline mr10">{{prodTotal.ctn}} CTNS</span>
          <span class="underline mr10">{{prodTotal.cbm.toFixed(3)}} CBM</span>
          <span class="underline mr10">{{payload.currency | currencyFormat}} {{prodTotal.amount.fthousands(2)}}</span>
        </span>
      </div>
    </x-table>
  </div>
</template>
<script>
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
  data() {
    return {
      vm: this.$h.cloneDeep(fmt),
      custInfo: {},
      comInfo: {},
      datas: [],
      treeProps: undefined,
      isEdit: false,
      showPushBtn: false
    }
  },
  computed: {
    approveUrl () {
      return `${window.location.origin}/approve-detail.html?approve_id=${this.payload.bill_id}&field=approve_contract`
    },
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
  },
  methods: {
    async initialize () {
      this.queryBillFullInfo()
      this.queryBillProdList()
      this.getEditStatus()
    },
    async queryBillFullInfo () {
      let v = await this.$get('/api/business/queryBillFullInfo', {
        bill_type: 'PI',
        bill_id: this.payload.bill_id
      })
      this.vm = {...this.vm, ...v.pi_contract}
      this.custInfo = v.cust_user || {}
      this.comInfo = v.cust_company
      this.vm.user_mail = (v.cm_user || {}).user_mail
      this.vm.x_seller_id_en = (v.cm_company || {}).legal_name_en || this.vm.x_seller_id_en
      this.showPushBtn = this.vm.ftp_upload_status === 'open'
    },
    async queryBillProdList () {
      let v = await this.$get('/api/business/queryBillProdList', {
        bill_type: 'PI',
        bill_id: this.payload.bill_id,
        need_mg: 1,
        need_suite: 'yes',
        need_nature: 'yes',
      })
      this.datas = v.pi_prods.map((m, i) => {
        m.natureMap = (m.natures || [])._object('nature_id')
        delete m.natures
        m.index = i + 1
        m.suites && m.suites.forEach((f, ii) => {
          f.index = m.index + '-' + (ii + 1)
        })
        if (!this.treeProps && m.suites && m.suites.length) this.treeProps = {children: 'suites', hasChildren: 'hasChildren'}
        return m
      })
    },
    async onRecall () {
      await this.$confirm(this.$t('sc.recall_sc_tip'), this.$t('dialog_tip'), {type: 'warning'})
      await this.$post2('/api/business/cancelPiContract', {contract_id: this.payload.bill_id})
      this.$tab.refresh(true)
    },
    async onAbandon () {
      await this.$confirm(this.$t('sc.abandon_sc_tip'), this.$t('dialog_tip'), {type: 'warning'})
      await this.$post2('/api/business/abandonBill', {
        bill_type: 'PI',
        bill_id: this.payload.bill_id,
      })
      this.$tab.refresh(true)
    },
    getPkgInfo (row) {
      return (row.mg_pkgs || []).map(m => {
        let pcs = (m.outer_pkg_pcs * 1 || 1) * (m.inner_pkg_pcs * 1 || 1)
        let ctn = Math.ceil(row.sell_quantity / pcs)
        let gws = (m.carton_gw * ctn).toFixed(2) * 1
        let cbms = (m.cbm * ctn).toFixed(3) * 1
        return `${gws} / ${ctn} / ${cbms}`
      }).join('<br>')
    },
    handleCommand (fun) {
      this[fun] && this[fun]()
    },
    onShowAnalysis () {
      let v = {
        ...this.payload,
        filename: 'Approve-' + (this.payload.id_code || this.payload.bill_no),
        url: `/x/r.html?field=bill_approve&bill_id=${this.payload.bill_id}&buyer_id=${this.payload.buyer_id}`,
        isSaveBill: true
      }
      this.$tab.push('BillPreview', v)
    },
    onPreview () {
      let v = {
        ...this.payload,
        filename: 'SC-' + (this.payload.id_code || this.payload.bill_no),
        url: `/x/r.html?field=bill_contract&bill_id=${this.payload.bill_id}`,
        isSaveBill: true
      }
      this.$tab.push('BillPreview', v)
    },
    viewProd (row) {
      this.$tab.open({
        title: row.prod_no,
        tab_id: row.bill_prod_id,
        path: 'OrderEdit',
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
    getEditStatus () {
      this.$request2('/api/business/isBook', {bill_id: this.payload.bill_id, bill_type: 'PI'}).then(data => {
        this.isEdit = !data.is_book
      })
    },
    onEditBill () {
      let vm = this.vm
      this.$dialog.EditScBill({vm}, data => {
        if (!data) return
        let v = {
          contract_id: this.payload.bill_id,
          ...data
        }
        this.$post2('/api/business/updateDonePiContract', v).then(() => {
          this.initialize()
        })
      })
    },
    async push2Erp () {
      await this.$confirm('确定推送到畅想？', this.$t('dialog_tip'), {type: 'warning'})
      await this.$get2('/api/manage/createExpContract', {
        contract_id: this.payload.bill_id,
        ext_type: 'exp_contract'
      })
      this.$message.success('推送成功')
      this.showPushBtn = false
    },
  },
  created () {
    this.initialize()
  },
  beforeDestroy() {}
}
</script>
