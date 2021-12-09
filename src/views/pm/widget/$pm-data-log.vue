<template>
  <div class="log-list">
    <div class="tab-page-header">
      <div class="flex-b mt10">
        <div class="h-left">
        </div>
        <div class="h-right">
        </div>
      </div>
    </div>
    <!-- <x-fold class="mt20" show>
      <span slot="header">Params</span>
      <x-table :data="operLogs" pagination :page="searchVm" @page-change="getOperLogs">
        <x-table-column>
          <t slot="header" path="log.index">序号</t>
          <template slot-scope="scope">
            {{scope.$index + 1}}
          </template>
        </x-table-column>
        <x-table-column>
          <t slot="header" path="log.operate_type">动作</t>
          <template slot-scope="{row}">
            {{row.remark || '修改'}}
          </template>
        </x-table-column>
        <x-table-column>
          <t slot="header" path="log.x_user_id">用户</t>
          <template slot-scope="{row}">
            <div>{{ row.x_create_user }}</div>
          </template>
        </x-table-column>
        <x-table-column>
          <t slot="header" path="log.create_date">时间</t>
          <template slot-scope="{row}">
            <div>{{ row.create_date | timeFormat('YYYY-MM-DD HH:mm') }}</div>
          </template>
        </x-table-column>
        <x-table-column width="80">
          <t slot="header" path="log.detail">详情</t>
          <template slot-scope="{row}">
            <el-button type="text">
              <t path="log.detail" @click="onDetail(row)">详情</t>
            </el-button>
          </template>
        </x-table-column>
      </x-table>
    </x-fold> -->
    <x-table :data="dataLogs" pagination :page="searchVm2" @page-change="getDataLogs" class="mt20">
      <x-table-column>
        <t slot="header" path="log.index">序号</t>
        <template slot-scope="scope">
          {{scope.$index + 1}}
        </template>
      </x-table-column>
      <!-- <x-table-column>
        <t slot="header" path="log.prod_name">产品</t>
        <template slot-scope="{row}">
          <div>{{row.prod_name}}</div>
          <div>{{row.model}}</div>
        </template>
      </x-table-column> -->
      <x-table-column>
        <t slot="header" path="log.field">数据</t>
        <template slot-scope="{row}">
          {{row.log_desc}}
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="log.original_value">原值</t>
        <template slot-scope="{row}">
          {{row.original_value}}
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="log.new_value">新值</t>
        <template slot-scope="{row}">
          {{row.new_value}}
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="log.x_user_id">用户</t>
        <template slot-scope="{row}">
          <div>{{ row.x_create_user }}</div>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="log.create_date">时间</t>
        <template slot-scope="{row}">
          <div>{{ row.create_date | timeFormat('YYYY-MM-DD HH:mm') }}</div>
        </template>
      </x-table-column>
    </x-table>
  </div>
</template>

<script>
export default {
  options: {
    icon_text: 'List',
    title: '产品数据日志'
  },
  components: {
  },
  data() {
    return {
      operLogs: [],
      dataLogs: [],
      searchVm: {
        page_index: 1,
        page_size: 15,
      },
      searchVm2: {
        page_index: 1,
        page_size: 15,
      },
      log_id: ''
    }
  },
  methods: {
    async getOperLogs (i) {
      this.searchVm.page_index = typeof i === 'number' ? i : 1
      let para = {...this.searchVm}
      para.operate_table_id = this.payload.prod_id
      let v = await this.$get('/api/manage/queryOperLogs', para._trim())
      this.operLogs = v.operate_logs
      if ('count' in v) this.searchVm.count = v.count
    },
    async getDataLogs (i) {
      this.searchVm2.page_index = typeof i === 'number' ? i : 1
      let para = {...this.searchVm2}
      // para.operate_log_id = this.log_id
      para.operate_table_id = this.payload.prod_id
      let v = await this.$get('/api/manage/queryDataLogs', para._trim())
      this.dataLogs = v.data_logs
      if ('count' in v) this.searchVm2.count = v.count
    },
    onDetail (row) {
      this.log_id = row.operate_log_id
      this.getDataLogs()
    },
    async init () {
      // this.getOperLogs()
      this.getDataLogs()
    },
  },
  created () {
    this.init()
  }
}
</script>
