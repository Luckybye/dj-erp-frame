<template>
  <el-dialog visible width="80%" @close="onClose" :close-on-click-modal="false">
    <div class="text-bold text-15" slot="title">
      <span>工作组</span>
    </div>
    <el-form ref="form" label-width="100px">
      <el-form-item label="工作组：">
      <el-checkbox-group v-model="selectedGroups" @change="selectPublicGroup">
        <el-checkbox
          :label="$groupId"
        >{{$t('cust.public')}}</el-checkbox>
      </el-checkbox-group>
        <select-group
          v-model="selectedGroups"
          type="check"
          multiple
          width="100%"
          @change="selectOtherGroup"
        ></select-group>
      </el-form-item>
      <el-form-item label="默认联系人：">
        <x-select
          :source="custUsers"
          :map="{ value: 'cust_id', label: 'user_name' }"
          :result="vm"
          field="default_cust_id"
        ></x-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="onConfirm">{{
        $t('confirm')
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      custUsers: [],
      selectedGroups: [],
      vm: {
        default_cust_id: '',
      },
    }
  },
  computed: {},
  methods: {
    init() {
      this.queryCustUserList()
      this.queryCustBusiGroup()
    },
    async queryCustUserList() {
      let d = await this.$get('/api/crm/queryCustUserList', {
        cust_com_id: this.vm.cust_com_id,
      })
      this.custUsers = d.cust_users
    },
    async queryCustBusiGroup() {
      let d = await this.$get('/api/crm/queryCustBusiGroup', {
        cust_com_id: this.vm.cust_com_id,
      })
      this.selectedGroups = d.allocated_groups || []
    },
    selectPublicGroup (v) {
      if (v.length) this.selectedGroups = [this.$groupId]
    },
    selectOtherGroup () {
      let i = this.selectedGroups.indexOf(this.$groupId)
      i >= 0 && this.selectedGroups.splice(i, 1)
    },
    async onConfirm() {
      if (!this.selectedGroups.length) return this.$message.warning('请选择工作组')
      let {cust_com_id, default_cust_id} = this.vm
      let d = {
        cust_com_id,
        busi_groups: this.selectedGroups,
      }
      // if (!this.selectedGroups.includes(busi_group_id)) busi_group_id = this.selectedGroups[0]
      await this.$post2('/api/crm/allocateBusiGroups', d, {loading: true})
      await this.$post('/api/crm/updateCustCompany', {cust_com_id, default_cust_id}, {loading: true})
      this.onCallback().then(this.onClose)
    },
    changeMainUser() {
      let d = {
        cust_com_id: this.cust_com_id,
        default_cust_id: this.vm.default_cust_id,
      }
      return this.$post('/api/crm/updateCustCompany', d).then(() => {})
    },
  },
  created() {
    this.init()
  },
}
</script>
