<template>
  <el-dialog
    visible
    width="500px"
    @close="onClose"
    :close-on-click-modal="false"
    :title="title || $t('sc.sc_create')">
    <div class="d-content">
      <select-cust :result="vm" field="buyer_id" field2="contact" label-width="70px" width="100%" :label="$t('sc.buyer')"></select-cust>
      <select-our-com :result="vm" field="seller_id" label-width="70px" width="100%" class="mt20" :label="$t('sc.seller')"></select-our-com>
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
      title: '',
      vm: {
        seller_id: '',
        buyer_id: '',
        contact: ''
      },
    }
  },
  computed: {},
  methods: {
    async onConfirm() {
      let {seller_id, buyer_id} = this.vm
      if (!seller_id || !buyer_id) return
      this.onCallback(this.vm).then(() => {
        this.onClose()
      })
    }
  },
  created() {},
};
</script>

<style lang="scss">
.sc-create-dialog {
}
</style>
