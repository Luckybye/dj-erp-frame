<template lang="html">
  <div class="cust-like-prod">
    <div v-tr-dom>
      <el-button type="primary" @click="createCatalog" v-if="!disabled">创建电子册</el-button>
    </div>

    <el-form label-position="left" label-width="90px">
      <el-form-item>
        <t slot="label" path="cust.prod_sorts" colon>产品分类:</t>
        <select-sort @save="onSave" :result="searchVm" field="prod_sorts" multiple width="100%" :disabled="disabled"></select-sort>
      </el-form-item>
      <el-form-item>
        <t slot="label" path="cust.brand_ids" colon>产品品牌:</t>
        <select-brand @save="onSave" :result="searchVm" field="brand_ids" multiple width="100%" :disabled="disabled"></select-brand>
      </el-form-item>
      <el-form-item>
        <t slot="label" path="cust.prod_types" colon>产品类型:</t>
        <select-prod-type @save="onSave" :result="searchVm" field="prod_types" multiple width="100%" :disabled="disabled"></select-prod-type>
      </el-form-item>
      <el-form-item>
        <t slot="label" path="cust.prod_levels" colon>产品等级:</t>
        <select-prod-level @save="onSave" :result="searchVm" field="prod_levels" multiple width="100%" :disabled="disabled"></select-prod-level>
      </el-form-item>
      <el-form-item>
        <t slot="label" path="cust.extend_tags" colon>产品标签:</t>
        <select-prod-label  @save="onSave" :result="searchVm" field="extend_tags" multiple width="100%" :disabled="disabled"></select-prod-label>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import Auth from '../components/auth-mixins';
export default {
  options: {title: '意向产品'},
  mixins: [Auth],
  data() {
    return {
      searchVm: {
        prod_sorts: [],
        brand_ids: [],
        prod_types: [],
        prod_levels: [],
        extend_tags: [],
      },
      custInfo: {}
    }
  },
  components: {
  },
  computed: {
    disabled () {
      return this.isDisableEdit
    },
  },
  methods: {
    init () {
      this.queryFavorites()
      this.getCustInfo()
    },
    getCustInfo () {
      let {cust_id} = this.custInfo
      if (!cust_id) return
      this.$pull.queryCustUser({cust_id}).then(user => {
        this.custInfo = {...this.custInfo, ...user.cust_user}
      })
    },
    queryFavorites () {
      this.$get2('/api/crm/queryFavorites', {cust_id: this.payload.cust_id}).then(d => {
        d = d.cust_favorites || []
        this.searchVm = d.reduce((pre, val) => {
          pre[val.favo_type] || (pre[val.favo_type] = [])
          pre[val.favo_type].push(val.favorite)
          return pre
        }, this.searchVm)
      })
    },
    onSave (v) {
      let field = Object.keys(v)[0]
      this.$post2('/api/crm/editFavorite', {
        cust_id: this.payload.cust_id,
        favo_type: field,
        busi_type: this.payload.busi_type || 'cust',
        favorite_list: v[field].map(favorite => ({favorite}))
      })
    },
    createCatalog () {
      let searchVm = this.$h.clone2(this.searchVm)
      this.$dialog.SelectPmProd({searchVm}, (prods) => {
        prods = prods.map((m, i) => ({prod_id: m.prod_id, order_no: i}))
        return this.$post('/api/product/createCataLog', {}, {loading: true}).then(res => {
          res = res.e_catalog || {}
          return res
        }).then((res) => {
          return this.$post2('/api/product/updateCataLog', {products: prods, catalog_id: res.catalog_id}, {loading: true}).then(() => {
            this.$tab.open({
              path: 'CatalogInfo',
              title: res.catalog_name,
              tab_id: res.catalog_id,
              query: {
                catalog_id: res.catalog_id,
                cust: {cust_id: this.custInfo.cust_id, user_mail: this.custInfo.user_mail}
              }
            })
          })
        })
      })
    },
  },
  created () {
    this.init()
  },
  beforeDestroy() {}
}
</script>
