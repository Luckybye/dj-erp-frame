<template>
  <div class="cust-level">
    <div class="tab-page-header">
      <div class="flex-b mt10">
        <div class="t-left">
          <div>提示:建议将价格系数最高的客户分级设为默认值</div>
        </div>
        <div class="t-right">
          <el-button @click="newCustmoerLevel"><t path="cust.add">添加</t></el-button>
        </div>
      </div>
    </div>
    <div class="content">
      <x-table :data="datas">
        <x-table-column type="index" width="50"></x-table-column>
        <x-table-column>
          <t slot="header" path="cust.level_name">客户分级</t>
          <template slot-scope="{row}">
            <el-button type="text" v-if="isOperate()" skin="blue" @click="onCustomerEdit(row)">{{row.level_name}}</el-button>
            <div v-else>{{row.level_name}}</div>
          </template>
        </x-table-column>
        <x-table-column>
          <t slot="header" path="cust.price_type">价格类型</t>
          <template slot-scope="{row}">
            <div>{{(priceTypesMap[row.price_type] || priceTypesMap.sell_price).text}}</div>
          </template>
        </x-table-column>
        <x-table-column>
          <t slot="header" path="cust.pricing_factor1">价格系数</t>
          <template slot-scope="{row}">
            <div>{{row.pricing_factor}}</div>
          </template>
        </x-table-column>
        <x-table-column>
          <t slot="header" path="action">操作</t>
          <template slot-scope="{row}">
            <el-button type="text" v-if="isOperate()" class="text-red" @click="onReceiptDel(row)">
              <t path="delete">删除</t>
            </el-button>
            <el-button type="text" v-if="isOperate()" :class="row.is_default == 'no' ? 'text-grey' : 'text-blue'" @click="onSetDefault(row)">
              <t path="cust.is_default">默认</t>
            </el-button>
          </template>
        </x-table-column>
      </x-table>
    </div>
  </div>
</template>

<script>
// import {clone} from 'xe-utils'
export default {
  options: {
    icon_text: 'B2B'
  },
  data() {
    return {
      datas: [],
      priceTypesMap: [
        {text: '售价折算(售价 × 价格系数)', expect: 'sell_price', unexpect: 'sell_price'},
        {text: '采购价折算(采购价 ÷ 价格系数)', expect: 'pu_price', unexpect: 'sell_price'},
      ]._object('expect')
    };
  },
  watch: {},
  methods: {
    newCustmoerLevel() {
      this.$dialog.EditCustLevel({ title: this.$t('cust.add') }, (res) => {
        this.onCreateValue(res);
      });
    },
    onCustomerEdit(row) {
      this.$dialog.EditCustLevel({ title: this.$t('cust.edit'), viewModel: row }, (res) => {
        this.onUpdateValue(res);
      });
    },
    isOperate () {
      let self = this
      if (self.$state('me').role !== '1' && self.$state('me').role !== '2') return false
      return true
    },
    onGetValue() {
      this.$get2("/api/b2b/queryCustLevels").then((data) => {
        this.datas = data.cust_levels;
        return data;
      });
    },
    onCreateValue(data) {
      this.$post2("/api/b2b/createCustLevel", data).then((res) => {
        this.onGetValue();
      });
    },
    onUpdateValue(data) {
      this.$request2("/api/b2b/updateCustLevel", data).then((res) => {
        this.onGetValue();
      });
    },
    onSetDefault(item) {
      this.$get2("/api/b2b/updateCustDefaultLevel", {
        level_id: Number(item.level_id),
      }).then((res) => {
        this.onGetValue();
      });
    },
    onReceiptDel(item) {
      this.$post2("/api/b2b/deleteCustLevel", {
        level_id: item.level_id,
      }).then((res) => {
        this.onGetValue();
      });
    },
  },
  created() {
    this.onGetValue();
  },
};
</script>
<style lang="scss">
.stats-brand {
  table {
    font-size: 14px;
    color: #606266;
    thead {
      color: #909399;
      font-weight: 500;
      text-align: left;
    }
    th,
    td {
      border-color: #ebeef5;
      padding: 5px 10px;
    }
  }
}
</style>
