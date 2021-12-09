<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.carton_40hc" colon>40HC:</t>
    <div class="flex">
      {{pkg.hc40}}
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
