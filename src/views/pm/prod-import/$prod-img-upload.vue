<template lang="html">
  <div class="pm-img-upload">
    <div class="flex-b">
      <div class="h-left">
        <select-date-range
          width="300px"
          @save="refresh"
          :result="searchModel"
          field="create_date_start"
          field2="create_date_end"
        ><t slot="label" path="pm.upload_date" colon>上传日期</t></select-date-range>
      </div>
      <div class="h-center">
        <x-upload
          listType="text"
          v-model="tempModel.upload"
          :show-file-list="false"
          @finish="onUpload"
        ><el-button type="primary">上传</el-button><span class="ml20">请上传ZIP压缩格式</span>
        </x-upload>
      </div>
      <div class="h-right">
        <el-button type="primary" @click="refresh()" class="mr20">刷新</el-button>
      </div>
    </div>
    <x-table class="mt20" :data="imgDatas" :page="searchModel" :getData="refresh">
      <x-table-column type="index" width="50"></x-table-column>
      <x-table-column>
        <t slot="header" path="pm.zip_name">文件名</t>
        <div slot-scope="{row}">{{row.zip_name}}</div>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="pm.create_user">上传人</t>
        <div slot-scope="{row}">{{row.x_create_user}}</div>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="pm.upload_date">上传时间</t>
        <div slot-scope="{row}">{{row.create_time | timeFormat}}</div>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="pm.status">状态</t>
        <div slot-scope="{row}">{{getStatus(row.status.toLocaleString())}}</div>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="action">操作</t>
        <div slot-scope="{row}">
          <el-button type="text" @click="onDownload(row.file_url)"><t path="download">下载</t></el-button>
        </div>
      </x-table-column>
    </x-table>
  </div>
</template>
<script>
export default {
  data () {
    return {
      searchModel: {
        x_searchLast: 0,
        page_index: 1,
        page_size: 10,
        create_date_start: "",
        create_date_end: "",
      },
      imgDatas: [],
      url: 'http://dxtemp4.oss-cn-hangzhou.aliyuncs.com/17/12/7/2639623_5a29171e1742b76c0ce1534e_061ebb567c01.xlsx',
      impType: 'impProduct',
      impModel: {imp_type: 'impProduct'},
      tempModel: {
        upload: []
      }
    }
  },
  methods: {
    refresh () {
      return this.$get('/api/product/getProdPhoto', this.searchModel).then((data) => {
        this.imgDatas = data.prod_photo
        return data
      })
    },
    initialize () {
      this.searchModel.x_searchLast = 1
    },
    getStatus (status) {
      if (status === 'normal') {
        return '正在解析'
      } else if (status === 'done') {
        return '解析完成'
      } else if (status === 'uploaded') {
        return '已更新'
      } else if (status === 'finish') {
        return '已更新'
      } else {
        return ''
      }
    },
    onDownload (url) {
      console.log(url)
      if (url) {
        window.open(url)
      } else {
        window.open(this.url)
      }
    },
    onUpload (file) {
      let pram = {
        file_url: this.tempModel.upload[0].url,
        file_name: this.tempModel.upload[0].file_name,
      }
      this.$post2('/api/product/uploadPhotoZip', pram, {loading: true}).then(
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
    }
  },
  created () {
    this.initialize()
  }
}
</script>