<template lang="html">
  <div class="cust-prod-setting">
    <div class="s-item" v-for="t in setItems" :key="t.name">
      <h3 class="prod-title">
        {{ t.name }}
      </h3>
      <div class="s-panel ph20">
        <div class="left-border-title">
          产品卡
        </div>
        <div>
          <el-button
            type="primary"
            @click="setProdPage(page, t)"
            v-for="page in t.prodPages"
            :key="page.name"
            class="mb10 ml0 mr10"
          >
            {{ page.name }}
          </el-button>
        </div>

        <div class="left-border-title">
          产品列表
        </div>
        <div>
          <el-button
            type="primary"
            @click="onEdit(page, t)"
            v-for="page in t.prodThs"
            :key="page.name"
            class="mb10 ml0 mr10"
          >
            {{ $tt(page, 'title') }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTh } from '@/views/setting/prod-th/th.js'
export default {
  options: {
    icon: 'icon-set',
  },
  data() {
    return {
      setItems: [
        {
          cust_type: '4',
          name: 'F端客户',
          prodPages: [{ type: 'pm', name: 'F端产品卡' }],
          prodThs: [
            { key: 'pm_prod_table_header4' },
            { key: 'pu_prod_table_header4' },
            { key: 'sp_prod_table_header4' }
          ],
        },
        { cust_type: '2', name: 'B端客户', prodPages: [{ type: 'pm', name: 'B端产品卡' }], prodThs: [] },
      ],
    }
  },
  methods: {
    init() {
      this.setItems.forEach(d => {
        d.prodThs.forEach(m => {
          Object.assign(m, getTh(m.key))
        })
      })
    },
    setProdPage(page, { cust_type }) {
      this.$tab.open({
        title: page.name,
        tab_id: page.name,
        query: {
          billType: page.type,
          cust_type,
        },
        path: 'SetProdPage',
      })
    },
    onEdit(item, { cust_type }) {
      this.$tab.open({
        title: item.title,
        title_en: item.title_en,
        tab_id: item.key,
        path: 'ProdTheadSettingDetail',
        query: {
          type: item.key,
          filter: item.filter,
          cust_type,
        },
      })
    },
  },
  computed: {},
  created() {
    this.init()
  },
}
</script>
<style lang="scss" scoped></style>
