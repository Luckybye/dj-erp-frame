<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.mg_pkg_req" colon>包装细节:</t>
    <div class="flex">
      <x-input :field="isCn?'mg_pkg_req':'mg_pkg_req_en'" :result="viewModel" @save="onSaveInner" :disabled="readonly" class="flex-1" type="textarea">
        <div @click="onTranslate('mg_pkg_req_en', 'mg_pkg_req')" slot="append" class="translate-icon">
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
    // this.initialize()
  },
  mixins: []
}
</script>
<style>
</style>
