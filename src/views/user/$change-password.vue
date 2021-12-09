<template lang="html">
  <div class="change-password">
    <el-form label-position="left" label-width="180px">
      <el-form-item>
        <t slot="label" path="user.old_pass" colon>旧密码:</t>
        <x-input
          width="80%"
          :result="vm"
          field="old_pass"
          type="password"
          showPassword
        ></x-input>
      </el-form-item>
      <el-form-item>
        <t slot="label" path="user.new_pass" colon>新密码:</t>
        <x-input
          width="80%"
          :result="vm"
          field="new_pass"
          type="password"
          showPassword
        ></x-input>
      </el-form-item>
      <el-form-item>
        <t slot="label" path="user.check_pass" colon>重复输入新密码:</t>
        <x-input
          width="80%"
          :result="vm"
          field="check_pass"
          type="password"
          showPassword
        ></x-input>
      </el-form-item>
    </el-form>

    <div class="text-center">
      <el-button @click="onChangePass" type="primary">{{
        $t('confirm')
      }}</el-button>
    </div>
  </div>
</template>
<script>
export default {
  options: { title: '个人设置', icon_text: 'Pwd' },
  data() {
    return {
      vm: {
        old_pass: '',
        new_pass: '',
        check_pass: '',
      },
    }
  },
  methods: {
    onChangePass() {
      if (!this.vm.old_pass || !this.vm.new_pass || !this.vm.check_pass) return
      if (this.vm.new_pass === this.vm.check_pass) {
        let para = {
          old_password: this.$h.encrypt(this.vm.old_pass),
          new_password: this.$h.encrypt(this.vm.new_pass),
        }
        this.$post2('/api/system/chgPassword', para, { loading: true }).then(
          v => {
            console.log(v)
            this.$message('密码修改成功')
            this.vm = {
              old_pass: '',
              new_pass: '',
              check_pass: '',
            }
          }
        )
      } else {
        this.$message('2次输入的密码不一致')
      }
    },
  },
  created() {},
}
</script>
<style scope></style>
