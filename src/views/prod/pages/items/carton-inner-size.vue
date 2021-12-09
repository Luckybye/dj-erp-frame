<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.carton_inner_size" colon>内盒尺寸:</t>
    <div class="flex">
      {{pkg.pkg_size_length || '-'}} ×
      {{pkg.pkg_size_width || '-'}} ×
      {{pkg.pkg_size_height || '-'}} cm
    </div>
  </el-form-item>
</template>
<script>
import Mxins from '../pkg-mixins'
export default {
  mixins: [Mxins],
  data () {
    return {
    }
  },
  methods: {
  },
  created () {
  },
}
</script>
<style>
</style>
