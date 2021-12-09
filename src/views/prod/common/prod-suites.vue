<template lang="html">
  <div>
    <x-table :data="viewModel.x_suites" ref="datatable">
      <x-table-column label="图片" width="100">
        <template slot-scope="{row}">
          <x-td-img
            :src="row.main_pic"
            @click.native="onOpenProd(row)"
          ></x-td-img>
        </template>
      </x-table-column>
      <x-table-column label="品名" width="">
        <template slot-scope="{row}">
          <div class="line-1 text-blue cursor" @click="onOpenProd(row)">
            {{ row.prod_name || row.prod_name_en || '-'}}
          </div>
          <div class="text-grey">{{ row.prod_no }}</div>
        </template>
      </x-table-column>
      <x-table-column label="用量/单位" width="150">
        <div slot-scope="{row}">
          <x-input
            width="100px"
            field="sub_rate"
            :result="row"
            @blur-change="onUpdateBom(row, 'sub_rate')"
            :disabled="readonly"
            :unit="`/${row.prod_unit || 'PCS'}`"
          >
          </x-input>
        </div>
      </x-table-column>
      <!-- <x-table-column label="损耗%" width="150">
        <div slot-scope="{row}">
          <x-input
            width="100px"
            field="loss_rate"
            :result="row"
            @blur-change="onUpdateBom(row, 'loss_rate')"
            :disabled="readonly"
            unit="%"
          >
          </x-input>
        </div>
      </x-table-column> -->
      <x-table-column label="数量" width="150">
        <div slot-scope="{row}">
          <x-input
            width="100px"
            field="sell_quantity"
            :result="row"
            @blur-change="onUpdateBom(row, 'sell_quantity')"
            :disabled="readonly"
          >
          </x-input>
        </div>
      </x-table-column>
      <x-table-column label="价格" width="150">
        <div slot-scope="{row}">
          <span v-if="billType === 'pm'"
            >{{ row.pu_currency | currencyFormat }} {{ row.pu_price }}</span
          >
          <div v-else class="flex-b">
            <span class="lh-30 pr5">{{ row.pu_currency | currencyFormat }}</span>
            <x-input
              width="100px"
              field="pu_price"
              :result="row"
              @blur-change="onUpdateBom(row, 'pu_price')"
              :disabled="readonly"
              class="flex-1"
            ></x-input>
          </div>
        </div>
      </x-table-column>
      <x-table-column label="供应商" width="200">
        <div slot-scope="{row}">
          <span v-if="billType === 'pm' || readonly">{{
            row.x_supplier_id
          }}</span>
          <div v-else>
            <select-cust-com :result="row" field="seller_id" @change="onUpdateBom(row, 'seller_id')" width="100%" :pm="{custType: '4'}"></select-cust-com>
          </div>
        </div>
      </x-table-column>
      <x-table-column label="操作" width="100">
        <template slot-scope="{row}">
          <i class="el-icon-delete text-17 text-red ml10" @click="onDelete(row)" v-if="!readonly"></i>
        </template>
      </x-table-column>
    </x-table>
  </div>
</template>

<script>
// import Vue from "vue";
function initialize() {
}
function onSaveInner() {
  this.$emit("on-save");
}
async function onDeleteProd(prod) {
  let para = {
    prod_boms: [{ bom_id: prod.bom_id }],
  };
  let bom = this.viewModel.x_suites;
  let text = "确认删除？";
  if (bom.length === 2) {
    text = "删除第二个子件后，该套件将不存在";
    para.prod_boms = bom.map((m) => {
      return { bom_id: m.bom_id };
    });
  }
  await this.$confirm(text, this.$t('dialog_tip'), {type: 'warning'})
  this.$post("/api/product/deleteProdBom", para).then((data) => {
    this.$message("删除商品成功");
    this.$emit("on-refresh");
    this.$emit("on-edit");
  });
}
async function onDeletePiProd(prod) {
  let para = { pi_bom_id: prod.pi_bom_id };
  let bom = this.viewModel.x_suites;
  let text = "确认删除？";
  let ps = [];
  let del = (para) => {
    return this.$post("/api/business/deletePiBomProd", para);
  };
  ps.push(para);
  if (bom.length === 2) {
    this.$message("最后两个子件不能删除");
    return;
    // text = '删除第二个子件后，该套件将不存在'
    // ps.push({pi_bom_id: bom.filter(f => f.pi_bom_id !== prod.pi_bom_id)[0].pi_bom_id})
  }
  await this.$confirm(text, this.$t('dialog_tip'), {type: 'warning'})
  this.$Promise.when(ps.map((m) => del(m))).then((data) => {
    this.$message("删除商品成功");
    this.$emit("on-refresh");
    this.$emit("on-edit");
  });
}
export default {
  props: {
    viewModel: {
      type: Object,
      default() {
        return {};
      },
    },
    payload: {
      type: Object,
      default() {
        return {};
      },
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    isCn: {
      type: Boolean,
      default: true,
    },
    billType: {
      type: String,
      default: "pm",
    },
  },
  data() {
    return {
    };
  },
  methods: {
    onSaveInner,
    onUpdateBom(row, field) {
      let para = {
        bom_id: row.bom_id,
        [field]: row[field],
      };
      let url = "/api/product/editProdBom";
      if (this.billType === "qu") {
        if (field === 'sub_rate') {
          para.sell_quantity = (this.viewModel.sell_quantity * row.sub_rate).toFixed(2) * 1
        }
        if (field === 'sell_quantity') {
          para.sub_rate = (row.sell_quantity / this.viewModel.sell_quantity).toFixed(2) * 1
        }
        para.pi_bom_id = row.pi_bom_id;
        Object.assign(row, para)
        delete para.bom_id;
        url = "/api/business/editPiBomProd";
      }
      this.$post(url, para).then(() => {
        this.$emit("on-edit");
      });
    },
    onUpdateProd(row, field) {
      let para = {
        bill_prod_id: row.sub_pi_prod_id,
        [field]: row[field],
      };
      this.$pull.updatePiProd(para).then(() => {
        this.$emit("on-edit");
      });
    },
    onOpenProd(row) {
      this.$emit("open-prod", row);
    },
    onDelete(row) {
      if (this.billType === "qu") {
        onDeletePiProd.call(this, row);
      } else onDeleteProd.call(this, row);
    },
  },
  computed: {},
  created() {
    initialize.call(this);
  },
};
</script>
