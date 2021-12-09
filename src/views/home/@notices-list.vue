<template>
  <el-drawer
    :title="title"
    :visible="true"
    direction="rtl"
    @close="onClose">
    <div class="notices-list">
      <div class="fixed-top">
        <el-menu :default-active="searchVm.status" mode="horizontal" @select="handleSelect">
          <el-menu-item v-for="(item) in allStatus" :key="item.key" :index="item.key">
            {{$tt(item, 'text')}}
          </el-menu-item>
        </el-menu>
      </div>
      <div class="n-list ph10" v-infinite-scroll="load">
        <transition-group name="item" tag="div">
          <div class="n-item bb pv10 ph10" :class="{'active': active===item.id}" v-for="(item, i) in datas" :key="item.id" @click="active=item.id">
            <div class="n-title pointer" @click="onOpen(item, i)">
              <span class="text-semibold text-danger">{{getTitle(item, i)}}</span>
              <span class="text-grey ml10 text-12">({{item.update_time | formatTime}})</span>
            </div>
            <div class="text-12 text-deepgrey">
              {{item.content}}
            </div>
            <div class="flex-b mt10 text-12">
              <div class="text-grey">{{getStatus(item)}}</div>
              <span class="a-link" @click="doRead(item, i)" v-if="item.status === 'uncommit'">已读</span>
            </div>
          </div>
        </transition-group>
        <no-data v-if="!datas.length"></no-data>
      </div>
    </div>
  </el-drawer>
</template>
<script>
let textMap = {
  inquiry: {
    text: '询盘信息',
    open (d) {
      this.$dialog.InquiryDetail({quote_id: d.audit_id})
    }
  },
  inquiry_reply: {
    text: '询盘回复',
    open: ''
  },
  platform_monitor: {
    text: '任务信息',
    async open ({audit_id}) {
      if (!audit_id) return
      let d = await this.$get('/ideal/wf/queryTaskInsDetail', {task_ins_id: audit_id})
      d = d.wf_task_ins || {}
      let {contract_id, bookorder_id} = d
      let page_id = bookorder_id || contract_id || audit_id
      if (!page_id) return
      let title = d.x_contract_id || d.x_bookorder_id || d.type
      let path = 'TaskExecutionResults'
      if (contract_id) path = 'ScEdit'
      if (bookorder_id) path = 'BkEdit'
      this.$tab.open({title, page_id, path, query: d})

      this.onClose()
    }
  }
}
export default {
  props: {},
  components: {},
  data () {
    return {
      datas: [],
      searchVm: {
        status: 'uncommit',
        page_index: 1,
        page_size: 15,
        count: 0
      },
      allStatus: [
        {text: '全部', text_en: 'All', key: ''},
        {text: '未处理', text_en: '未处理', key: 'uncommit'},
        {text: '已处理', text_en: '已处理', key: 'approved'},
        {text: '拒绝', text_en: '拒绝', key: 'refused'},
        {text: '撤销', text_en: '撤销', key: 'revoked'},
      ],
      active: ''
    }
  },
  methods: {
    async getDatas () {
      let para = this.searchVm._trim()
      let d = await this.$get('/api/system/queryMsgRecord', para)
      this.datas = this.datas.concat(d.sys_msg_records || [])
      if ('count' in d) this.searchVm.count = d.count
    },
    load () {
      let {page_index, page_size, count} = this.searchVm
      if (page_index * page_size >= count) return
      this.searchVm.page_index++
      this.getDatas()
    },
    handleSelect (key) {
      this.searchVm.page_index = 1
      this.datas = []
      this.searchVm.status = key
      this.getDatas()
    },
    getTitle ({type}) {
      return textMap[type] ? textMap[type].text : type
    },
    getStatus ({status}) {
      this.allStatusMap || (this.allStatusMap = this.allStatus._object('key'))
      return (this.allStatusMap[status] || {}).text
    },
    onOpen (d, i) {
      let {audit_key, url} = d
      if (url) {
        window.open(url)
      } else {
        let v = textMap[audit_key]
        if (v && v.open) {
          v.open.call(this, d)
        }
      }
      this.doRead(d, i)
    },
    doRead (d, i) {
      if (d.status === 'approved') return
      d.status = 'approved'
      let {id, status} = d
      if (this.searchVm.status === 'uncommit') this.datas.splice(i, 1)
      this.$post('/api/system/upDatePushMsg', {id, status})
    }
  },
  computed: {
  },
  watch: {
  },
  created () {
    this.getDatas()
  },
  beforeDestroy () {
  }
}
</script>
<style lang="scss">
.notices-list-dialog {
  .el-drawer {
    display: flex;
    flex-direction: column;
  }
  .el-drawer__header {
    margin-bottom: 10px;
  }
  .el-drawer__body {
    height: calc(100% - 60px);
    flex: 1;
  }
}
.notices-list {
  height: 100%;
  .n-item {
    &.active {
      background: #eaebfc;
    }
    &:hover {
      background: #eaebfc;
    }
  }
  .n-list {
    height: calc(100% - 60px);
    overflow: auto;
  }

  .n-item {
    transition: all 1s;
    display: inline-block;
    margin-right: 10px;
    width: 100%;
  }
  .item-enter, .item-leave-to
  /* .item-leave-active for below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(30px);
  }
  .item-leave-active {
    position: absolute;
  }
}
</style>