<template lang="html">
  <div class="com-preview">
    <div class="flex-b mb20">
      <div class="h-left">
      </div>
      <div class="right">
        <el-button @click="onMail" type="primary">邮件</el-button>
        <el-button @click="onPrint" type="primary">打印</el-button>
      </div>
    </div>
    <iframe :src="share_url" frameborder="0" style="width: 100%;height: calc(100vh - 200px)"></iframe>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cust_company: {},
      cust_bank: {},
      cust_users: [],
      share_url: ''
    }
  },
  computed: {
    disabled () {
      return false
    }
  },
  methods: {
    initialize () {
      let self = this
      self.getShareUrl()
      let ps = []
      ps.push(self.$get2('/api/crm/queryCustBank', {cust_com_id: self.payload.cust_com_id}))
      ps.push(self.$get('/api/crm/queryCustCompany', {cust_com_id: self.payload.cust_com_id}))
      ps.push(self.$get('/api/crm/queryCustUserList', {cust_com_id: self.payload.cust_com_id}))
      let p = self.$Promise.when(ps).then(function (bank, cust_company, cust_user) {
        self.cust_bank = (bank.cust_company_bank || [])[0] || {}
        self.cust_company = cust_company.cust_company || {}
        self.cust_users = cust_user.cust_users || []
      })
      return p
    },
    inspection_request (data) {
      let mg_inspection_request = data || {}
      let arr = Object.values(mg_inspection_request)
      return arr.join(",")
    },
    getShareUrl() {
      let self = this
      let v = {
        field: 'customer_profile',
        bill_id: self.payload.cust_com_id,
        cust_com_id: self.payload.cust_com_id,
        // debug: 1
      }
      self.$get('/x/r.json', v).then(function (data) {
        self.share_url = `${window.location.origin}/x/${data.render_id}/r.html`
        console.log(self.share_url)
      })
    },
    onMail() {
      let me = this.$state('me')
      let mail = {
        newValue: {
          subject: '客户档案',
          html: `<div><a href="${this.share_url}" target="_blank" style="color:#6d78e7">${this.cust_company.com_name ||
            '客户档案'}</a></div>
            <div>Best Regards</div><div>${
            me.user_name_en
          }</div><br>`
        }
      }
      this.$dialog.SendEmail(mail, data => {})
    },
    onPrint() {
      var win = window.open(this.share_url)
      setTimeout(() => {
        win.print()
      })
    }
  },
  created () {
    this.initialize()
  },
  mounted () {
    // this.$nextTick(() => {
    //   this.payload.position === 'bottom' && this.$refs.introduction.$el.scrollIntoView()
    // })
  },
  beforeDestroy() {}
}
</script>
