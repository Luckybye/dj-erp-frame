<template>
  <el-dialog
    :visible="true"
    width="500px"
    @close="onClose"
    :close-on-click-modal="false">
    <x-select v-model="selected" :source="pages" :map="{label: 'name', value: 'type'}" width="100%">
      <span slot="label">选择商品页面</span>
    </x-select>
    <div class="text-red text-12">由于各类型商品属性存在差异，并不能完全继承所选择类型的全部配置，具体请详细检查，谨慎保存继承</div>

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
    let pages = [
      { type: 'pm', name: '公司档案商品页面' },
      // { type: 'ps', name: '公司研发商品页面' },
      // { type: 'inq', name: '询价商品页面' },
      // { type: 'qu-bom', name: '报价商品子件页面' },
      { type: 'qu', name: '报价商品页面' },
      { type: 'sc', name: '订单商品页面' },
      { type: 'sd', name: '内销订单商品页面' },
      // { type: 'sc-bom', name: '订单商品子件页面' },
      { type: 'pu', name: '采购商品页面' },
      { type: 'order', name: '批次商品页面' },
    ]
    return {
      pages,
      selected: ''
    }
  },
  computed: {},
  methods: {
    async onConfirm() {
      let t = this.selected
      if (!t) return
      let pages = await this.$cache.getProdPage(t, '').then(d => d.pages)
      if (!pages || !pages.length) pages = await this.$cache.getDfltProdPage(t)
      if (!pages || !pages.length) return this.$message.warning('该类商品没有模板')
      console.log(pages, '1111111111')
      pages = this.handlerDatas(pages)
      console.log(pages, '22222222')
      this.onCallback(pages).then(() => {
        this.onClose()
      })
    },
    handlerDatas (pages) {
      let t = this.billType || 'pm'
      if (t === 'ps') t = 'pm'
      if (t === 'sc-bom' || t === 'order') t = 'sc'
      if (t === 'qu-bom') t = 'qu'
      if (t === 'sd') t = 'sc'
      let arr = window._g.getProdComponents('prod', t)
      let obj = {'logistics-info': 1, 'custom-info': 1}
      arr.forEach(f => {
        if (Array.isArray(f.components)) {
          Object.assign(obj, f.components._object('part'))
        } else {
          obj[f.components] = 1
        }
      })
      return this.$h.filterDeep(pages, 'parts', d => obj[d.part])
    }
  },
  created() {},
};
</script>

<style lang="scss">
.select-cust-com-dialog {
}
</style>
