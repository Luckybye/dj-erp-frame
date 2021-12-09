<template lang="html">
  <div class="sup-confirm-crd">
    <div class="tab-page-header flex-b" v-tr-dom="{disabled: payload.disable_tr}">
      <div class="h-left">
      </div>
      <div class="h-right" v-if="vm.vend_busi_status === 'pending' && (payload.enable_submit || payload.enable_upload)">
        <el-button type="primary" @click="onUpload()">
          <t path="upload">上传</t>
        </el-button>
        <el-button type="primary" @click="onDownload()">
          <t path="download">下载</t>
        </el-button>
      </div>
    </div>
    <el-form label-position="left" label-width="90px" class="text-form">
      <el-row type="flex">
        <el-col :span="12">
          <el-form-item>
            <t slot="label" path="sc.pu_order_no" colon>采购订单/销售订单:</t>
            {{vm.bill_no}}/{{vm.x_contract_id}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <t slot="label" path="sc.crd_status" colon>交期状态:</t>
            <t :path="getStatus(vm).key">{{getStatus(vm).dflt}}</t>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <t slot="label" path="sc.purchaser" colon>采购方:</t>
            {{$tt(vm, 'x_buyer_id')}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <t slot="label" path="sc.supplier" colon>供应商:</t>
            {{vm.x_seller_id}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <t slot="label" path="sc.busi_user2" colon>跟单员:</t>
            <span v-if="isPu">{{$tt(vm, 'x_busi_user')}}</span>
            <select-group-user :result="vm" field="busi_group_id" field2="busi_user" width="80%" :disabled="disabled" :checkStrictly="false" v-else placeholder=" "></select-group-user>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <t slot="label" path="sc.sup_contact" colon>供方联系人:</t>
            <span v-if="isPu">{{vm.x_contact}}</span>
            <select-contact :pm="{cust_com_id: vm.seller_id}" :result="vm" field="contact" width="80%" :disabled="disabled" v-else-if="vm.seller_id"></select-contact>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item v-if="isDg">
            <t slot="label" path="sc.shipment_date" colon>出运日期:</t>
            {{vm.shipment_date | timeFormat}}
          </el-form-item>
          <el-form-item v-else>
            <t slot="label" path="sc.require_crd" colon>要求交期:</t>
            {{vm.delivery_date | timeFormat}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <t slot="label" path="sc.notice_date" colon>通知日期:</t>
            {{vm.publish_date | timeFormat}}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <t slot="label" path="sc.reply_date" colon>回复日期:</t>
            {{vm.receive_date | timeFormat}}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="text-right mb10">
      <el-button type="primary" @click="onBatchUpdate" v-if="isDg">{{ $t("batch_action") }}</el-button>
      <x-select :result="searchVm" field="prod_status" :source="isDg ? prodStatus2 : prodStatus" :map="{label: 'text', value: 'key'}" class="mr10 ml10" width="100px"></x-select>
      <el-button type="primary" @click="onSort">
        <t path="sort">排序</t>
      </el-button>
    </div>

    <x-table :data="datas2" default-expand-all :row-style="getStyle" :stripe="false" :colKey="isDg ? 'dg_sup_prod_table_header' : 'sup_prod_table_header'" class="have-expand">
      <!-- <x-table-column type="index" width="50">
        <t slot="header" path="no">序号</t>
      </x-table-column> -->
      <x-table-column  width="70" slot="th_main_pic" slot-scope="{col}">
        <t slot="header" path="title" :vm="col" tt>产品</t>
        <template slot-scope="{row}">
          <muti-img :url="row.main_pic" width="50px"></muti-img>
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
      <!-- <x-table-column width="150" prop="supplier_no">
        <t slot="header" path="sc.supplier_no">ERP号</t>
      </x-table-column> -->
      <!-- <x-table-column width="100" :prop="isDg?'quantity':'sell_quantity'">
        <t slot="header" path="sc.require_qty">数量</t>
      </x-table-column> -->
      <!-- <x-table-column width="160" v-if="!isDg">
        <t slot="header" path="prod.etd_date">出运日期</t>
        <template slot-scope="{row}">
          {{ row.etd_date | timeFormat}}
        </template>
      </x-table-column> -->
      <!-- <x-table-column width="160">
        <t slot="header" path="sc.promise_crd">承诺交期</t>
        <template slot-scope="{row}">
          {{(isDg ? (row.crd_date || row.delivery_date) : row.delivery_date) | timeFormat}}
        </template>
      </x-table-column> -->
      <!-- <x-table-column resizable width="100" v-if="isDg">
        <t slot="header" path="sp.stock_process">进度</t>
        <template slot-scope="{row}">
          <div>{{row.x_process_id}}</div>
        </template>
      </x-table-column> -->
      <x-table-column resizable width="100"  slot="th_sc_prod_status" slot-scope="{col}">
        <t slot="header" path="title" :vm="col" tt>状态</t>
        <span slot-scope="{row}" :title="row.delay_desc">
          <t :path="getStatus(row).key">{{getStatus(row).dflt}}</t>
          <div class="line-1 text-grey">{{row.delay_desc}}</div>
        </span>
      </x-table-column>
      <x-table-column width="60" v-if="!disabled && payload.enable_submit" slot="th_action" slot-scope="{col}">
        <t slot="header" path="title" :vm="col" tt>操作</t>
        <div slot-scope="{row}" class="lh-30">
          <div v-if="isDg"><t class="a-link" path="sc.update" @click="updateProdCrd(row)">更新</t></div>

          <div v-else><t class="a-link" path="sc.change" @click="onChange(row)">变更</t></div>
        </div>
      </x-table-column>
      <x-table-column width="1" slot="expand">
        <template slot-scope="{row}">
          <span v-if="row.delay_desc" class="expand-text">{{row.delay_desc}}</span>
        </template>
      </x-table-column>
    </x-table>

    <x-input :result="vm" field="remark" width="100%" type="textarea" label-width="90px" class="mt15" :disabled="disabled" v-if="payload.enable_submit">
      <t slot="label" path="remark" colon>备注:</t>
    </x-input>
    <x-label label-width="90px" class="mt15" v-else>
      <t slot="label" path="remark" colon>备注:</t>
      {{vm.remark}}
    </x-label>

    <div class="text-center fixed-bottom mt20" v-if="!disabled && payload.enable_submit">
      <el-button @click="onConfirm" type="primary">{{ $t("submit") }}</el-button>
    </div>
  </div>
</template>
<script>
// import Vue from 'vue'
const prodStatus = [
  {
    key: '',
    text: '全部',
    text_en: 'All',
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
const prodStatus2 = [
  {
    key: '',
    text: '全部',
    text_en: 'All',
  },
  {
    key: 'delay',
    text: '延期',
    text_en: 'Delay',
    filter: v => v.is_pu_delay === 'delay'
  },
  {
    key: 'normal',
    text: '正常',
    text_en: 'Normal',
    filter: v => v.is_pu_delay !== 'delay'
  },
]
export default {
  props: {
    prods: Array,
    pu: Object
  },
  data() {
    return {
      vm: {remark: '', contact: ''},
      datas: [],
      token: '',
      scInfo: {},
      files: [],
      searchVm: {prod_status: ''},
      prodStatus,
      prodStatus2
    }
  },
  computed: {
    prodStatusMap () {
      if (this.isDg) return this.prodStatus2._object('key')
      return this.prodStatus._object('key')
    },
    disabled () {
      return this.vm.vend_busi_status === 'confirmed' || this.vm.buy_busi_status === 'confirmed' || this.vm.buy_busi_status === 'pending'
    },
    isDg () {
      return this.payload.type === 'dg'
    },
    link () {
      return location.origin + '/#/sup-confirm-crd?bill_id=' + this.payload.bill_id + '&token=' + this.token
    },
    isPu () {
      return (this.payload.bill_id && !this.prods) || (this.prods && this.prods.every(f => f.purchase_id))
    },
    datas2 () {
      let state = this.searchVm.prod_status
      if (!state || !this.prodStatusMap[state]) return this.datas
      let fun = this.prodStatusMap[state].filter
      return this.datas.filter(f => fun(f))
    },
  },
  methods: {
    async initialize () {
      if (this.pu) this.vm = this.pu
      this.getDatas()
      if (!this.payload.bill_id) return
      this.billMainInfo()
    },
    async billMainInfo () {
      if (this.isDg) return this.getDgPuInfo()
      let v = await this.$get('/api/business/billMainInfo', {
        bill_type: 'PU',
        bill_id: this.payload.bill_id
      })
      this.vm = {...this.vm, ...v.pu_purchase}
    },
    async getDgPuInfo () {
      let v = await this.$get('/api/business/queryDeliveryPurInfo', {delivery_purchase_id: this.payload.bill_id}, {loading: false})
      let {x_purchase_id: bill_no, x_legal_id: x_buyer_id, x_legal_id_en: x_buyer_id_en, x_vend_cust_com_id: x_seller_id, x_vend_cust_user_id: x_contact, delivery_id} = v.delivery_purchase
      let extend = {bill_no, x_buyer_id, x_buyer_id_en, x_seller_id, x_contact}
      let v2 = await this.$get2('/api/business/queryDeliveryInfo', {
        delivery_id
      }, {loading: false})
      this.vm = {...this.vm, ...v2.pi_delivery, ...v.delivery_purchase, ...extend}
    },
    getStatus ({vend_busi_status: vend, is_plan_delay: delay, is_pu_delay: delay2, is_plan_split: split, busi_status: busi}) {
      if (busi === 'delete') return {key: 'sc.stop_sell', dflt: '淘汰'}
      if (vend === 'free' || vend === 'open') return {key: 'sc.prod_status_unnotice', dflt: '未通知'}
      if (vend === 'pending') return {key: 'sc.prod_status_unreply', dflt: '未回复'}
      if (delay2 === 'delay') return {key: 'sc.prod_status_delay', dflt: '延期'}
      if (delay === 'delay') return {key: 'sc.prod_status_delay', dflt: '延期'}
      if (split === 'yes') return {key: 'sc.prod_status_split', dflt: '分批'}
      if (vend === 'confirmed') return {key: 'sc.prod_status_normal', dflt: '正常'}
      return {}
    },
    async getDatas () {
      // if (!this.payload.bill_id) return
      if (this.prods) {
        this.datas = this.prods
        return
      }
      if (this.isDg) return this.getDgDatas()
      let para = {
        bill_id: this.payload.bill_id,
      }
      let v = await this.$get('/api/business/queryPuProdList', para._trim())
      this.datas = v.pi_prods
      // if ('count' in v) this.searchVm.count = v.count
    },
    async getDgDatas () {
      let para = {
        delivery_purchase_id: this.payload.bill_id,
        delivery_id: this.payload.delivery_id,
        need_mg: 1
      }
      let v = await this.$get('/api/business/queryDeliveryOrders', para._trim())
      this.datas = v.delivery_orders
    },
    async onConfirm () {
      let flag = true
      this.datas2.forEach(item => {
        if (!item.delivery_date && !this.isDg) flag = false
        if (!item.crd_date && this.isDg) flag = false
      })
      if (!flag) {
        this.$message.warning(this.$t('pls_input_crd_date'))
        return
      }
      let {remark} = this.vm
      let para = {
        bill_id: this.vm.bill_id,
        remark
      }
      let url = '/api/business/vendConfirmed'
      if (this.isDg) {
        url = '/api/business/deliveryendConfirmed'
        para.delivery_purchase_id = this.vm.delivery_purchase_id
      }
      await this.$post2(url, para)
      this.initialize()
    },
    getStyle ({row: {vend_busi_status: vend, is_plan_delay: delay, is_plan_split: split, busi_status: busi, is_pu_delay, is_pu_split}}) {
      if (vend === 'open' || vend === 'free') return {}
      if (busi === 'delete') return {background: 'rgba(24,139,141,.1)'}
      if (split === 'yes' || delay === 'delay') return {background: 'rgba(245,34,45,0.15)'}
      if (is_pu_split === 'yes' || is_pu_delay === 'delay') return {background: 'rgba(245,34,45,0.15)'}
      return {}
    },
    // changeProd (v) {
    //   this.$dialog.ChangeProd({prod: v}, async d => {
    //     await this.$post2('/api/business/replacePiProduct', {...d, bill_prod_id: v.bill_prod_id})
    //     this.getDatas()
    //   })
    // },
    // inBatch (v) {
    //   this.$dialog.PreInBatchProd({order: v}, async d => {
    //     await this.$post('/api/business/prodPlanSplit', {
    //       bill_prod_id: v.bill_prod_id,
    //       ...d
    //     })
    //     this.getDatas()
    //   })
    // },
    updateProdCrd (v) {
      this.$dialog.UpdateProdCrd({vm: {crd_date: v.crd_date || v.delivery_date, reason: v.reason, reason_detail: v.reason_detail, process_id: v.process_id}, show_stock_process: true, sell_com_id: this.vm.sell_com_id}, async d => {
        await this.$post2('/api/business/deliveryDelay', {
          reason: d.reason,
          reason_detail: d.reason_detail,
          delivery_order: [{
            crd_date: d.crd_date,
            bill_prod_id: v.bill_prod_id,
          }],
          process_id: d.process_id
        })
        this.getDatas()
      })
    },
    onBatchUpdate () {
      this.$dialog.UpdateProdCrd({show_stock_process: true, sell_com_id: this.vm.sell_com_id}, async d => {
        await this.$post2('/api/business/editDeliverOrdBatch', {
          reason: d.reason,
          reason_detail: d.reason_detail,
          process_id: d.process_id,
          crd_date: d.crd_date,
          delivery_purchase_id: this.payload.bill_id
        })
        this.getDatas()
      })
    },
    async createAuthToken () {
      if (this.token) return
      let v = await this.$get('/api/system/createAuthToken')
      this.token = v.token
    },
    async copLink () {
      await this.createAuthToken()
      this.$h.copy(this.link)
      this.$message.success('Copy succeeded')
    },
    async sendMail () {
      await this.createAuthToken()
      this.$dialog.SendEmail({
        mail_key: 'notice_sup_confirm_etd',
        vars: {
          user_com_name: this.$state('com').com_name_en,
          link: `<a target="_blank" href="${this.link}">链接</a>`,
          sup_user_name: this.vm.x_seller_id,
          pu_no: this.vm.bill_no
        },
        contact: this.vm.contact,
        user_id: this.vm.busi_user,
        bill: {}
      })

      if (!this.disabled) this.$get('/api/business/sendVendor', {purchase_id: this.payload.bill_id}, {loading: false})
    },
    async onSave (v, row) {
      let para = {
        ...v,
        bill_id: row.purchase_id,
        bill_type: 'PU',
        bill_action: 'bill_edit'
      }
      await this.$post('/api/business/upsertBillMain', para, {loading: false})
    },
    onUpload () {
      this.$dialog.SupConfirmCrdUpload({purchase_id: this.payload.bill_id, isDg: this.isDg}, res => {
        this.getDatas()
      })
    },
    onDownload () {
      let field = 'sup_crd'
      let file_name = '供方交期确认'
      if (this.isDg) {
        field = 'cargo_confirm'
        file_name = '发货清单确认'
      }
      let v = {
        field: field,
        bill_id: this.payload.bill_id,
        delivery_purchase_id: this.payload.bill_id
      }
      this.$get('/x/r.json', v, {loading: true}).then(data => {
        this.$h.download(data.url.replace('.json', '.xlsx'), file_name + '-' + this.vm.bill_no + '.xlsx')
      })
    },
    onSort () {
      this.$dialog.SortProd({datas: this.datas, disableSave: true}, (data, type) => {
        this.datas = data
      })
    },
    onChange (row) {
      this.$dialog.ScProdChange({order: row}, async d => {
        this.getDatas()
      })
    }
  },
  created () {
    this.initialize()
  },
  beforeDestroy() {}
}
</script>
