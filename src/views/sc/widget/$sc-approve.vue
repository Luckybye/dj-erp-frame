<template lang="html">
  <div class="sc-approve mb10">
    <div class="tab-page-header" v-tr-dom>
      <span v-if="payload.show_status === 'auditing'">
        <a class="a-link lh-30" target="_bank"
          :href="`/approve-detail.html?approve_id=${payload.bill_id}&field=approve_contract`">
          <t path="auditing">审批中</t>
        </a>
      </span>
      <span v-else>
        <el-button type="primary" @click="onSubmit('save')">
          <t path="save">保存</t>
        </el-button>
        <el-button type="primary" @click="onSubmit('submit')" >
          <t path="submit_approve">提交审批</t>
        </el-button>
      </span>
    </div>

    <iframe :src="approveHtml" frameborder="0" width="100%" ref="iframe" style="height:calc(100vh - 170px)"></iframe>
  </div>
</template>
<script>
export default {
  data() {
    return {
      flag: '',
      approveHtml: ''
    }
  },
  watch: {
  },
  methods: {
    initialize () {
      this.approveHtml = `/approve-detail.html?approve_id=${this.payload.bill_id}&field=approve_contract&view=1`
    },
    onSubmit (type) {
      this.flag = type
      let iframe = this.$refs.iframe.contentWindow
      iframe.Bus.$emit('onSubmit')
    },
    onSubmitBack (v) {
      // inland_freigh0, local_charge0, ocean_freight0, premium0
      let d = {
        bill_id: v.bill_id, //          订单ID
        premium: v.premium0, //        保险费
        premium_cur: v.x_cost_curr, //     保险费币种
        ocean_freight: v.ocean_freight0, //    海运费
        ocean_freight_cur: v.x_cost_curr, // 海运费币种
        inland_freighs: v.inland_freigh0, //    国内运费
        inland_freighs_cur: v.x_cost_curr, // 国内运费币种
        local_charges: v.local_charge0, //     港杂费
        local_charges_cur: v.x_cost_curr // 港杂费币种
      }
      this.$request('/api/business/updateBudgetFee', d).then(data => {
        this.onRefresh()
        if (this.flag === 'submit') this.onApprove()
      })
    },
    onEvent (iframeWin) {
      if (iframeWin && iframeWin.Bus) {
        iframeWin.Bus.$on('onSubmitBack', this.onSubmitBack)
      }
    },
    offEvent (iframeWin) {
      if (iframeWin && iframeWin.Bus) {
        iframeWin.Bus.$off('onSubmitBack')
      }
    },
    onRefresh () {
      let iframeWin = this.$refs.iframe.contentWindow
      if (iframeWin) {
        iframeWin.window.location.reload()
      }
    },
    async submitSc () {
      await this.$get('/api/business/upsertBillMain', {
        bill_type: 'PI',
        bill_id: this.payload.bill_id,
        bill_action: 'pi_approve'
      })
      this.refresh()
    },
    async onApprove (v) {
      v = v || this.payload
      let res = await this.$get('/api/manage/preApprove', { approve_type: 'approve_contract' }, {loading: true})
      if (res.status !== 'normal') return this.submitSc()
      let params = {
        ...v,
        approver_id: v.bill_id,
        users: res.approvers,
        explain: res.explain,
        title: res.name || '销售审批',
        seller_id: this.payload.seller_id
      }
      this.$dialog.ScApproval(params, data => {
        let para = {
          approve_type: 'approve_contract',
          approve_id: v.bill_id,
          cm_approve: {
            bill_type: 'PI',
            approve_name: res.name || '销售审批',
            approve_brief: data.x_bill.bill_no || data.x_bill.quote_no,
            suggestion: data.x_bill.suggestion
          },
          ...data
        }
        // this.$tab.back()
        this.$pull.commitApprove(para).then(() => {
          // this._context.initialize && this._context.initialize()
          // this.payload.show_status = 'auditing'
          // this.actived = false
          this.refresh()
        })
      })
    },
    openOldSaas (v = this.payload) {
      this.$openPage({
        name: v.bill_no,
        method: 'PiEdit',
        feature: 'open',
        pageId: v.bill_id,
        opt: {
          bill_id: v.bill_id,
          title: v.bill_no
        },
        isActive: false,
      }).then(d => {
        window.close()
      })
    },
    refresh () {
      if (this.$route.query.back_old) return this.openOldSaas()
      if (this.$route.query.listen) return window.postMessage({type: this.$route.query.listen}, '*')
      // this.$tab.back()
      this.$nextTick(() => {
        this.$tab.refresh(true)
      })
    }
  },
  created () {
    this.initialize()
  },
  mounted() {
    this.initialize()
    let self = this
    let iframe = this.$refs.iframe
    let iframeWin = this.$refs.iframe.contentWindow
    if (iframe.attachEvent) {
      iframe.attachEvent('onload', function () {
        self.onEvent(iframeWin)
      })
    } else {
      iframe.onload = function () {
        self.onEvent(iframeWin)
      }
    }
  },
  beforeDestroy() {}
}
</script>
