<template lang="html">
  <div class="cust-contact-info">
    <el-form label-position="left" label-width="90px" :rules="rules" :model="vm" ref="form">
      <el-row type="flex" :gutter="50">
        <el-col :md="12" :lg="8">
          <el-form-item class="mb0">
            <t slot="label" path="cust.cardpic" colon>名片:</t>
            <x-upload :result="vm" field="mg_cardpic" :limit="1" :disabled="disabled" @save="onSave" :disabledMap="disabledMap"></x-upload>
          </el-form-item>
        </el-col>
        <el-col :md="12" :lg="16">
          <el-form-item class="mb0" v-if="inputCom">
            <t slot="label" path="cust.input_com" colon>输入公司名称:</t>
            <x-input :result="vm" field="cust_com" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></x-input>
            <div class="text-grey text-12"><span class="a-link" @click="inputCom = false,vm.cust_com=''">选择</span></div>
          </el-form-item>
          <el-form-item class="mb0" v-else>
            <t slot="label" path="cust.belong_com" colon>所属公司:</t>
            <div v-if="add">
              <select-cust-com :result="vm" field="cust_com_id" width="100%" :pm="{custType: vm.cust_type}" :clearable="false" placeholder=" "></select-cust-com>
              <div class="text-grey text-12">没有？<span class="a-link" @click="inputCom = true,vm.cust_com_id=''">新建</span></div>
            </div>
            <div v-else>
              <span class="">{{vm.x_cust_com_id}}</span>
              <span class="a-link ml20" @click="changeCom" v-if="!disabled">{{$t('change')}}</span>
            </div>
          </el-form-item>
          <!-- 客户经理 -->
          <cust-owner :vm="vm" @save="onSave" :disabled="disabled" :disabledMap="disabledMap" class="mb5" v-if="!add"></cust-owner>
          <el-form-item class="">
            <t slot="label" path="cust.address" colon>公司地址:</t>
            <x-input :result="vm" field="address" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap" type="textarea"></x-input>
          </el-form-item>
        </el-col>

        <el-col :md="12" :lg="8">
          <el-form-item prop="user_name">
            <t slot="label" path="cust.user_name" colon>姓名:</t>
            <x-input :result="vm" field="user_name" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></x-input>
          </el-form-item>
        </el-col>
        <el-col :md="12" :lg="8">
          <el-form-item>
            <t slot="label" path="cust.contact_no" colon>联系人编号:</t>
            <x-input :result="vm" field="contact_no" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></x-input>
          </el-form-item>
        </el-col>
        <!-- 客户等级
        <el-col :md="12" :lg="8">
          <cust-level :vm="vm" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></cust-level>
        </el-col> -->

        <el-col :md="12" :lg="8">
          <el-form-item prop="user_mail">
            <t slot="label" path="cust.user_mail" colon>邮箱:</t>
            <x-input :result="vm" field="user_mail" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap" rule="mail"></x-input>
          </el-form-item>
        </el-col>
        <el-col :md="12" :lg="8">
          <el-form-item>
            <t slot="label" path="cust.position" colon>职务:</t>
            <x-input :result="vm" field="position" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></x-input>
          </el-form-item>
        </el-col>

        <el-col :md="12" :lg="8">
          <el-form-item>
            <t slot="label" path="cust.country_id" colon>国家:</t>
            <select-country :result="vm" field="country_id" width="100%" @change="onSelectCountry" :disabled="disabled" :disabledMap="disabledMap"></select-country>
          </el-form-item>
        </el-col>
        <el-col :md="12" :lg="8">
          <el-form-item>
            <t slot="label" path="cust.user_phone" colon>区号/手机:</t>
            <select-area-code :result="vm" field="area_code" width="100px" :disabled="disabled" :disabledMap="disabledMap" @save="onSave"></select-area-code>
            <x-input :result="vm" field="user_phone" width="calc(100% - 100px)" @save="onSave" :disabled="disabled" :disabledMap="disabledMap" rule="phone2"></x-input>
          </el-form-item>
        </el-col>
        <el-col :md="12" :lg="8">
          <el-form-item>
            <t slot="label" path="cust.office_phone" colon>电话:</t>
            <x-input :result="vm" field="mg_office_phone" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></x-input>
          </el-form-item>
        </el-col>

        <el-col :md="12" :lg="8">
          <el-form-item>
            <t slot="label" path="cust.fax_number" colon>传真:</t>
            <x-input :result="vm" field="fax_number" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></x-input>
          </el-form-item>
        </el-col>
        <el-col :md="12" :lg="8">
          <el-form-item>
            <t slot="label" path="cust.gender" colon>性别:</t>
            <check-gender :result="vm" field="gender" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></check-gender>
          </el-form-item>
        </el-col>

        <el-col :md="12" :lg="8" v-if="!add">
          <!-- 法人 -->
          <legal-com :vm="vm" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></legal-com>
        </el-col>

        <el-col :md="12" :lg="8" v-if="!add">
          <el-form-item>
            <t slot="label" path="cust.create_user" colon>创建人:</t>
            {{vm.x_busi_group_id || '-'}} | {{vm.x_create_user}}
          </el-form-item>
        </el-col>
        <el-col :md="12" :lg="8" v-if="!add">
          <el-form-item>
            <t slot="label" path="cust.create_date" colon>创建时间:</t>
            {{vm.create_date | timeFormat}}
          </el-form-item>
        </el-col>
        <!-- <el-col :md="12" :lg="8" v-if="!add">
          <el-form-item>
            <t slot="label" path="cust.create_user" colon>是否注册:</t>
          </el-form-item>
        </el-col> -->
      </el-row>
    </el-form>
  </div>
</template>
<script>
import Mixins from "../../pages//mixins";
export default {
  mixins: [Mixins],
  props: {
    add: Boolean
  },
  components: {
    CustOwner: require("../../pages/items/cust-owner").default,
    LegalCom: require("../../pages/items/legal-com").default,
  },
  data() {
    return {
      rules: {},
      inputCom: false
    }
  },
  computed: {
  },
  methods: {
    onSelectCountry (v) {
      this.vm.country = v.name_en
      this.vm.area_code = v.callingcode
      let {country, country_id, area_code} = this.vm
      this.onSave({country, country_id, area_code})
    },
    changeCom () {
      this.$dialog.SelectCustCom({vm: this.vm}, (d, com) => {
        Object.assign(this.vm, d)
        this.vm.x_cust_com_id = com.com_name
        this.onSave('cust_com_id')
      })
    },
    selectCom (v) {
      this.vm.address = v.address
      this.onSave('address')
    }
  },
  created () {
    this.add && (this.rules = this.$createRules(this.vm))
  },
  beforeDestroy() {}
}
</script>
