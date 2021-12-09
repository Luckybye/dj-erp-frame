<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>其他费用:</t>
    <div class="flex">
      <x-input :result="vm.mg_charge" field="commission_rate" class="flex-1" @save="onSave('mg_charge')" :disabled="true" :disabledMap="disabledMap" type="number" unit="%"></x-input>
      <i class="el-icon-edit-outline text-17 text-blue lh-30 ml5" @click="onEditOther()"></i>
    </div>
  </el-form-item>
</template>
<script>
export default {
  props: {
  },
  data() {
    return {
    }
  },
  computed: {
  },
  methods: {
    onEditOther() {
      let {mg_charge, cust_com_id} = this.vm
      mg_charge.commissions || this.$set(mg_charge, 'commissions', [])
      this.$dialog.EditOtherFee({newValue: {mg_charge}, cust_com_id, disabled: this.disabled}, d => {
        Object.assign(this.vm, d)
        this.onSave('mg_charge')
      })
    }
  },
  created () {
  },
  beforeDestroy() {}
}
</script>
