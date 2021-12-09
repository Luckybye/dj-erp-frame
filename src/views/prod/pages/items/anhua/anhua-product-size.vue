<template lang="html">
  <el-form-item :label="isCn ? '产品尺寸:' : 'Product Size:'" class="relative">
    <div class="flex relative">
      <span class="text-blue width-15 lh-30">H:</span>
      <x-input rules="" width="calc(25% - 20px)" field="height" :result="viewModel.mg_prod_size" @save="onSaveInner2"
        :disabled="readonly" class="flex-1"></x-input>
      <span class="text-blue width-15 lh-30 mr5">T:</span>
      <x-input rules="" width="calc(25% - 20px)" field="top_diam" :result="viewModel.mg_prod_size" @save="onSaveInner2"
        :disabled="readonly" class="flex-1"></x-input>
      <span class="text-blue width-15 lh-30">D:</span>
      <x-input rules="" width="calc(25% - 20px)" field="diam" :result="viewModel.mg_prod_size" @save="onSaveInner2"
        :disabled="readonly" class="flex-1"></x-input>
      <span class="text-blue width-15 lh-30">B:</span>
      <x-input rules="" width="calc(25% - 20px)" field="btm_diam" :result="viewModel.mg_prod_size" @save="onSaveInner2"
        :disabled="readonly" class="flex-1"></x-input>
      <span class="text-blue lh-30 prod-unit">cm</span>
    </div>
    <div class="text-grey text-12 size-inch flex-b">
      <span class="text-blue width-15">H:</span>
      <span class="inline-block" style="width: calc(25% - 20px)">
        {{(viewModel.mg_prod_size.height/2.54 || 0).toFixed(2)}}
      </span>
      <span class="text-blue width-15">T:</span>
      <span class="inline-block" style="width: calc(25% - 20px)">
        {{(viewModel.mg_prod_size.top_diam/2.54 || 0).toFixed(2)}}
      </span>
      <span class="text-blue width-15">D:</span>
      <span class="inline-block" style="width: calc(25% - 20px)">
        {{(viewModel.mg_prod_size.diam/2.54 || 0).toFixed(2)}}
      </span>
      <span class="text-blue width-15">B:</span>
      <span class="inline-block" style="width: calc(25% - 20px)">
        {{(viewModel.mg_prod_size.btm_diam/2.54 || 0).toFixed(2)}}
      </span>
      <span class="prod-unit" style="line-height:normal;">inch</span>
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
    onSaveInner2 () {
      this.onSaveInner({mg_prod_size: this.viewModel.mg_prod_size})
    }
  },
  created () {
    // this.initialize()
  },
  mixins: []
}
</script>
<style lang="scss">
  .size-inch {
    position: absolute;
    left: 0;
    bottom: 0;
    transform: translateY(100%);
    width: 100%;
    line-height: normal;
    &>span {
      margin-right: 6px;
    }
  }
</style>
