<template>
  <div class="prod-upload-info">
    <div>
      <x-fold :show="false" class="mb5 full text-12">
        <div class="flex-b flex-1" slot="header">
          <div>
            提示：请设置每一列对应的字段；不能有多列对应一个字段；不选字段，则不导入该列；
            <span class="text-red text-bold text-16">绿色区域是导入区域，请务必确认好导入区域，避免导入失败</span>
          </div>
          <b>导入说明</b>
        </div>
        <ol class="text-grey text-12">
          <li>分类和货号都存在的时候，会以分类生成货号为准；</li>
          <li>系统没有该公司货号，会新增，有该货号，会更新；</li>
          <li>每列字段不选系统对应字段，就不导入该列数据；</li>
          <li>同一份没有货号的excel商品不要重复’上传‘导入，不然会新增多份商品，可以在第一次导入成功页面修改，然后再导入，也可以成功后导出该excel数据（选上货号），然后在excel修改再导入</li>
          <li>列操作，请选定列，点击导入结果一行，选定列</li>
          <li>创建一条<b>客户专属</b>记录，必须需要客户和价格（外销价/fob价），同一客户重复导入，会覆盖</li>
          <li>创建一条<b>供应商询价</b>记录，必须需要供应商和采购价（成本价），重复导入会新增</li>
          <li>
            <b>阶梯价导入</b>：必须输入价格和数量，最少两级，最多四级
            <div>① 0~~阶梯价1-数量，阶梯价1-价格</div>
            <div>② 上一级阶梯价-数量~~阶梯价2-数量，阶梯价2-价格（看实际情况选择）</div>
            <div>③ 上一级阶梯价-数量~~阶梯价3-数量，阶梯价1-价格（看实际情况选择）</div>
            <div>④ 上一级阶梯价-数量~~正无穷，阶梯价末级-价格</div>
            <div>例如，只有两级阶梯价，选择①④；只有三级阶梯价，①②④</div>
            <div>重复导入会覆盖以前的数据</div>
          </li>
          <li>
            <b>多包装导入</b>：每个包装数据单独一行，和其他商品数据一样；然后选中‘更多操作’里面的合并商品，和判断标志（即系统根据什么东西判断，如货号）；系统会根据判断标志判断这一行是哪个商品的包装数据，导入时，会合并到同一个商品
            <div>重复导入会覆盖以前的数据</div>
          </li>
        </ol>
      </x-fold>

      <div class="mb10">
        <label class="text-bold">从第几行开始导入数据:</label>
        <x-input width="100px"
                     :result="tempModel"
                     field="startIndex"
                     rules="require"
                     @blur-change="onChangeStartIndex"></x-input>

        <label class="ml10 text-bold">指定头部: 指定头部后可以记住该次选择，以便下次导入</label>
        <x-input width="150px"
                     :result="tempModel"
                     field="headIndex"
                     rules="require"
                     type="primary"></x-input>
        <span v-if="isOver === false">
          <span class="text-orange ml10">导入中({{currentImportIndex + 1}}/{{datas.length}})...</span>
          <el-button @click="stopProdUpload" type="danger" class="mh10">停止导入</el-button>
        </span>
        <el-dropdown placement="bottom" v-else class="mh10">
          <el-button @click="onSave()" type="primary" title="存在覆盖，不存在新增">导入</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-button @click="onAdd()" title="会提示哪些存在">新增</el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button @click="onUpdate()" title="会提示哪些不存在">更新</el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button @click="refreshAllData" type="primary">刷新</el-button>
        <el-button @click="moreAction=!moreAction" type="success">更多操作</el-button>
      </div>

      <div class="more-action mb10" v-show="moreAction">
        <div class="mt10">
          <span class="text-bold">列操作：</span>
          <el-button @click="editCol('toFixed')" type="primary">保留2位小数</el-button>
          <el-button @click="editCol('number')" type="primary">变为数字</el-button>
        </div>
        <div class="mt10">
          <el-button @click="doValidate('tip')" type="primary">校验</el-button>

          <el-button @click="checkProdIsExit('tip')" type="primary" title="会提示哪些存在,哪些不存在">检查商品是否存在</el-button>

          <el-button @click="deleteAllProds" type="danger">删除本次导入商品</el-button>
          <el-button @click="saveKeyListatLocal('tip')" type="primary" class="ml10">保存当前设置</el-button>
          <!-- <el-button @click="autoMatch('', true)" type="primary" text="模糊匹配头部" title="模糊匹配是根据上次位置匹配"></el-button> -->
          <el-button @click="matchExact" type="primary" title="精准匹配是根据商品头部文字匹配, 所有列都会匹配">精准匹配头部</el-button>
          <el-button @click="autoMatch('', true)" type="primary" title="匹配未选择的列">匹配未选择的列</el-button>
          <el-button @click="onExport" type="primary">导出当前商品</el-button>
        </div>
        <div class="mt10">
          <x-check :result="tempModel" field="is_merge" :expect="true" :unexpect="false" class="mr20">是否合并商品</x-check>
          <span style="vertical-align: text-bottom;">合并判断标志(根据什么字段判断是同一个商品)，可用于导入多包装等数据</span>
          <x-select :result="tempModel"
                                      width="150px"
                                      clearable
                                      :source="titleDatas"
                                      field="merge_field"
                                      filter="text"
                                      :map="{label:'text',value:'key'}"></x-select>
        </div>
      </div>

      <ux-grid
        ref="plxTable"
        :max-height="maxHeight"
        :rowClassName="getRowClass"
        :edit-config="{trigger: 'dblclick', mode: 'cell'}">

        <ux-table-column title="字段" class-name="fixed-left">
          <ux-table-column title="导入结果" width="80" class-name="bg-white fixed-left ph10">
            <template slot-scope="{row, rowIndex}" v-if="rowIndex >= tempModel.startIndex - 1">
              <span v-if="isOver === false && !row.no_save">
                {{(row.prod_id ? row.error ? 'x' : '✔️' : '导入中...')}}
              </span>
              <span v-if="isOver && !row.no_save">{{(row.prod_id && !row.error ? '✔️' : 'x')}}</span>
              <span v-if="isOver === null && row.error" class="text-red">{{row.error}}</span>
              <span class="a-link ml5" v-if="row.prod_id" @click="viewProd(row)" :title="row.error">
                <span v-if="row.error">x</span>
                查看
              </span>
            </template>
          </ux-table-column>
          <ux-table-column type="index" width="50" class-name="bg-white fixed-left pl10"></ux-table-column>
        </ux-table-column>
        <ux-table-column
          v-for="(k, n) in keyList"
          :key="n + k + currentCol"
          :header-class-name="currentCol === n ? 'current-col' : ''">
          <div slot="header">
            <div class="flex-b field-select" :class="{'have-field': k}">
              <div class="a-link text-bold text-center flex-1" @click="onSelectField(n, k)">
                <span>{{(keyMap[k] || {}).text}}</span>
                <span class="placeholder">单击选择...</span>
              </div>
              <div style="width: 20px" class="flex-middle pointer">
                <i class="el-icon-arrow-down down-btn" @click="onSelectField(n, k)"></i>
                <i class="el-icon-circle-close close-btn" @click="clearField(n)"></i>
              </div>
            </div>
            <!-- <x-select :result="tempModel.keyList"
                      width="100%"
                      clearable
                      :source="titleDatas"
                      :field="n+''"
                      filter="text"
                      :map="{label:'text',value:'key'}"
                      @change="onSelectKey(n)"
                      @clear="cleanError(n)"></x-select> -->
          </div>
          <ux-table-column width="130" edit-render :className="currentCol === n ? 'current-col' : ''" :header-class-name="currentCol === n ? 'current-col' : ''">
            <span slot="header">{{n + 1 + ''}}
              <span class="cell-cover" @click="currentCol = currentCol === n ? '' : n"></span>
            </span>
            <template slot-scope="{row, rowIndex}" slot="edit">
              <div :key="ii" v-for="(child, ii) in [row.data[n]]">
                <el-input v-model="child.text" type="textarea" v-if="!isImgUrl(child.text)" @blur="handlerCol(n, rowIndex)"></el-input>
              </div>
            </template>
            <template slot-scope="{row}" slot="default">
              <div :key="ii" v-for="(child, ii) in [row.data[n]]" :class="{'bg-danger': child.error}" :title="child.error">
                <div v-if='isImgUrl(child.text)'><img :src="child.text | imgFormat('min')"></div>
                <div v-else v-text="child.text">
                </div>
              </div>
            </template>
          </ux-table-column>
        </ux-table-column>
      </ux-grid>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Excel from './excel.js'
import {exportExcel} from '../widget/widget'
import { UxGrid, UxTableColumn } from 'umy-ui'
Vue.component(UxGrid.name, UxGrid)
Vue.component(UxTableColumn.name, UxTableColumn)
export default {
  options: {
    icon_text: 'Imp'
  },
  mixins: [Excel],
  components: {
  },
  data () {
    return {
      isOver: null,
      timer: 0,
      moreAction: false,
      currentCol: '',
      currentImportIndex: 0,
      maxHeight: 700
    }
  },
  methods: {
    refresh (loading) {
      return this.getExcelData(loading).then((data) => {
        this.isOver = data.isOver
      })
    },
    editCol (action) {
      let i = this.currentCol
      if (typeof i !== 'number') return this.$message('请选择某一列')
      this.datas.forEach((item, index) => {
        if (index < this.tempModel.startIndex - 1) return
        let d = item.data[i] || {}
        if (d.text) {
          if (action === 'toFixed') d.text = (d.text + '').toFixed(2)
          if (action === 'number') d.text = parseFloat(d.text)
        }
      })
    },
    matchExact () {
      this.autoMatch('exact', false, false, true)
    },
    saveKeyListatLocal (tip) {
      let j = this.tempModel.headIndex - 1
      let map = ((this.datas[j] || {}).data || []).map(m => m.text)
      let pre = window.localStorage.getItem('excel_import_rule')
      if (pre) pre = JSON.parse(pre).keyList || {}
      let list = {...pre}
      for (let i = 0; i < this.getMaxTitleLength; i++) {
        let key = this.tempModel.keyList[i] || ''
        // 以头部文字保存
        if (map[i]) list[map[i]] = key
        // 以顺序保存
        list[i] = key
        // 以头部文字和顺序保存
        map[i] && (list[i + '-' + map[i]] = key)
      }
      window.localStorage.setItem('excel_import_rule', JSON.stringify({...this.tempModel, keyList: list}))
      tip === 'tip' && this.$message({message: '保存成功', type: 'success'})
    },
    clearField (n) {
      Vue.set(this.tempModel.keyList, n + '', '')
      this.cleanError(n)
    },
    onSelectField (n, k) {
      this.currentCol = n
      let disabled = this.keyList._object()
      delete disabled[k]
      this.$dialog.SelectProdImpField({datas: this.titleDatas, selected: k, disabled}, d => {
        this.tempModel.keyList[n] = d
        this.onSelectKey(n, k)
      })
    },
    onSelectKey (n, k) {
      // let existIndex = this.keyList.findIndex((f, i) => f === k && i !== n)
      // if (existIndex >= 0) {
      //   this.$message(`该项在第${existIndex + 1}列已选`)
      //   this.tempModel.keyList[n] = ''
      //   return
      // }
      this.handlerCol(n)
    },
    onChangeStartIndex () {
      let max = this.getMaxTitleLength
      for (var i = 0; i < max; i++) {
        this.handlerCol(i)
      }
    },
    getExcelData (loading) {
      let pram = {
        mongo_id: this.payload.imp_id
      }
      return this.$request('/api/excel/get', pram, {loading}).then((data) => {
        this.datas = data.data
        this.$refs.plxTable.reloadData(this.datas)
        return data
      })
    },
    initialize () {
      // 获取上次保存的设置
      this.getExcelData(true).then((data) => {
        this.getMaxTitleLength = data.titleLength
        if (data.isOver === false) this.isOver = false
        if (data.import_rule) {
          Object.assign(this.tempModel, data.import_rule)
        } else {
          let rule = window.localStorage.getItem('excel_import_rule')
          if (rule) {
            rule = JSON.parse(rule)
            delete rule.keyList
            delete rule.is_merge
            delete rule.merge_field
            Object.assign(this.tempModel, rule)
          }
          // 数据库没有，进行匹配
          this.autoMatch('exact')
        }
      })
    },
    timedRefresh () {
      this.isOver = false
      this.timer++
      if (this.timer > 10) {
        this.timer = 0
        return
      }
      setTimeout(() => {
        this.refresh().then(() => {
          if (this.isOver) {
            this.$message({message: '导入完成', type: 'success'})
          } else {
            this.timedRefresh()
          }
        })
      }, 5000)
    },
    viewProd ({prod_id}) {
      this.$tab.open({
        title: 'Product Info',
        path: 'PmEdit',
        tab_id: prod_id,
        query: { prod_id },
      })
    },
    checkProdIsExit (tip) {
      let t = this.tempModel.keyList
      let i = Object.keys(t).find(k => t[k] && t[k] === 'prod_no') * 1
      if (!i && i !== 0) return this.$message('没有商品货号，无法校验商品是否存在')
      let start = Math.max((this.tempModel.startIndex * 1 - 1) || 0, 0)
      let datas = this.datas.slice(start, this.datas.length)
      let nos = datas.map((m) => {
        let text = (m.data || [])[i].text
        return (Number(text) || text || '') + ''
      })
      let para = {prod_nos: [...new Set(nos.filter(f => f))]}
      if (para.prod_nos.length > 5000) this.$message.warning('需校验商品超过5000，不予校验')
      return this.$post2('/api/product/queryProdNoIsExisted', para, {loading: true}).then((p) => {
        this.prodMap = (p.prod_infos || [])._object('prod_no')
        let noarr = []
        let arr = nos.reduce((pre, m, index) => {
          if (this.prodMap[m]) {
            pre.push(index + start + 1)
          } else noarr.push(index + 1 + start)
          return pre
        }, [])
        let text = ''
        let add = ''
        let update = ''
        if (!p.prod_infos || !p.prod_infos.length) update = '商品都不存在'
        if (arr.length === datas.length && arr.length) add = '商品都存在'
        if (noarr.length === datas.length && noarr.length) update = '商品都不存在'
        if (!add) {
          let t1 = arr.join(',')
          if (t1) add = '第' + t1 + '行商品存在。<br>'
        }
        if (!update) {
          let t2 = noarr.join(',')
          if (t2) update = '第' + t2 + '行商品不存在。'
        }
        if (tip === 'add') return {add, arr}
        if (tip === 'update') return {update, noarr}
        text = add + update
        if (tip === 'tip') {
          this.$confirm(text, {
            dangerouslyUseHTMLString: true,
          })
        }
        return text
      })
    },
    onExport () {
      let start = Math.max((this.tempModel.startIndex * 1 - 1) || 0, 0)
      let datas = this.datas.slice(start, this.datas.length)
      let ids = datas.map((m) => {
        return {prod_id: m.prod_id}
      }).filter(f => f.prod_id)
      if (!ids.length) return this.$message.warning('系统不存在下列商品，无法导出')
      this.checkboxValue = ids
      exportExcel.call(this, 'select')
    },
    refreshAllData () {
      this.refresh(true)
      this.getCheckData()
    },
    async deleteAllProds () {
      await this.$confirm('确定删除本次导入商品？', this.$t('dialog_tip'), {type: 'warning'})
      let prods = this.datas.reduce((pre, val) => {
        if (val.prod_id) pre.push({prod_id: val.prod_id})
        return pre
      }, [])
      if (!prods.length) return
      this.$request2('/api/product/deleteProducts', {
        prod_infos: prods
      }, {loading: true}).then(() => {
        this.$message({type: 'success', message: '删除成功'})
      })
    },
    getRowClass ({row, rowIndex}) {
      if (rowIndex + 1 === this.tempModel.headIndex * 1) return 'header-area'
      if (rowIndex + 1 >= this.tempModel.startIndex * 1) return 'import-area'
    },
    async stopProdUpload () {
      await this.$post('/api/excel/stopProdUpload', {
        mongo_id: this.payload.imp_id
      })
      this.refresh(true)
    },
  },
  computed: {
    keyList () {
      return Array._of(this.getMaxTitleLength, i => this.tempModel.keyList[i])
    }
  },
  created () {
    this.maxHeight = window.innerHeight - 225
    this.initialize()
  }
}
</script>

<style lang="scss">
.prod-upload-info {
  // * {
  //   font-size: 12px !important;
  // }
  .body--wrapper::-webkit-scrollbar {
    width: 15px;
    height: 15px;
  }

  .plx-table .plx-body--column.col--ellipsis, .plx-table .plx-footer--column.col--ellipsis, .plx-table .plx-header--column.col--ellipsis, .plx-table.plx-editable .plx-body--column {
    height: 30px;
  }
  .fixed-left {
    color: black;
    position: sticky;
    left: 0;
    z-index: 5;
    background-color: #f8f8f9;
    &+.fixed-left {
      left: 80px;
    }
  }
  .plx-header--row {
    // background: grey;
    // background: inherit;
    th:nth-child(1), th:nth-child(2) {
      // background: white;
      @extend .fixed-left;
    }
    &:nth-child(1) th:nth-child(2) {
      position: inherit;
    }
  }
  .import-area {
    background: var(--color-green);
    color: black;
  }
  .header-area {
    background: var(--color-blue) !important;
    color: white;
    // td {
    //   position: sticky;
    //   top: 0;
    //   z-index: 1;
    // }
  }
  .current-col {
    background: rgb(165, 162, 162);
    color: #fff !important;
    // &.cell-cover {
    //   background: rgb(128, 128, 128);
    // }
  }
  .cell-cover {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
  .plx-cell {
    font-size: 12px;
  }
  .field-select {
    white-space: nowrap;
    border-bottom: 1px solid var(--color-primary);
    .close-btn, .down-btn {
      font-size: 17px !important;
    }
    .close-btn {
      display: none;
    }
    &.have-field {
      .placeholder {
        display: none;
      }
    }
    &:hover {
      &.have-field {
        .close-btn {
          display: inline;
        }
        .down-btn {
          display: none;
        }
      }
    }
  }
}
</style>
