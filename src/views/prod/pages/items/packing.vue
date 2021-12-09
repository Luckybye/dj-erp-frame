<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.sale_pkg" colon>包装方式:</t>
    <div class="flex">
      <x-select field="sale_pkg_en" :result="viewModel" :disabled="readonly" class="flex-1" :map="{label: isCn?'cn':'en', value: 'en'}" :source="packings" filter="filter" @change="onSelectPurcharsePack"></x-select>
    </div>
  </el-form-item>
</template>
<script>
async function initialize () {
  let arr = await this.$cache.getPackings()
  this.packings = arr.map(m => {
    m.filter = [m.en, m.cn].join('~')
    return m
  })
}
export default {
  data () {
    return {
      packings: []
    }
  },
  computed: {
  },
  methods: {
    onSelectPurcharsePack (item) {
      if (!item) return
      this.viewModel.sale_pkg = item.cn
      let {sale_pkg, sale_pkg_en} = this.viewModel
      this.onSaveInner({sale_pkg, sale_pkg_en})
    }
  },
  created () {
    initialize.call(this)
  },
  mixins: []
}
</script>
<style>
</style>
