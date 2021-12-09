<template>
  <el-dialog
    :visible="true"
    width="50%"
    @close="onClose"
    :close-on-click-modal="false"
  >
    <div slot="title" class="text-18">
      {{ !vm.id ? 'Create New Title' : 'Edit Title' }}
    </div>

    <el-form ref="idealForm" label-position="left" label-width="80px" :model="vm" :rules="rules">
      <el-form-item label="简称:" prop="short_name">
        <x-input width="100%" :result="vm" field="short_name"></x-input>
      </el-form-item>

      <el-form-item label="抬头:" prop="title">
        <x-input
          type="textarea"
          width="100%"
          :result="vm"
          field="title"
        ></x-input>
      </el-form-item>

      <el-form-item label="收货人:" prop="consignee">
        <x-input
          type="textarea"
          width="100%"
          :result="vm"
          field="consignee"
        ></x-input>
      </el-form-item>

      <el-form-item label="目的港:" prop="port_code">
        <select-port
          :result="vm"
          width="100%"
          field="port_code"
          @change="onSelectPort"
        ></select-port>
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
    let fmt = {
      short_name: '',
      title: '',
      consignee: '',
      port_code: '',
    }
    return {
      vm: {
        ...fmt,
      },
      rules: this.$createRules(fmt),
    }
  },
  methods: {
    initialize() {},
    onSelectPort(item) {
      this.vm.port = item
    },
    async onConfirm() {
      let valid = await this.$refs.idealForm.validate()
      if (!valid) return
      await this.onCallback(this.vm)
      this.onClose()
    },
  },
  created() {
    this.initialize()
  },
}
</script>

<style scoped>
.img-el-form-item {
  height: 90px;
  label {
    vertical-align: left;
  }
}
</style>
