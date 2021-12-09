<template>
  <div class="pwd-handler">
    <div>
      <x-input type="textarea" :result="vm" field="decryption"></x-input>
      <el-button @click="encryption" type="primary">加密</el-button>
    </div>
    <div class="mt10">
      <x-input type="textarea" :result="vm" field="encryption"></x-input>
      <el-button @click="decryption" type="primary">解密</el-button>
    </div>
  </div>
</template>
<script>
export default {
  options: {title: '密码加密解密'},
  data() {
    return {
      vm: {
        decryption: '',
        encryption: '',
      },
    }
  },
  methods: {
    decryption() {
      this.vm.decryption = this.$h.decrypt(this.vm.encryption)
    },
    encryption() {
      this.vm.encryption = this.$h.encrypt(this.vm.decryption)
    },
  },
}
</script>
<style lang="scss" scoped></style>
