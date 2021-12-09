<template>
  <el-dialog
    :visible="true"
    :close-on-click-modal="false"
    @close="onClick"
    class="imp-prod-in-order">
    <div class="dialog-title" slot="title">
      <t path="sc.imp_prod_by_excel">通过Excel导入商品</t>
    </div>
    <div>
      <div class="flex-a">
        <el-button @click="downloadTpl"><t path="sc.download_excel_tpl">下载Excel模板</t></el-button>
        <x-upload only @finish="uploadExcel" list-type="text" width="auto">
          <el-button><t path="sc.upload_excel">上传Excel</t></el-button>
        </x-upload>
        <el-button @click="refresh"><t path="refresh">刷新</t></el-button>
      </div>
      <div class="imp-desc mt10">
        <div class="i-title"><t path="steps" colon>步骤:</t></div>
        <t path="sc.imp_prod_by_excel_steps">
          <div>1. 点击下载模板</div>
          <div>2. 填写模板数据</div>
          <div>3. 上传模板</div>
          <div>4. 如果有识别错误的商品，可查看添加失败的品号，维护后再次上传</div>
        </t>
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
          <el-table-column prop="prod_no">
            <t slot="header" path="sc.failed_prod_no">公司货号</t>
          </el-table-column>
          <el-table-column prop="supplier_no">
            <t slot="header" path="sc.failed_supplier_no">供方货号</t>
          </el-table-column>
          <el-table-column prop="model">
            <t slot="header" path="sc.failed_model">规格型号</t>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <!-- <el-button @click="onClick">{{$t('close')}}</el-button> -->
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
      impId: '',
      tplsMap: {
        PI: {
          url: 'https://dxdoc3.oss-cn-hangzhou.aliyuncs.com/21/4/28/808220_6089442db3976a6174d1d6eb_b202aa034501.xlsx',
          file_name: '订单导入模板.xlsx'
        },
        QU: {
          url: 'https://dxdoc3.oss-cn-hangzhou.aliyuncs.com/21/4/28/808220_6089442db3976a6174d1d6eb_b202aa034501.xlsx',
          file_name: '报价导入模板.xlsx'
        }
      }
    }
  },
  computed: {
    failDatas () {
      return this.datas.filter(m => m.imp_status === 'fail')
    }
  },
  methods: {
    async downloadTpl () {
      let m = this.tplsMap[this.bill_type] || this.tplsMap.PI
      this.$h.download(m.url, m.file_name)
    },
    async uploadExcel (file) {
      if (!file) return this.$message(this.$t('pls_upload_excel'))
      let para = {
        ...this.imp_para,
        import_url: file.url,
        file_name: file.file_name
      }
      this.$post2('/api/manage/impExcel', para, {loading: true, warning: false}).then((data) => {
        this.impId = data.impId
        this.timerStart()
      }).catch(d => {
        if (d.message.indexOf('ResponseTimeoutError') >= 0) {
          this.$message(this.$t('sc.importing_tip'))
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
            this.$message.success(this.$t('sc.importing_tip'))
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
      this.timer = 0 // 清除定时
      this.onCallback()
      this.onClose()
    },
    onClose2 () {
      // if (this.isFinish) return this.onClick()
      // if (this.importStatus) return this.$message(this.importStatus)
      this.onClose()
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