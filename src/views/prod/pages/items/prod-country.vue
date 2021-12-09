<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.origin" colon>原产国:</t>
    <div class="flex">
      <x-select field="origin" :result="viewModel" @save="onSaveInner" :disabled="readonly" class="flex-1" :map="{label: isCn?'name':'name_en', value: 'id'}" :source="countrys" filter="filter"></x-select>
    </div>
  </el-form-item>
</template>
<script>
export default {
  data () {
    return {
      countrys: []
    }
  },
  computed: {
  },
  methods: {
  },
  created () {
    this.$cache.getAllCountry().then(c => (this.countrys = c))
  },
  mixins: []
}
</script>
<style>
</style>
