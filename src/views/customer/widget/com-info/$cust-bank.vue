<template lang="html">
  <div class="basic-info">
    <el-form label-position="left" label-width="90px">
      <el-row type="flex" :gutter="50">

        <el-col :span="16">
          <el-form-item>
            <t slot="label" path="cust.bank_name" colon>银行名称:</t>
            <x-input :result="bankVm" field="bank_name" width="100%" @save="onSaveBank" :disabled="disabled" :disabledMap="disabledMap"></x-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <t slot="label" path="cust.bank_account" colon>银行账号:</t>
            <x-input :result="bankVm" field="bank_account" width="100%" @save="onSaveBank" :disabled="disabled" :disabledMap="disabledMap"></x-input>
          </el-form-item>
        </el-col>

        <el-col :span="16">
          <el-form-item>
            <t slot="label" path="cust.bank_address" colon>银行地址:</t>
            <x-input :result="bankVm" field="bank_address" width="100%" @save="onSaveBank" :disabled="disabled" :disabledMap="disabledMap"></x-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <t slot="label" path="cust.swift_bic" colon>银行代码:</t>
            <x-input :result="bankVm" field="swift_bic" width="100%" @save="onSaveBank" :disabled="disabled" :disabledMap="disabledMap"></x-input>
          </el-form-item>
        </el-col>

        <el-col :span="16">
          <el-form-item>
            <t slot="label" path="cust.intermediary_bank" colon>中间行名称:</t>
            <x-input :result="bankVm" field="intermediary_bank" width="100%" @save="onSaveBank" :disabled="disabled" :disabledMap="disabledMap"></x-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <t slot="label" path="cust.inter_swift_bic" colon>中间行代码:</t>
            <x-input :result="bankVm" field="inter_swift_bic" width="100%" @save="onSaveBank" :disabled="disabled" :disabledMap="disabledMap"></x-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import Mixins from "../../pages/mixins";
let fmt = {
  bank_name: '',
  bank_account: '',
  bank_address: '',
  swift_bic: '',
  intermediary_bank: '',
  inter_swift_bic: ''
}
export default {
  mixins: [Mixins],
  data() {
    return {
      bankVm: {...fmt}
    }
  },
  computed: {
  },
  methods: {
    async queryCustBank () {
      if (!this.payload.cust_com_id) return;
      let v = await this.$get2('/api/crm/queryCustBank', {cust_com_id: this.payload.cust_com_id})
      this.bankVm = {...this.bankVm, ...v.cust_company_bank[0]}
      this.bankVm.cust_com_id = this.payload.cust_com_id
    },
    onSaveBank () {
      if (!this.bankVm.bank_account) return
      let para = Object._merge(fmt, this.bankVm)
      let {cust_com_id, bank_id} = this.bankVm
      return this.$post2('/api/crm/modifyCustCompanyBank', {
        cust_com_id, bank_id, ...para
      }).then((d) => {
        this.bankVm.bank_id = d.cust_company_bank.bank_id
      })
    },
  },
  created () {
    this.queryCustBank()
  },
  beforeDestroy() {}
}
</script>
