<template lang="html">
  <div class="sc-terms mb30">
    <div class="tab-page-header" v-tr-dom>
      <el-button type="danger" @click="handlerEdit" v-if="payload.editEvent">
        修改
      </el-button>
      <el-checkbox v-model="tempVm.language" true-label="cn" false-label="en" title="配置了中英文模板才生效，没配置无效" v-if="payload.change_lang">
        <t path="chinese">中文</t>
      </el-checkbox>
      <!-- 额外模板 -->
      <x-select v-model="currentTpl.field" :map="{label: 'text',value: 'field'}" width="100px" class="ml10" v-if="tpls && tpls.length" :source="tpls" @change="selectTpl"></x-select>
      <el-button type="primary" @click="onCreateBill(true)" v-if="payload.isSaveBill" class="ml10">
        <t path="save_file">存档</t>
      </el-button>
      <el-button type="primary" @click="onSend">
        <t path="send">发送</t>
      </el-button>

      <el-dropdown placement="bottom" @command="onDownload" class="mh10">
        <el-button type="primary">
          <t path="download">下载</t>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :command="{url: billPdf, type: 'pdf'}" v-if="billPdf">
            <t path="pdf">Pdf</t>
          </el-dropdown-item>
          <el-dropdown-item :command="{url: billExcel, type: 'xlsx'}" v-if="billExcel">
            <t path="excel">Excel</t>
          </el-dropdown-item>
          <el-dropdown-item :command="{url: billOds, type: 'ods', async: true}" v-if="billOds">
            <t path="ODS">ODS</t>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <el-dropdown placement="bottom" @command="handleCommand">
        <el-button type="primary">
          <t path="print">打印</t>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="onPrint" title="系统自带打印，不存在浏览器不同而排版不一样，但是受框架影响，可能某些排版不是很友好">
            <t path="sys_print">系统打印</t>
          </el-dropdown-item>
          <el-dropdown-item command="browserPrint" title="浏览器自带的打印功能，每个浏览器的打印可能存在差异，但是排版较好；缺点不是所有浏览器都支持打印">
            <t path="browser_print">浏览器打印</t>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <i class="el-icon-full-screen text-primary ml10 pointer" @click="onPrint" style="vertical-align: middle;"></i>
    </div>

    <iframe :src="billUrl" frameborder="0" width="100%" height="800px" v-if="billPdf" ref="iframe"></iframe>
    <iframe :src="$h.previewExcel(billExcel)" frameborder="0" width="100%" height="800px" v-else-if="billExcel"></iframe>
    <iframe :src="$h.previewExcel(billOds)" frameborder="0" width="100%" height="800px" v-else-if="billOds"></iframe>
    <div v-else class="lh-50 text-center">无模板</div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tplCOnfig: {pdf: true, excel: false},
      tpls: [],
      currentTpl: {field: '', url: ''},
      tempVm: {language: 'en'},
    }
  },
  computed: {
    billUrl () {
      let {pdf_field: field, url} = this.currentTpl
      if (!url) {
        let reg = new RegExp(/field=([^&]*)/)
        let str = 'field=' + field
        url = this.payload.url.replace(/pdf/, 'html').replace(reg, str)
      }

      let {language} = this.tempVm
      let reg2 = new RegExp(/language=([^&]*)/)
      let str2 = 'language=' + language
      if (reg2.test(url)) {
        url = url.replace(reg2, str2)
      } else url = url + (url.indexOf('?') > 0 ? '&' : '?') + str2

      return url
    },
    billPdf () {
      let {pdf_field: field} = this.currentTpl
      if (!field) return ''
      return this.billUrl.replace(/html/, 'pdf')
    },
    billExcel () {
      let {excel_field: field} = this.currentTpl
      if (!field) return ''
      let reg = new RegExp(/field=([^&]*)/)
      let str = 'field=' + field
      return this.billUrl.replace(/html/, 'xlsx').replace(reg, str)
    },
    billOds () {
      let {ods_field: field} = this.currentTpl
      if (!field) return ''
      let reg = new RegExp(/field=([^&]*)/)
      let str = 'field=' + field
      return this.billUrl.replace(/html/, 'xlsx').replace(reg, str) + '&ext_type=xls_to_ods'
    },
  },
  methods: {
    selectTpl (v) {
      v.name = v.name || ''
      this.currentTpl = {...v}
      if (!v.pdf_field && !v.url) this.onCreateBill(false, v)
    },
    initialize () {
      let field = this.$h.getQueryString('field', this.payload.url) || this.payload.field
      this.$configure.getValue('constant_template', this.$state('me').partner_com_id || this.$state('me').com_id).then(d => {
        d = d.constant_template[field] || this.payload.tplCOnfig || this.tplCOnfig
        this.tpls = d.tpls || []
        let dflt = {text: '默认单据', field, excel_field: d.excel ? field : '', pdf_field: d.pdf ? field : ''}
        let isExit = this.tpls.find(f => f.pdf_field === dflt.pdf_field && f.excel_field === dflt.excel_field)
        if (!isExit) this.tpls.unshift(dflt)
        this.tplCOnfig = d
        this.selectTpl(this.tpls[0])
      })
    },
    onSend () {
      let v = this.payload
      let p = v.isSaveBill ? this.onCreateBill() : Promise.resolve(v)
      return p.then(data => {
        let para = {
          bill: {
            file_name: this.getFieldName(),
            field: this.currentTpl.field,
            url: this.billUrl,
          },
          mail: {
            subject: v.filename,
          },
          contact: v.contact || ''
        }
        this.$dialog.SendEmail(para, (data) => {
          if (v.isSaveBill) this.onCreateBill(true)
        })
      })
    },
    onCreateBill (bool, tpl) {
      let v = {
        ...this.$h.getQueryString2(this.payload.url),
        ...this.payload.search,
        field: this.currentTpl.field,
        bill_id: this.payload.bill_id,
        file_name: this.getFieldName()
      }
      if (!v.field) return ''
      bool && (v.save = 'pdf')
      return this.$get('/x/r.json', v, {loading: true}).then(bill => {
        // this.billPdf = bill.url.replace(/.json/, '.pdf')
        this.$set(this.currentTpl, 'url', bill.url.replace(/.json/, '.html').replace(/.pdf/, '.html').replace(/.xlsx/, '.html'))
        if (tpl) tpl.url = this.currentTpl.url
        return bill
      })
    },
    browserPrint () {
      let win = window.open(this.billUrl)
      setTimeout(() => {
        win.print()
      })
    },
    onPrint () {
      window.open(this.billPdf || this.$h.previewExcel(this.billExcel))
    },
    // onChangeCheck () {
    //   let {language} = this.tempVm
    //   let url = this.billUrl
    //   let reg = new RegExp(/language=([^&]*)/)
    //   let str = 'language=' + language
    //   if (reg.test(url)) {
    //     this.billUrl = url.replace(reg, str)
    //   } else this.billUrl = url + '&' + str
    // },
    async onDownload ({url, type, async}) {
      let name = this.getFieldName()
      name += ('.' + type)
      url += ('&download=' + name)
      if (async) {
        await this.$axios(url, null, {loading: true})
        this.$tab.open({
          path: 'ExportList',
          tab_id: 'export_list',
          title: 'Excel导出列表'
        })
      } else this.$h.download(url, name)
    },
    getFieldName () {
      return (this.currentTpl.name || this.payload.filename || '')._eval(this.payload.replace, this.payload)
    },
    handleCommand (fun) {
      this[fun] && this[fun]()
    },
    handlerEdit () {
      let iframe = this.$refs.iframe
      iframe && this.payload.editEvent(this.payload, {iframe})
    }
  },
  created () {
    if (this.payload.language) this.tempVm.language = this.payload.language
    this.initialize()
  },
  beforeDestroy() {}
}
</script>
