<template>
  <div class="pi-list">
    <div class="tab-page-header flex-b h-b pb0 fixed-top">
      <el-menu :default-active="searchVm.busi_status" mode="horizontal" @select="handleSelect">
        <el-menu-item v-for="(item, i) in filterStatus" :key="i" :index="item.status">
          {{$tt(item, 'text')}}
        </el-menu-item>
      </el-menu>
      <div>
        <x-input
            v-model="searchVm.fuzzy_value"
            :placeholder="$t('pls_input_search_cond')"
            prefix-icon="el-icon-search" width="250px"
            @blur-change="getDatas()"
            @enter="getDatas"
            clearable></x-input>
      </div>
    </div>

    <x-table :data="datas" :page="searchVm" @page-change="getDatas">
      <x-table-column>
        <t slot="header" path="cust.com_name">公司</t>
        <template slot-scope="{row}">
          <div class="a-link" @click="viewDetail(row)">{{ row.com_name || "-" }}</div>
        </template>
      </x-table-column>
      <x-table-column prop="user_name">
        <t slot="header" path="cust.contact">联系人</t>
        <template slot-scope="{row}">
          <div class="a-link" @click="viewCustDetail(row)">{{ row.user_name || "-" }}</div>
        </template>
      </x-table-column>
      <x-table-column prop="position">
        <t slot="header" path="cust.position">职务</t>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="cust.email_account">邮箱账号</t>
        <template slot-scope="{row}">
          <div>{{ row.user_mail || "-" }}</div>
        </template>
      </x-table-column>
      <x-table-column prop="user_phone">
        <t slot="header" path="cust.phone">手机</t>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="cust.invite_date">入驻日期</t>
        <template slot-scope="{row}">
          <div>{{ row.invite_date | timeFormat('YYYY-MM-DD HH:mm') }}</div>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="cust.status">状态</t>
        <template slot-scope="{row}">
          <div>{{ inviteStatus(row.busi_status) }}</div>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="cust.owner">客商经理</t>
        <template slot-scope="{row}">
          <div>{{ $tt(row, 'x_owner_id') }}</div>
        </template>
      </x-table-column>
      <x-table-column width="100">
        <t slot="header" path="oprate">操作</t>
        <template slot-scope="{row}">
          <span class="pointer" v-if="row.busi_status==='confirmed'">
            <t path="cust.notice" @click="inviteCust(row)" class="text-primary">通知</t>
            <span class="mh5">|</span>
            <t path="cust.cancel" @click="cancel(row)" class="text-danger">注销</t>
          </span>
          <span class="a-link" @click="opening(row)" v-else-if="row.busi_status==='cancel'"><t path="cust.enable">启用</t></span>
          <span class="a-link" @click="opening(row)" v-else><t path="cust.opening">开通</t></span>
        </template>
      </x-table-column>
    </x-table>
  </div>
</template>

<script>
export default {
  options: {
    icon_text: 'List'
  },
  components: {
  },
  data() {
    let filterStatus = [
      {
        status: 'confirmed',
        text: '已开通',
        text_en: '已开通',
      },
      {
        status: 'open',
        text: '未开通',
        text_en: '未开通',
      },
      {
        status: 'cancel',
        text: '已注销',
        text_en: '已注销',
      },
    ]
    return {
      datas: [],
      filterStatus,
      filterStatusMap: filterStatus._object('status'),
      searchVm: {
        busi_status: 'confirmed',
        fuzzy_value: '',
        page_index: 1,
        page_size: 15,
        // cust_type: '2'
      },
    }
  },
  methods: {
    async getDatas (i) {
      this.searchVm.page_index = typeof i === 'number' ? i : 1
      let para = {...this.searchVm}
      let v = await this.$get('/api/query/queryUserPartner', para._trim())
      this.datas = v.cust_user || []
      if ('count' in v) this.searchVm.count = v.count
    },
    inviteStatus (f = 'open') {
      if (!f) return
      return this.$tt(this.filterStatusMap[f] || {}, 'text')
    },
    handleSelect (status) {
      this.searchVm.busi_status = status
      this.getDatas()
    },
    viewDetail (v) {
      this.$tab.open({
        title: v.com_name,
        tab_id: v.cust_com_id,
        path: 'CustEdit',
        query: {
          cust_com_id: v.cust_com_id
        }
      })
    },
    viewCustDetail (v) {
      this.$tab.open({
        title: v.user_name,
        tab_id: v.cust_id,
        path: 'ContactEdit',
        query: {
          cust_id: v.cust_id
        }
      })
    },
    async init () {
      this.getDatas()
    },
    async opening ({cust_id}) {
      await this.$confirm(this.$t('cust.opening_tip'), this.$t('dialog_tip'), {type: 'warning'})
      await this.$get2('/api/b2b/inviteCustUser', {cust_id})
      this.getDatas(this.searchVm.page_index)
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
      this.getDatas(this.searchVm.page_index)
    },
  },
  created () {
    this.searchVm = {...this.searchVm, ...(this.payload || {}).search}
    this.init()
  }
}
</script>
