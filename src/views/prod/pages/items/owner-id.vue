<template lang="html">
  <el-form-item>
    <t path="prod.owner_id" slot="label">客户经理</t>
    <span class="text-grey">
      {{viewModel.busi_group_id==='-1' ? $t('prod.company') : viewModel.x_busi_group_id}}
      <span v-if="viewModel.owner_id">
        <el-divider direction="vertical"></el-divider>
        {{$tt(viewModel, 'x_owner_id') || '-'}}
      </span>
    </span>
    <el-button @click="changeOwner" type="primary" class="ml20">{{$t('prod.change')}}</el-button>
  </el-form-item>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  methods: {
    changeOwner () {
      let {busi_group_id, owner_id} = this.viewModel
      let vm = {busi_group_id, owner_id}
      this.$dialog.SelectGroupUser({vm, addCom: true}, d => {
        Object.assign(this.viewModel, d)
        this.onSaveInner(Object._merge(vm, d))
      })
    },
  },
  watch: {
  },
  created () {
  },
  beforeDestroy () {
  }
}
</script>
<style>
</style>
