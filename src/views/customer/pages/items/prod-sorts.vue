<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>产品分类:</t>
    <select-sort @save="onSave2" :result="searchVm" field="prod_sorts" multiple width="100%" :disabled="disabled"></select-sort>
  </el-form-item>
</template>

<script>
export default {
  mixins: [],
  props: {
    payload: {
      type: Object,
      default () {
        return {}
      }
    },
    disabled: Boolean,
    path: String
  },
  data() {
    return {
      searchVm: {
        prod_sorts: [],
        brand_ids: [],
        prod_types: [],
        prod_levels: [],
        extend_tags: [],
      },
    }
  },
  components: {
  },
  computed: {
  },
  methods: {
    init () {
      this.queryFavorites()
    },
    getMainKey () {
      if (this.payload.cust_com_id) this.mainKey = {cust_com_id: this.payload.cust_com_id, busi_type: 'com'}
      if (this.payload.cust_id) this.mainKey = {cust_id: this.payload.cust_id, busi_type: 'cust'}
    },
    queryFavorites () {
      this.getMainKey()
      if (!this.mainKey) return
      this.$get2('/api/crm/queryFavorites', this.mainKey).then(d => {
        d = d.cust_favorites || []
        this.searchVm = d.reduce((pre, val) => {
          pre[val.favo_type] || (pre[val.favo_type] = [])
          pre[val.favo_type].push(val.favorite)
          return pre
        }, this.searchVm)
      })
    },
    onSave2 (v) {
      this.getMainKey()
      if (!this.mainKey) return
      let field = v ? Object.keys(v)[0] : 'prod_sorts'
      let list = this.searchVm[field]
      if (!list.length) return
      this.$post2('/api/crm/editFavorite', {
        ...this.mainKey,
        favo_type: field,
        favorite_list: list.map(favorite => ({favorite}))
      })
    },
  },
  created () {
    this.init()
  },
  beforeDestroy() {}
}
</script>