<template>
  <el-dialog
    :visible="true"
    width="784px"
    @close="onClose"
    :close-on-click-modal="false"
    title="付款方式"
  >
    <div>
      <div class="left-border-title">
        Payment:
      </div>
      <div class="terms mb10" v-for="(item, index) in terms" :key="index">
        <div class="flex">
          <span class="flex-middle">{{ index + 1 }}</span>

          <div class="flex-1 mh20">
            <x-select
              :source="paymentTime"
              @change="setText(item)"
              :result="item"
              field="type"
              width="120px"
              :map="{ label: 'cn', value: 'cn' }"
            ></x-select>
            <x-input
              width="70px"
              field="days"
              :result="item"
              unit="天"
              @blur-change="setText(item)"
            ></x-input>
            <span>&#X3000;向供方支付</span>
            <x-input
              width="70px"
              field="percent"
              :result="item"
              unit="%"
              type="number"
              @blur-change="setText(item)"
            ></x-input>
            <span>货款</span>
            <x-select
              :source="paymentConds"
              @change="setText(item)"
              :result="item"
              field="cut_point_cond"
              width="130px"
              :map="{ label: 'cn', value: 'value' }"
            ></x-select>
            <x-select
              width="150px"
              :result="item"
              :source="timePoint"
              :map="{ label: 'text', value: 'id' }"
              field="time_point"
              placeholder="Point of Time"
            ></x-select>
            <x-input
              width="100%"
              :result="item"
              field="text"
            ></x-input>
          </div>

          <div class="flex-middle">
            <el-button
              @click="onAddpaymentTime(index)"
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
        描述:
      </div>
      <div>{{ getTerms() }}</div>

      <div class="left-border-title mt20">
        结算方式
      </div>
      <div>
        <el-checkbox v-model="vm.pu_st_type" true-label="ship" false-label="arrival" class="mr20">发货</el-checkbox>
        <el-checkbox v-model="vm.pu_st_type" true-label="arrival" false-label="ship" class="mr20">入库</el-checkbox>
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
let fmt = {
  percent: 100,
  days: 45,
  type: '合同签订后',
  cut_point_cond: '',
  time_point: '',
  text: '合同签订后45天，需方向供方支付100%的货款；',
}
function onConfirm() {
  if (this.onCheckSubmit()) return
  let text = ''
  this.terms.forEach(item => {
    text += this.toText(item)
  })
  this.vm.payment_text = text
  this.vm.payment_desc = this.getTerms()
  this.vm.payment_params = JSON.stringify(this.terms)

  this.onCallback(this.vm).then(() => {
    this.onClose()
  })
}
export default {
  data() {
    return {
      vm: {},
      paymentTime: [
        { cn: '合同签订后', type: 'pre' },
        { cn: '交货前', type: 'pre' },
        { cn: '进仓后' },
        { cn: '货物出运后' },
      ],
      paymentConds: [
        { cn: '空白', value: '' },
        { cn: 'L/C', value: 'L/C' },
        { cn: 'L/C at sight', value: 'L/C at sight' },
        { cn: 'T/T', value: 'T/T' },
      ],
      timePoint: [
        { text: '订单生效日', id: 'pu_valid' },
        { text: '计划发货日', id: 'pu_delivery' },
        { text: '实际开船日', id: 'bk_bl' },
        { text: '实际到货日', id: 'invein_valid' },
      ],
      terms: [],
    }
  },
  computed: {
    prePayMap() {
      return this.paymentTime.filter(f => f.type === 'pre')._object('cn')
    },
    payableMap() {
      return this.paymentTime.filter(f => f.type !== 'pre')._object('cn')
    },
  },
  methods: {
    toText(val) {
      let day = val.days * 1 || ''
      return `${val.type}${day}${day && '天'}，需方向供方支付${
        val.percent
      }%的货款${val.cut_point_cond ? ',' + val.cut_point_cond : ''}；`
    },
    setText(row) {
      row.text = this.toText(row)
    },
    getTerms() {
      return this.terms.map(m => m.text).join('')
    },
    onAddpaymentTime() {
      let count = 0
      this.terms.forEach(function(item) {
        count += Number(item.percent)
      })
      if (count >= 100) {
        this.$message.warning('超过100不行')
      } else {
        let payment = { ...fmt }
        payment.percent = 100 - count
        payment.type = '合同签订后'
        payment.time_point = ''
        payment.text = this.toText(payment)
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
        let { type, percent, time_point } = payment[i]
        this.prePayMap[type] && pre++
        this.payableMap[type] && pay++
        if (pay > 1) {
          isError = '应付只能存在一条'
          break
        }
        if (pre > 2) {
          isError = '预付不能超过2条'
          break
        }
        if (exitMap[type]) {
          isError = '不能存在同样的类型'
          break
        }
        exitMap[type] = 1
        count += (percent * 1 || 0)
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
      this.terms = (this.vm.payment_params.parse() || [])._fmt(fmt)
      if (!this.terms.length) this.onAddpaymentTime()
    },
    onConfirm,
  },
  components: {},
  created() {
    this.initialize()
  },
}
</script>
