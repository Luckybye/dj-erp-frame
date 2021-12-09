<template lang="html">
  <div class="add-contact">
    <el-form label-position="left" label-width="90px" :rules="rules" :model="vm" ref="form">
      <el-row type="flex" :gutter="50">
        <el-col :span="24">
          <el-form-item class="mb0" v-if="inputCom">
            <t slot="label" path="cust.input_com" colon>输入公司名称:</t>
            <x-input :result="vm" field="cust_com" width="100%"></x-input>
            <div class="text-grey text-12"><span class="a-link" @click="inputCom = false,vm.cust_com=''">选择</span></div>
          </el-form-item>
          <el-form-item class="mb0" v-else>
            <t slot="label" path="cust.belong_com" colon>所属公司:</t>
            <select-cust-com :result="vm" field="cust_com_id" width="100%" :pm="{custType: vm.cust_type}" :clearable="false" placeholder=" "></select-cust-com>
            <div class="text-grey text-12">没有？<span class="a-link" @click="inputCom = true,vm.cust_com_id=''">新建</span></div>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item prop="user_name">
            <t slot="label" path="cust.user_name" colon>姓名:</t>
            <x-input :result="vm" field="user_name" width="100%"></x-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item prop="user_mail">
            <t slot="label" path="cust.user_mail" colon>邮箱:</t>
            <x-input :result="vm" field="user_mail" width="100%" rule="mail"></x-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item>
            <t slot="label" path="cust.position" colon>职务:</t>
            <x-input :result="vm" field="position" width="100%"></x-input>
          </el-form-item>
        </el-col> -->

        <el-col :span="12">
          <el-form-item>
            <t slot="label" path="cust.country_id" colon>国家:</t>
            <select-country :result="vm" field="country_id" width="calc(100% - 100px)" @change="onSelectCountry"></select-country>
            <select-area-code :result="vm" field="area_code" width="100px"></select-area-code>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <t slot="label" path="cust.user_phone" colon>区号/手机:</t>
            <x-input :result="vm" field="user_phone" width="100%" rule="phone2"></x-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item>
            <t slot="label">客户性质:</t>
            <select-cust-level :result="vm" field="cust_level" width="100%"></select-cust-level>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item>
            <t slot="label" path="cust.office_phone" colon>电话:</t>
            <x-input :result="vm" field="mg_office_phone" width="100%"></x-input>
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <prod-sorts ref="prodSorts" :payload="vm"></prod-sorts>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import ProdSorts from "@/views/customer/pages/items/prod-sorts"
import Mixins from "../../pages//mixins";
export default {
  mixins: [Mixins],
  components: {ProdSorts},
  data() {
    return {
      rules: {},
      inputCom: false,
    }
  },
  computed: {
  },
  methods: {
    onSelectCountry (v) {
      this.vm.country = v.name_en
      this.vm.area_code = v.callingcode
    },
    onSelect (item) {
      this.vm.cust_profit = item.value
    },
    changeCom () {
      this.$dialog.SelectCustCom({vm: this.vm}, (d, com) => {
        Object.assign(this.vm, d)
        this.vm.x_cust_com_id = com.com_name
      })
    },
    selectCom (v) {
      this.vm.address = v.address
    },
    onSaveProdSorts () {
      return this.$refs.prodSorts.onSave2()
    }
  },
  created () {
    this.rules = this.$createRules(this.vm)
  },
  beforeDestroy() {}
}
</script>
