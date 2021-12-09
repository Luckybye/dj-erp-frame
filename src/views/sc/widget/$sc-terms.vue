<template lang="html">
  <div class="sc-terms">
    <div class="tab-page-header mb0" v-tr-dom>
      <template v-if="deal_types.indexOf('rela_deal')>=0">
        <el-button type="primary" @click="createRelaDeal" v-if="vm.is_related === 'no'">
          <t path="sc.create_rela_deal">创建关联交易</t>
        </el-button>
        <span class="a-link ml20 float-left lh-30" @click="viewRelaDeal" v-else>
          <t path="sc.rela_deal">关联交易</t>
        </span>
      </template>
      <el-button type="primary" v-on:click="replyCust" v-if="!disabled">
        <t path="sc.reply_cust">回复客户</t>
      </el-button>
      <el-button type="primary" @click="onShowAnalysis">
        <t path="sc.approve_sc">预审单</t>
      </el-button>
      <el-button type="primary" @click="onPreview">
        <t path="sc.preview">预览</t>
      </el-button>
      <el-button type="primary" @click="submitOrder">
        <t path="sc.submit">提交</t>
      </el-button>
      <span v-if="payload.show_status === 'auditing'" class="ml10">
        <span class="pointer text-warning" ref="reference">
          <t path="sc.auditing">审批中</t>
        </span>
        <div v-popover="'reference'" class="popover-box">
          <div class="btn-item danger" @click="onCancelApprove">取消审批</div>
          <div class="btn-item" @click="viewApprove">查看审批</div>
        </div>
      </span>
      <span class="ml10 lh-30">
        {{vm.contract_no}}
        <i class="el-icon-edit-outline a-link text-15" @click="onEditBillNo" v-if="!disabled"></i>
      </span>
    </div>
    <el-form label-position="left" label-width="90px">
      <el-row type="flex" :gutter="50">
        <el-col :span="12">
          <el-form-item>
            <t slot="label" path="sc.buyer" colon>客户:</t>
            <select-cust :result="vm" field="buyer_id" field2="contact" width="100%" @change="selectCust" :disabled="disabled" :showValue="vm.x_buyer_id + '/' + vm.x_contact" :clearable="false"></select-cust>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <t slot="label" path="sc.seller" colon>销售方:</t>
            <select-our-com :result="vm" field="seller_id" width="100%" @save="onSave" :disabled="disabled || vm.is_related === 'yes'" :clearable="false" @change="getConfigure"></select-our-com>
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
            <!-- {{$tt(vm, 'x_busi_user')}} -->
            <select-group-user :result="vm" field="busi_group_id" field2="busi_user" width="100%" @save="onSave" :disabled="disabled" :checkStrictly="false" :clearable="false" :pm="{range: 'all'}"></select-group-user>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <t slot="label" path="sc.trade_term" colon>贸易条款:</t>
            <select-terms :result="vm" field="trade_term" width="100%" @save="onSave" :disabled="disabled"></select-terms>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <t slot="label" path="sc.load_port" colon>起运港:</t>
            <select-port :result="vm" field="load_port" width="100%" @save="onSave" :disabled="disabled"></select-port>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <t slot="label" path="sc.unload_port" colon>目的港:</t>
            <select-port :result="vm" field="unload_port" width="100%" @save="onSave" :disabled="disabled"></select-port>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <t slot="label" path="sc.tran_type" colon>运输方式:</t>
            <select-transport :result="vm" field="tran_type" width="100%" @save="onSave" :disabled="disabled"></select-transport>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <t slot="label" path="sc.shipment_date" colon>出运日期:</t>
            <select-date :result="vm" field="shipment_date" width="100%" @save="onChangeShipmentdate" :disabled="disabled" :clearable="false"></select-date>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <t slot="label" path="sc.cust_po_no" colon>客户PO:</t>
            <x-input :result="vm" field="cust_po_no" width="100%" @save="onSave" :disabled="disabled"></x-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <t slot="label" path="sc.sc_curr" colon>销售币种:</t>
            <select-currency :result="vm" field="currency" width="100%" @save="onSave" :disabled="disabled" :clearable="false"></select-currency>
            <div style="width:80%;" class="flex-b">
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <t slot="label" path="sc.pu_curr" colon>采购币种:</t>
            <select-currency :result="vm" field="pu_currency" width="100%" @save="onSave" :disabled="disabled" :clearable="false">
            </select-currency>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item>
            <t slot="label" path="sc.pay_cond" colon>付款条件:</t>
            <select-remittance :result="vm" field="mg_payment" field2="text" width="100%" @save="onSave" :disabled="disabled" :clearable="false"></select-remittance>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <t slot="label" path="sc.stock_up" colon>备货方式:</t>
            <select-stock-type :result="vm" field="prod_source" width="100%" @save="onChangeStockType" :disabled="disabled" ref="selectStockType"></select-stock-type>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <t slot="label" path="sc.shipment_range_date" colon>出运时段:</t>
            <x-input :result="vm" field="shipment_desc" width="100%" @save="onSave" :disabled="disabled"></x-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-if="vm.is_agent === 'yes'">
          <el-form-item>
            <t slot="label" path="sc.operate_fee" colon>操作费:</t>
            <x-input :result="vm" field="cust_profit" width="100%" @save="onSave" v-input="{rule: 'number,min=0,max=100'}" :disabled="disabled">
              <span slot="append">%</span>
            </x-input>
          </el-form-item>
        </el-col>
        <el-col :span="6" v-else>
          <el-form-item>
            <t slot="label" path="sc.sc_discount" colon>销售折扣:</t>
            <x-input :result="vm.mg_charge" field="discount_rate" width="100%" @save="onSave({mg_charge: vm.mg_charge})" v-input="{rule: 'number,min=0,max=100'}" :disabled="disabled">
              <span slot="append">%</span>
            </x-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <t slot="label" path="sc.other_fee" colon>其他费用:</t>
            {{vm.mg_charge.commission_rate}}%<i class="el-icon-edit-outline a-link text-15 ml15" @click="onEditScTerms" v-if="!disabled"></i>
          </el-form-item>
        </el-col>
      </el-row>

      <x-fold reverse>
        <el-row>
          <el-col :span="24">
            <el-collapse>
              <el-collapse-item name="1">
                <t slot="title" path="sc.remark" colon>订单备注:</t>
                <x-input :result="vm" field="remark" width="calc(90% + 18px)" type="textarea" :rows="5" @save="onSave" :disabled="disabled"></x-input>
              </el-collapse-item>

              <el-collapse-item name="3">
                <t slot="title" path="sc.bank_info" colon>银行信息:</t>
                <el-row>
                  <el-col :span="12">
                    <select-bank :result="vm" field="account_no" width="100%" :pm="{legal_id: vm.seller_id}" @save="onSave" @get="getBankInfo" @change="getBankInfo" :disabled="disabled"></select-bank>
                  </el-col>
                  <el-col :span="12">
                    <div style="width:calc(80% + 18px)" class="border pa5">
                      <el-form-item class="mb0">
                        <t slot="label" path="sc.bene" colon>受益人信息:</t>
                        <div class="lh-30 text-grey">
                          {{bankInfo.legal_name}}
                          </div>
                      </el-form-item>
                      <el-form-item class="mb0">
                        <t slot="label" path="sc.bank_info" colon>银行信息:</t>
                        <div class="lh-30 text-grey">
                          {{bankInfo.beneficiary_bank}}&amp;{{bankInfo.bank_address}}
                          </div>
                      </el-form-item>
                      <el-form-item class="mb0">
                        <t slot="label" path="sc.swift_bic" colon>银行代码:</t>
                        <div class="lh-30 text-grey">{{bankInfo.swift_bic}}</div>
                      </el-form-item>
                      <el-form-item class="mb0">
                        <t slot="label" path="sc.bank_no" colon>银行行号:</t>
                        <div class="lh-30 text-grey">{{bankInfo.bank_no}}</div>
                      </el-form-item>
                      <el-form-item class="mb0">
                        <t slot="label" path="sc.bank_account" colon>银行账号:</t>
                        <div class="lh-30 text-grey">{{bankInfo.beneficiary_account}}</div>
                      </el-form-item>
                    </div>
                  </el-col>
                </el-row>
              </el-collapse-item>

              <el-collapse-item name="2">
                <t slot="title" path="sc.sc_mark" colon>订单唛头:</t>
                <el-row>
                  <el-col :span="12">
                    <el-form-item>
                      <t slot="label" path="sc.main_mark" colon>正唛:</t>
                      <x-input :result="vm.mg_main_mark" field="text" width="100%" type="textarea" :rows="5" @save="onSave({mg_main_mark: vm.mg_main_mark})" :disabled="disabled"></x-input>
                    </el-form-item>
                    <x-upload :files="vm.mg_main_mark.upload" list-type="text" class="mt10" width="100%" :disabled="disabled" @finish="onSave({mg_main_mark: vm.mg_main_mark})">
                      <el-button type="primary">{{$t('upload')}}</el-button>
                    </x-upload>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item>
                      <t slot="label" path="sc.side_mark" colon>侧唛:</t>
                      <x-input :result="vm.mg_side_mark" field="text" width="100%" type="textarea" :rows="5" @save="onSave({mg_side_mark: vm.mg_side_mark})" :disabled="disabled"></x-input>
                    </el-form-item>
                    <x-upload :files="vm.mg_side_mark.upload" list-type="text" class="mt10" width="100%" :disabled="disabled" @finish="onSave({mg_side_mark: vm.mg_side_mark})">
                      <el-button type="primary">{{$t('upload')}}</el-button>
                    </x-upload>
                  </el-col>
                </el-row>
              </el-collapse-item>
            </el-collapse>
          </el-col>
        </el-row>
      </x-fold>

    </el-form>
  </div>
</template>
<script>
import ScCancel from "./sc-cancel.js";
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
  shipment_desc: '',
  remark: '',
  account_no: '',
  cust_profit: '',
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
      bankInfo: {},
      custInfo: {},
      terms_editable: true,
      deal_types: []
    }
  },
  computed: {
    disabled () {
      return this.payload.bill_status === 'normal' || (this.payload.bill_status !== 'cancel' && this.payload.buy_busi_status === 'submit') || this.payload.audit_status === 'auditing' || (this.payload.bill_status === 'cancel' && !this.terms_editable)
    }
  },
  mixins: [ScCancel],
  methods: {
    async initialize () {
      this.billMainInfo().then(() => {
        this.getCustInfo()
        this.getConfigure()
      })
      this.getEditable()
    },
    async getEditable() {
      // 查询已撤销销售订单是否可编辑
      if (this.payload.bill_status !== 'cancel') return
      let para = {
        contract_id: this.payload.bill_id,
      }
      let v = await this.$get2('/api/business/queryCanceledPIEditable', para)
      this.payload.buy_busi_status = 'open'
      this.terms_editable = v.is_editable === 'yes'
      return v
    },
    async selectCust (v) {
      Object.assign(this.custInfo, v)
      let {buyer_id, contact} = this.vm
      await this.onSave({buyer_id, contact})
      this.billMainInfo({loading: false})
    },
    async billMainInfo (opt) {
      let v = await this.$get('/api/business/billMainInfo', {
        bill_type: 'PI',
        bill_id: this.payload.bill_id,
        need_mg: 1,
        need_prod_count: 1
      }, opt)
      this.vm = {...this.vm, ...v.pi_contract}
    },
    async onSave (v, opt) {
      let para = {
        bill_id: this.vm.bill_id,
        bill_type: 'PI',
        bill_action: 'bill_edit',
        ...v,
      }
      await this.$post('/api/business/upsertBillMain', para, opt)
      // this.onSaveCancelTerms(v)
    },
    async onChangeShipmentdate (v, _, text) {
      return this.$confirm(text || '是否更改该订单所有商品的Shipping Date？', this.$t('dialog_tip'), {
        cancelButtonText: this.$t('no2'),
        confirmButtonText: this.$t('yes'),
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(d => {
        this.onSave({...v, is_update_prods: 'yes'}).then(() => {
          this.$tab.emit('refresh-prod')
        })
      }).catch(d => this.onSave(v))
    },
    onChangeStockType (v) {
      this.$nextTick(() => {
        this.onChangeShipmentdate(v, null, '是否更改该订单所有商品的备货方式？')
      })
    },
    getBankInfo (v) {
      this.bankInfo = v
      // console.log(v, 'getBankInfogetBankInfo')
    },
    async getCustInfo () {
      if (!this.vm.contact) return (this.custInfo = {})
      let v = await this.$get('/api/crm/queryCustUser', {cust_id: this.vm.contact}, {loading: false, warning: false})
      this.custInfo = v.cust_user
    },
    replyCust () {
      this.validateBill(null, async () => {
        this.$dialog.SendEmail({
          mail_key: 'notice_cust_confirm_order',
          vars: {
            cust_user_name: this.custInfo.user_name,
            contract_no: this.vm.bill_no,
            user_com_name: this.$state('com').com_name_en,
            link: `<a href="${this.$state('com').mg_portal_url}#/business/order-detail?bill_id=${this.vm.bill_id}" class="a-link">Order Confirmation ${this.vm.bill_no}</a>`,
            busi_user: this.$state('me').user_name_en
          },
          mail: {
            to: this.custInfo.user_mail || ''
          },
          bill: {}
        })

        await this.$get('/api/business/scSendCust', {bill_id: this.payload.bill_id}, {loading: false})
        this.billMainInfo({loading: false})
      })
    },
    validateBill (v, cb) {
      v = v || this.payload || {}
      this.$dialog.ValidateBill({bill_type: 'PI', bill_id: v.bill_id}, (item) => {
        // 验证不通过，页面跳转
        if (item && item.type) {
          // if (item.type === 'cust') {
          //   let para = {title: '客户', cust_com_id: v.buyer_id, bill_id: v.buyer_id, cust_type: '2'}
          //   onOpen.call(this, para, 'CrmCustInfo')
          // }
          // if (item.type === 'bill') {
          //   this.changePart('PiTerms', v)
          // }
          // if (item.type === 'pi_prod') {
          //   this.changePart('PiProducts', v)
          // }
          return
        }
        cb && cb()
      })
    },
    async submitOrder () {
      if (this.deal_types.length === 1 && this.deal_types[0] === 'rela_deal' && this.vm.is_related === 'no') {
        return this.$message('该订单只能建立关联交易，请创建关联交易再提交')
      }
      await this.checkPort()
      this.validateBill(null, () => {
        this.$tab.push({
          from: 'ScEdit',
          path: 'ScApprove',
          query: {...this.payload},
          target: '_blank'
        })
      })
    },
    onEditBillNo () {
      this.$dialog.EditBillNo({vm: {bill_no: this.vm.contract_no}, type: 'sc'}, d => {
        d = {contract_no: d.bill_no}
        this.onSave(d)
        Object.assign(this.vm, d)
      })
    },
    onEditScTerms () {
      this.$dialog.EditScTerm({vm: this.vm, cust_com_id: this.vm.buyer_id}, d => {
        this.onSave({mg_charge: d.mg_charge})
        Object.assign(this.vm, d)
      })
    },
    onShowAnalysis () {
      let v = {
        ...this.payload,
        filename: 'Approve-' + (this.payload.id_code || this.payload.bill_no),
        url: `/x/r.html?field=bill_approve&bill_id=${this.payload.bill_id}&buyer_id=${this.payload.buyer_id}`,
        isSaveBill: true
      }
      // this.$tab.push('BillPreview', v)
      window.open(v.url)
    },
    onPreview () {
      let v = {
        ...this.payload,
        filename: 'SC-' + (this.payload.id_code || this.payload.bill_no),
        url: `/x/r.html?field=bill_contract&bill_id=${this.payload.bill_id}`,
        isSaveBill: true
      }
      this.$tab.push({
        from: 'ScEdit',
        path: 'BillPreview',
        query: {...v},
        target: '_blank'
      })
      // window.open(v.url)
    },
    async createRelaDeal () {
      await this.$get2('/api/business/createRptBill', {bill_id: this.payload.bill_id})
      this.viewRelaDeal()
      this.billMainInfo()
    },
    viewRelaDeal () {
      this.$tab.push({
        from: 'ScEdit',
        path: 'ScRelaDeal',
        query: {...this.payload},
        target: '_blank'
      })
    },
    async getConfigure () {
      let field = 'rela_deal_setting'
      let v = await this.$configure.getValue(field, this.vm.seller_id)
      this.deal_types = (v[field] || {}).deal_types || []
    },
    viewApprove () {
      window.open(`/approve-detail.html?approve_id=${this.payload.bill_id}&field=approve_contract`)
    },
    async onCancelApprove () {
      await this.$confirm('确定取消审批？', this.$t('dialog_tip'), {type: 'warning'})
      this.$pull.cancelApprove({approve_type: 'approve_contract', approve_id: this.payload.bill_id}).then(() => {
        this.$tab.refresh()
      })
    },
    async checkPort () {
      return this.$dialog.CheckPortInSc({bill_id: this.payload.bill_id, excludeId: this.vm.buyer_id})
    },
  },
  created () {
    this.initialize()
  },
  beforeDestroy() {}
}
</script>
