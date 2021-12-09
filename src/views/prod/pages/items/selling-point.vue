<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.selling_point" colon>卖点:</t>
    <div class="flex">
      <x-input :field="isCn?'selling_point':'selling_point_en'" :result="viewModel" @save="onSaveInner" :disabled="readonly" class="flex-1" type="textarea">
        <div @click="onTranslate('selling_point_en', 'selling_point')" slot="append" class="translate-icon">
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
