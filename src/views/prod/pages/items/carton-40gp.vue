<template lang="html">
  <el-form-item>
    <t slot="label" path="prod.carton_40gp" colon>40GP:</t>
    <div class="flex">
      {{pkg.gp40}}
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
