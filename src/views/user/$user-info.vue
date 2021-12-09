<template>
  <div class="user-info">
    <div class="tab-page-header"></div>
    <el-form label-position="left" label-width="200px" ref="userForm" :rules="rules" :model="viewModel">
      <el-form-item prop="user_name">
        <t slot="label" path="user.user_name" colon>姓 名:</t>
          <x-input width="80%"
                       :result.sync="viewModel"
                       field="user_name"
                       rules="require"
                       skin="blue"></x-input>
      </el-form-item>
      <el-form-item prop="user_name_en">
        <t slot="label" path="user.user_name_en" colon>英文名:</t>
          <x-input width="80%"
                       :result.sync="viewModel"
                       field="user_name_en"
                       rules="require"
                       skin="blue"></x-input>
      </el-form-item>
      <el-form-item prop="user_mail">
        <t slot="label" path="user.user_mail" colon>登录邮箱:</t>
        <x-input
          width="80%"
          :result.sync="viewModel"
          field="user_mail"
          rules="require,mail"
          skin="blue"
          :readonly="viewModel.verified === 'mail'"></x-input>
        <span v-if="viewModel.verified !== 'mail'">
          <span v-if="waitingTime" class="pl10 text-grey">{{waitingTime}}s可重新发送，若没有收到请在垃圾箱看看或者联系管理员</span>
          <el-button type="text" skin="blue" @click="onVerifyMail" v-if="waitingTime===null"><t path="">验证</t></el-button>
          <el-button type="text" skin="blue" @click="refresh" v-if="waitingTime===0"><t path="">刷新</t></el-button>
        </span>
        <span v-else class="text-blue pl10">
          已验证
        </span>
      </el-form-item>
      <el-form-item prop="work_mail">
        <t slot="label" path="user.work_mail" colon>工作邮箱:</t>
        <x-input
          width="80%"
          :result.sync="viewModel"
          field="work_mail"
          rules="require,mail"
          skin="blue"></x-input>
      </el-form-item>
      <el-form-item>
        <t slot="label" path="user.email_pwd" colon>邮箱密码:</t>
        <x-input
          width="80%"
          :result.sync="viewModel"
          field="email_pwd"
          rules=""
          skin="blue"
          type="password"></x-input>
        <div class="text-12 text-red lh-n">
          此密码用于工作邮箱在本系统“代发”邮件时使用，一般企业邮箱输入邮箱密码即可，私人邮箱（如QQ和163邮箱）请输入授权码，具体请百度，如：
          <a class="text-blue" target="_blank" href="https://www.baidu.com/s?ie=UTF-8&wd=QQ%E9%82%AE%E7%AE%B1%E5%A6%82%E4%BD%95%E8%8E%B7%E5%8F%96%E6%8E%88%E6%9D%83%E7%A0%81">QQ邮箱如何获取授权码</a>
        </div>
      </el-form-item>
      <el-form-item>
        <t slot="label" path="user.smtp_host" colon>发送邮件服务器:</t>
        <x-input
          width="80%"
          :result.sync="viewModel.mg_mail_config"
          field="smtp_host"
          rules=""
          skin="blue"></x-input>
        <div class="text-12 text-red">
          如果你的邮箱是POP和IMAP类型，请配置发送邮件服务器(SMTP)(O)
        </div>
      </el-form-item>
      <el-form-item>
        <t slot="label" path="user.mg_mail_config" colon>是否要求安全连接(SSL):</t>
        <el-radio-group
          v-model="viewModel.mg_mail_config.is_ssl">
          <el-radio :label="true"><t path="user.yes">是</t></el-radio>
          <el-radio :label="false"><t path="user.no">否</t></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="phone">
        <t slot="label" path="user.phone" colon>手 机 号:</t>
        <x-input
          width="80%"
          :result.sync="viewModel"
          field="phone"
          rules="require,phone"
          skin="blue"
          :readonly="viewModel.phone_verify==='yes'"></x-input>
      </el-form-item>
      <el-form-item>
        <t slot="label" path="user.tel_number" colon>固定电话:</t>
        <x-input
          width="80%"
          :result.sync="viewModel"
          field="tel_number"
          rules=""
          skin="blue"></x-input>
      </el-form-item>
      <el-form-item>
        <t slot="label" path="user.photo" colon>照片:</t>
        <div style="display:flex;width:80%;justify-content: space-between">
          <span>
            <span style="overflow: hidden;display: inline-block;"><t path="user.mg_avatar">头像</t></span>
            <x-upload img-width="100px" :files="viewModel.mg_avatar" :limit="1"></x-upload>
          </span>
          <span>
            <span style="overflow: hidden;display: inline-block;"><t path="user.mg_en_card">英文名片</t></span>
            <x-upload img-width="100px" :files="viewModel.mg_en_card" :limit="1"></x-upload>
          </span>
          <span>
            <span style="overflow: hidden;display: inline-block;"><t path="user.mg_card">中文名片</t></span>
            <x-upload img-width="100px" :files="viewModel.mg_card" :limit="1"></x-upload>
          </span>
          <span>
            <span style="overflow: hidden;display: inline-block;"><t path="user.mg_e_signature">电子签章</t></span>
            <x-upload img-width="100px" :files="viewModel.mg_e_signature" :limit="1"></x-upload>
          </span>
        </div>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col :span="24" align="center">
        <el-button skin="blue" @click="onClick"><t path="save">保存</t></el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  options: {
    icon_text: 'User',
  },
  components: {},
  data() {
    return {
      viewModel: {
        role: "",
        user_name: "",
        user_name_en: "",
        user_mail: "",
        work_mail: '',
        phone: "",
        tel_number: "",
        position: "",
        mg_avatar: [],
        mg_en_card: [],
        mg_card: [],
        mg_e_signature: [],
        email_pwd: "",
        mg_mail_config: {
          smtp_host: "",
          is_ssl: true,
        },
      },
      apartmentInfo: [],
      waitingTime: null,
      rules: {
        user_name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
        ],
        user_name_en: [
          { required: true, message: '请输入英文名', trigger: 'blur' },
        ],
        user_mail: [
          { required: true, message: '请输入登录邮箱', trigger: 'blur' },
          { validator: this.checkEmail, trigger: 'blur' }
        ],
        work_mail: [
          { required: true, message: '请输入工作邮箱', trigger: 'blur' },
          { validator: this.checkEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          // { validator: this.checkPhone, trigger: 'blur' }
        ],
        tel_number: [
          { required: true, message: '固定电话', trigger: 'blur' },
        ],
      }
    };
  },
  methods: {
    onClick() {
      let self = this;
      self.$refs.userForm.validate((valid) => {
        if (valid) {
          console.log('preModel:', self.preModel)
          console.log('viewModel:', self.viewModel)
          let passModel = self.diffValue(
            'viewModel',
            "user_id"
          );
          console.log('passModel:', passModel)
          if (!passModel) return;
          passModel.email_pwd &&
            (passModel.email_pwd = this.$h.encrypt(passModel.email_pwd));
          self
            .$post("/api/manage/upsertStaff", passModel, { loading: true })
            .then(() => {
              this.$message({ type: "success", message: "保存成功" });
              this.storeUserInfo();
              this.modelReset('viewModel', 100);
            });
        } else {
          console.log('error submit!!')
          return false
        }
      });
    },
    waiting() {
      this.waitingTime = 60;
      let timer = setInterval(() => {
        this.waitingTime--;
        if (this.waitingTime === 0) clearInterval(timer);
      }, 1000);
    },
    onVerifyMail() {
      this.waiting();
      this.initialize().then((data) => {
        this.storeUserInfo();
        if (data.verified === "mail") return this.$message("已验证");
        this.$request("/api/system/applyActiveByMail");
      });
    },
    refresh() {
      this.initialize().then(() => {
        this.waitingTime = null;
        this.storeUserInfo();
      });
    },
    initialize() {
      return this.$get("/api/manage/queryStaffInfo", {
        user_id: this.$state("me").user_id,
      }).then((data) => {
        if (!data.mg_mail_config) {
          data.mg_mail_config = {
            smtp_host: "",
            is_ssl: true,
          }
        }
        data.email_pwd = this.$h.decrypt(data.email_pwd);
        Object.assign(this.viewModel, data);
        this.modelReset('viewModel', 100);
        return data;
      });
    },
    storeUserInfo(pwd) {
      Object.assign(window.vglobal.user || {}, this.viewModel, {
        email_pwd: this.$h.encrypt(this.viewModel.email_pwd),
      });
      this.$store.dispatch("USER_LOGIN", window.vglobal.user);
    },
    checkPhone (rule, value, callback) {
      console.log('value:', value)
      const phoneReg = /^[1][3,4,5,7,8,9][0-9]{9}$/i
      if (!value) {
        return callback(new Error('手机号不能为空'))
      }
      setTimeout(() => {
        if (!Number.isInteger(+value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (phoneReg.test(value)) {
            callback()
          } else {
            callback(new Error('手机号格式不正确'))
          }
        }
      }, 100)
    },
    checkEmail (rule, value, callback) {
      let v = this.$validate('mail', value)
      if (v) {
        callback(this.$t(v.hint))
      } else callback()
    },
  },
  created() {
    this.$get("/api/manage/queryDeptList").then((data) => {
      this.apartmentInfo = data.cm_depts;
    });
    this.initialize();
  },
  mixins: [],
};
</script>
<style scope>
  .image-upload {
    position: absolute;
    top: 50px;
    left: 15px;
  }

  .image-upload-box {
    background-color: #d8d8d8;
    width: 150px;
    height: 150px;
    line-height: 150px;
    position: relative;
    border: 1px solid #979797;
  }

  .image-upload-bg {
    min-height:150px;
    width: 150px;
    height: 150px;
  }

  .image-upload-btn {
    height: 100%;
    width: 100%;
    display: block;
    left: 0;
    opacity: 0;
    position: absolute;
    top: 0;
    z-index: 9999;
  }

  .upload-text {
    font-size: 14px;
  }
</style>
