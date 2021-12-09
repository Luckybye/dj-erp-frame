<template>
  <el-dialog
    :visible="true"
    width="80%"
    @close="onClose"
    :close-on-click-modal="false"
  >
    <!-- <div class="" slot="title"><t path="change_prod" colon>换货</t></div> -->
    <div class="d-content">
      <sup-confirm-crd :payload="{...payload, enable_upload: true, disable_tr: true}" :pu="vm" :prods="prods" ref="supConfirmCrd" v-if="show"></sup-confirm-crd>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onNoticeAgain" type="primary" v-if="puInfo.vend_busi_status === 'confirmed'">
        <t path="notice_again">再次通知</t>
      </el-button>
      <el-button @click="onConfirm" type="primary" v-if="!isPu">
        <t path="notice">通知</t>
      </el-button>
      <el-button type="primary" @click="copLink" v-if="isPu">
        <t path="copy_link">复制链接</t>
      </el-button>
      <el-button type="primary" @click="sendMail" v-if="isPu">
        <t path="sc.send_mail">邮件</t>
      </el-button>
      <el-button @click="onClose">{{ $t("close") }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import Vue from 'vue'
export default {
  data() {
    return {
      token: '',
      show: true,
      pued: false,
      puInfo: {}
    };
  },
  computed: {
    isPu () {
      return (this.payload.bill_id && !this.prods) || (this.prods && this.prods.every(f => f.purchase_id)) || this.pued
    },
    link () {
      return location.origin + '/#/sup-confirm-crd?bill_id=' + this.payload.bill_id + '&token=' + this.token
    },
    isConfirm () {
      if (!this.$refs.supConfirmCrd) return false
      return (this.$refs.supConfirmCrd.vm.vend_busi_status || this.payload.vend_busi_status) === 'confirmed'
    }
  },
  methods: {
    async onConfirm() {
      let {seller_id: vend_cust_com_id, contract_id: bill_id, contact, busi_user, busi_group_id} = this.$refs.supConfirmCrd.vm
      let v = await this.$post2('/api/business/preCreatePur', {vend_cust_com_id, bill_id, contact, busi_user, busi_group_id})
      // let id = v.pu_purchase.purchase_id
      this.payload.bill_id = v.pu_purchase.purchase_id
      // this.prods.forEach(m => {
      //   m.purchase_id = id
      // })
      this.prods = undefined
      this.pued = true
      this.reload()
      this.onCallback().then(() => {
        // this.onClose();
      });
    },
    async getPuInfo () {
      if (!this.payload.bill_id) return this.queryPuDefault()
      let v = await this.$pull.querySimpleBill({bill_id: this.payload.bill_id, bill_type: 'PU'}, {loading: false})
      this.puInfo = v.pu_purchase || {}
    },
    reload () {
      this.show = false
      this.$nextTick(() => {
        this.show = true
        this.getPuInfo()
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
      let v = {...this.$refs.supConfirmCrd.vm, ...this.puInfo}
      await this.createAuthToken()
      this.$dialog.SendEmail({
        mail_key: 'notice_sup_confirm_etd',
        vars: {
          user_com_name: this.$state('com').com_name_en,
          link: `<a target="_blank" href="${this.link}">链接</a>`,
          sup_user_name: v.x_seller_id,
          pu_no: v.bill_no
        },
        contact: v.contact,
        user_id: v.busi_user,
        bill: {}
      })
    },
    async queryPuDefault () {
      let {seller_id: vend_cust_com_id, busi_user, contract_id: bill_id} = this.vm
      if (busi_user) return
      let v = await this.$get('/api/business/queryPuDefault', {vend_cust_com_id, bill_id})
      this.vm.busi_user = v.cm_user.user_id
      this.vm.busi_group_id = v.cm_user.busi_group_id
      Vue.set(this.vm, 'buyer_id', v.pi_contract.seller_id)
      Vue.set(this.vm, 'x_buyer_id', v.pi_contract.x_seller_id)
      Vue.set(this.vm, 'x_buyer_id_en', v.pi_contract.x_seller_id_en)
      this.vm.contact = this.vm.contact || v.cust_company.default_cust_id
    },
    async onNoticeAgain () {
      await this.$get2('/api/business/vendRedo', {bill_id: this.payload.bill_id})
      this.onCallback().then(() => {
        // this.onClose();
      });
      this.reload()
    }
  },
  created() {
    this.getPuInfo()
  },
};
</script>
<style lang="scss">
</style>
