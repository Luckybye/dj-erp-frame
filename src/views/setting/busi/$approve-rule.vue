<template lang="html">
  <div class="approve-rule">
    <x-table :data="tableData">
      <x-table-column type="index" width="50"></x-table-column>
      <x-table-column>
        <t slot="header" path="">业务类型</t>
        <template slot-scope="{row}">
          <div>{{row.name}}</div>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="">状态</t>
        <template slot-scope="{row}">
          <x-check :result="viewModel.busi_type[row.x_key]" field="status" expect="normal" unexpect="stopped" text="启用" @change="changeHandle(row.x_key)"></x-check>
          <br>
          <x-check :result="viewModel.busi_type[row.x_key]" field="status" expect="stopped" unexpect="normal" text="禁用" @change="changeHandle(row.x_key)" class="mt10"></x-check>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="">审批人</t>
        <template slot-scope="{row}">
          <div @click="_self.onEdit(row, {explain: true})">
            <div v-for="approver in row.approvers" class="approver a-link" :key="approver.user_id">
                {{approver.user_name}}
            </div>
          </div>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="">审批说明</t>
        <template slot-scope="{row}">
          <div v-html="row.explain"></div>
        </template>
      </x-table-column>
      <x-table-column width="100">
        <t slot="header" path="action">操作</t>
        <template slot-scope="{row}">
          <el-button type="text" v-if="!isOperate" @click="onEdit(row)"><t path="edit">编辑</t></el-button>
        </template>
      </x-table-column>
    </x-table>
  </div>
</template>

<script>
export default {
  options: {
    icon: 'icon-set',
  },
  data() {
    return {
      viewModel: {
        busi_type: {
          approve_purchase: {
            name: '采购审批',
            approvers: [],
            status: '',
            explain: ''
          },
          approve_contract: {
            name: '销售审批',
            approvers: [],
            status: '',
            explain: ''
          },
          approve_customer: {
            name: '客户引入审批',
            approvers: [],
            status: '',
            explain: ''
          },
          approve_supplier: {
            name: '供应商引入审批',
            approvers: [],
            status: '',
            explain: ''
          },
          approve_inland_freight: {
            name: '国内运费审批',
            approvers: [],
            status: '',
            explain: ''
          },
          approve_ocean_freight: {
            name: '海运费审批',
            approvers: [],
            status: '',
            explain: ''
          },
          approve_local_charge: {
            name: '港杂费审批',
            approvers: [],
            status: '',
            explain: ''
          },
          approve_premium: {
            name: '保险费审批',
            approvers: [],
            status: '',
            explain: ''
          },
          approve_amt_pu1: {
            name: '采购预付货款审批',
            approvers: [],
            status: '',
            explain: ''
          },
          approve_amt_pu9: {
            name: '采购应付货款审批',
            approvers: [],
            status: '',
            explain: ''
          },
          approve_amt_comm9: {
            name: '佣金审批',
            approvers: [],
            status: '',
            explain: ''
          },
          approve_claim: {
            name: '索赔审批',
            approvers: [],
            status: '',
            explain: ''
          },
          approve_bk_settle: {
            name: '结算审批',
            approvers: [],
            status: '',
            explain: ''
          },
          approve_pu_settle: {
            name: '采购结算审批',
            approvers: [],
            status: '',
            explain: ''
          },
        }
      },
      instance: ''
    }
  },
  methods: {
    refresh (field) {
      this.$configure.getValue(field, this.instance).then(v => {
        Object.assign(
          this.viewModel.busi_type[field],
          v
        )
      })
    },
    onEdit (row, disabled = {}) {
      this.$dialog.AddApprover({row, disabled}, data => {
        this.$post('/api/support/setConfigure', {
          instance: this.instance,
          field: row.x_key,
          value: data
        }, {loading: true}).then(res => this.refresh(row.x_key))
      })
    },
    changeHandle (field) {
      this.$post('/api/support/setConfigure', {
        instance: this.instance,
        field: field,
        value: this.viewModel.busi_type[field]
      }, {loading: true}).then(res => this.refresh(field))
    },
    initialize () {
      Object.keys(this.viewModel.busi_type).forEach(key => {
        this.refresh(key)
      })
    },
    onSave(field) {
      return this.$configure
        .setValue(field, { [field]: this[field] }, this.instance)
    },
  },
  computed: {
    isOperate() {
      return !/^(1|2){1}$/.test(this.$state('me').role * 1)
    },
    tableData () {
      return Object.entries(this.viewModel.busi_type).map(([key, value]) => ({...value, x_key: key}))
    }
  },
  created() {
    this.instance = this.payload.instance || this.$state('me').com_id
    this.initialize()
  },
}
</script>
