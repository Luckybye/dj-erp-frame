<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.carton_gw" colon>整箱毛重:</t>
    <div class="flex">
      {{pkg.carton_gw}} KGS
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
