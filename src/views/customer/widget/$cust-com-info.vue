<template lang="html">
  <div class="cust-com-info">
    <div v-tr-dom>
      <span class="lh-30 text-12">
        <!-- <span class="mr5">创建者:{{vm.x_create_user || ''}}({{vm.create_date | formatTime}})</span> -->
        <span class="mr5">最近修改:{{vm.x_update_user || ''}}({{vm.update_date | timeFormat('abbr')}})</span>
        <span class="mr5">运营人员:{{vm.x_owner_id || ''}}</span>
        <el-button @click="preview">预览</el-button>
      </span>
      <el-dropdown @command="handleCommand" v-if="!/initial/.test(this.vm.cust_audit) && isAllowApprove && !editAfterPass" class="ml10">
        <el-button type="primary" :class="['bill-status', vm.cust_audit]">
          {{vm.cust_audit | approveStatus}}
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="onCancelApprove" v-if="isApproveing && !isDisableEdit"><t path="cancel_approve">取消审批</t></el-dropdown-item>
          <el-dropdown-item command="viewApprove"><t path="view_approve">查看审批</t></el-dropdown-item>
          <el-dropdown-item command="editInfo" v-if="isPass">修改</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="primary" @click="onSubmit" v-else-if="isNoApprove && !isDisableEdit" class="ml10">
        <t path="submit_approve">提交审批</t>
      </el-button>
      <el-button type="primary" @click="onSubmitChange" v-if="editAfterPass" class="ml10">
        提交修改
      </el-button>
    </div>
    <cust-page :vm="vm" @save="onSave" :disabled="disabled" :payload="payload" v-if="payload.cust_type === '2' || payload.cust_type === '4'" :custType="payload.cust_type" :isPass="isPass"></cust-page>
    <service-com-info :vm="vm" @save="onSave" :disabled="disabled" :payload="payload" v-else></service-com-info>
  </div>
</template>
<script>
import {queryCustCompany, updateCustCompany, queryApprove} from './widget';
import Auth from './components/auth-mixins';

// let disFmt = {
//   com_name: 1,
//   payment_id: 1,
//   cust_nature: 1,
//   insurance_amount: 1,
//   mg_rating: 1,
//   cust_profit: 1,
//   discount_rate: 1,
//   credit_line: 1,
//   commission_rate: 1,
//   cust_level: 1,
//   legal_id: 1,
//   id_code: 1,
//   edi_buyer_no: 1,
//   id_code: 1,
//   id_code: 1,
// }

function getFmt (type) {
  let fmt = {}
  if (type === '2') {
    fmt = {
      ...window._g.getFmtFields("cust"),
      mg_titles: []
    }
  }
  if (type === '4') {
    fmt = {
      ...window._g.getFmtFields("sup"),
    }
  }
  if (type === '9999') {
    fmt = {
      ...window._g.getFmtFields("service"),
      mg_city: '',
      cust_code: '',
      is_equity: '',
    }
  }
  return fmt
}

export default {
  options: {title: '公司档案'},
  data() {
    let type = this.payload.cust_type
    return {
      vm: this.$h.cloneDeep(getFmt(type)),
      approve: {},
      editAfterPass: false,
      changeModel: ''
    }
  },
  components: {
    CustPage: require('../cust-page').default,
    ServiceComInfo: require('./service-info/com-info').default
  },
  computed: {
    disabled () {
      return this.isApproveing || this.isDisableEdit || (this.isPass && !this.editAfterPass)
    },
    isAllowApprove () {
      return this.approve.status === 'normal'
    },
    isNoApprove () {
      return /initial|reject/.test(this.vm.cust_audit) && this.isAllowApprove
    },
    isApproveing () {
      return this.vm.cust_audit === 'approval' && this.isAllowApprove
    },
    isPass () {
      return /^agree$/.test(this.vm.cust_audit) && this.isAllowApprove
    }
  },
  mixins: [Auth],
  methods: {
    queryApprove,
    queryCustCompany,
    async onSave (v, vm) {
      if (this.editAfterPass) {
        if (typeof v === 'string') v = {[v]: this.vm[v]}
        this.changeModel = {...this.changeModel, ...v}
        return
      }
      await updateCustCompany.call(this, v)
    },
    async initialize () {
      this.queryCustCompany()
      this.queryApprove()
    },
    onSubmit () {
      this.onApprove()
    },
    onSubmitChange () {
      if (!this.changeModel) {
        this.editAfterPass = false
        return
      }
      this.onApprove(() => {
        this.editAfterPass = false
        return this.onSave(this.changeModel)
      })
    },
    onApprove (cb) {
      let funName
      if (this.vm.cust_type === '2') funName = 'CustApproval'
      if (this.vm.cust_type === '4') funName = 'SupplierApproval'
      if (!funName) return
      this.$dialog[funName]({bill: this.vm}, async d => {
        if (cb) await cb()
        this.initialize()
      })
    },
    handleCommand (fun) {
      this[fun] && this[fun]()
    },
    async onCancelApprove () {
      await this.$confirm(this.$t('cancel_approve_tip'), this.$t('dialog_tip'), {type: 'warning'})
      let para = {
        approve_type: 'approve_customer',
        approve_id: this.payload.cust_com_id
      }
      this.$pull.cancelApprove(para).then(() => {
        this.initialize()
      })
    },
    viewApprove () {
      let url = `/approve-detail.html?field=approve_customer&approve_id=${this.payload.cust_com_id}`
      window.open(url)
    },
    editInfo () {
      // this.onSubmit()
      this.editAfterPass = true
    },
    preview() {
      let path = ''
      if (this.vm.cust_type === '2') {
        path = 'CustomerProfile'
      } else if (this.vm.cust_type === '4') {
        path = 'SupplierProfile'
      }
      this.$tab.open({
        tab_id: 'preview' + this.payload.cust_com_id,
        title: this.payload.com_name + '预览',
        query: { cust_com_id: this.payload.cust_com_id },
        path,
      })
    }
  },
  created () {
    this.initialize()
  },
  beforeDestroy() {}
}
</script>
