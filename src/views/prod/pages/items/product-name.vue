<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.prod_name" colon>商品名称:</t>
    <div class="flex">
      <x-input :field="isCn?'prod_name':'prod_name_en'" :result="viewModel" @save="onSaveInner" :disabled="readonly" class="flex-1">
        <div @click="onTranslate('prod_name_en', 'prod_name')" slot="append" class="translate-icon">
          <x-icon icon="translate" colorClass="primary" title="translate" type="svg"></x-icon>
        </div>
      </x-input>
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
