<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.mg_detail" colon>详情:</t>
    <div class="flex">
      <x-input :field="isCn ? 'mg_detail' : 'mg_detail_en'" :result="viewModel" @save="onSaveInner" :disabled="readonly" class="flex-1" type="textarea">
        <div @click="onTranslate('mg_detail_en', 'mg_detail')" slot="append" class="translate-icon">
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
