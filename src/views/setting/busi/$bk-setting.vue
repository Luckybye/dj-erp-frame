<template lang="html">
  <div class="bk-setting">
    <x-fold class="mb10" show>
      <div class="lh-30" slot="header">
        装柜前是否需要验货
      </div>
      <div>
        <el-checkbox v-model="bk_config.need_qc" @change="onSave('bk_config')" true-label="yes" false-label="no" :disabled="isOperate"
        >是</el-checkbox>
        <el-checkbox v-model="bk_config.need_qc" :disabled="isOperate" @change="onSave('bk_config')" true-label="no" false-label="yes" class="ml20"
        >否</el-checkbox>
      </div>
    </x-fold>

    <x-fold class="mb10" show>
      <div class="lh-30" slot="header">
        是否允许溢装
      </div>
      <div>
        <el-checkbox v-model="bk_config.is_overflow" @change="onSave('bk_config')" true-label="yes" false-label="no" :disabled="isOperate"
        >是</el-checkbox>
        <el-checkbox v-model="bk_config.is_overflow" :disabled="isOperate" @change="onSave('bk_config')" true-label="no" false-label="yes" class="ml20"
        >否</el-checkbox>
      </div>
    </x-fold>

    <x-fold class="mb10" show>
      <div class="lh-30" slot="header">
        是否允许修改装柜件数
      </div>
      <div>
        <el-checkbox v-model="bk_config.is_edit_ctn" @change="onSave('bk_config')" true-label="yes" false-label="no" :disabled="isOperate"
        >是</el-checkbox>
        <el-checkbox v-model="bk_config.is_edit_ctn" :disabled="isOperate" @change="onSave('bk_config')" true-label="no" false-label="yes" class="ml20"
        >仅限管理员修改</el-checkbox>
      </div>
    </x-fold>

    <x-fold class="mb10" show>
      <div class="lh-30" slot="header">
        订舱时校验信用额度
      </div>
      <div>
        <el-checkbox v-model="bk_config.booking_credit.status" @change="onSave('bk_config')" true-label="stopped" false-label="normal" :disabled="isOperate"
        >禁用</el-checkbox>
        <el-checkbox v-model="bk_config.booking_credit.status" @change="onSave('bk_config')" true-label="normal" false-label="stopped" :disabled="isOperate" class="ml20"
        >启用</el-checkbox>
        <el-checkbox v-model="bk_config.booking_credit.param.insurance_amount" @change="onSave('bk_config')" true-label="true" false-label="false" :disabled="bk_config.booking_credit.status === 'stopped'" class="ml40"
        >中信保额度</el-checkbox>
        <el-checkbox v-model="bk_config.booking_credit.param.credit_line" @change="onSave('bk_config')" true-label="true" false-label="false" :disabled="bk_config.booking_credit.status === 'stopped'" class="ml20"
        >公司授信额度</el-checkbox>
        <el-checkbox v-model="bk_config.booking_credit.param.no_lc" @change="onSave('bk_config')" true-label="true" false-label="false" :disabled="bk_config.booking_credit.status === 'stopped'" class="ml20"
        >L/C 不计算信用额度</el-checkbox>
      </div>
    </x-fold>

    <x-fold class="mb10" show>
      <div class="lh-30" slot="header">
        订舱时校验产品起运港
      </div>
      <div>
        <el-checkbox v-model="bk_config.check_port_before_submit" @change="onSave('bk_config')" true-label="no" false-label="tip" :disabled="isOperate"
        >不约束</el-checkbox>
        <el-checkbox v-model="bk_config.check_port_before_submit" @change="onSave('bk_config')" true-label="tip" false-label="no" :disabled="isOperate" class="ml20"
        >起运港不同时提醒</el-checkbox>
        <el-checkbox v-model="bk_config.check_port_before_submit" @change="onSave('bk_config')" true-label="disabled" false-label="no" :disabled="isOperate" class="ml20"
        >起运港不同时禁止提交</el-checkbox>
      </div>
    </x-fold>

    <x-fold class="mb10" show>
      <div class="lh-30" slot="header">
        议付完成后是否允许修改应收金额、应收日期
      </div>
      <div>
        <el-checkbox v-model="bk_config.is_edit_ar" @change="onSave('bk_config')" true-label="yes" false-label="no" :disabled="isOperate"
        >是</el-checkbox>
        <el-checkbox v-model="bk_config.is_edit_ar" :disabled="isOperate" @change="onSave('bk_config')" true-label="no" false-label="yes" class="ml20"
        >仅限管理员修改</el-checkbox>
      </div>
    </x-fold>

    <x-fold class="mb10" show>
      <div class="lh-30" slot="header">
        应付货款申请是否允许修改应付日期
      </div>
      <div>
        <el-checkbox v-model="bk_config.is_edit_ap_date" @change="onSave('bk_config')" true-label="yes" false-label="no" :disabled="isOperate"
        >是</el-checkbox>
        <el-checkbox v-model="bk_config.is_edit_ap_date" :disabled="isOperate" @change="onSave('bk_config')" true-label="no" false-label="yes" class="ml20"
        >仅限管理员修改</el-checkbox>
      </div>
    </x-fold>

    <x-fold class="mb10" show>
      <div class="lh-30" slot="header">
        议付完成后是否允许撤销
      </div>
      <div>
        <el-checkbox v-model="bk_config.is_cancel_cipl" @change="onSave('bk_config')" true-label="yes" false-label="no" :disabled="isOperate"
        >是</el-checkbox>
        <el-checkbox v-model="bk_config.is_cancel_cipl" :disabled="isOperate" @change="onSave('bk_config')" true-label="no" false-label="yes" class="ml20"
        >仅限管理员修改</el-checkbox>
      </div>
    </x-fold>

    <x-fold class="mb10" :show="false">
      <div class="lh-30" slot="header">
        报关配置
      </div>
      <div>
        <decl-config :payload="payload" :componentName="componentName"></decl-config>
      </div>
    </x-fold>
  </div>
</template>

<script>
let fmt = {
  need_qc: 'no',
  is_overflow: 'yes',
  is_edit_ctn: 'yes',
  is_edit_ar: 'yes',
  is_edit_ap_date: 'yes',
  is_cancel_cipl: 'yes',
  check_port_before_submit: 'no', // no不约束，tip提醒，disabled禁止提交
  booking_credit: {
    status: 'stopped',
    param: {
      insurance_amount: false,
      credit_line: false,
      no_lc: false
    }
  },
}
function initialize() {
  let ps = [this.$configure.getValue('bk_config', this.instance)]
  this.$Promise.when(ps).then((config) => {
    config = config.bk_config || {}
    Object.assign(this.bk_config, config)
  })
}
export default {
  options: { title: '出运相关配置', icon: 'icon-set' },
  data() {
    return {
      instance: '',
      bk_config: this.$h.clone(fmt),
    }
  },
  methods: {
    onSave(field) {
      field = field || 'bk_config'
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
