<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.carton_outer_size" colon>外箱尺寸:</t>
    <div class="flex">
      {{pkg.carton_size_length || '-'}} ×
      {{pkg.carton_size_width || '-'}} ×
      {{pkg.carton_size_height || '-'}} cm
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
