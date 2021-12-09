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
      cust_banks: [],
      cust_users: [],
      vm: {
        com_overview: {
          com_v_p: [],
          com_details: {
            busi_type: '',
            country: '',
            main_prod: '',
            total_employess: '',
            year_established: '',
            prod_cert: '',
            trademarks: '',
            ownership: '',
            total_ann_rev: '',
            main_process: '',
            certifications: '',
            Patents: '',
            main_markets: '',
          },
        },
        prod_capacity: {
          prod_flow: [],
          prod_equ: [],
          factory_info: {
            factory_size: '',
            factory_add: '',
            prod_line_no: '',
            contract_man: '',
            ann_out_val: '',
          },
          ann_prod_cap: [],
        },
        quality_con: {
          test_equ: [],
        },
        r_d_capacity: {
          certifications: [],
          prod_certifications: [],
          patents: [],
          trademarks: [],
          r_d: '',
        },
        main_markets: {
          main_markets: [],
        },
        factory_insp_rep: [],
      },
      countrys: [],
      busi_types: [
        {
          text: 'Manufacturer',
          value: '',
        },
        {
          text: 'Trading Company',
          value: '',
        },
      ],
      total_Employees: [
        {
          text: '0-20 People',
          value: '',
        },
        {
          text: '21-300 People',
          value: '',
        },
        {
          text: '301-1000 People',
          value: '',
        },
        {
          text: 'More than 1000 People',
          value: '',
        },
      ],
      ownerships: [
        {
          text: 'Private Owner',
          value: '',
        },
        {
          text: 'Public Company',
          value: '',
        },
        {
          text: 'Collective',
          value: '',
        },
        {
          text: 'State-owned',
          value: '',
        },
      ],
      factory_sizes: [
        {
          text: '200 - 2000 m²',
          value: '',
        },
        {
          text: '2001 - 5000 m²',
          value: '',
        },
        {
          text: '5001 - 10000 m²',
          value: '',
        },
        {
          text: 'More than 10000 m²',
          value: '',
        },
      ],
      annual_output_values: [
        {
          text: 'US$ 0 Million - US$ 5 Million',
          value: '',
        },
        {
          text: 'US$ 5 Million - US$ 10 Million',
          value: '',
        },
        {
          text: 'US$ 10 Million - US$ 30 Million',
          value: '',
        },
        {
          text: 'US$ 30 Million - US$ 100 Million',
          value: '',
        },
        {
          text: 'More than US$ 100 Million',
          value: '',
        },
      ],
      profileDatas: [
        {
          text: 'Company Overview',
          key: 'com_overview',
          param: [
            {
              text: 'Company video and photos',
              key: 'com_v_p',
            },
            {
              text: 'Company Details',
              key: 'com_details',
            },
          ],
        },
        {
          text: 'PRODUCT CAPACITY',
          key: 'prod_capacity',
          param: [
            {
              text: 'Production Flow',
              key: 'prod_flow',
            },
            {
              text: 'Production Equipment',
              key: 'prod_equ',
            },
            {
              text: 'Factory Information',
              key: 'factory_info',
            },
            {
              text: 'Annual Production Capacity',
              key: 'ann_prod_cap',
            },
          ],
        },
        {
          text: 'QUALITY CONTROL',
          key: 'quality_con',
          param: [
            {
              text: 'Test Equipment',
              key: 'test_equ',
            },
          ],
        },
        {
          text: 'R&D CAPACITY',
          key: 'r_d_capacity',
          param: [
            {
              text: 'Certifications',
              key: 'certifications',
            },
            {
              text: 'Production Certification',
              key: 'prod_certifications',
            },
            {
              text: 'Patents',
              key: 'patents',
            },
            {
              text: 'Trademarks',
              key: 'trademarks',
            },
            {
              text: 'Research & Development',
              key: 'r_d',
            },
          ],
        },
        {
          text: 'Main Markets',
          key: 'main_markets',
          param: [
            {
              text: 'Main Markets',
              key: 'main_markets',
            },
          ],
        },
        {
          text: 'Factory inspection reports',
          key: 'factory_insp_rep',
          param: [],
        },
      ],
      field: 'supplier_com_profile',
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
      ps.push(self.$configure.getValue(self.field, self.payload.cust_com_id))
      let p = self.$Promise.when(ps).then(function (bank, cust_company, cust_user, configure) {
        self.cust_banks = bank.cust_company_bank
        self.cust_company = cust_company.cust_company || {}
        self.cust_users = cust_user.cust_users || []
        self.vm = { ...self.vm, ...configure[self.field] }
      })
      return p
    },
    inspection_request (data) {
      let mg_inspection_request = data || {}
      let arr = Object.values(mg_inspection_request)
      return arr.join(",")
    },
    onDownLoad(url) {
      if (!url) return
      window.open(url)
    },
    getShareUrl() {
      let self = this
      let v = {
        field: 'supplier_profile',
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
          subject: '供应商档案',
          html: `<div><a href="${this.share_url}" target="_blank" style="color:#6d78e7">${this.cust_company.com_name ||
            '供应商档案'}</a></div>
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
