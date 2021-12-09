<template>
  <div class="cust-contacts">
    <div class="" v-tr-dom>
      <el-button
        type="primary"
        @click="onAddContact"
        icon="el-icon-plus"
        v-if="!disabled"
        size="mini"
        ></el-button>
    </div>
    <x-table :data="datas">
      <x-table-column prop="contact_no" width="80">
        <t slot="header" path="cust.contact_no">编号</t>
      </x-table-column>
      <x-table-column >
        <t slot="header" path="cust.user_name">联系人名称</t>
        <template slot-scope="{row}">
          <span class="a-link" @click="viewDetail(row)">{{ row.user_name || '---' }}</span>
          <span v-if="row.busi_status!=='normal'" class="text-grey text-12">
            (已停用)
          </span>
          <span v-if="vm.default_cust_id === row.cust_id" class="text-green text-12">
            (<t path="cust.dflt">默认</t>)
          </span>
        </template>
      </x-table-column>
      <x-table-column prop="position" width="80">
        <t slot="header" path="cust.position">职务</t>
      </x-table-column>
      <x-table-column prop="user_mail">
        <t slot="header" path="cust.user_mail">邮箱</t>
      </x-table-column>
      <x-table-column prop="user_phone" width="100">
        <t slot="header" path="cust.user_phone">手机号</t>
      </x-table-column>
      <x-table-column prop="x_owner_id" width="">
        <t slot="header" path="cust.owner_id">客商经理</t>
      </x-table-column>
      <x-table-column width="120">
        <t slot="header" path="cust.create_date">创建时间</t>
        <template slot-scope="{row}">
          <span>{{ row.create_date | timeFormat }}</span>
        </template>
      </x-table-column>
      <x-table-column v-if="/^(2|4)$/.test(payload.cust_type)">
        <t slot="header" path="cust.open_status">开通状态</t>
        <template slot-scope="{row}">
          <div>{{openStatus[row.open_status]}}</div>
          <div class="text-grey">{{ row.invite_date | timeFormat }}</div>
        </template>
      </x-table-column>
      <x-table-column class-name="lh-20 text-center" width="80" v-if="!disabled">
        <t slot="header" path="oprate">操作</t>
        <template slot-scope="{row, $index}">
          <div v-if="vm.default_cust_id === row.cust_id"><t class="text-green" path="cust.dflt">默认</t></div>
          <div v-else-if="row.busi_status==='normal'"><t class="a-link" path="cust.set_dflt" @click="onSetDflt(row)">设为默认</t></div>
          <div title="停用之后，还可以被查询，但是不能做业务；适用场景：以前交易现在不在交易的客户" v-if="vm.default_cust_id !== row.cust_id">
            <span class="d-link" v-if="row.busi_status==='normal'" @click="onStopOrStart(row, 'stopped', $event)">停用</span>
            <t class="a-link" path="start" v-else @click="onStopOrStart(row, 'normal')">启用</t>
          </div>
          <div v-if="vm.default_cust_id !== row.cust_id" title="删除之后，不能被查询，不能做业务；适合场景：手误新建的人；警告：做过业务的单据查询会报错">
            <span class="d-link" @click="onDelete(row, $index, $event)" >删除</span>
          </div>
        </template>
      </x-table-column>
      <x-table-column width="100" v-if="/^(2|4)$/.test(payload.cust_type) && !disabled">
        <t slot="header" path="cust.account_oprate">账号操作</t>
        <template slot-scope="{row}" v-if="row.busi_status==='normal'">
          <span class="pointer" v-if="row.open_status==='confirmed'">
            <t path="cust.notice" @click="inviteCust(row)" class="text-primary">通知</t>
            <span class="mh5">|</span>
            <t path="cust.cancel" @click="cancel(row)" class="text-danger">注销</t>
          </span>
          <span class="a-link" @click="opening(row)" v-else-if="row.open_status==='cancel'"><t path="cust.enable">启用</t></span>
          <span class="a-link" @click="opening(row)" v-else><t path="cust.opening">开通</t></span>
        </template>
      </x-table-column>
    </x-table>
  </div>
</template>

<script>
import {queryCustCompany, updateCustCompany} from './widget';
import Auth from './components/auth-mixins';
export default {
  options: {title: '联系人'},
  mixins: [Auth],
  data() {
    return {
      datas: [],
      vm: {},
      openStatus: {
        confirmed: '已开通',
        cancel: '已注销',
        open: '未开通',
      }
    };
  },
  computed: {
    disabled () {
      return this.isDisableEdit
    },
  },
  methods: {
    queryCustCompany,
    updateCustCompany,
    init() {
      if (!this.payload.cust_com_id) return;
      this.queryCustCompany()
      this.queryCustUserList()
    },
    async queryCustUserList () {
      let v = await this.$get('/api/crm/queryCustUserList', {
        cust_com_id: this.payload.cust_com_id,
        need_partner: '1'
      })
      this.datas = (v.cust_users || []).map(m => {
        let p = m.partner || {}
        m.open_status = p.busi_status || 'open'
        m.invite_date = p.create_date
        m.partner_id = p.partner_id
        return m
      })
    },
    viewDetail (v) {
      this.$tab.open({
        title: v.user_name,
        tab_id: v.cust_id,
        path: 'ContactEdit',
        query: {
          ...this.payload,
          cust_id: v.cust_id,
          cust_type: v.cust_type || this.payload.cust_type
        }
      })
    },
    onAddContact () {
      let {cust_com_id, cust_type} = this.payload
      this.$dialog.AddCustContact({vm: {cust_com_id, cust_type}}, async d => {
        this.queryCustUserList()
        if (d.cust_user) this.viewDetail(d.cust_user)
      })
    },
    // onStopUser (item, val) {
    //   let self = this
    //   if (item.cust_id === self.main_id) {
    //     self.$message('默认联系人不能被禁用')
    //     return
    //   }
    //   let v = {cust_id: item.cust_id}
    //   v.status = val
    //   return self.$pull.upsertCustUser(v).then(function () {
    //     self.refresh()
    //   })
    // },
    async onDelete (row, i, ev) {
      console.log(ev, 'ev')
      let tip = this.$t('delete_tip')
      if (ev) tip = ev.target.title
      await this.$confirm(tip, this.$t('dialog_tip'), {type: 'warning'})
      this.$post2('/api/crm/deletCustUser', {cust_id: row.cust_id})
      this.datas.splice(i, 1)
    },
    async onStopOrStart (item, status, ev) {
      let tip = '确定启用？'
      if (ev) tip = ev.target.parentNode.title
      await this.$confirm(tip, this.$t('dialog_tip'), {type: 'warning'})
      item.busi_status = status
      let v = {cust_id: item.cust_id, busi_status: status}
      this.$pull.upsertCustUser(v)
    },
    onSetDflt (item) {
      if (item.status !== 'normal') return this.$message('未启用联系人不能设为默认')
      this.vm.default_cust_id = item.cust_id
      this.updateCustCompany('default_cust_id')
    },
    async opening ({cust_id}) {
      await this.$confirm(this.$t('cust.opening_tip'), this.$t('dialog_tip'), {type: 'warning'})
      await this.$get2('/api/b2b/inviteCustUser', {cust_id})
      this.queryCustUserList()
    },
    async getPwdLink ({user_id}) {
      if (this.pwdLink) return this.pwdLink
      let {token} = await this.$pull.genSetPWdToken({user_id})
      this.pwdLink = `<a target="_blank" href="${location.origin}/reset-pwd.html?token=${token}">Set Password</a>`
      return this.pwdLink
    },
    inviteCust ({cust_id, ...row}) {
      this.$get('/api/b2b/inviteCustUser', {cust_id}, {loading: true}).then(async res => {
        // this.getRegisterInfo()
        let v = res.cm_user || {}
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
    async cancel ({partner_id}) {
      await this.$confirm(this.$t('cust.cancel_tip'), this.$t('dialog_tip'), {type: 'warning'})
      await this.$get2('/api/b2b/cancelInviteCustUser', {partner_id})
      this.queryCustUserList()
    },
  },
  created() {
    this.init();
  },
};
</script>
<style lang="scss">
</style>
