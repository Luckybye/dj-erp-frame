<template lang="html">
  <div class="custom-info mb10">
    <el-row :gutter="30">
      <el-col :span="12">
        <el-form-item>
          <t slot="label" path="prod.decl_name" colon>报关中文名:</t>
          <x-input
            width="100%"
            field="decl_name"
            :result="viewModel"
            @save="onSaveInner"
            :disabled="readonly2"
          ></x-input>
        </el-form-item>
        <el-form-item>
          <t slot="label" path="prod.decl_name_en" colon>报关英文名:</t>
          <x-input
            width="100%"
            field="decl_name_en"
            :result="viewModel"
            @save="onSaveInner"
            :disabled="readonly2"
          ></x-input>
        </el-form-item>
        <el-form-item>
          <t slot="label" path="prod.decl_factor" colon>申报要素:</t>
          <div class="flex-1">
            <x-input
              width="100%"
              field="decl_factor"
              :result="viewModel"
              @save="onSaveInner"
              :rows="4"
              :disabled="readonly2"
              type="textarea"
            ></x-input>

            <div class="element text-primary lh-n" v-if="hsInfo.element">
              <t slot="label" path="prod.decl_factor_fmt" colon>申报要素格式: </t>
              {{ hsInfo.element }}
            </div>
          </div>
        </el-form-item>
      </el-col>
      <el-col class="ver-t" :span="12">
        <div class="hscode-style">
          <div class="header">
            <img :src="hsCodeImg" v-if="hsInfo.sp === 'Y'" class="hscode-img" />
            <h2 class="text-center mb15">海关信息</h2>
          </div>

          <div class="flex-b lh-30 text text-center">
            <div>
              退税率 <br />
              {{ hsInfo.rebate_rate || "0" }}%
            </div>
            <div>
              增值税率 <br />
              {{ hsInfo.vat || "0" }}%
            </div>
            <div>
              最惠税率 <br />
              {{ hsInfo.most_rate || "0" }}%
            </div>
            <div>
              需要商检 <br />
              {{ hsInfo.sp === "Y" ? "是" : "否" }}
            </div>
            <div>
              普通税率 <br />
              {{ hsInfo.nor_rate || "0" }}%
            </div>
            <div>
              计量单位 <br />
              {{ hsInfo.unit || "null" }}
            </div>
          </div>

          <div class="text pt0">货品名称: {{ hsInfo.hs_name || "null" }}</div>
        </div>
        <!-- <div v-show="false">{{ hsInfos }}</div> -->
      </el-col>
    </el-row>
  </div>
</template>
<script>
// import {img} from 'assets'
function initialize() {
}

export default {
  options: { title: "hscode" },
  data() {
    return {
      hsCodeImg: "",
      hsInfo: {},
    };
  },
  methods: {
    initialize,
    setHsInfo (code) {
      this.hsInfo = code || {}
    },
  },
  computed: {
    readonly2 () {
      return this.readonly || this.payload.decl_readonly
    }
  },
  created() {
    this.initialize();
    this.$tab.on('set-hs-info', this.setHsInfo)
  },
  beforeDestroy() {
    this.$tab.remove('set-hs-info', this.setHsInfo)
  },
};
</script>
<style lang="scss">
.hscode-style {
  // padding: 15px 20px;
  width: 100%;
  border: 1px solid #8b8fa1;
  border-radius: 2px;
  position: relative;
  .header {
    border-bottom: 1px solid #8b8fa1;
    height: 40px;
    line-height: 40px;
    .hscode-img {
      position: absolute;
      top: 0px;
      left: 0px;
      width: 30px;
    }
  }
  .text {
    padding: 10px;
  }
}
.decl-factor .el-form-item .el-form-item-content .slot-content {
  // display: inline-block !important;
  .element {
    width: 100%;
    white-space: normal;
  }
  textarea {
    height: 60px;
  }
}
</style>
