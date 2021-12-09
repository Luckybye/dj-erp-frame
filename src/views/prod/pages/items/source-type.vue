<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.source_type" colon>来源:</t>
    <div class="flex">
      <select-source-type field="source_type" :result="viewModel" :disabled="readonly" class="flex-1" @save="onSaveInner"></select-source-type>
    </div>
  </el-form-item>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  computed: {
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
