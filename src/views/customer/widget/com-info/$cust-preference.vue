<template lang="html">
  <div class="cust-preference">
    <div class="mb15">
      <span>
        <span class="text-bold">联系人：</span>
        <span>{{ payload.cust.user_name }}</span>
      </span>
      <span class="ml15">
        <span class="text-bold">电话：</span>
        <span>{{ payload.cust.user_phone }}</span>
      </span>
      <span class="ml15">
        <span class="text-bold">邮箱：</span>
        <span>{{ payload.cust.user_mail }}</span>
      </span>
      <span class="ml15">
        <span class="text-bold">公司：</span>
        <span>{{ payload.cust.x_cust_com_id }}</span>
      </span>
      <span class="ml15">
        <span class="text-bold">国家：</span>
        <span>{{ payload.country }}</span>
      </span>
    </div>
    <x-table :data="datas" :getData="refresh" :page="searchModel">
      <x-table-column type="index" width="">
      </x-table-column>
      <x-table-column label="产品图片" width="">
        <x-td-img :src="row.prod_pic" slot-scope="{row}"></x-td-img>
      </x-table-column>
      <x-table-column label="品名/货号" width="">
        <template slot-scope="{row}">
          <div class="line-2">
            {{ row.prod_name || row.prod_name_en }}
          </div>
          <div class="text-grey">
            {{ row.prod_no }}
          </div>
        </template>
      </x-table-column>
      <x-table-column label="浏览次数" width="" prop="read_count">
      </x-table-column>
      <x-table-column label="浏览时长(s)" width="" prop="duration">
      </x-table-column>
      <x-table-column label="询价次数" width="" prop="inq_count">
      </x-table-column>
      <x-table-column label="报价次数" width="" prop="qu_count">
      </x-table-column>
      <x-table-column label="订单次数" width="" prop="order_count">
      </x-table-column>
      <x-table-column label="最近互动" width="">
        <template slot-scope="{row}">
          {{ row.last_create_date | timeFormat }}
        </template>
      </x-table-column>
    </x-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      datas: [],
      searchModel: {
      }
    }
  },
  methods: {
    openBill(v) {
      this.$tab.open({
        title: v.user_name || '联系人详情',
        tab_id: v.cust_id,
        path: 'ContactEdit',
        query: {
          cust_id: v.cust_id,
          cust_type: v.cust_type,
        }
      })
    },
    refresh() {
      return this.$get('/api/marking/queryCustProdLog', {
        cust_id: this.payload.cust_id,
        ...this.searchModel,
      }).then(res => {
        this.datas = res.cust_marking || []
        return res
      })
    },
    initialize() {
      this.searchModel.x_searchLast = 1
    },
  },
  created() {
    this.initialize()
  },
}
</script>
