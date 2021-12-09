<template lang="html">
  <div class="sc-sups">
    <div class="tab-page-header" v-tr-dom>
      <el-button type="primary" @click="confirmDate" v-if="!disabled && showConfirmBtn">
        <t path="sc.confirm_delivery_date">交期确认</t>
      </el-button>
      <!-- <el-button type="primary">
        <t path="sc.notice_sup">通知供方</t>
      </el-button> -->
      <span class="ml10">{{payload.bill_no}}</span>
    </div>
    <el-table :data="datas" style="width: 100%">
      <el-table-column type="index" width="50">
        <t slot="header" path="no">序号</t>
      </el-table-column>
      <el-table-column  width="">
        <t slot="header" path="sc.sup">供方</t>
        <template slot-scope="{row}">
          {{row.x_seller_id}}
        </template>
      </el-table-column>
      <el-table-column min-width="50" prop="prod_count">
        <t slot="header" path="sc.sku_num">SKU数</t>
      </el-table-column>
      <el-table-column min-width="150">
        <t slot="header" path="sc.sup_contact">供方联系人</t>
        <template slot-scope="{row}">
          <select-contact :pm="{cust_com_id: row.seller_id}" :result="row" field="contact" @get="v => getCustInfo(v, row)" @save="onSave" @change="v => getCustInfo(v, row)" width="100%" :disabled="disabled"></select-contact>
        </template>
      </el-table-column>
      <el-table-column width="" prop="phone">
        <t slot="header" path="phone">电话</t>
        <!-- <template slot-scope="{row}">
        </template> -->
      </el-table-column>
      <el-table-column width="" prop="user_mail">
        <t slot="header" path="mailbox">邮箱</t>
        <!-- <template slot-scope="{row}">
        </template> -->
      </el-table-column>
      <el-table-column width="" min-width="150">
        <t slot="header" path="sc.busi_user2">跟单员</t>
        <template slot-scope="{row}">
          <!-- {{$tt(row, 'x_busi_user')}} -->
          <select-group-user :result="row" field="busi_group_id" field2="busi_user" width="100%" @save="onSave" :disabled="disabled" :checkStrictly="false"></select-group-user>
        </template>
      </el-table-column>
      <el-table-column width="">
        <t slot="header" path="sc.notice">通知</t>
        <template slot-scope="{row}">
          <div>{{ row.publish_date | timeFormat }}</div>
        </template>
      </el-table-column>
      <el-table-column width="">
        <t slot="header" path="sc.reply">回复</t>
        <template slot-scope="{row}">
          <div>{{ row.receive_date | timeFormat }}</div>
        </template>
      </el-table-column>
      <el-table-column>
        <t slot="header" path="status">状态</t>
        <template slot-scope="{row}">
          <t :path="getStatus(row).key" :class="'text-' + getStatus(row).class">{{getStatus(row).dflt}}</t>
        </template>
      </el-table-column>
      <el-table-column width="60">
        <t slot="header" path="action">操作</t>
        <div slot-scope="{row}" class="lh-30">
          <div><t class="a-link" path="notice" @click="onNotice(row)">通知</t></div>
        </div>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import Vue from 'vue'
let fmtArr = {
  contact: '',
  user_mail: '',
  phone: ''
}
export default {
  data() {
    return {
      datas: [],
      showConfirmBtn: false
    }
  },
  computed: {
    disabled () {
      return this.payload.bill_status === 'normal' || this.payload.buy_busi_status === 'submit'
    }
  },
  methods: {
    async initialize () {
      this.getDatas()
      this.getProds()
    },
    async getDatas () {
      if (!this.payload.bill_id) return
      this.datas = []
      let para = {
        bill_type: 'PU',
        contract_id: this.payload.bill_id,
        need_prod: 1
      }
      let v = await this.$get('/api/business/billSearch', para._trim())
      this.datas = (v.pu_purchases || [])._fmt(fmtArr)
      // if ('count' in v) this.searchVm.count = v.count
    },
    getStatus ({vend_busi_status: vend, is_plan_delay: delay, is_plan_split: split}) {
      if (vend === 'free') return {key: 'sc.prod_status_unnotice', dflt: '未通知'}
      if (vend === 'pending') return {key: 'sc.prod_status_unreply', dflt: '未回复', class: 'yellow'}
      if (split === 'yes') return {key: 'sc.prod_status_split', dflt: '分批', class: 'orange'}
      if (delay === 'yes') return {key: 'sc.prod_status_delay', dflt: '延期', class: 'orange'}
      if (vend === 'confirmed') return {key: 'sc.prod_status_normal', dflt: '正常', class: 'green'}
      return {}
    },
    selectSup (v) {
      this.$dialog.SelectCustCom({pm: {custType: '4'}, vm: {cust_com_id: v.seller_id}}, (d, com) => {
        v.seller_id = d.cust_com_id
        Vue.set(v, 'x_seller_id', com.com_name)
        this.onSave({seller_id: v.seller_id}, v)
      })
    },
    async confirmDate () {
      await this.$post2('/api/business/preCreatePur', {bill_id: this.payload.bill_id})
      this.getDatas()
      this.getProds()
    },
    onNotice ({bill_id, bill_no}) {
      this.$tab.push('SupConfirmCrd', {bill_id, bill_no})
    },
    getCustInfo (v, row) {
      row.user_mail = v.user_mail
      row.phone = v.user_phone
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
    async getProds () {
      let para = {
        bill_id: this.payload.bill_id,
      }
      let v = await this.$get2('/api/business/isScAllPurchase', para, {loading: false})
      this.showConfirmBtn = v.all_purchase === 'no'
    },
    tabBack () {
      this.getDatas()
      this.getProds()
    },
    tabShow () {
      this.getDatas()
      this.getProds()
    }
  },
  created() {
    this.initialize()
  },
  beforeDestroy() {}
}
</script>
<style lang="scss">
.sc-sups {}
</style>
