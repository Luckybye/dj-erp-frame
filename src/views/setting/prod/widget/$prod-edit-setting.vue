<template lang="html">
  <div>
    <x-fold class="mb10" show>
      <div class="lh-30" slot="header">
        货号生成规则
      </div>
      <div>
        <el-checkbox v-model="prod_setting.prod_no_create_type" @change="onSave('prod_setting')" true-label="category" false-label="input" :disabled="!isOperate"  type="checkbox"
        >根据分类自动生成</el-checkbox>
        <el-checkbox v-model="prod_setting.prod_no_create_type" :disabled="!isOperate" @change="onSave('prod_setting')" true-label="input" false-label="category" class="ml20"  type="checkbox"
        >自由编辑</el-checkbox>
      </div>
    </x-fold>
    <x-fold class="mb10" show>
      <div class="lh-30" slot="header">
        修改外箱长、宽、高后，是否自动计算CBM
      </div>
      <div>
        <x-check :result="prod_setting" field="calc_cbm" @change="onSave('prod_setting')" :expect="true" :unexpect="false" :disabled="!isOperate" type="checkbox"
        >是，自动计算CBM</x-check>
        <x-check :result="prod_setting" field="calc_cbm" :disabled="!isOperate" @change="onSave('prod_setting')" :expect="false" :unexpect="true" class="ml20" type="checkbox"
        >否，保留CBM原值</x-check>
      </div>
    </x-fold>
  </div>
</template>

<script>
let fmt = {
  prod_no_create_type: 'category',
  calc_cbm: false,
}
function initialize() {
  this.$cache.getProdSetting(true).then(res => {
    this.prod_setting = { ...this.prod_setting, ...res }
  })
}
export default {
  options: { title: '编辑约束' },
  data() {
    return {
      instance: '',
      prod_setting: {...fmt},
    }
  },
  methods: {
    onSave(field, data) {
      field = field || 'prod_setting'
      return this.$configure
        .setValue(field, { [field]: data || this[field] || '' }, this.instance)
        .then(res => {
          console.log(res)
        })
    },
  },
  computed: {
    isOperate() {
      return !(this.$state('me').role !== '1' && this.$state('me').role !== '2')
    },
  },
  created() {
    this.instance = this.payload.instance || this.$state('me').com_id
    initialize.call(this)
  },
}
</script>
