<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.hs_code" colon>海关编码:</t>

    <select-hscode field="hs_code" :result="viewModel" @change="onQueryHscode" :disabled="readonly2" :isCn="isCn" @load="initialize" width="100%"></select-hscode>
  </el-form-item>
</template>
<script>
// import Vue from 'vue'
async function initialize (v) {
  this.allHsCodes = v
  setTimeout(() => {
    this.findHsInfo()
  }, 2000)
  this.$tab.on('prod-load-over', this.findHsInfo)
}
export default {
  data () {
    return {
      allHsCodes: [],
    }
  },
  methods: {
    initialize,
    onQueryHscode (code) {
      if (code) {
        this.viewModel.hs_code = code.hs_code
        // this.viewModel.decl_rebate = code.rebate_rate
        this.viewModel.vat = code.vat || 0
        let {hs_code, vat} = this.viewModel
        this.onSaveInner({hs_code, vat})
      } else if (!this.viewModel.hs_code) {
        this.$message('未检测到此海关编码信息！')
      }
      this.setHsInfo(code)
    },
    setHsInfo (code) {
      this.$tab.emit('set-hs-info', code)
    },
    findHsInfo () {
      if (!this.viewModel.hs_code || !this.allHsCodes) return
      let m = this.allHsCodes.find(f => f.hs_code === this.viewModel.hs_code)
      this.setHsInfo(m)
    }
  },
  computed: {
    readonly2 () {
      return this.readonly || this.payload.decl_readonly
    }
  },
  created () {
    this.initialize()
  },
  mixins: [],
  beforeDestroy() {
    this.$tab.remove('prod-load-over', this.findHsInfo)
  }
}
</script>
<style>
</style>
