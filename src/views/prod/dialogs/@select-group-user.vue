<template>
  <el-dialog
    :visible="true"
    width="500px"
    @close="onClose"
    :close-on-click-modal="false">
    <div class="d-content">
      <select-group-user field="busi_group_id" field2="owner_id" :result="vm" @change="onChange" width="100%" :checkStrictly="false" :pm="{addCom, addPublic}"></select-group-user>
    </div>

    <span
      slot="footer"
      class="dialog-footer">
      <el-button @click="onClose">{{$t('cancel')}}</el-button>
      <el-button
        type="primary"
        @click="onConfirm"
      >{{$t('confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      vm: {
        busi_group_id: '',
        owner_id: ''
      },
      selectOption: {},
      addCom: false,
      addPublic: false,
    }
  },
  computed: {},
  methods: {
    async onConfirm() {
      this.onCallback(this.vm, this.selectOption).then(() => {
        this.onClose()
      })
    },
    onChange (_, v) {
      v = v || []
      this.vm.x_busi_group_id = (v[0] || {}).busi_group_name || ''
      this.vm.x_owner_id = (v[1] || {}).user_name || ''
      this.vm.x_owner_id_en = (v[1] || {}).user_name_en || ''
      this.selectOption = v
    }
  },
  created() {},
};
</script>

<style lang="scss">
.select-cust-com-dialog {
}
</style>
