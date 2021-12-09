<template lang="html">
  <div class="prod-import-list">
    <div class="flex">
      <div class="s-left fixed-top">
        <div class="text-bold text-16 mb10">
          产品Excel上传
        </div>
        <x-upload
          class="mb10"
          :limit-size="200 * 1024"
          v-model="tempModel.upload"
          @finish="onUpload"
          listType="text"
        >
          <el-button type="primary">Excel上传</el-button>
        </x-upload>
        <el-button type="primary" @click="refresh">刷新</el-button>
        <br>
        <el-button type="success" @click="refresh" class="mt10">
          <a href="https://i.wokelink.com/editor/index.html#/preview?doc_id=60aca12dd1a60e1b732c8474&type=dir&current_doc=60ae06a082b91f6a1c2dae9c" target="_blank">导入说明</a>
        </el-button>

      </div>
      <div class="flex-1 hidden">
        <div class="flex-b mb10">
          <span class="text-bold text-16 left-border-title">
            本次上传记录详情
          </span>
          <div class="">
            <x-label>
              <t slot="label" path="pm.upload_date" colon>上传日期：</t>
              <select-date
                width="130px"
                @change="refresh"
                :result="impModel"
                field="date_start"
              ></select-date>
              -
              <select-date
                width="130px"
                @change="refresh"
                :result="impModel"
                field="date_end"
              ></select-date>
            </x-label>
          </div>
        </div>
        <x-table :data="excelDatas">
          <x-table-column label="序号" type="index" width=""> </x-table-column>
          <x-table-column label="文件名" width="">
            <template slot-scope="{ row }">
              {{ row.file_name }}
            </template>
          </x-table-column>
          <x-table-column label="上传人" width="">
            <template slot-scope="{ row }">
              {{ row.x_create_user }}
            </template>
          </x-table-column>
          <x-table-column label="上传时间" width="">
            <template slot-scope="{ row }">
              {{ row.create_date | timeFormat }}
            </template>
          </x-table-column>
          <x-table-column label="状态" width="">
            <template slot-scope="{ row }">
              {{ getStatus(row.status.toLocaleString()) }}
            </template>
          </x-table-column>
          <x-table-column label="操作" width="250">
            <template slot-scope="{ row }">
              <div class="lh-20">
                <span class="a-link" @click="onDownload(row.imp_url)">下载</span>
                <el-divider direction="vertical"></el-divider>
                <span class="a-link" @click="onUploadProd(row)">查看</span>
                <el-divider direction="vertical"></el-divider>
                <span class="a-link" @click="onImport(row)">快速导入</span>
                <el-divider direction="vertical"></el-divider>
                <span class="a-link" @click="onDownloadRst(row)">导入结果</span>
              </div>
            </template>
          </x-table-column>
        </x-table>
      </div>
    </div>
  </div>
</template>
<script>
import Excel from './excel.js'
import Moment from 'dayjs'
export default {
  mixins: [Excel],
  data() {
    return {
      excelDatas: [],
      imgDatas: [],
      url:
        'http://dxtemp4.oss-cn-hangzhou.aliyuncs.com/17/12/7/2639623_5a29171e1742b76c0ce1534e_061ebb567c01.xlsx',
      impType: 'impProduct',
      impModel: {
        imp_type: 'impProduct',
        date_start: Moment().subtract(7, 'days'),
        date_end: null,
      },
      tempModel: {
        upload: [],
      },
    }
  },
  methods: {
    refresh() {
      return this.$request('/api/manage/queryImpResult', this.impModel).then(
        data => {
          this.excelDatas = data.imp_results
          return data
        }
      )
    },
    initialize() {
      if (this.payload.imp_type) this.impModel.imp_type = this.payload.imp_type
      this.refresh()
    },
    refreshAll() {
      this.refresh()
      this.getTitleConfig()
    },
    getStatus(status) {
      if (status === 'normal') {
        return '正在解析'
      } else if (status === 'done') {
        return '解析完成'
      } else if (status === 'uploaded') {
        return '已更新'
      } else {
        return ''
      }
    },
    onDownload(url) {
      console.log(url)
      if (url) {
        window.open(url)
      } else {
        window.open(this.url)
      }
    },
    onDownloadRst(row) {
      let url = `/x/r.xlsx?field=excel_imp_result&mongo_id=${row.imp_id}&bill_id=excel_imp_result`
      this.$h.download(url, row.file_name)
    },
    onUpload() {
      console.log(this.tempModel.upload)
      let pram = {
        import_url: this.tempModel.upload[0].url,
        imp_type: 'impProduct',
        file_name: this.tempModel.upload[0].file_name,
      }
      this.$request2('/api/manage/impExcel', pram, { loading: true }).then(
        data => {
          console.log(data)
          this.tempModel.upload = []
          this.refresh()
          setTimeout(() => {
            this.refresh()
          }, 2000)
        },
        () => {
          this.tempModel.upload = []
        }
      )
    },
    onUploadProd(row) {
      this.$tab.open({
        path: 'ProdUploadInfo',
        tab_id: row.imp_id,
        title: '导入-' + row.file_name,
        query: {
          imp_id: row.imp_id,
        },
      })
    },
    onImport(row) {
      if (!this.exp_pm_prod) return this.$message('该公司没有做导出配置（导入配置）')
      let pram = {
        mongo_id: row.imp_id,
      }
      return this.$request('/api/excel/get', pram, { loading: true }).then(
        data => {
          // debugger
          this.datas = data.data
          this.getMaxTitleLength = data.titleLength
          if (data.isOver === false) return this.$message('正在导入')
          if (data.import_rule) {
            Object.assign(this.tempModel, data.import_rule)
          } else this.autoMatch('exact')
          this.onSave2(row.imp_id)
          return data
        }
      )
    },
    onSave2(id) {
      let config = this.exp_pm_prod || {}
      let listArr = Object.values(this.tempModel.keyList)
      this.doValidate('fast').then(text => {
        for (const key in config) {
          if (key in config) {
            const k = config[key]
            if (listArr.indexOf(k) < 0) text += '该excel没有' + key + '<br>'
          }
        }
        if (text) {
          this.$confirm(text, this.$t('dialog_tip'), {
            type: 'warning',
            confirmButtonText: '导入',
            cancelButtonText: '放弃',
          }).then(this.uploadProds)
        } else this.uploadProds(id)
      })
    },
  },
  created() {
    this.initialize()
  },
}
</script>

<style lang="scss">
.imp-explain {
  font-size: 18px;
}
.imp-explain li {
  margin-left: 20px;
  font-size: 0.8em;
  list-style: decimal;
}
.left-btn {
  margin: 10px;
}
.ideal-prod-import {
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
        &.initial,
        &.start {
          color: orange;
        }
        &.finish {
          color: rgb(31, 179, 38);
        }
        &.exception,
        &.fail {
          color: red;
        }
      }
    }
  }
}
</style>
