<template>
  <div class="sup-confirm-crd-list">
    <el-menu :default-active="searchModel.vend_busi_status" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item v-for="item in bill_status" :key="item.key" :index="item.key">{{ $i18n.locale === 'cn' ? item.text : item.text_en}}({{ data[item.key+'_count'] }})</el-menu-item>
    </el-menu>
    <div class="flex-b mt10">
      <div class="h-left">
        <select-group-user :result="searchModel" field="busi_group_id" field2="busi_user" @change="refresh" v-if="$root.isSaas"></select-group-user>
      </div>
      <div class="h-center"></div>
      <div class="h-right">
        <x-input
          v-model="searchModel.fuzzy_value"
          placeholder="请输入"
          @blur-change="refresh"
          @enter="refresh"
          :maxlength="100"
          prefix-icon="el-icon-search"
          clearable
        ></x-input>
      </div>
    </div>
    <el-table :data="datas" tooltip-effect="dark" style="width: 100%" v-if="type !== 'dg'">
      <el-table-column>
        <t slot="header" path="sc.purchase_no">采购单号</t>
        <template slot-scope="scope">
          <div><el-button type="text" @click="onBill(scope.row)">{{ scope.row.purchase_no || "--" }}</el-button></div>
        </template>
      </el-table-column>
      <el-table-column width="100">
        <t slot="header" path="seller_id">供应商</t>
        <template slot-scope="scope">
          {{ scope.row.x_seller_id }}
        </template>
      </el-table-column>
      <el-table-column>
        <t slot="header" path="sc.contract_no">预订单号</t>
        <template slot-scope="scope">
          <div>{{ (scope.row.pi_contract || {}).cust_po_no }}</div>
          <div>{{ (scope.row.pi_contract || {}).contract_no }}</div>
        </template>
      </el-table-column>
      <el-table-column>
        <t slot="header" path="customer">客户</t>
        <template slot-scope="scope">
          {{ scope.row.x_pi_buyer_id }}
        </template>
      </el-table-column>
      <el-table-column>
        <t slot="header" path="product">产品</t>
        <template slot-scope="{row}">
          <!-- {{ getProdName(scope.row) }} -->
          <div class="line-1" v-for="item in (row.pi_prods || []).slice(0, 3)" :key="item.bill_prod_id" :title="item.prod_name || item.prod_name_en">
            {{item.prod_name || item.prod_name_en}}
          </div>
        </template>
      </el-table-column>
      <el-table-column>
        <t slot="header" path="sku_num">SKU数量</t>
        <template slot-scope="scope">
          {{ (scope.row.pi_prods || []).length }}
        </template>
      </el-table-column>
      <el-table-column>
        <t slot="header" path="sc.delivery_date">要求交期</t>
        <template slot-scope="scope">
          <div>{{ scope.row.delivery_date | timeFormat }}</div>
        </template>
      </el-table-column>
      <el-table-column>
        <t slot="header" path="sc.busi_user2">跟单员</t>
        <template slot-scope="scope">
          <div>{{ scope.row.x_busi_user }}</div>
          <div>{{ scope.row.receive_date | timeFormat('MM-DD HH:mm') }}</div>
        </template>
      </el-table-column>
      <el-table-column>
        <t slot="header" path="sc.busi_user_create">业务员/创建</t>
        <template slot-scope="scope">
          <div>{{ scope.row.x_pi_busi_user }}</div>
          <div>{{ scope.row.publish_date | timeFormat('MM-DD HH:mm') }}</div>
        </template>
      </el-table-column>
      <el-table-column>
        <t slot="header" path="action">操作</t>
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="onBill(scope.row)"
            >{{$t('view')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-table :data="datas" tooltip-effect="dark" style="width: 100%" v-if="type === 'dg'">
      <el-table-column>
        <t slot="header" path="sc.purchase_no">采购单号</t>
        <template slot-scope="scope">
          <div><el-button type="text" @click="onBill(scope.row)">{{ scope.row.x_purchase_id || "--" }}</el-button></div>
        </template>
      </el-table-column>
      <el-table-column width="100">
        <t slot="header" path="seller_id">供应商</t>
        <template slot-scope="scope">
          {{ scope.row.x_vend_cust_com_id }}
        </template>
      </el-table-column>
      <el-table-column width="100">
        <t slot="header" path="cust_user">联系人</t>
        <template slot-scope="scope">
          {{ scope.row.x_vend_cust_user_id }}
        </template>
      </el-table-column>
      <!-- <el-table-column>
        <t slot="header" path="sc.delivery_no">可发货清单</t>
        <template slot-scope="scope">
          <div><el-button type="text" @click="onDgEdit(scope.row)">{{ (scope.row.pi_delivery || {}).delivery_no || "--" }}</el-button></div>
        </template>
      </el-table-column> -->
      <el-table-column>
        <t slot="header" path="customer">客户</t>
        <template slot-scope="scope">
          {{ scope.row.x_sell_cust_com_id }}
        </template>
      </el-table-column>
      <el-table-column>
        <t slot="header" path="sc.shipment_date">出运日</t>
        <template slot-scope="scope">
          <div>{{ (scope.row.pi_delivery || {}).shipment_date | timeFormat }}</div>
        </template>
      </el-table-column>
      <el-table-column>
        <t slot="header" path="sc.busi_user_receive">跟单员/回复</t>
        <template slot-scope="scope">
          <div>{{ scope.row.x_busi_user }}</div>
          <div>{{ scope.row.receive_date | timeFormat('MM-DD HH:mm') }}</div>
        </template>
      </el-table-column>
      <el-table-column>
        <t slot="header" path="sc.busi_user_publish">业务员/通知</t>
        <template slot-scope="scope">
          <div>{{ scope.row.x_pi_busi_user }}</div>
          <div>{{ scope.row.publish_date | timeFormat('MM-DD HH:mm') }}</div>
        </template>
      </el-table-column>
      <el-table-column>
        <t slot="header" path="action">操作</t>
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="onBill(scope.row)"
            >{{$t('view')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="text-center mt15">
      <el-pagination
        hide-on-single-page
        background
        layout="prev, pager, next"
        :total="searchModel.count"
        @current-change="refresh"
        :page-size="searchModel.page_size"
        :current-page.sync="searchModel.page_index"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      datas: [],
      data: {},
      searchModel: {
        page_index: 1,
        page_size: 10,
        count: 0,
        busi_group_id: "",
        busi_user: "",
        fuzzy_value: "",
        vend_busi_status: "pending",
        status: 'normal',
        bill_status: 'open',
      },
      bill_status: [
        {text: "待确认", text_en: "Padding", key: "pending"},
        {text: "已确认", text_en: "Confirmed", key: "confirmed"},
      ],
      type: ''
    };
  },
  computed: {
  },
  methods: {
    init() {
      this.type = this.payload.type || this.type
      this.refresh();
    },
    async refresh(index) {
      this.searchModel.page_index = typeof index === 'number' ? index : 1
      let self = this;
      let search = { ...self.searchModel };
      search = search._trim();
      let url = "/api/business/confirmDeliveryDateList"
      if (this.type === 'dg') url = "/api/business/queryDeliveryPurchaseList"
      return this.$get(url, search, {
        loading: true,
      }).then((res) => {
        this.data = res || {}
        this.datas = res.pu_purchases || res.delivery_purchases || [];
        console.log(this.datas)
        if ('count' in res) this.searchModel.count = res.count;
        return res;
      });
    },
    handleSelect (key, path) {
      this.searchModel.vend_busi_status = key
      this.searchModel.page_index = 1
      this.refresh()
    },
    // getProdName (row) {
    //   let length = row.pi_prods.length >= 3 ? 3 : row.pi_prods.length
    //   let str = []
    //   for (let i = 0; i < length; i++) {
    //     str += row.pi_prods[i].prod_name + ','
    //     str.push()
    //   }
    //   return str
    // },
    onDelete(row, index) {
    },
    onBill (row) {
      let auth = this.$store.getters.user_auth.pu_auth.edit
      // let enable_submit = row.busi_user === this.$state("me").user_id
      let enable_submit = auth === 'all' ||
                          (auth === 'group' && (this.$state('me').busi_groups.includes(row.busi_group_id))) ||
                          (auth === 'self' && (row.busi_user === this.$state("me").user_id))
      let bill_id = row.bill_id || row.delivery_purchase_id
      let bill_no = row.bill_no || row.x_purchase_id || ''
      this.$tab.push('SupConfirmCrd', {bill_id, bill_no, enable_submit})
    },
    onDgEdit (row) {
      if (!row.pi_delivery) return
      this.$tab.open({
        title: row.pi_delivery.delivery_no,
        tab_id: row.pi_delivery.delivery_id,
        path: 'DgEdit',
        query: {
          bill_id: row.pi_delivery.delivery_id
        }
      })
    }
  },
  created() {
    this.init();
  },
};
</script>
