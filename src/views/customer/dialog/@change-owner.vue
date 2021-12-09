<template>
  <el-dialog
    :visible="true"
    width="50%"
    @close="onClose"
    :close-on-click-modal="false"
  >
    <div class="" slot="title"><t path="change_owner" colon>批量变更客户经理</t></div>
    <el-form label-position="left" label-width="90px">
      <el-form-item>
        <t slot="label" path="owner" colon>客户经理:</t>
        <select-group-user
          width="100%"
          :result="vm"
          field="busi_group_id"
          field2="user_id"
          @change="change"></select-group-user>
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
      vm: {
        busi_group_id: '',
        user_id: ''
      }
    }
  },
  methods: {
    onConfirm() {
      if (!this.vm.busi_group_id || !this.vm.user_id) {
        this.$message('请选择客户经理')
        return
      }
      this.onCallback(this.vm).then(() => {
        this.onClose()
      })
    },
    initialize() {
    },
    change(v, a) {
      console.log('vhange', v)
      console.log('vhange', a)
    }
  },
  created() {
    this.initialize()
  },
}
</script>
