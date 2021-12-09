<template>
  <el-dialog
    :visible="true"
    width="30%"
    @close="onClose"
    :close-on-click-modal="false"
  >
    <p class="left-border-title" slot="title">
      {{ bank.bank_id ? '修改银行信息' : '新建银行' }}
    </p>
    <el-form label-position="left" label-width="100px">
      <el-form-item label="开户银行:">
        <x-input
          width="80%"
          :result="viewModel"
          field="bank_name"
          rules="require,minLen=2"
        ></x-input>
      </el-form-item>
      <el-form-item label="银行账号:">
        <x-input
          width="80%"
          :result="viewModel"
          field="bank_account"
          rules="require,minLen=2"
        ></x-input>
      </el-form-item>
      <el-form-item label="银行代码:">
        <x-input
          width="80%"
          :result="viewModel"
          field="swift_bic"
          rules="require,minLen=2"
        ></x-input>
      </el-form-item>
      <el-form-item label="币种:">
        <select-currency width="80%" :result="viewModel" field="currency">
        </select-currency>
      </el-form-item>
      <el-form-item v-if="viewModel.currency !== 'CNY'" label="中间行:">
        <x-input
          width="80%"
          :result="viewModel"
          field="intermediary_bank"
          rules="minLen=2"
        ></x-input>
      </el-form-item>

      <el-form-item v-if="viewModel.currency !== 'CNY'" label="中间行SWIFT:">
        <x-input
          width="80%"
          :result="viewModel"
          field="inter_swift_bic"
          rules="minLen=2"
        ></x-input>
      </el-form-item>

      <el-form-item v-if="viewModel.currency !== 'CNY'" label="签章文件:">
        <x-upload img-width="100px" v-model="viewModel.mg_sign_files" @change="onchange"></x-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="onClick">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
let fmt = {
  bank_name: '',
  swift_bic: '',
  bank_account: '',
  currency: 'CNY',
  intermediary_bank: '',
  inter_swift_bic: '',
  mg_sign_files: []
}
function onClick() {
  if (!this.viewModel.bank_name || !this.viewModel.bank_account) {
    this.$message('缺少必要信息')
    return
  }
  this.onCallback(this.viewModel).then(() => {
    this.onClose()
  })
}
function initialize() {
  this.viewModel = { ...this.viewModel, ...this.bank }
}
export default {
  data() {
    return {
      viewModel: { ...fmt },
    }
  },
  methods: {
    onClick,
    onchange (v) {
      console.log(this.viewModel)
      // this.$configure.setValue('mg_sign', {mg_sign: this.viewModel.mg_sign}, this.viewModel.bank_id).then(res => {
      // })
    }
  },
  created() {
    initialize.call(this)
  },
}
</script>
