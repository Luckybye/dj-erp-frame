<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.prod_no" colon>货号:</t>
    <div class="flex">
      <x-input field="prod_no" :result="viewModel" @save="onSaveInner" :disabled="prodSetting.prod_no_create_type!=='input' || readonly" width="130px"></x-input>
      <span class="prod-sort flex-1 ml10" :title="isCn ? viewModel.x_prod_sort : viewModel.x_prod_sort_en">
        <span class="">{{isCn ? '商品分类: ' : 'Category: '}}</span>
        <span  @click="onSelectSort(viewModel.prod_sort)" :class="{'a-link': !readonly}">
          {{isCn ? (viewModel.x_prod_sort || '请选择分类') : (viewModel.x_prod_sort_en || 'Category')}}
        </span>
      </span>
    </div>
  </el-form-item>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    onSelectSort (sort) {
      if (this.readonly) return
      let self = this
      this.$dialog.SelectSort({ newValue: { prod_sort: sort }, isCn: self.isCn, sort_type: this.payload.sort_type }, (data) => {
        console.log(data)
        Object.assign(this.viewModel, data)
        this.onSaveInner(data)
      })
    }
  },
  created () {
    // this.initialize()
  },
  mixins: []
}
</script>
<style lang="scss">
  .prod-sort {
      display: inline-block;
      // width: calc(100% - 155px);
      text-overflow: ellipsis;
      overflow: hidden;
      line-height: 30px;
      vertical-align: middle;
    }
</style>
