<template lang="html">
  <div class="contact-info">
    <div v-tr-dom>
      <span class="lh-30 text-12">
        <!-- <span class="mr5">创建者:{{vm.x_create_user || ''}}({{vm.create_date | formatTime}})</span> -->
        <span class="mr5">最近修改:{{vm.x_update_user || ''}}({{vm.update_date | timeFormat('abbr')}})</span>
        <span class="mr5">运营人员:{{vm.x_owner_id || ''}}</span>
      </span>
    </div>
    <div class="tab-page-title full">
      <t path="cust.basic_info" class="left-border-title">基础数据</t>
    </div>
    <cust-info :vm="vm" @save="onSave" :disabled="disabled" :payload="payload"></cust-info>

    <div v-if="payload.cust_type === '2'">
      <div class="tab-page-title full mt20">
        <t path="cust.busi_auth" class="left-border-title">业务权限配置</t>
      </div>
      <div>
        <div class="mt20">
          <div class="flex-b">
            <div>
              <span class="">客户登陆官网权限</span>
              <span class="text-grey ml20">是否为客户开通登陆官网账号</span>
            </div>
            <div v-if="!disabled">
              <el-button type="primary" v-if="!isRegister" @click="inviteCustUser">
                {{registerInfo.busi_status === 'cancel' ? '启用' : '创建账号'}}
              </el-button>
              <el-button type="danger" v-else @click="cancel">解除</el-button>
              <el-button @click="sendEmail" v-if="isRegister">邮件邀请</el-button>
              <el-button v-if="isRegister" @click="loginWeb">登录官网</el-button>
            </div>
          </div>
          <div class="lh-30 ml15">
            <span class="">当前状态</span>
            <span class="ml20 text-grey">
              {{isRegister ? '账号有效' : '账号无效'}}
              <span v-if="registerInfo.busi_status === 'cancel'">(已注销)</span>
            </span>
          </div>
        </div>

        <div class="mt20">
          <div>
            <span class="">官网业务权限</span>
            <span class="text-grey ml20">允许联系人在官网执行的操作</span>
          </div>
          <div class="lh-30 ml15">
            <el-checkbox v-model="vm.mg_web_auth.inq_online" true-label="yes" false-label="no" @change="onSave('mg_web_auth')" :disabled="disabled">在线询盘</el-checkbox>
            <el-checkbox v-model="vm.mg_web_auth.order_online" true-label="yes" false-label="no" @change="onSave('mg_web_auth')" :disabled="disabled">在线下单</el-checkbox>
          </div>
        </div>

        <div class="mt20">
          <div>
            <span class="">官网数据权限</span>
            <span class="text-grey ml20">允许联系人在官网查询的订单、出运、议付等数据</span>
          </div>
          <div class="lh-30 ml15">
            <el-checkbox v-model="vm.mg_web_auth.busi_info" true-label="com" false-label="self" @change="onSave('mg_web_auth')" :disabled="disabled">所属客户公司全部数据</el-checkbox>
            <el-checkbox v-model="vm.mg_web_auth.busi_info" true-label="self" false-label="com" @change="onSave('mg_web_auth')" :disabled="disabled">联系人本人数据</el-checkbox>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Auth from '../components/auth-mixins';
export default {
  options: {title: '档案及权限'},
  data() {
    let fmt = {
      user_name: '',
      user_mail: '',
      user_phone: '',
      address: '',
      mg_office_phone: '',
      position: '',
      mg_cardpic: [],
      gender: 'm',
      contact_no: '',
      fax_number: '',
      country_id: '',
      country: '',
      area_code: '',
      legal_id: '',
      mg_web_auth: {
        inq_online: 'yes',
        order_online: 'yes',
        busi_info: 'com', // self本人,com本人公司
        login_web: 'no'
      }
    }
    return {
      vm: this.$h.cloneDeep(fmt),
      registerInfo: {}
    }
  },
  components: {
    CustInfo: require('../components/contact-info').default
  },
  computed: {
    disabled () {
      return this.isDisableEdit
    },
    isRegister () {
      return this.registerInfo.busi_status === 'confirmed'
    }
  },
  mixins: [Auth],
  methods: {
    init () {
      this.getCustInfo()
      this.getRegisterInfo()
    },
    getCustInfo () {
      let {cust_id} = this.payload
      if (!cust_id) return
      this.$pull.queryCustUser({cust_id, need_mg: 1}).then(user => {
        this.vm = {...this.vm, ...user.cust_user}
      })
    },
    onSave (v) {
      if (typeof v === 'string') v = {[v]: this.vm[v]}
      v.cust_id = this.vm.cust_id
      return this.$pull.upsertCustUser(v)
    },
    async inviteCustUser () {
      let v = await this.$get('/api/b2b/inviteCustUser', {cust_id: this.vm.cust_id})
      this.isRegister || this.getRegisterInfo()
      return v.cm_user || {}
    },
    getRegisterInfo () {
      this.$request2('/api/system/queryPartner', {cust_id: this.payload.cust_id}, {loading: false}).then(res => {
        this.registerInfo = res.user_partner || {}
      })
    },
    async getPwdLink ({user_id}) {
      if (this.pwdLink) return this.pwdLink
      let {token} = await this.$pull.genSetPWdToken({user_id})
      this.pwdLink = `<a target="_blank" href="${location.origin}/reset-pwd.html?token=${token}">Set Password</a>`
      return this.pwdLink
    },
    sendEmail () {
      let row = this.vm
      this.inviteCustUser().then(async v => {
        this.$dialog.SendEmail({
          mail_key: 'invite_cust_login',
          vars: {
            cust_user_name: row.user_name,
            user_com_name: this.$state('com').com_name_en,
            busi_user: this.$state('me').user_name_en,
            cust_user_mail: row.user_mail,
            cust_user_password: await this.getPwdLink(v),
            mall_help_manual: '',
            com_mall_website: this.$state('com').mg_portal_url
          },
          mail: {
            to: v.user_mail || ''
          },
          bill: {}
        }, (data) => {})
      })
    },
    async cancel () {
      let {partner_id} = this.registerInfo
      await this.$confirm(this.$t('cust.cancel_tip'), this.$t('dialog_tip'), {type: 'warning'})
      await this.$get2('/api/b2b/cancelInviteCustUser', {partner_id})
      this.getRegisterInfo()
    },
    loginWeb () {
      if (!this.isRegister) return this.$message.warning('该客户还未注册')
      this.$get('/api/system/genToken').then((d) => {
        this.$get('/api/system/scanToken', {
          token: d.token,
          cust_id: this.payload.cust_id
        }).then(() => {
          let v = this.$state('com')
          let host = v.mg_portal_url || v.mg_mall_url || 'http://console.wokelink.com'
          let link = host + `#/home?com_id=${this.$state('me').com_id}&token=${d.token}`
          window.open(link)
        })
      })
    },
  },
  created () {
    this.init()
  },
  beforeDestroy() {}
}
</script>
