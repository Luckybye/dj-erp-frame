<template>
  <el-dialog
    :visible="true"
    width="50%"
    @close="onClose"
    :close-on-click-modal="false"
    title="Other"
  >
    <x-input
      :result="newValue.mg_charge"
      field="commission_rate"
      type="number"
      width="100%"
      rules="require,min=0,max=100"
      unit="%"
      disabled
    >
      <span slot="label">Other Expense:</span>
    </x-input>
    <x-table :data="newValue.mg_charge.commissions" class="mt10">
      <x-table-column label="Target" width="">
        <select-cust-com
          slot-scope="{ row }"
          field="commission_cust_id"
          :result="row"
          width="100%"
          :clearable="false"
          :disabled="disabled"
        ></select-cust-com>
      </x-table-column>
      <x-table-column label="Percent" width="150">
        <x-input
          :result="row"
          field="commission_rate"
          type="number"
          width="100%"
          rules="require,min=0,max=100"
          unit="%"
          @blur-change="onChange()"
          slot-scope="{ row }"
          :disabled="disabled"
        ></x-input>
      </x-table-column>
      <x-table-column label="Act" width="80">
        <span
          class="d-link"
          v-if="$index !== 0"
          @click="onDelete(row, $index)"
          slot-scope="{ row, $index }"
          >Del</span
        >
      </x-table-column>
    </x-table>
    <el-button class="btn float-right mt10" @click="onAdd" v-if="!disabled">添加</el-button>

    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="onClick" v-if="!disabled">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
function onClick() {
  this.onCallback(this.newValue).then(() => {
    this.onClose()
  })
}
export default {
  data() {
    return {
      newValue: {
        mg_charge: {
          commission_rate: '',
          commissions: [],
        },
      },
    }
  },
  methods: {
    onClick,
    initialize() {
    },
    onAdd() {
      let {commissions} = this.newValue.mg_charge
      commissions.push({
        commission_rate: 0,
        commission_cust_id: this.cust_com_id,
      })
    },
    onChange() {
      let total = 0
      this.newValue.mg_charge.commissions.forEach(item => {
        total += item.commission_rate || 0
      })
      this.newValue.mg_charge.commission_rate = total
    },
    onDelete(row, index) {
      this.newValue.mg_charge.commissions.splice(index, 1)
      this.onChange()
    },
  },
  created() {
    this.initialize()
  },
}
</script>
