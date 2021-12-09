<template lang="html">
  <div class="web-prod-setting">
    <div class="s-item">
      <h3 class="prod-title">
        客商信息显示配置
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
  </div>
</template>

<script>
function initialize() {}
export default {
  options: {title: 'Web端客商卡', icon: 'icon-set'},
  data() {
    return {
      pages: [
        {id: 'cust_page_config', type: '2', name: '客户档案页面' },
        {id: 'sup_page_config', type: '4', name: '供应商档案页面' },
      ],
    }
  },
  methods: {
    setProdPage(page) {
      this.$tab.open({
        title: page.name,
        tab_id: page.id,
        query: {
          cust_type: page.type,
        },
        path: 'SetCustPage',
      })
    },
  },
  computed: {},
  created() {
    initialize.call(this)
  },
}
</script>
<style lang="scss" scoped>
</style>
