<template>
  <el-dialog
    :visible="true"
    width="50%"
    @close="onClose"
    :close-on-click-modal="false"
  >
    <div class="" slot="title">
      <t path="select_sparepart" colon>选择配件</t>
    </div>
    <div class="d-content">
      <x-table
        :data="datas"
        tooltip-effect="dark"
        @selection-change="handleSelectionProdChange"
        rowKey="spare_id"
      >
        <x-table-column type="selection" width="55" :selectable="selectable">
        </x-table-column>
        <x-table-column prop="part_no">
          <t slot="header" path="prod.pos_no">Pos NO.</t>
        </x-table-column>
        <x-table-column>
          <t slot="header" path="prod.spare_parts">Spare Parts</t>
          <template slot-scope="scope">
            <x-td-img :src="scope.row.main_pic"></x-td-img>
          </template>
        </x-table-column>
        <x-table-column>
          <t slot="header" path="prod.item_erp_no">Item/ERP</t>
          <template slot-scope="{ row }">
            <div class="" :title="'公司货号' + row.prod_no">
              {{ row.prod_no }}
            </div>
            <div class="text-grey">{{ row.supplier_no }}</div>
          </template>
        </x-table-column>
        <x-table-column prop="part_no">
          <t slot="header" path="prod.description2">Description</t>
          <template slot-scope="{ row }">
            <div class="line-3">
              {{ row.prod_name_en || row.prod_name }}
            </div>
          </template>
        </x-table-column>
        <x-table-column prop="sub_rate">
          <t slot="header" path="prod.qty">QTY</t>
        </x-table-column>
        <x-table-column prop="remark">
          <t slot="header" path="prod.remark">Remark</t>
        </x-table-column>
      </x-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onClose">{{ $t("cancel") }}</el-button>
      <el-button type="primary" @click="onConfirm">{{
        $t("confirm")
      }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
function initialize() {
  this.$get("/api/product/queryprodSpareByMainId", {
    main_prod_id: this.prod_id,
  }).then((part) => {
    this.datas = part.prod_spares || [];
  });
}
function onConfirm() {
  if (!this.allSelect.length) return;
  let para = {
    prod_spare: this.allSelect.map((m) => ({ spare_id: m.spare_id })),
  };
  if (this.bill_type === "qu") {
    para.quote_id = this.bill_id;
  } else if (this.bill_type === "PN") {
    para.plan_id = this.bill_id;
  } else para.contract_id = this.bill_id;
  para = para._trim();
  this.$post("/api/business/addPiSpares", para).then(() => {
    this.onCallback().then(() => {
      this.onClose();
    });
  });
}
export default {
  data() {
    return {
      datas: [],
      allSelect: [],
    };
  },
  methods: {
    onConfirm,
    selectable(row) {
      let id = row.sub_prod_id;
      if (!this.selectedProds) return true;
      return !this.selectedProds.find(
        (m) => m.sell_prod_id && m.sell_prod_id === id
      );
    },
    handleSelectionProdChange(val) {
      this.allSelect = val;
    },
  },
  created() {
    initialize.call(this);
  },
};
</script>
