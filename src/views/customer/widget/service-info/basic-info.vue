<template lang="html">
  <div class="cust-basic-info">
    <el-form label-position="left" label-width="90px">
      <el-row type="flex" :gutter="50">

        <el-col :span="8">
          <!-- 供应商编号 -->
          <cust-no :vm="vm" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></cust-no>
        </el-col>
        <el-col :span="16">
          <!-- 客户经理 -->
          <cust-owner :vm="vm" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></cust-owner>
        </el-col>

        <el-col :span="16">
          <!-- 公司名称 -->
          <com-name :vm="vm" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></com-name>
        </el-col>
        <el-col :span="8">
          <!-- 公司简称 -->
          <com-nick :vm="vm" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></com-nick>
        </el-col>

        <el-col :span="8">
          <!-- 公司国别 -->
          <cust-country :vm="vm" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></cust-country>
        </el-col>
        <el-col :span="8">
          <!-- 所在城市 -->
          <cust-city :vm="vm" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></cust-city>
        </el-col>
        <el-col :span="8">
          <!-- 公司主页 -->
          <cust-homepage :vm="vm" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></cust-homepage>
        </el-col>

        <el-col :span="24">
          <!-- 公司地址 -->
          <cust-address :vm="vm" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></cust-address>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item>
            <t slot="label" path="cust.com_phone" colon>联系电话:</t>
            <x-input :result="vm" field="com_phone" width="100%" @save="onSave" :disabled="disabled" :disabledMap="disabledMap" rule="tel"></x-input>
          </el-form-item>
        </el-col> -->

        <el-col :span="24">
          <!-- 公司简介 -->
          <cust-introduction :vm="vm" @save="onSave" :disabled="disabled" :disabledMap="disabledMap"></cust-introduction>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import Mixins from "../../pages/mixins";
import components from '../../pages'
export default {
  mixins: [Mixins],
  components,
  data() {
    return {
    }
  },
  computed: {
  },
  methods: {
    onSelectCountry (v) {
      this.vm.country = v.name_en
      let {country, country_id} = this.vm
      this.onSave({country, country_id})
    }
  },
  created () {
  },
  beforeDestroy() {}
}
</script>
