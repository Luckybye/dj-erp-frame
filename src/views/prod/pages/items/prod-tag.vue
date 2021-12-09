<template lang="html">
  <div class="pa10 prod-tag flex-b">
    <div class="flex-1">
      <x-prod-tag :map="item" v-for="(item, i) in datas2" @close="deleteProdTag(item, i)" close class="mr20" :key="i"></x-prod-tag>
    </div>
    <div>
      <select-prod-label width="150px" field="tag_id" :result="tempVm" :source="tags" :disabled="readonly" @change="onSelectTag" :isCn="isCn"></select-prod-label>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      datas: [],
      tagsMap: {},
      tags: [],
      tempVm: {tag_id: ''}
    }
  },
  methods: {
    queryProdTag () {
      let id = this.payload.prod_id
      if (!id) return
      this.$get('/api/product/queryProdTag', {prod_id: id}, {loading: false}).then(d => {
        this.datas = d.prod_tags || []
      })
    },
    deleteProdTag ({prod_tag_id}, i) {
      this.datas.splice(i, 1)
      this.$get2('/api/product/deleteProdTag', {prod_tag_id}, {loading: false}).then(d => {
        this.queryProdTag()
      })
    },
    querySysTag () {
      return this.$get('/api/system/querySysTag', {com_id: this.$state('me').com_id}, {loading: false}).then(d => {
        // debugger
        d = d.sys_tags || []
        this.tags = d
        this.tagsMap = d._object('tag_id')
      })
    },
    onSelectTag (v) {
      let m = this.datas.find(m => m.tag_id === v.tag_id)
      if (!m) {
        this.datas.push(v)
        this.addProdTag(v)
      }
    },
    addProdTag (v) {
      this.$post2('/api/product/addProdTag', {
        prod_infos: [{prod_id: this.payload.prod_id}],
        sys_tags: [{tag_id: v.tag_id}]
      }, {loading: false}).then(d => {
        this.queryProdTag()
      })
    }
  },
  computed: {
    datas2 () {
      return this.datas.map(m => ({...m, ...this.tagsMap[m.tag_id]}))
    }
  },
  watch: {
  },
  created () {
    this.querySysTag()
    this.queryProdTag()
    // this.$tab.on('prod-load-over', this.queryProdTag)
  },
  beforeDestroy () {
  }
}
</script>
<style lang="scss">
.prod-tag {

}
</style>
