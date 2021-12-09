<template>
  <el-dialog
    :visible="true"
    width="600px"
    @close="onClose"
    :close-on-click-modal="false"
    title="产品世界海关数据维护"
  >
    <el-form label-position="left" label-width="80px" ref="hscodeForm" :rules="rules" :model="tempModel">
      <el-row type="flex">
        <el-col :span="12">
          <el-form-item prop="country_id">
            <t slot="label" path="prod.country" colon>国家:</t>
            <select-country field="country_id" :result="tempModel" :collapseTags="false" width="80%"></select-country>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="hs_code">
            <t slot="label" path="prod.hs_code" colon>海关码:</t>
            <x-input
              :result="tempModel"
              field="hs_code"
            ></x-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="tariff">
            <t slot="label" path="prod.tariff" colon>关税率:</t>
            <x-input :result="tempModel" field="tariff" width="80%" v-input="{rule: 'number,min=0,max=100'}">
              <span slot="append">%</span>
            </x-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="vat">
            <t slot="label" path="prod.vat" colon>增值税率:</t>
            <x-input :result="tempModel" field="vat" width="80%" v-input="{rule: 'number,min=0,max=100'}">
              <span slot="append">%</span>
            </x-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="decl_name">
            <t slot="label" path="prod.decl_name" colon>清关名:</t>
            <x-input
              :result="tempModel"
              field="decl_name"
            ></x-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item>
            <t slot="label" path="prod.decl_factor" colon>申报要素:</t>
            <x-input
              :result="tempModel"
              field="decl_factor"
              type="textarea"
              :rows="4"
            ></x-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="onClick">{{ $t("confirm") }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      tempModel: {
        prod_country_id: "",
        prod_id: "",
        country_id: "",
        hs_code: "",
        decl_name: "",
        decl_factor: "",
        tariff: "0",
        vat: "0",
      },
      rules: {
        country_id: [
          { required: true, message: '请选择国家', trigger: 'blur' },
        ],
        hs_code: [
          { required: true, message: '请输入海关码', trigger: 'blur' },
        ],
        tariff: [
          { required: true, message: '请输入关税率', trigger: 'blur' },
        ],
        vat: [
          { required: true, message: '请输入增值税率', trigger: 'blur' },
        ],
        decl_name: [
          { required: true, message: '请输入清关名', trigger: 'blur' },
        ],
      }
    };
  },
  methods: {
    initialize() {
      if (this.tempModel.prod_country_id === '') return
      this.$get2("/api/product/prodCountryInfo", {prod_country_id: this.tempModel.prod_country_id}).then(res => {
        this.tempModel = res.prod_country || {}
      })
    },
    onClick() {
      let self = this;
      self.$refs.hscodeForm.validate((valid) => {
        if (valid) {
          self.$post2("/api/product/editProdCountry", {
            prod_id: self.prod_id,
            ...self.tempModel._trim()
          }).then((d) => {
            self.onCallback().then(() => {
              self.onClose();
            });
          });
        }
      })
    },
  },
  created() {
    this.initialize();
  },
};
</script>
