<template>
  <el-dialog
    :visible="true"
    width="600px"
    @close="onClose"
    :close-on-click-modal="false"
    title="Customer Product Info"
  >
    <el-form label-position="left" label-width="120px">
      <el-form-item label="Customer:">
        <select-cust-com
          :result="tempModel"
          field="cust_com_id"
          :pm="{ custType: '2' }"
          width="100%"
          :disabled="!!param.cust_com_id"
          @change="getCustComInfo"
        ></select-cust-com>
      </el-form-item>
      <el-form-item label="Trade Terms:">
        <div class="lh-30">{{ tempModel.trade_term }}</div>
      </el-form-item>
      <el-form-item label="Important Rank:">
        <x-select
          width="100%"
          field="important_rank"
          :result="tempModel"
          :source="important_rank"
          :map="{ label: 'text', value: 'value' }"
        ></x-select>
      </el-form-item>
      <el-form-item label="Cust Item NO.:">
        <x-input
          width="100%"
          field="cust_prod_no"
          :result="tempModel"
        ></x-input>
      </el-form-item>
      <el-form-item label="Cust Barcode.:">
        <x-input
          width="100%"
          field="cust_prod_barcode"
          :result="tempModel"
        ></x-input>
      </el-form-item>
      <el-form-item label="Sell Price:">
        <div class="flex-b">
          <select-currency
            width="40%"
            field="currency"
            :result="tempModel"
          ></select-currency>
          <x-input
            width="calc(60% - 16px)"
            field="price"
            :result="tempModel"
            style="left: 6px"
            type="number"
          ></x-input>
        </div>
      </el-form-item>
      <el-form-item label="Import HS Code:">
        <x-input
          width="100%"
          field="cust_hs_code"
          :result="tempModel"
        ></x-input>
      </el-form-item>
      <el-form-item label="Tariff:">
        <x-input
          width="100%"
          field="tariff"
          :result="tempModel"
          unit="%"
        ></x-input>
      </el-form-item>
      <el-form-item label="Supplier:">
        <select-cust-com
          :result="tempModel"
          field="supplier_id"
          :pm="{ custType: '4' }"
          width="100%"
        ></select-cust-com>
      </el-form-item>
      <el-form-item label="Pu Price:">
        <div class="flex-b">
          <select-currency
            width="40%"
            field="pu_currency"
            :result="tempModel"
          ></select-currency>
          <x-input
            width="calc(60% - 16px)"
            field="pu_price"
            :result="tempModel"
            style="left: 6px"
            type="number"
          ></x-input>
        </div>
      </el-form-item>
      <el-form-item label="Load Port:">
        <select-port
          :result="tempModel"
          field="load_port"
          :disabled="readonly"
          width="100%"
        ></select-port>
      </el-form-item>
      <el-form-item label="Info:">
        <div class="lh-30">
          {{ tempModel.x_create_user }}/
          {{ (tempModel.update_date || Date.now()) | timeFormat("YYYY-MM-DD") }}
        </div>
      </el-form-item>
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
        cust_prod_id: "",
        cust_com_id: "",
        trade_term: "",
        cust_prod_no: "",
        cust_prod_barcode: "",
        currency: "",
        price: "",
        cust_hs_code: "",
        tariff: "",
        pu_currency: "",
        pu_price: "",
        supplier_id: "",
        load_port: "",
        important_rank: "A",
        update_date: Date.now(),
        x_create_user: "",
      },
      important_rank: [
        { text: "A", value: "A" },
        { text: "B", value: "B" },
        { text: "C", value: "C" },
        { text: "Null", value: "null" },
      ],
      readonly: false,
    };
  },
  methods: {
    initialize() {
      this.tempModel = {
        ...this.tempModel,
        prod_id: this.prod_id || this.tempModel.prod_id,
        ...this.param,
        x_create_user: this.$state("me").user_name_en,
      };
      if (this.tempModel.cust_com_id && !this.tempModel.trade_term) {
        this.getCustComInfo();
      }
    },
    onClick() {
      delete this.tempModel.x_create_user;
      delete this.tempModel.update_date;
      let param = this.tempModel._trim();
      this.$post2("/api/product/updateCustomProduct", param).then((res) => {
        this.onCallback().then(() => {
          this.onClose();
        });
      });
    },
    getCustComInfo() {
      let id = this.tempModel.cust_com_id
      if (!id) return
      this.$get(
        "/api/crm/queryCustCompany",
        { cust_com_id: id },
        { loading: true }
      ).then((res) => {
        this.tempModel.trade_term = res.cust_company.trade_term;
      });
    },
  },
  created() {
    this.initialize();
  },
};
</script>
