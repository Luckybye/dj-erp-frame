<template>
  <el-dialog
    :visible="true"
    width="823px"
    @close="onClose"
    :close-on-click-modal="false"
    title="收款方式"
  >
    <div>
      <div class="left-border-title">
        Payment:
      </div>
      <div class="terms mb10" v-for="(item, index) in terms" :key="index">
        <div class="flex">
          <span class="flex-middle">{{ index + 1 }}</span>

          <div class="flex-1 mh20">
            <x-input
              width="70px"
              field="percent"
              :result="item"
              unit="%"
              type="number"
              @blur-change="setText(item)"
            ></x-input>
            <x-select
              :source="paymentTypes"
              @change="onChangePaymentTypes(item)"
              :result="item"
              field="type"
              width="120px"
              :map="{ label: 'en', value: 'en' }"
            ></x-select>
            <x-input
              v-if="item.x_paymentConds.length > 0"
              width="70px"
              field="days"
              :result="item"
              unit="days"
              @blur-change="setText(item)"
            ></x-input>
            <x-select
              v-if="item.x_paymentConds.length > 0"
              :source="item.x_paymentConds"
              @change="onCheckOnly(item)"
              :result="item"
              field="cut_point_cond"
              width="280px"
              :map="{ label: 'en', value: 'en' }"
            ></x-select>
            <x-select
              width="150px"
              :result="item"
              :source="timePoint"
              :map="{ label: 'text', value: 'id' }"
              field="time_point"
              placeholder="Point of Time"
            ></x-select>
            <x-input width="100%" :result="item" field="text"></x-input>
          </div>

          <div class="flex-middle">
            <el-button
              @click="onAddpayment()"
              icon="el-icon-plus"
              v-if="index === 0"
              type="primary"
            ></el-button>

            <el-button
              @click="onDeletepaymentTime(index)"
              v-if="index !== 0"
              icon="el-icon-delete"
              type="danger"
            ></el-button>
          </div>
        </div>
      </div>

      <div class="left-border-title mt20">
        Description:
      </div>
      <div>{{ getTerms() }}</div>

      <div class="left-border-title mt20">
        Occupy Line of Credit：
      </div>
      <div>
        <el-checkbox v-model="vm.is_credit" true-label="yes" false-label="no" class="mr20">是</el-checkbox>
        <el-checkbox v-model="vm.is_credit" true-label="no" false-label="yes" class="mr20">否</el-checkbox>
      </div>
      <div class="left-border-title mt20">
        Credit Limit：
      </div>
      <div>
        <el-checkbox v-model="vm.credit_limit" true-label="yes" false-label="no" class="mr20">是</el-checkbox>
        <el-checkbox v-model="vm.credit_limit" true-label="no" false-label="yes" class="mr20">否</el-checkbox>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="onConfirm">{{
        $t('confirm')
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
const Constant = require('dj-model').Constant
// var paymentMixCond = Constant.paymentMixCond
function paymentMixCond(term) {
  var paymentTypes = Constant('paymentType')
  var MixConds = Constant('paymentCutPointMixCond')
  if (!term) return MixConds
  var payType = paymentTypes.find(item => item.en === term)
  var MixCondSelectable = []
  if (payType && payType.selectable && payType.selectable.length) {
    MixCondSelectable = MixConds.filter(f =>
      payType.selectable.contains(f.type)
    )
  }
  return MixCondSelectable
}
let fmt = {
  percent: 100,
  days: 30,
  type: 'T/T',
  cut_point_cond: 'against copy of B/L',
  time_point: '',
  text: '100% T/T 30 days against copy of B/L;',
  x_paymentConds: paymentMixCond('T/T'),
}
function onConfirm() {
  if (this.onCheckSubmit()) return
  let text = ''
  this.terms.forEach(item => {
    text += this.toText(item)
  })
  this.vm.payment_text = text
  this.vm.payment_desc = this.getTerms()
  this.vm.payment_params = JSON.stringify(this.terms.map(m => this.$h.omit(m, 'x_paymentConds')))

  this.onCallback(this.vm).then(() => {
    this.onClose()
  })
}
export default {
  data() {
    return {
      vm: { is_credit: 'yes', credit_limit: 'yes' },
      paymentTypes: Constant('paymentType'),
      // 应收Map
      payableMap2: [
        'after sight',
        'after B/L date',
        'after receipt of goods',
        'against copy of B/L',
        'against full set of copy shipping docs',
        'against receipt of original shipping docs',
      ],
      // 预收Map
      prePayMap2: ['before shipment', 'after sales contract'],
      timePoint: [
        { text: '订单生效日', id: 'sc_valid' },
        { text: '计划发货日', id: 'sc_shipment' },
        { text: '实际开船日', id: 'bk_bl' },
        { text: '预计到货日', id: 'bk_eta' },
      ],
      terms: [],
    }
  },
  computed: {
    prePayMap() {
      return this.prePayMap2._object()
    },
    payableMap() {
      return this.payableMap2._object()
    },
  },
  methods: {
    toText(item) {
      let text = ''
      if (item.cut_point_cond) {
        let days = item.days * 1
        days = days ? `${days} days ` : ''
        text = `${item.percent}% ${item.type} ${days}${item.cut_point_cond}; `
      } else {
        text += item.percent + '% ' + item.type + '; '
      }
      return text
    },
    setText(row) {
      row.text = this.toText(row)
    },
    getTerms() {
      return this.terms.map(m => m.text).join('')
    },
    onChangePaymentTypes(v) {
      this.setText(v)
      let p = paymentMixCond(v.type) || []
      v.x_paymentConds = p
      // console.log(v.type, v.x_paymentConds)
      if (!p.length) {
        v.cut_point_cond = ''
        v.days = ''
        return
      }
      v.days = v.days || 30
      let bool = p.find(val => val.en === v.cut_point_cond)
      if (!bool) v.cut_point_cond = p[0].en
    },
    onCheckOnly(item, index) {
      // let flag = true
      // for (let i = 0; i < this.terms.length; i++) {
      //   if (
      //     i !== index &&
      //     this.terms[i].cut_point_cond === item.cut_point_cond
      //   ) {
      //     item.cut_point_cond = ''
      //     flag = false
      //     this.$message.warning('不能存在同样的类型')
      //     break
      //   }
      // }
      this.setText(item)
      // return flag
    },
    onAddpayment() {
      let count = 0
      this.terms.forEach(function(item) {
        count += Number(item.percent)
      })
      if (count >= 100) {
        this.$message.warning('超过100不行')
      } else {
        let payment = { ...fmt }
        payment.percent = 100 - count
        payment.type = this.paymentTypes[0].en
        payment.time_point = ''
        payment.text = this.toText(payment)
        payment.x_paymentConds = paymentMixCond(payment.type)
        payment.cut_point_cond = payment.x_paymentConds[0].en
        this.terms.push(payment)
      }
    },
    onCheckSubmit() {
      let pre = 0
      let pay = 0
      let payment = this.terms
      let isError = ''
      let exitMap = {}
      let count = 0
      let timePointIsNull = false
      for (let i = 0; i < payment.length; i++) {
        let { cut_point_cond: type, percent, time_point } = payment[i]
        this.prePayMap[type] && pre++
        this.payableMap[type] && pay++
        if (pay > 1) {
          isError = '应收只能存在一条'
          break
        }
        if (pre > 2) {
          isError = '预收不能超过2条'
          break
        }
        if (exitMap[type]) {
          isError = '不能存在同样的类型'
          break
        }
        exitMap[type] = 1
        count += percent * 1 || 0
        timePointIsNull = timePointIsNull || !time_point
      }
      console.log(count, 'countcount')
      if (count !== 100) isError = isError || '累计必须等于100%'
      if (timePointIsNull) isError = isError || 'Point of Time 不能为空'
      if (isError) this.$message.warning(isError)
      return isError
    },
    onDeletepaymentTime(index) {
      this.terms.splice(index, 1)
    },
    initialize() {
      let terms = this.vm.payment_params.parse() || []
      this.terms = terms.map(m => {
        m = {...fmt, ...m}
        m.x_paymentConds = paymentMixCond(m.type)
        return m
      })
      if (!this.terms.length) this.onAddpayment()
    },
    onConfirm,
  },
  components: {},
  created() {
    this.initialize()
  },
}
</script>
