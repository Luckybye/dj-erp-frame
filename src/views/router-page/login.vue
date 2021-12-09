<template>
  <div class="dj-login">
    <div class="login-wrap">
      <div class="login-title">{{$t('welcome')}}</div>

      <el-form ref="form" :model="vm" :rules="rules" size="medium">
        <el-form-item label="" prop="user_mail">
          <!-- <div class="label">{{$t('email_addr')}}</div> -->
          <el-input
            v-model="vm.user_mail"
            clearable
            @keypress.enter.native="onLogin"
            :placeholder="$t('email_addr')">
          </el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <!-- <div class="label">{{$t('password')}}</div> -->
          <el-input
            v-model="vm.password"
            clearable
            type="password"
            @keypress.enter.native="onLogin"
            :placeholder="$t('password')">
          </el-input>
        </el-form-item>
      </el-form>

      <div class="other-action flex-b">
        <div class="sign-up a-item">
          <span @click="signUp" class="pointer">{{$t('sign_up')}}</span>
        </div>
        <div class="forget-pwd a-item">
          <span @click="forgetPwd" class="pointer">{{$t('forget_pwd')}}</span>
        </div>
      </div>

      <div class="login-btn" @click="onLogin">
        {{$t('login')}}
      </div>

      <div class="other-action flex-b">
        <div class="help a-item">
          <span @click="viewHelp" class="pointer">{{$t('help')}}</span>
        </div>
        <div class="term a-item">
          <span @click="viewTerm" class="pointer">{{$t('term')}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
      vm: {
        user_mail: '',
        password: ''
      },
      rules: {
        user_mail: [
          {
            validator: (rule, val, cb) => {
              let v = this.$validate('mail', val)
              if (v) {
                cb(this.$t(v.hint))
              } else cb()
            },
            trigger: 'blur'
          }
        ],
        password: [
          {
            validator: (rule, val, cb) => {
              if (!val) {
                cb(this.$t('require'))
              } else cb()
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    forgetPwd () {
      this.$prompt(this.$t('pls_input_mail_reset_pwd'), this.$t('tip'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: this.$t('illegal_mail'),
        inputValue: this.vm.user_mail
      }).then(({ value }) => {
        this.$get('/api/system/applyResetPassword', {user_mail: value}).then(() => {
          this.$message(this.$t('reset_pwd_tip'))
        })
      })
    },
    async onLogin () {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        let para = {...this.vm}
        para.password = this.$h.encrypt(para.password)

        para.host = this.$h.getHost()
        para.login_domain = this.$root.login_domain

        await this.$get('/api/system/signin', para)
        let {redirect} = this.$route.query
        let lastUser = window.localStorage.getItem('last_login_user')
        if (lastUser !== this.vm.user_mail) {
          redirect = '/'
          window.localStorage.setItem('last_login_user', this.vm.user_mail)
        }
        this.$router.replace(redirect || '/').then(() => {
          // this.$tab.reShow()
          location.reload()
        }).catch((e) => {
          console.log(e, 'eeeeeeeeee')
          location.reload()
        })
      })
    },
    signUp () {},
    viewHelp () {},
    viewTerm () {},
  },
  created () {
  }
}
</script>
<style lang="scss">
.dj-login {
  height: 100vh;
  background: linear-gradient(-45deg, #fff, #555ABF);
  background-image: url('https://dximg3.oss-cn-hangzhou.aliyuncs.com/20/6/2/1331586_5ed5fccd1ad8b680c98c5a4b_b9ee39dc8e01.png');
  background-size: 100% 100%;
  font-family:HelveticaNeue-Light,HelveticaNeue;
  padding: 20px;
  .login-wrap {
    background: white;
    max-width: 360px;
    width: 100%;
    margin: auto;
    position: relative;
    top: 50%;
    transform: translateY(-80%);
    box-shadow:0px 2px 15px 2px rgba(75,75,75,0.04);
    border-radius:4px;
    padding: 40px;
    .login-title {
      font-size:36px;
      font-weight:300;
      color:rgba(46,91,255,1);
      margin-bottom: 30px;
    }
    .el-form-item {
      margin-top: 20px;
    }
    .other-action {
      font-size:12px;
      color:rgba(183,188,214,1);
      .a-item {
        border-bottom: 1px solid #B7BCD6;
      }
    }
    .login-btn {
      color: white;
      background:rgba(46,91,255,1);
      border-radius:4px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      margin: 10px 0;
    }
  }
}
</style>
