<template>
  <el-dialog
    :visible="true"
    :close-on-click-modal="false"
    @close="onClose2"
    class="imp-prod-in-order">
    <div class="dialog-title" slot="title">
      <t path="upload">上传</t>
    </div>
    <div>
      <div class="flex-a">
        <x-upload only @finish="uploadExcel" list-type="text" width="auto">
          <el-button><t path="sc.upload_excel">上传Excel</t></el-button>
        </x-upload>
        <el-button @click="refresh"><t path="refresh">刷新</t></el-button>
      </div>
      <div class="imo-status">
        <span class="text-orange mr20" v-if="isOver === false">
          <t path="sc.importing">导入中...</t>
        </span>
        <span v-if="datas.length">
          <t path="sc.import_desc" :vars="[datas.length, failDatas.length]">
            已导入{{datas.length}}，其中失败{{failDatas.length}}
          </t>
        </span>
      </div>
      <div class="mt20">
        <div class="i-title"><t path="sc.import_prod">Products failed to import</t></div>
        <el-table :data="failDatas" style="width: 100%">
          <el-table-column type="index" width="80">
            <t slot="header" path="no">序号</t>
          </el-table-column>
          <el-table-column prop="model">
            <t slot="header" path="sc.failed_model">添加失败的型号</t>
          </el-table-column>
          <el-table-column prop="supplier_no">
            <t slot="header" path="sc.failed_supplier_no">添加失败的品号</t>
          </el-table-column>
          <el-table-column prop="syn_reason">
            <t slot="header" path="sc.failed_reason">添加失败的原因</t>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="onClose2">{{$t('cancel')}}</el-button>
      <el-button
        type="primary"
        @click="onClick"
      >{{$t('confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>

export default {
  components: {},
  data() {
    return {
      datas: [],
      isOver: '',
      impId: ''
    }
  },
  computed: {
    failDatas () {
      return this.datas.filter(m => m.imp_status === 'fail')
    }
  },
  methods: {
    async uploadExcel (file) {
      if (!file) return this.$message(this.$t('pls_upload_excel'))
      let para = {
        import_url: file.url,
        imp_type: 'impDeliveryDate',
        purchase_id: this.purchase_id
      }
      if (this.isDg) para.imp_type = 'impDeliveryOrder'
      this.$post2('/api/manage/impExcel', para, {loading: true, warning: false}).then((data) => {
        this.impId = data.impId
        this.timerStart()
      }).catch(d => {
        if (d.message.indexOf('ResponseTimeoutError') >= 0) {
          this.$message(this.$t('importing_tip'))
          this.timerStart()
        }
      })
    },
    timerStart () {
      this.isOver = false
      this.timer = 0
      this.timedRefresh()
    },
    timedRefresh () {
      this.isOver = false
      this.timer++
      if (this.timer > 100) return
      setTimeout(() => {
        this.refresh().then(() => {
          if (this.isOver) {
            this.$message.success(this.$t('importing_tip'))
          } else {
            this.timedRefresh()
          }
        })
      }, 5000)
    },
    refresh () {
      if (this.impId) {
        return this.$get('/api/manage/queryImpResultDetail', {imp_id: this.impId}, {loading: false}).then((data) => {
          console.log(data)
          if (data) {
            if (data.imp_result.status === 'done') {
              this.isOver = true
            }
            this.datas = data.imp_result_details || []
          }
          return data
        })
      }
    },
    onClick() {
      this.timer = 999 // 清除定时
      this.onCallback().then(() => this.onClose())
    },
    onClose2 () {
      this.timer = 999 // 清除定时
      // if (this.isFinish) return this.onClick()
      // if (this.importStatus) return this.$message(this.importStatus)
      this.onCallback().then(() => this.onClose())
    }
  },
  created() {
  },
  beforeDestroy () {
    this.timer = 0 // 清除定时
  }
}
</script>

<style lang="scss">
.imp-prod-in-order {
  .el-dialog {
    width: 80%;
    max-width: 900px;
  }
  .i-title {
    font-weight: 600;
    margin-bottom: 5px;
  }
  .upload-excel {
    padding: 0;
    .ideal-upload-core-wrap {
      padding: 12px 20px;
    }
  }
}
</style>