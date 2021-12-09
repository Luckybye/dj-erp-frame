<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>现场图片:</t>
    <x-upload :result="vm" field="mg_full_view" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap">
    </x-upload>
  </el-form-item>
</template>
<script>
export default {
  props: {
  },
  data() {
    return {
    }
  },
  computed: {
  },
  methods: {
  },
  created () {
  },
  beforeDestroy() {}
}
</script>
