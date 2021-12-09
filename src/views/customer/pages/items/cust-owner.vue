<template lang="html">
  <el-form-item>
    <t slot="label" :path="path" colon>客户经理:</t>
    <select-group-user width="100%" :result="vm" field="busi_group_id" field2="owner_id" v-if="type==='select'" placeholder=" " @save="onSave" :checkStrictly="false"></select-group-user>
    <div class="" v-else>
      <span class="text-grey">
        {{(vm.busi_group_id===$groupId ? $t('cust.public') : vm.x_busi_group_id) || '-'}}
        <span v-if="vm.owner_id">
          <el-divider direction="vertical"></el-divider>
          {{$tt(vm, 'x_owner_id') || '-'}}
        </span>
      </span>
      <span class="a-link ml20" @click="changeOwner" v-if="!disabled">{{$t('change')}}</span>
    </div>
  </el-form-item>
</template>
<script>
export default {
  props: {
    type: String,
    label: String
  },
  data () {
    return {
    }
  },
  methods: {
    changeOwner () {
      let {busi_group_id, owner_id} = this.vm
      let vm = {busi_group_id, owner_id}
      this.$dialog.SelectGroupUser({vm, addPublic: true}, d => {
        Object.assign(this.vm, d)
        this.onSave(Object._merge(vm, d))
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
