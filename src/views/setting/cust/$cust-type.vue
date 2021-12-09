<template>
  <div class="cust-level">
    <div class="tab-page-header">
      <div class="flex-b mt10">
        <div class="t-left">
          <div>提示:建议将利润率最高的客户类型设为默认值</div>
        </div>
        <div class="t-right">
          <el-button @click="newCustmoerType"><t path="cust.add">添加</t></el-button>
        </div>
      </div>
    </div>
    <div class="content">
      <x-table :data="viewModel.customer_type">
        <x-table-column type="index" width="50"></x-table-column>
        <x-table-column>
          <t slot="header" path="cust.cust_type">企业性质</t>
          <template slot-scope="{row}">
            <div>{{row.text}}</div>
          </template>
        </x-table-column>
        <x-table-column>
          <t slot="header" path="cust.pricing_factor">目标利润率</t>
          <template slot-scope="{row}">
            <div>{{row.value}}</div>
          </template>
        </x-table-column>
        <x-table-column>
          <t slot="header" path="action">操作</t>
          <template slot-scope="{row, $index}">
            <el-button type="text" v-if="isOperate" @click="onCustomerEdit(row)">
              <t path="edit">编辑</t>
            </el-button>
            <el-button type="text" v-if="isOperate" class="text-red" @click="onReceiptDel($index, 'customer_type')">
              <t path="delete">删除</t>
            </el-button>
            <el-button type="text" v-if="isOperate" :class="$index !== 0 ? 'text-grey' : 'text-blue'" @click="onSetDefault($index, 'customer_type')">
              <t path="default">默认</t>
            </el-button>
          </template>
        </x-table-column>
      </x-table>
    </div>
  </div>
</template>

<script>
let fmt = {
  customer_type: [
  ]
}
function duplicateRemove (arr) {
  const tempArr = []
  return arr.filter(item => {
    const duplicate = tempArr.some(tempItem => {
      return item.text === tempItem.text
    })
    if (duplicate) return false
    tempArr.push(item)
    return true
  })
}
function onCustomerSave () {
  let self = this
  let v = self.viewModel.customer_type
  if (v[self.edit_index].text && v[self.edit_index].value) {
    self.viewModel.customer_type = duplicateRemove(v)
    console.log(self.viewModel.customer_type)
    return self.onSetValue('customer_type').then(() => {
      self.edit_index = null
    })
  }
}
function initialize () {
  const self = this
  self.onGetValue('customer_type')
}
export default {
  options: {
    icon_text: 'B2B'
  },
  data() {
    const self = this
    let me = self.$state('me')
    return {
      viewModel: self.$h.cloneDeep(fmt),
      instance: me.com_id,
      edit_index: null
    }
  },
  watch: {},
  methods: {
    initialize,
    newCustmoerType () {
      this.$dialog.AddCustomerType({title: '新建'}, res => {
        this.viewModel.customer_type.push({text: res.value, value: res.rate})
        this.onSetValue('customer_type')
      })
    },
    onCustomerEdit (row) {
      this.$dialog.AddCustomerType({title: '编辑', row: row}, res => {
        row.text = res.value
        row.value = res.rate
        this.onSetValue('customer_type')
      })
    },
    onGetValue (field) {
      this.$configure.getValue(field, this.instance).then(res => {
        this.viewModel[field] = res[field] || this.viewModel[field]
      })
    },
    onSetValue(field) {
      return this.$configure.setValue(field, {[field]: this.viewModel[field]}, this.instance).then(res => {
        console.log(res)
      })
    },
    onSetDefault (index, field) {
      const self = this
      let t = self.viewModel[field][index]
      self.viewModel[field].splice(index, 1)
      self.viewModel[field].unshift(t)
      self.onSetValue(field)
    },
    onReceiptDel (index, field) {
      const self = this
      if (self.viewModel[field].length < 2) {
        self.$message('必须存在一条')
        return
      }
      self.viewModel[field].splice(index, 1)
      self.onSetValue(field)
    },
    onCustomerSave
  },
  computed: {
    isOperate () {
      let role = this.$state('me').role
      return role === '1' || role === '2'
    }
  },
  created() {
    this.initialize();
  },
};
</script>
<style lang="scss">
.stats-brand {
  table {
    font-size: 14px;
    color: #606266;
    thead {
      color: #909399;
      font-weight: 500;
      text-align: left;
    }
    th,
    td {
      border-color: #ebeef5;
      padding: 5px 10px;
    }
  }
}
</style>
