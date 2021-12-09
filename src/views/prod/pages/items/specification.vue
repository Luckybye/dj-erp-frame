<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.prod_spec" colon>规格:</t>
    <div class="flex">
      <x-input :field="isCn?'prod_spec':'prod_spec_en'" :result="viewModel" @save="onSaveInner" :disabled="readonly" class="flex-1">
        <div @click="onTranslate('prod_spec_en', 'prod_spec')" slot="append" class="translate-icon">
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
