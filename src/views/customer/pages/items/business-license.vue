<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>营业执照:</t>
    <x-upload :result="vm" field="mg_business_license" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap" listType="text">
      <el-button type="primary">上传文件</el-button>
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
