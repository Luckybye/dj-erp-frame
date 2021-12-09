<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.carton_cbm" colon>整箱体积:</t>
    <div class="flex">
      {{pkg.cbm}} m³
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
