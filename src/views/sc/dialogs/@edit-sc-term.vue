<template>
  <el-dialog
    :visible="true"
    width="normal"
    @close="onClose"
    :close-on-click-modal="false"
  >
    <div class="" slot="title"><t path="sc.other" colon>Other</t></div>
    <div class="d-content">
      <x-input
        field="commission_rate"
        labelWidth="120px"
        width="100%"
        v-input="{rule: 'number,min=0,max=100'}"
        :disabled="true"
        :result="vm.mg_charge">
        <t slot="label" path="sc.other_expense" colon>Other Expense:</t>
      </x-input>
      <x-table :data="vm.mg_charge.commissions" class="mt10">
        <x-table-column>
          <t slot="header" path="sc.target">Target</t>
          <template slot-scope="{row}">
            <select-cust-com
              :result="row"
              field="commission_cust_id"
              width="100%"
              :pm="{custType: '2'}"></select-cust-com>
          </template>
        </x-table-column>
        <x-table-column width="100">
          <t slot="header" path="sc.percent">Percent</t>
          <template slot-scope="{row}">
            <x-input
              field="commission_rate"
              width="100%"
              v-input="{rule: 'number,min=0,max=100'}"
              :disabled="isReadonly"
              @change="onChange()"
              :result="row">
            </x-input>
          </template>
        </x-table-column>
        <x-table-column width="50">
          <t slot="header" path="action"></t>
          <template slot-scope="{row, $index}">
            <el-button type="text" @click="onDelete(row, $index)" v-if="$index !== 0 && !isReadonly">
              <t path="delete">delete</t>
            </el-button>
          </template>
        </x-table-column>
      </x-table>
      <el-button v-if="!isReadonly" class="btn float-right" @click="onAdd()">
        <t path="add">Add</t>
      </el-button>
    </div>
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
      vm: {
        mg_charge: {
          commissions: []
        }
      },
      cust_com_id: '',
      isReadonly: false
    };
  },
  computed: {},
  methods: {
    onConfirm() {
      this.onCallback(this.vm).then(() => {
        this.onClose();
      });
    },
    getData () {
      console.log('this.vm', this.vm)
      if (this.cust_com_id !== '') {
        console.log('this.vm.mg_charge:', this.vm.mg_charge)
        if (!this.vm.mg_charge.commissions || !this.vm.mg_charge.commissions.length) {
          this.vm.mg_charge.commissions = [{
            commission_rate: this.vm.mg_charge.commission_rate || 0,
            commission_cust_id: this.cust_com_id || ''
          }]
        }
      }
    },
    onAdd () {
      let cust = this.cust_com_id || ''
      if (this.vm.mg_charge.commissions.length > 0) {
        cust = this.cust_com_id || this.vm.mg_charge.commissions[this.vm.mg_charge.commissions.length - 1].cust_com_id || ''
      }
      this.vm.mg_charge.commissions.push({
        commission_rate: 0,
        commission_cust_id: cust
      })
    },
    onChange () {
      let total = 0
      this.vm.mg_charge.commissions.forEach(item => {
        total += item.commission_rate * 1 || 0
      })
      this.vm.mg_charge.commission_rate = total
      console.log(this.vm)
    },
    onDelete (row, index) {
      this.vm.mg_charge.commissions.splice(index, 1)
    },
  },
  created() {
    this.getData()
  },
};
</script>
<style lang="scss">
</style>
