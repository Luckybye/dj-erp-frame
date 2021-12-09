<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.prod_sort" colon>商品分类:</t>
    <!-- <span slot="label">{{$t('prod.prod_sort')}}</span> -->
    <div class="flex">
      <select-sort field="prod_sort" :result="viewModel" @save="onSaveInner" :disabled="readonly" class="flex-1" placeholder=" " :isCn="isCn"></select-sort>
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
  },
  created () {
  },
  mixins: []
}
</script>
<style>
</style>
