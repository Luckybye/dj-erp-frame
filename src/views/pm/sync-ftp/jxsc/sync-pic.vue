<template lang="html">
  <div class="sync-prod-data">
    <div class="mb15">
      <el-button type="primary" @click="onSync">新建图片同步</el-button>
      <span v-if="currentLog.syn_status === 'start'">
        <el-button type="primary" @click="timeRefresh" v-if="!dateMap.timer">刷新当前同步记录详情</el-button>
        <el-button type="primary" @click="stopRefresh" v-else>停止刷新</el-button>
      </span>
    </div>
    <div class="flex">
      <div class="s-left">
        <div class="text-bold text-16 mb10">
          同步记录
          <el-button type="primary" @click="queryLogs()" class="ml10">刷新</el-button>
        </div>
        <div class="sync-logs">
          <div class="s-item" v-for="(item, i) in datas" :key="i" :class="{'active': currentLog.syn_plan_id === item.syn_plan_id}" @click="refresh(i)">
            {{item.create_date | timeFormat 'YYYY-MM-DD HH:mm'}}
            <span class="s-status" :class="item.syn_status">
              {{item.syn_status | synStatusFilter}}</span>
          </div>
        </div>
      </div>
      <div class="flex-1">
        <div class="text-bold text-16 mb10">
          本次同步记录详情
          <span class="text-14 text-red ml20">
            <x-check :result="searchModel" field="syn_status" expect="fail" unexpect="" text="同步失败" @on-change="onRefresh"></x-check>
          </span>
        </div>
        <x-table :datas="logDetails" :page="searchModel" :getData="refresh">
          <x-table-column class="text-center" label="图片名">
            <div slot-scope="{row}">{{row.file_name}}</div>
          </x-table-column>
          <x-table-column class="text-center" label="图片">
            <div slot-scope="{row}">
              <div style="width:100px;height:100px">
                <img :src="row.file_url | imgFormat 'middle'" alt="" class="object-cover">
              </div>
            </div>
          </x-table-column>
          <x-table-column class="text-semibold" label="同步时间">
            <div slot-scope="{row}">{{row.create_date | timeFormat}}</div>
          </x-table-column>
          <x-table-column class="text-semibold" label="错误原因">
            <div slot-scope="{row}">{{row.syn_reason}}</div>
          </x-table-column>
        </x-table>
      </div>
    </div>
  </div>
</template>
<script>
function timeRefresh (v) {
  let d = this.dateMap
  this.onRefresh()
  d.timer = setInterval(() => {
    this.onRefresh()
  }, d.interval)
  d.timeout = setTimeout(() => {
    d.clear()
    this.queryLogs()
  }, d.outtime)
}

export default {
  data () {
    return {
      searchModel: {
        x_searchLast: 0,
        page_index: 1,
        page_size: 10,
        syn_status: '',
      },
      datas: [],
      dateMap: {
        interval: 5000,
        outtime: 2 * 60 * 1000,
        timer: null,
        timeout: null,
        clear: (save) => {
          clearInterval(this.dateMap.timer)
          clearTimeout(this.dateMap.timeout)
          if (!save) {
            this.dateMap.timer = null
            this.dateMap.timeout = null
          }
          console.log('已清除定时器')
        }
      },
      currentIndex: 0,
      logDetails: [],
      vm: {is_fail: false}
    }
  },
  methods: {
    timeRefresh,
    stopRefresh () {
      this.dateMap.clear()
      this.queryLogs()
    },
    onSync () {
      if (!this.$state('me').isJxsilk) {
        return this.$message('本接口需专门接口，请联系WokeLink')
      }
      this.$get('/api/manage/createSynPicPlan').then(data => {
        this.queryLogs().then(() => {
          this.currentIndex = 0
          this.timeRefresh()
        })
      })
    },
    onRefresh () {
      this.searchModel.x_searchLast = 1
    },
    refresh (i) {
      let search = this.searchModel
      if (typeof i === 'number') {
        this.currentIndex = i
        search.page_index = 1
      }
      let id = this.currentLog.syn_plan_id
      if (!id) return this.$Promise.as()
      return this.$get('/api/manage/queryPicSynDetail', {
        syn_plan_id: id,
        ...search
      }._trim()).then(data => {
        this.logDetails = data.prod_syn_pics || []
        return data
      })
    },
    queryLogs () {
      return this.$get('/api/manage/queryProdSynPlan', {file_type: 'pic'}).then(data => {
        this.datas = (data.prod_syn_plans || []).reverse()
        return data
      })
    },
  },
  filters: {
    synStatusFilter (v) {
      return {
        initial: '正在导入',
        start: '正在导入',
        finish: '导入完成',
        exception: '导入异常',
        fail: '导入失败'
      }[v] || v
    }
  },
  watch: {
    actived (n) {
      if (!this.dateMap.timer) return
      n && this.timeRefresh()
      n || this.dateMap.clear(true)
    }
  },
  computed: {
    currentLog () {
      return this.datas[this.currentIndex || 0] || {syn_plan_id: '', syn_status: ''}
    }
  },
  created () {
    this.queryLogs().then(data => {
      this.onRefresh()
    })
  },
  beforeDestroy () {
    this.dateMap.clear()
  }
}
</script>

<style lang="scss">
  .sync-prod-data {
    .s-left {
    }
    .sync-logs {
      width: 200px;
      margin-right: 50px;
      .s-item {
        line-height: 30px;
        cursor: pointer;
        border-bottom: 1px solid #e1e1e1;
        padding-left: 10px;
        font-size: 14px;
        &:hover {
          background: #eeeeee;
        }
        &.active {
          background: #6d78e7;
          color: white;
        }
        .s-status {
          font-size: 12px;
          margin-left: 10px;
          &.initial, &.start {
            color: orange;
          }
          &.finish {
            color: rgb(31, 179, 38);
          }
          &.exception, &.fail {
            color: red;
          }
        }
      }
    }
  }
</style>
