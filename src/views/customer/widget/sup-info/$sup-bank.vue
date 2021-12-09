<template lang="html">
  <div class="sup-basic-info">
    <div class="text-right" v-tr-dom>
      <el-button @click="onSelectBank({})" icon="el-icon-plus" type="primary" v-if="!disabled"></el-button>
    </div>
    <x-table :data="banks">
      <x-table-column type="index" width=""></x-table-column>
      <x-table-column label="开户银行" width="">
        <span
          class="a-link"
          :class="{'dd-link':disabled}"
          slot-scope="{ row }"
          :style="{ color: row.status === 'normal' ? '' : 'grey' }"
          @click="onSelectBank(row)"
          >{{ row.bank_name }}</span
        >
      </x-table-column>
      <x-table-column label="银行账号" width="" prop="bank_account">
      </x-table-column>
      <x-table-column label="银行代码" width="" prop="swift_bic">
      </x-table-column>
      <x-table-column label="币种" width="" prop="currency"></x-table-column>
      <x-table-column label="操作" width="" v-if="!disabled">
        <template slot-scope="{ row }">
          <div v-if="row.is_default === 'yes'">
            <t class="text-green" path="cust.dflt">默认</t>
          </div>
          <div v-else-if="row.status === 'normal'">
            <t class="a-link" path="cust.set_dflt" @click="onDefaultLegal(row)"
              >设为默认</t
            >
          </div>
          <div v-if="row.status === 'normal'">
            <t class="d-link" path="stop" @click="onStopBank(row, 'stopped')" v-if="row.is_default !== 'yes'"
              >停用</t>
          </div>
          <div v-else>
            <t class="a-link" path="enable" @click="onStopBank(row, 'normal')"
              >启用</t>
          </div>
        </template>
      </x-table-column>
    </x-table>
  </div>
</template>
<script>
import Mixins from '../../pages/mixins'
// let fmt = {
//   bank_name: '',
//   bank_account: '',
//   bank_address: '',
//   swift_bic: '',
//   intermediary_bank: '',
//   inter_swift_bic: '',
// }
export default {
  mixins: [Mixins],
  data() {
    return {
      banks: [],
    }
  },
  computed: {},
  methods: {
    async queryCustBank() {
      if (!this.payload.cust_com_id) return
      let v = await this.$get('/api/crm/queryCustBank', {
        cust_com_id: this.payload.cust_com_id,
      })
      this.banks = v.cust_company_bank || []
    },
    onStopBank(item, val) {
      if (item.status === 'normal' && item.is_default !== 'no') {
        this.$message('默认银行不能被禁用')
        return
      }
      let v = { bank_id: item.bank_id }
      v.status = val
      return this.$post('/api/crm/modifyCustCompanyBank', v).then(data => {
        this.queryCustBank()
      })
    },
    onDefaultLegal(item) {
      if (item.status !== 'normal') {
        this.$message('未启用银行不能设为默认')
        return
      }
      let v = { bank_id: item.bank_id }
      v.is_default = 'yes'
      return this
        .$post('/api/crm/modifyCustCompanyBank', v, { loading: true })
        .then(data => {
          this.queryCustBank()
        })
    },
    onSelectBank(item) {
      this.$dialog.CrmBankAdd({ bank: item, disabled: this.disabled }, (data) => {
        if (!data.cust_com_id) data.cust_com_id = this.payload.cust_com_id
        return this
          .$post('/api/crm/modifyCustCompanyBank', data, { loading: true })
          .then((bank) => {
            this.queryCustBank()
          })
      })
    },
  },
  created() {
    this.queryCustBank()
  },
  beforeDestroy() {},
}
</script>
