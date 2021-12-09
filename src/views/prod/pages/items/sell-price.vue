<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.price" colon>价格:</t>
    <div class="flex">
      <span class="lh-30">{{payload.currency || 'USD'}}</span>
      <x-input field="sell_price" :result="viewModel" @save="onSaveInner" :disabled="readonly || approving || !edit_auth" class="flex-1 ml10" type="number"></x-input>
    </div>
  </el-form-item>
</template>
<script>
export default {
  data () {
    return {
      edit_auth: true,
    }
  },
  methods: {
    init() {
      let auth = ''
      if (this.billType === "meet") auth = 'meeting_auth'
      if (this.billType === "qu") auth = 'sc_auth'
      if (this.billType === "sc" || this.billType === "sd") auth = 'order_auth'
      if (auth !== '') this.getConfig(auth)
    },
    getConfig(field) {
      this.$cache.getUserAuth(this.$state('me').user_id, true).then(config => {
        this.edit_auth = (config[field] || {}).edit_prod_price === 'yes'
      })
    }
  },
  created () {
    this.init()
    console.log('ljj:111111:', this.billType)
  },
  mixins: []
}
</script>
<style>
</style>
