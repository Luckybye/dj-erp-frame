<template>
  <el-dialog
    :visible="true"
    width="500px"
    @close="onClose"
    :close-on-click-modal="false">
    <div class="d-content">
      <x-input type="textarea" width="100%" field="query" :result.sync="newValue" @on-input="onTranslate('query', 'rst')" class="mb15" :rows="5"></x-input>
      <br>
      <x-input type="textarea" width="100%" field="rst" :result.sync="newValue" :rows="5"></x-input>
      <div class="text-grey text-left mt5">点击Confirm自动会把值拷贝到对应商品属性</div>
    </div>

    <span
      slot="footer"
      class="dialog-footer">
      <el-button @click="onClose">{{$t('cancel')}}</el-button>
      <el-button
        type="primary"
        @click="onConfirm"
      >{{$t('confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      newValue: {},
      timer: null
    }
  },
  computed: {},
  methods: {
    async onConfirm() {
      this.onCallback(this.newValue).then(() => {
        this.onClose()
      })
    },
    onTranslate (f1, f2) {
      let v = this.newValue
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(() => {
        this.$h.translate(v[f1]).then(data => {
          v[f2] = data.map(m => m.dst).join('\n')
        })
      }, 1000)
    }
  },
  created() {
    let q = this.newValue.query
    if (!q) return
    this.$h.translate(q).then(data => {
      this.newValue.rst = data.map(m => m.dst).join('\n')
    })
  },
};
</script>

<style lang="scss">
</style>
