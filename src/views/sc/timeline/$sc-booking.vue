<template>
  <div class="sc-booking">
    <div class="tab-page-header flex-b fixed-top h-b">
      <div class="h-left lh-30">
      </div>
      <div class="h-right">
        <el-button type="primary" @click="onAdd">
          <i class="el-icon-plus"></i>
        </el-button>
      </div>
    </div>
    <x-table :data="datas" tooltip-effect="dark">
      <x-table-column>
        <t slot="header" path="bk.book_order">订舱发票号</t>
        <template slot-scope="scope">
          <div class="a-link" @click="viewDetail(scope.row)">{{ scope.row.inv_no || scope.row.bookorder_no || "--" }}</div>
          <!-- <div>{{ getStatus(scope.row) }}</div> -->
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="bk.port">启运/目的港</t>
        <template slot-scope="scope">
          <div>{{ scope.row.x_load_port_en }}</div>
          <div>{{ scope.row.x_unload_port_en }}</div>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="bk.amount">金额</t>
        <template slot-scope="scope">
          {{ scope.row.currency | currencyFormat }}
          {{ amount(scope.row).fthousands(2) }}</template
        >
      </x-table-column>
      <x-table-column>
        <t slot="header" path="bk.create_book_date">通知/订舱</t>
        <template slot-scope="scope">
          <div>{{ scope.row.create_date | timeFormat }}</div>
          <div>{{ scope.row.book_date | timeFormat }}</div>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="bk.load_settle_date">装柜/结算</t>
        <template slot-scope="scope">
          <div>{{ scope.row.loading_date | timeFormat }}</div>
          <div>{{ scope.row.settle_date | timeFormat }}</div>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="bk.decl">报关</t>
        <template slot-scope="scope">
          <div>{{ scope.row.decl_no }}</div>
          <div>{{ scope.row.decl_date | timeFormat }}</div>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="bk.bl">提单</t>
        <template slot-scope="scope">
          <div>{{ scope.row.bl_no }}</div>
          <div>{{ scope.row.bl_date | timeFormat }}</div>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="bk.etd_eta_date">船期</t>
        <template slot-scope="scope">
          <div>{{ scope.row.etd_date | timeFormat }}</div>
          <div>{{ scope.row.eta_date | timeFormat }}</div>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="bk.settle">议付</t>
        <template slot-scope="scope">
          <div>{{ scope.row.inv_no }}</div>
          <div>{{ scope.row.settle_date | timeFormat }}</div>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="bk.busi_user_contact">销售/单证</t>
        <template slot-scope="scope">
          <div>{{ scope.row.x_busi_user || scope.row.x_busi_user_en }}</div>
          <div>{{ scope.row.x_contact || scope.row.x_contact_en }}</div>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="action">操作</t>
        <template slot-scope="scope">
          <div v-if="scope.row.show_status === 'no_shipping_space'">
            <el-button
              type="text"
              style="color: red"
              @click="onDelete(scope.row)"
              >{{ $t("delete") }}</el-button
            >
          </div>
        </template>
      </x-table-column>
    </x-table>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      datas: [],
    };
  },
  computed: {},
  methods: {
    init() {
      let v = this.payload;
      let ps = [];
      let url = "/api/business/queryBookorderListByContract";
      ps.push(this.$get(url, { bill_type: "BK", bill_id: v.bill_id }));
      return Promise.all(ps).then(([data]) => {
        this.datas = data.pi_bookorders;
      });
    },
    amount(row) {
      const {
        show_status: showStatus,
        amt1_sell: amt1Sell,
        amt1_discount: amt1Discount,
        amt2_sell: amt2Sell,
        adjust_income: adjustIncome,
        amt2_discount: amt2Discount,
      } = row;
      if (
        showStatus === "no_shipping_space" ||
        showStatus === "no_on_board" ||
        showStatus === "no_settlement"
      ) {
        return (amt1Sell || 0).toFixed(2) - (amt1Discount || 0).toFixed(2);
      } else {
        return (
          Number((amt2Sell || 0).toFixed(2)) -
          Number((amt2Discount || 0).toFixed(2)) +
          Number((adjustIncome || 0).toFixed(2))
        ).toFixed(2);
      }
    },
    async onDelete(row) {
      await this.$confirm(this.$t("delete_tip"), this.$t("dialog_tip"), {
        type: "warning",
      });
      this.$post2("/api/business/deleteBill", {
        bill_id: row.bill_id,
        bill_type: "BK",
      }).then((data) => {
        this.$message("删除成功");
        this.init();
      });
    },
    onAdd () {
      let d = this.payload
      this.$dialog.SelectShippingOrders({
        searchVm: {
          bill_kind: 'SC',
          busi_group_id: d.busi_group_id,
          busi_user: d.busi_user,
          com_legal: d.seller_id,
          buyer_id: d.buyer_id,
          is_delivery: 'no',
          is_order: 'no',
          contract_id: this.payload.contract_id
        },
        colKey: 'select_order_table_header',
        disabledMap: {
          busi_group_id: true,
          busi_user: true,
          com_legal: true,
          buyer_id: true
        }
      }, async data => {
        if (!data.length) return
        this.$pull.preBill({
          bill_type: 'BK',
          pi_orders: data.map((m, index) => ({bill_prod_id: m.bill_prod_id, bk_seq: index + 1})),
          trade_type: this.payload.trade_type || 'foreign'
        }).then((data) => {
          this.viewDetail(data)
          this.init()
        })
      })
    },
    viewDetail (v) {
      this.$tab.open({
        title: v.bill_no,
        tab_id: v.bill_id,
        path: 'BkEdit',
        query: {
          bill_id: v.bill_id,
        },
      })
    },
  },
  created() {
    this.payload.trade_type = this.payload.trade_type || 'foreign'
    this.init();
  },
};
</script>
