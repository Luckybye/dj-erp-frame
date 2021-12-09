<template>
  <el-dialog
    :visible="true"
    width="50%"
    @close="onClose"
    :close-on-click-modal="false"
    title="新建付款要求文本"
  >
    <div class="text-red">
      说明：该文本仅用于{{ vm.currency }}的采购合同付款要求中
    </div>
    <x-input type="textarea" width="100%" field="text" :result="vm"></x-input>

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
        currency: 'CNY',
        text: '',
      },
    }
  },
  methods: {
    onConfirm() {
      let param = this.vm
      param.status || (param.status = 'normal')
      this.onCallback(param).then(() => {
        this.onClose()
      })
    },
  },
  created() {},
}
</script>
