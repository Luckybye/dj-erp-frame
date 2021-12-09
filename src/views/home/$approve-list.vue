<template>
  <div class="approve-list">
    <div class="tab-page-header flex-b fixed-top h-b">
      <el-menu :default-active="searchModel.approve_action" mode="horizontal" @select="handlerSelect" class="fixe-1">
        <el-menu-item v-for="(item) in filterStatus" :key="item.status" :index="item.status">
          {{$tt(item, 'text')}}
        </el-menu-item>
      </el-menu>
      <div>
        <x-input
        v-model="searchModel.fuzzy_value"
        :placeholder="$t('pls_input_search_cond')"
        prefix-icon="el-icon-search" width="250px"
        @blur-change="queryApproveList()"
        @enter="queryApproveList"
        clearable></x-input>
      </div>
    </div>
    <div class="list">
      <div
        v-for="(row) in datas"
        :key="row.approve_id"
        class="item"
      >
        <div class="flex-b">
          <div class="section">
            <span>申请人:</span>
            <span>
              {{ row.x_create_user }}
            </span>
          </div>
          <div class="section right">
            <span>提交日期:</span>
            <span style="color: grey">
              {{ row.create_date | timeFormat }}
            </span>
          </div>
        </div>
        <div class="flex-b">
          <div class="section">
            <span class="a-link"
              @click="clickHandler(row)">
              {{row.approve_brief || '-'}}
            </span>
          </div>
          <div class="section right">
            <span class="text-bold">
              {{row.approve_name}}
              <span v-if="row.approve_status==='agreed'" style="color: #5cd992">
                &#X3000;同意</span>
              <span v-if="row.approve_status==='rejected'" style="color: red">
                &#X3000;驳回</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="text-right fixed-bottom mt10">
      <el-pagination
        @current-change="onShowPage"
        layout="total, sizes, prev, pager, next, jumper"
        :total="searchModel.count"
        :page-sizes="[20, 30, 40, 50]"
        :page-size="searchModel.page_size"
        @size-change="handleSizeChange"
        hide-on-single-page
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  options: {
    icon_text: 'List'
  },
  data() {
    return {
      searchModel: {
        page_index: 1,
        page_size: 20,
        fuzzy_value: '',
        approve_action: 'doing',
        count: 0,
      },
      datas: [],
      filterStatus: [
        {
          text: '待审批',
          text_en: '待审批',
          status: 'doing',
        },
        {
          text: '已审批',
          text_en: '已审批',
          status: 'done',
        },
      ]
    }
  },
  methods: {
    clickHandler(row) {
      let url = `/approve-detail.html?field=${row.approve_type}&approve_id=${row.rela_main}&view=2`
      this.$tab.push('ApproveDetail', {url})
    },
    queryApproveList() {
      let search = { ...this.searchModel }
      this.$get('/api/manage/queryApproveList', search).then(res => {
        this.datas = res.cm_approves || []
        res.count && (this.searchModel.count = res.count)
      })
    },
    onShowPage(i) {
      this.searchModel.page_index = i
      this.queryApproveList()
    },
    handleSizeChange(val) {
      this.searchModel.page_size = val
      this.queryApproveList()
    },
    handlerSelect (v) {
      this.searchModel.approve_action = v
      this.queryApproveList()
    }
  },
  components: {
  },
  created() {
    this.queryApproveList()
  },
}
</script>

<style rel="stylesheet/scss" lang="scss">
.approve-list {
  .tr {
    color: #6d78e7;
    cursor: pointer;
    &:hover {
      background: #e1e1e1;
    }
  }
  .item {
    width: 100%;
    // height: 95px;
    padding: 10px 5px;
    margin: 0px;
    &:nth-child(2n) {
      background-color: rgba(231, 235, 252, 0.5);
    }

    .section {
      height: 25px;
      line-height: 25px;
      white-space: nowrap;
      &.right {
        text-align: right;
      }
    }
  }
}
</style>
