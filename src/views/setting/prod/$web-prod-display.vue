<template lang="html">
  <div class="web-prod-setting">
    <div class="s-item">
      <h3 class="prod-title">
        产品卡信息显示配置
      </h3>
      <div class="s-panel">
        <el-button
          type="primary"
          @click="setProdPage(page)"
          v-for="page in pages"
          :key="page.name"
          class="mb10 ml0 mr10"
        >
          {{ page.name }}
        </el-button>
      </div>
    </div>

    <div class="s-item">
      <h3 class="prod-title">
        快捷选择产品下拉显示信息配置
      </h3>
      <div class="s-panel">
        <el-button
          type="primary"
          @click="setProdDisplay(page)"
          v-for="page in selectProdPages"
          :key="page.name"
          class="mb10 ml0 mr10"
        >
          {{ page.name }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
function initialize() {}
export default {
  options: {title: 'Web端产品卡', icon: 'icon-set'},
  data() {
    return {
      pages: [
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
      ],
      selectProdPages: [
        { type: 'pm', name: '选择公司档案商品', field: 'select_pm_prod_display' },
      ]
    }
  },
  methods: {
    setProdPage(page) {
      this.$tab.open({
        title: page.name,
        tab_id: page.type,
        query: {
          billType: page.type,
        },
        path: 'SetProdPage',
      })
    },
    async setProdDisplay (vm) {
      const v = await this.$configure.getValue(vm.field, this.$state("me").com_id)
      vm.show_attributes = v[vm.field] || 'prod_name_en,item_no'
      this.$dialog.SetProdDisplay({vm}, d => {
        this.$configure.setValue(vm.field, {[vm.field]: d.cata_attributes}, this.$state("me").com_id)
      })
    }
  },
  computed: {},
  created() {
    initialize.call(this)
  },
}
</script>
<style lang="scss" scoped>
</style>
