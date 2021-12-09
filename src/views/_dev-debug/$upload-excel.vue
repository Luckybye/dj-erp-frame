<template>
  <div class="upload-excel-tool">
    <div class="tab-page-header h-b fixed-top flex-b">
      <x-label label="上传文件" labelWidth="100px">
        <input type="file" @change="onChange">
        <span class="ml20 text-danger">{{loading}}</span>
      </x-label>
      <div class="nowrap">
        <el-button type="primary" @click="toJson">excel转换json</el-button>
        <el-button type="primary" @click="toExcel">json转换excel</el-button>
        <el-button type="primary" @click="downloadExcel" v-if="jsonData">下载excel</el-button>
      </div>
    </div>
    <x-fold class="import-area" :show="showExcel">
      <div slot="header">
        <span class="form-label">Excel数据</span>
      </div>
      <table class="sample-table">
        <tr>
          <td>字段</td>
          <td v-for="(item, i) in fields" :key="i">
            <input v-model="item.field" class="noborder-input lh-30">
          </td>
          <td>操作</td>
        </tr>
        <tr v-for="(cols, i1) in datas" :key="i1">
          <td>{{i1 + 1}}</td>
          <td v-for="(cell, i2) in cols" :key="i2">
            <span v-if="cell">{{cell.text}}</span>
          </td>
          <td>
            <i class="el-icon-delete text-red" @click="onDelete(i1)" v-if="i1"></i>
          </td>
        </tr>
      </table>
    </x-fold>

    <x-fold :show="!showExcel">
      <div slot="header">
        Json数据
      </div>
      <x-code v-model="jsonData" height="500px"></x-code>
    </x-fold>
  </div>
</template>

<script>
// import { saveAs } from 'file-saver';
export default {
  options: {title: 'excel数据处理'},
  components: {},
  mounted() {},
  data() {
    return {
      datas: [],
      importArra: {
        start: 0,
        end: 0,
        col: 0
      },
      fields: [],
      showExcel: true,
      jsonData: '',
      loading: ''
    }
  },
  methods: {
    onChange (e) {
      this.loading = '读取中。。。'
      const f = e.target.files[0]
      this.importArra.start = 0
      this.importArra.end = 0
      try {
        let reader = new window.FileReader()
        reader.onload = event => {
          const data = new Uint8Array(event.target.result)
          const workbook = window.XLSX.read(data, {type: 'array'})
          let {SheetNames, Sheets} = workbook
          let name = SheetNames[0]
          let datas = Sheets[name]
          this.handlerData(datas)
          this.preDatas = {...datas}
        }
        reader.readAsArrayBuffer(f)
      } catch (error) {
        this.loading = ''
      }
    },
    handlerData (d) {
      this.loading = '解析中。。。'
      this.showExcel = true
      let ref = d['!ref'].split(':')
      let letterMap = {}
      for (let i = 65; i < 91; i++) {
        let letter = String.fromCharCode(i)
        letterMap[letter] = i - 64
      }
      let getXY = (str) => {
        let {x, y} = str.match(/(?<x>[A-Z]+)(?<y>[0-9]+)/).groups
        // if (x.length > 1)
        return [letterMap[x] - 1, y - 1]
      }
      let keys = Object.keys(d)
      let arr = []
      let start = 0
      let end = 0
      let col = getXY(ref[1])[0]
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        if (/^[A-Z]/.test(k)) {
          let [x, y] = getXY(k)
          arr[y] || (arr[y] = Array._of(col + 1, null))
          arr[y][x] = {text: (d[k] || {}).v}
          if (end < y) end = y
          if (col < x) col = x
        }
      }
      this.datas = arr.slice(0, 1000)
      this.importArra.start = start
      this.importArra.end = end
      // console.log(arr, start, end, col, 'start, end, col')
      this.fields = Array._of(col + 1, () => ({field: ''}))
      this.loading = ''
      if (arr.length > this.datas.length) this.loading = '数据过长，只显示前1000行'
    },
    onDelete (i) {
      this.datas.splice(i, 1)
    },
    toJson () {
      this.showExcel = false
      let arr = []
      this.datas.forEach(row => {
        let obj = {}
        row.forEach((f, i) => {
          let ff = this.fields[i].field
          if (ff) obj[ff] = f.text
        })
        arr.push(obj)
      })
      this.jsonData = this.$h.formatJson(arr)
    },
    toExcel () {
      let jsonData = JSON.parse(this.$h.transitionJsonToString(this.jsonData))
      console.log('toExceltoExceltoExcel', jsonData)
      let fields = Object.keys(jsonData[0])
      let excelData = []
      jsonData.forEach(d => {
        let row = []
        fields.forEach(f => {
          row.push({text: d[f]})
        })
        excelData.push(row)
      })
      this.datas = excelData
      this.showExcel = true
      this.fields = fields.map(field => ({field}))
    },
    downloadExcel () {
      /* Create a new workbook */
      const workbook = window.XLSX.utils.book_new();

      /* make worksheet */
      let data = this.datas.map(row => {
        return row.map(f => f.text)
      })
      data.unshift(this.fields.map(f => f.field))
      const worksheet = window.XLSX.utils.json_to_sheet(data);

      /* Add the worksheet to the workbook */
      window.XLSX.utils.book_append_sheet(workbook, worksheet);

      window.XLSX.writeFile(workbook, "out.xlsx");
    },
  },
  created() {
  }
}
</script>

<style lang="scss">
.upload-excel-tool {
  .x-fold .fold--content.card {
    overflow: auto;
  }
}
</style>