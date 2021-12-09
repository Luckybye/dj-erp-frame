<template>
  <el-dialog
    :visible="true"
    width="80%"
    @close="onClose"
    :close-on-click-modal="false"
  >
    <div class="" slot="title"><t path="approval_apply" colon>审批申请</t></div>
    <el-form label-position="left" label-width="90px">
      <el-row type="flex">
        <el-col :span="12">
          <el-form-item>
            <t slot="label" path="busi_type" colon>业务类型:</t>
            {{title}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <t slot="label" path="sc.order_no" colon>订单单据号:</t>
            {{bill.bill_no}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <t slot="label" path="sc.buyer" colon>客户:</t>
            {{bill.x_buyer_id}}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <t slot="label" path="sc.pay_cond" colon>付款方式:</t>
            <span v-if="bill.mg_payment">{{bill.mg_payment.text}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <t slot="label" path="sc.gross_profit" colon>毛利:</t>
            <span>{{fee.gross_rate && fee.gross_rate.toFixed(2)}}%(已减公共费率{{fee.public_fee || 0}}%)</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <t slot="label" path="sc.sale_total_amount" colon>销售总额:</t>
            <span>{{bill.currency}} {{fee.amt_sell && fee.amt_sell.toFixed(2)}}</span>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item>
            <t slot="label" path="approver" colon>审批人:</t>
            <span v-for="(approver, i) in approvers" :key="i">
              {{approver.user_name || approver.x_user_id || approver.user_id}}
            </span>
            <i class="el-icon-circle-plus-outline text-primary pointer text-18" @click="addApprover" v-if="!isDisabled"></i>
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
            <x-input width="90%" field="suggestion" :result.sync="bill" type="textarea"></x-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item>
            <t slot="label" path="approve_rule" colon>审批制度:</t>
            <div @click="isShow=!isShow" class="a-link mb10">
              <t path="unfold" v-if="!isShow">展开</t>
              <t path="fold" v-else>收起</t>
            </div>
            <div v-html="explain" v-show="isShow"></div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="onConfirm">{{
        $t("confirm")
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
      bill: {mg_payment: {}, mg_charge: {}, suggestion: ''},
      prods: [],
      isShow: false,
      isDisabled: false,
      fee: {}
    };
  },
  computed: {},
  methods: {
    onConfirm () {
      if (!this.approvers.length) return this.$message(this.$t('pls_select_approval'))
      this.onCallback({
        cm_users: this.approvers,
        x_bill: this.bill
      }).then(() => {
        this.onClose()
      })
    },
    initialize () {
      let ps = [
        this.$pull.billMainInfo({bill_id: this.bill_id, bill_type: 'PI', need_mg: 1}),
        this.$get('/approve-detail.html', {approve_id: this.bill_id, field: 'approve_contract', debug: 1}),
        this.$configure.getValue('constant_budget', this.seller_id)
      ]
      this.$Promise.when(ps).then((pi, appr, busi) => {
        // this.explain = this.explain
        this.bill = {...this.bill, ...pi.pi_contract}
        busi = busi.constant_budget || {}
        appr = appr.pi_contract || {}
        appr = {
          amt_sell: appr.total_amount || 0,
          gross_rate: ((appr.amt1_grate || 0) - (busi.public_fee || 0)).toFixed(2),
          field: 'approver_sc',
          busi_group_id: appr.busi_group_id || this.$state('me').busi_group_id,
          gross_amount: appr.total_gross_profit || 0,
          public_fee: busi.public_fee
        }
        this.fee = appr
        this.$pull.flowEngine(appr, {warning: false}).then(data => {
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
};
</script>
<style lang="scss">
</style>
