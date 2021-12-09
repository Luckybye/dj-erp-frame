<template lang="html">
  <div class="login-setting">
    <x-fold class="mb10" show>
      <div class="lh-30" slot="header">
        登陆通知配置
      </div>
      <div>
        <el-row>
          <el-col :span="6"><strong>公司用户登录是否接受通知</strong></el-col>
          <el-col :span="8">
            <x-check :result="app_login_display" field="login_config" expect="yes" unexpect="no" text="是" @change="onSave('app_login_display')"></x-check>
            <x-check :result="app_login_display" field="login_config" expect="no" unexpect="yes" text="否" @change="onSave('app_login_display')"></x-check>
          </el-col>
          <el-col :span="10"><label class="text-grey">说明：公司所有用户登录时，都向指定用户通知登录消息</label></el-col>
        </el-row>
        <el-row class="mt20">
          <el-col :span="6"><strong>选择接收登录通知的用户</strong></el-col>
          <el-col :span="8">
            <select-staff :result="temp" field="approvers" width="80%" multiple @change="selectUser"></select-staff>
          </el-col>
          <el-col :span="10"><label class="text-grey">说明：接收登录通知的指定用户，需在App端开启"接收通知"功能</label></el-col>
        </el-row>
      </div>
    </x-fold>
  </div>
</template>

<script>
function initialize() {
  let ps = [this.$configure.getValue('app_login_display', this.instance)]
  this.$Promise.when(ps).then((config) => {
    config = config.app_login_display || {}
    Object.assign(this.app_login_display, config)
    this.temp.approvers = (this.app_login_display.approvers || []).map(m => {
      return m.user_id
    })
  })
}
export default {
  options: {
    icon: 'icon-set',
  },
  data() {
    return {
      app_login_display: {
        approvers: [],
        login_config: 'no'
      },
      temp: {
        approvers: [],
      },
      instance: ''
    }
  },
  methods: {
    selectUser(item) {
      this.app_login_display.approvers = item.map(m => {
        return {
          user_id: m.user_id,
          user_name: m.user_name
        }
      })
      this.onSave('app_login_display')
    },
    onSave(field) {
      return this.$configure
        .setValue(field, { [field]: this[field] }, this.instance)
    },
  },
  computed: {
    isOperate() {
      return !/^(1|2){1}$/.test(this.$state('me').role * 1)
    },
  },
  created() {
    this.instance = this.payload.instance || this.$state('me').com_id
    initialize.call(this)
  },
}
</script>
