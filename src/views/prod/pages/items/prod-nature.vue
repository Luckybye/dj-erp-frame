<template lang="html">
  <div class="pa10 flex-b">
    <div class="lh-30">
      <el-checkbox v-model="viewModel.is_sell" true-label="yes" false-label="no" @change="changeProdNature('is_sell')">
        <t path="prod.is_sell">可销售</t>
      </el-checkbox>
      <el-checkbox v-model="viewModel.is_buy" true-label="yes" false-label="no" @change="changeProdNature('is_buy', 'PmFactory')">
        <t path="prod.is_buy">可采购</t>
      </el-checkbox>
      <el-checkbox v-model="viewModel.is_service" true-label="yes" false-label="no" @change="changeProdNature('is_service')">
        <t path="prod.is_service">劳务</t>
      </el-checkbox>
      <el-checkbox v-model="viewModel.is_bom" true-label="yes" false-label="no" @change="changeProdNature('is_bom', 'PmBom')" :disabled="viewModel.is_service==='yes'">
        <t path="prod.is_bom">BOM</t>
      </el-checkbox>
      <el-checkbox v-model="viewModel.is_spare" true-label="yes" false-label="no" @change="changeProdNature('is_spare', 'PmParts')" :disabled="viewModel.is_bom==='yes'">
        <t path="prod.is_spare">Spare Parts</t>
      </el-checkbox>
    </div>

    <!-- <el-form-item>
      <t path="prod.vat" slot="label">增值税</t>
      <x-input width="100px" field="vat" :result="viewModel" @save="onSaveInner" :disabled="readonly || !!viewModel.hs_code">
        <span slot="append">%</span>
      </x-input>
    </el-form-item> -->

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
  </div>
</template>
<script>
import Vue from "vue";
export default {
  data () {
    return {
      authConfig: {}
    }
  },
  methods: {
    changeProdNature (field, part, nosave) {
      let v = this.viewModel
      if (!v.prod_id) return
      if (field === 'is_service' && v.is_service === 'yes') {
        v.is_bom = 'no'
        this.changeProdNature('is_bom', 'PmBom', 'nosave')
      }
      let para = {
        disabled: v[field] !== 'yes',
        partName: part
      }
      if (this.authConfig.pm_normal_buy === false && field === 'is_buy') para.disabled = true
      if (this.authConfig.pm_normal_bom === false && field === 'is_bom') para.disabled = true
      // console.log(para, 'changeProdNature')
      // part && this.pageEventer && this.pageEventer.emit('changeProdNature', para)
      if (part) {
        let tab = this.$store.getters.GetCurrentTab
        tab = (tab.parts[0].parts || []).find(m => part === m.path)
        tab && Vue.set(tab, 'disabled', para.disabled)
      }
      nosave || this.onSaveInner({[field]: v[field], is_bom: v.is_bom})
    },
    changeOwner () {
      let {busi_group_id, owner_id} = this.viewModel
      let vm = {busi_group_id, owner_id}
      this.$dialog.SelectGroupUser({vm, addCom: true}, d => {
        // console.log(d, 'dddddddddd')
        Object.assign(this.viewModel, d)
        this.onSaveInner(Object._merge(vm, d))
      })
    },
  },
  watch: {
    // viewModel: {
    //   deep: true,
    //   handler (n, o) {
    //     if (n.is_buy !== o.is_buy || !n.is_buy) {
    //       this.changeProdNature('is_buy', 'PmFactory', 'nosave')
    //     }
    //     if (n.is_bom !== o.is_bom || !n.is_bom) {
    //       this.changeProdNature('is_bom', 'PmBom', 'nosave')
    //     }
    //     if (n.is_spare !== o.is_spare || !n.is_spare) {
    //       this.changeProdNature('is_spare', 'PmParts', 'nosave')
    //     }
    //   }
    // }
  },
  created () {
    if (this.isEdit) return;
    let change = () => {
      this.changeProdNature('is_buy', 'PmFactory', 'nosave')
      this.changeProdNature('is_bom', 'PmBom', 'nosave')
      this.changeProdNature('is_spare', 'PmParts', 'nosave')
    }
    this.$tab.on('prod-load-over', change)

    let v = {config_id: this.$state('me').user_id, mg_user_index_map: '1'}
    this.$get('/api/manage/queryExtCfig', v, {loading: false}).then((d) => {
      d = (d.extend_config || {}).mg_user_index_map || {}
      this.authConfig = d
      change()
    })
  },
  beforeDestroy () {
    // this.$tab.remove('prod-load-over', change)
  }
}
</script>
<style>
</style>
