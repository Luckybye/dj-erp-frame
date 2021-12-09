<template lang="html">
  <div class="pm-bom">
    <div class="mb15 text-right">
      <!-- <ideal-icon-btn
        skin="blue"
        icon="refresh"
        @click="refresh()"
      ></ideal-icon-btn> -->
      <x-input
        width="150px"
        field="pu_price"
        :result="viewModel"
        @save="onSaveInner"
        :disabled="readonly"
        label="预估成本:"
        label-width="70px"
      ></x-input>
      <select-currency
        class="ml10"
        width="170px"
        field="pu_currency"
        :result="viewModel"
        @save="onSaveInner"
        :disabled="readonly"
        label="成本币种:"
        label-width="70px"
      ></select-currency>
      <el-button type="primary" @click="selectBom()" icon="el-icon-plus" class="ml10">
      </el-button>
    </div>

    <prod-suites
      :view-model="viewModel"
      :payload="payload"
      @open-prod="openProd"
      bill-type="pm"
      @on-edit="editBom"
      @on-refresh="initialize"
    ></prod-suites>
  </div>
</template>
<script>
import { onSaveInner } from "./widget.js";
import ProdSuites from "@/views/prod/common/prod-suites.vue";
import Vue from "vue";
let fmt = {
  x_suites: [],
  pu_price: "",
  pu_currency: "CNY",
};
function initialize() {
  let v = this.payload;
  let ps = [
    this.$get("/api/product/queryProdBomByMainId", {
      main_prod_id: v.prod_id,
    }),
    this.$pull.queryProdInfo({ prod_id: v.prod_id }),
    // this.$configure.getValue('constant_currency', this.$state('me').com_id)
  ];
  return this.$Promise.when(ps).then((bom, main, curr) => {
    this.viewModel = {
      ...this.viewModel,
      ...main.prod_info,
      x_suites: bom.prod_boms || [],
    };
    // this.currencyTypes = curr.constant_currency || []
    // this.modelReset(this.viewModel);
  });
}

export default {
  options: { title: "Bom" },
  data() {
    return {
      viewModel: this.$h.clone2(fmt),
      readonly: false
    };
  },
  methods: {
    onSaveInner,
    initialize,
    refresh() {
      this.initialize().then(() => {
        this.editBom();
      });
    },
    selectBom() {
      if (!this.payload.prod_id) return;
      this.$dialog.SelectPmProd({searchVm: {is_bom: 'no'}, selected: this.viewModel.x_suites}, (prods) => {
        prods = prods.map((m) => {
          return { prod_id: m.prod_id };
        });
        return this.saveBom(prods);
      });
    },
    saveBom(boms) {
      let para = {
        main_prod_id: this.payload.prod_id,
        sub_prods: boms,
      };
      this.$post("/api/product/addSubProds", para).then(() => {
        this.refresh();
      });
    },
    editBom() {
      let v = this.viewModel;
      let price = v.x_suites.reduce((pre, val) => {
        pre += val.sub_rate * (1 + val.loss_rate / 100) * val.pu_price || 0;
        return pre;
      }, 0);
      price = (price || 0).toFixed(2);
      console.log(price, "pu_price");
      Vue.set(v, "pu_price", price);
      this.onSaveInner({pu_price: price});
    },
    openProd(v) {
      let {sub_prod_id: prod_id} = v
      this.$tab.open({
        title: v.prod_name,
        title_en: v.prod_name_en,
        tab_id: v.prod_id,
        path: 'PmEdit',
        query: {prod_id},
      })
    },
    onActive() {
      // this.pageEventer.emit("open-suite-part", true);
      // initialize.call(this);
    },
    createProd(item) {
      Object.assign(this.payload, item);
    },
  },
  components: {
    ProdSuites,
  },
  created() {
    initialize.call(this);
    // this.pageEventer.on("create-prod", this.createProd);
  },
  beforeDestroy() {
    // this.pageEventer.remove("create-prod", this.createProd);
  },
};
</script>
