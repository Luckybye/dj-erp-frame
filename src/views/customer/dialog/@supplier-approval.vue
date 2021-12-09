<template>
  <el-dialog
    :visible="true"
    width="50%"
    @close="onClose"
    :close-on-click-modal="false"
  >
    <div class="" slot="title"><t path="approval_apply" colon>审批申请</t></div>
    <el-form label-position="left" label-width="90px">
      <el-row type="flex">
        <el-col :span="12">
          <el-form-item>
            <t slot="label" path="busi_type" colon>业务类型:</t>
            {{ title }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <t slot="label" path="sc.buyer" colon>客户:</t>
            {{ bill.com_name }}
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item>
            <t slot="label" path="approver" colon>审批人:</t>
            <span v-for="(approver, i) in approvers" :key="i">
              {{ approver.user_name || approver.x_user_id || approver.user_id }}
            </span>
            <i
              class="el-icon-circle-plus-outline text-primary pointer text-18"
              @click="addApprover"
              v-if="!isDisabled"
            ></i>
            <div class="text-grey text-12 mt10" v-if="isDisabled">
              <t path="is_wrong_approver">审批人不对？</t>
              <span class="a-link" @click="isDisabled = false">
                <t path="click_this_to_edit">点此修改</t>
              </span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item>
            <t slot="label" path="approve_explain" colon>审批说明:</t>
            <x-input
              width="90%"
              field="suggestion"
              :result.sync="bill"
              type="textarea"
            ></x-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item>
            <t slot="label" path="approve_rule" colon>审批制度:</t>
            <div @click="isShow = !isShow" class="a-link mb10">
              <t path="unfold" v-if="!isShow">展开</t>
              <t path="fold" v-else>收起</t>
            </div>
            <div v-html="explain" v-show="isShow"></div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="onConfirm">{{
        $t('confirm')
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      explain: '',
      approvers: [],
      bill: { suggestion: '' },
      isShow: false,
      title: '供应商引入',
      users: [],
      isDisabled: false,
    }
  },
  methods: {
    onConfirm() {
      let bill = this.bill
      if (!this.approvers.length) {
        this.$message('请选择审批人')
        return
      }
      let para = {
        approve_type: 'approve_supplier',
        approve_id: bill.cust_com_id,
        cm_approve: {
          bill_type: 'AP',
          approve_name: this.title,
          approve_brief: bill.com_name,
          suggestion: bill.suggestion,
        },
        cm_users: this.approvers,
      }
      this.$pull.commitApprove(para, { loading: true, cache: 2 }).then(() => {
        this.onCallback(true).then(() => {
          this.onClose()
        })
      })
    },
    initialize() {
      let ps = [
        this.$pull.preApprove({ approve_type: 'approve_supplier' }),
        this.$pull.queryCustCompany({cust_com_id: this.bill.cust_com_id}, {loading: true})
      ]
      this.$Promise.when(ps).then((app, cust) => {
        this.title = app.name || '审批'
        this.users = app.approvers || []
        this.explain = app.explain
        this.bill = cust.cust_company || {}
        let para = {
          payment: (this.bill.mg_payment || {}).text,
          busi_group_id: this.bill.busi_group_id || this.$state('me').busi_group_id,
          field: 'approver_sup',
        }
        this.$pull.flowEngine(para, { warning: false }).then(data => {
          this.approvers = data.approvers || []
          this.approvers.length && (this.isDisabled = true)
          console.log('审批人：', data)
        })
      })
    },
    addApprover () {
      let selectedMap = this.approvers._object('user_id')
      let checkList = this.users.filter(m => selectedMap[m.user_id])
      this.$dialog.ChooseApprover({approvers: this.users, checkList}, data => {
        this.approvers = data
      })
    }
  },
  created() {
    this.initialize()
  },
}
</script>
