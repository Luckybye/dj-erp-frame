<template>
  <el-dialog :visible="visible" :close-on-click-modal="false" @close="onClose" title="港口校验">
    <div>
      <span v-html="tipText"></span>
      <div class="text-red" v-if="disabled">当前订单中包含多个起运港的产品，禁止提交！</div>
      <div class="text-red" v-else>当前订单中包含多个起运港的产品，是否提交？</div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="onClick" :disabled="disabled">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      visible: false,
      check_port_before_submit: 'no',
      tipText: '',
      exclude: {
        '59819c54970d7878cf3a02f8': 1,
        '59819e78970d7878cf3a0348': 1,
        '59819d6b970d7878647bcad8': 1,
        '59819dfe970d7878cf3a0333': 1,
        '59819e09970d7878647bcaeb': 1,
      },
    }
  },
  computed: {
    disabled () {
      return this.check_port_before_submit === 'disabled' && !this.exclude[this.excludeId]
    }
  },
  methods: {
    initialize() {
      this.getConfig()
    },
    async getConfig () {
      let field = 'sc_config'
      let v = await this.$configure.getValue(field, this.$state('me').com_id).then(d => d[field])
      this.vm = {...this.vm, ...v}
      if (v) this.check_port_before_submit = v.check_port_before_submit
      if (this.check_port_before_submit !== 'no') {
        this.getProds()
      } else this.onClick()
    },
    async getProds() {
      let v = await this.$get('/api/business/queryBillProdList', {
        bill_id: this.bill_id,
        bill_type: 'PI',
      })
      let portMap = v.pi_prods.toGroup('load_port')
      let ports = Object.keys(portMap)
      this.visible = ports.length > 1
      if (!this.visible) this.onClick()
      this.tipText = ports.map(k => {
        let nos = portMap[k].map(m => m.prod_no).join(',')
        let port = portMap[k][0].x_load_port_en || portMap[k][0].load_port || '无港口'
        return port + '---' + nos
      }).join('<br>')
    },
    onClick() {
      this.onCallback().then(() => {
        this.onClose()
      })
    },
  },
  created() {
    this.initialize()
  },
}
</script>
