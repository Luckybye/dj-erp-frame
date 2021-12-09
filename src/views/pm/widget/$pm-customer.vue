<template lang="html">
  <div class="pm-customer">
    <div class="mb15 clearfix">
      <div class="text-16 lh-30  inline-block">
        维护客户专属信息
      </div>
      <div class="float-right">
        <el-button type="primary" @click="onCreateCustInfo()" icon="el-icon-plus">
        </el-button>
      </div>
    </div>
    <x-table :data="datas">
      <x-table-column label="NO" width="50" type="index">
      </x-table-column>
      <x-table-column label="Cust" width="" prop="x_cust_com_id">
      </x-table-column>
      <x-table-column label="Trade term" width="100" prop="trade_term">
      </x-table-column>
      <x-table-column label="Cust Item no." width="" prop="cust_prod_no">
      </x-table-column>
      <x-table-column label="Cust Barcode" width="" prop="cust_prod_barcode">
      </x-table-column>
      <x-table-column label="Sell Price" width="100">
        <template slot-scope="{row}">
          {{ row.price || "—" }} ({{ row.currency || "—" }})
        </template>
      </x-table-column>
      <x-table-column label="Cust HS Code" width="" prop="cust_hs_code">
      </x-table-column>
      <x-table-column label="Tariff" width="80" prop="tariff">
      </x-table-column>
      <x-table-column label="Supplier" width="" prop="x_supplier_id">
      </x-table-column>
      <x-table-column label="Pu Price" width="100">
        <div slot-scope="{row}">
          {{ row.pu_price || "—" }} ({{ row.pu_currency || "—" }})
        </div>
      </x-table-column>
      <x-table-column label="POL" width="80" prop="x_load_port_en">
      </x-table-column>
      <x-table-column label="Info" width="">
        <template slot-scope="{row}">
          {{ row.x_create_user }}/{{row.update_date | timeFormat('YYYY-MM-DD')}}
        </template>
      </x-table-column>
      <x-table-column label="Operate" width="100">
        <template slot-scope="{row}">
          <span class="a-link" @click="onEditCustomerInfo(row)">Edit</span>
          <br />
          <!-- <span class="a-link text-red" @click="onDeleteCustomerInfo(row)">Delete</span>
          <br /> -->
          <span
            class="a-link text-red"
            v-if="row.busi_status === 'normal'"
            @click="onUpdateStatus(row, 'stop')"
            >Disable</span>
          <br />
          <span
            class="a-link"
            v-if="row.busi_status === 'stop'"
            @click="onUpdateStatus(row, 'normal')"
            >Enable</span>
        </template>
      </x-table-column>
    </x-table>
  </div>
</template>
<script>
export default {
  options: { title: "Customer" },
  data() {
    return {
      datas: [],
    };
  },
  methods: {
    initialize() {},
    onCreateCustInfo() {
      let param = {};
      if (this.datas.length > 0) {
        let item = this.datas[this.datas.length - 1];
        console.log(item);
        param = {
          prod_id: this.payload.prod_id,
          cust_prod_no: item.cust_prod_no,
          cust_prod_barcode: item.cust_prod_barcode,
          currency: item.currency,
          price: item.price,
          cust_hs_code: item.cust_hs_code,
          tariff: item.tariff,
          pu_currency: item.pu_currency,
          pu_price: item.pu_price,
          supplier_id: item.supplier_id,
          load_port: item.load_port,
        };
      } else {
        param.prod_id = this.payload.prod_id;
      }
      console.log(param);
      console.log("EditPmCustomer");
      this.$dialog.EditPmCustomer({ param: param }, (data) => {
        this.getCustomerInfo();
      });
    },
    onEditCustomerInfo(item) {
      let param = {
        cust_prod_id: item.cust_prod_id,
        prod_id: this.payload.prod_id,
        cust_com_id: item.cust_com_id,
        trade_term: item.trade_term,
        cust_prod_no: item.cust_prod_no,
        cust_prod_barcode: item.cust_prod_barcode,
        currency: item.currency,
        price: item.price,
        cust_hs_code: item.cust_hs_code,
        tariff: item.tariff,
        pu_currency: item.pu_currency,
        pu_price: item.pu_price,
        supplier_id: item.supplier_id,
        load_port: item.load_port,
        update_date: item.update_date,
        x_create_user: item.x_create_user,
      };
      this.$dialog.EditPmCustomer({ param: param }, (data) => {
        this.getCustomerInfo();
      });
    },
    updateCustomInfo(data) {
      let param = data;
      param.prod_id = this.payload.prod_id;
      this.$post2("/api/product/updateCustomProduct", param).then((res) => {
        this.getCustomerInfo();
      });
    },
    async onDeleteCustomerInfo({cust_prod_id}) {
      await this.$confirm(this.$t('delete_tip'), this.$t('dialog_tip'), {type: 'warning'})
      await this.$post2("/api/product/deleteCustomProduct", {cust_prod_id})
      this.getCustomerInfo()
    },
    getCustomerInfo() {
      let param = {
        prod_id: this.payload.prod_id,
      };
      if (!param.prod_id) return
      this.$get("/api/product/queryCustomProductList", param).then(
        (res) => {
          this.datas = res.cust_prods;
        }
      );
    },
    onUpdateStatus(row, status) {
      let param = {
        cust_prod_id: row.cust_prod_id,
        busi_status: status,
      };
      this.$post2("/api/b2b/updateCustProdBusiStatus", param).then((res) => {
        row.busi_status = status;
      });
    },
  },
  created() {
    this.getCustomerInfo();
  },
};
</script>
