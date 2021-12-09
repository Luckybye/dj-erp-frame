<template>
  <div class="x-table" :class="{'virtual-table' : useVirtual2, 'x-fixed-header-table': fixedHeader, 'self-scrollbar': haveScrollbar}">
    <div class="search-wrap">
      <span class="open-dialog-btn" :class="{'bg-danger':searchText}" @click="onShowSearch" v-if="rowKey"><i class="el-icon-search text-12"></i></span>
      <div class="table-search" v-if="showSearch">
        <span class="hide-input-btn flex-middle" @click="showSearch = false">
          <i class="el-icon-arrow-right text-12"></i>
        </span>
        <x-input v-model="searchText" @blur-change="onFilter" @enter="onFilter" :disabled="isSearching" width="300px" clearable placeholder="根据列表显示内容，搜索此列表里面的数据" ref="searchInput"></x-input>
        <span v-if="filterData" class="search-count ml10">{{filterData.length}}/{{data.length}}</span>
        <i class="el-icon-close ml20 close-btn" @click="showSearch = false, searchText='', onFilter()"></i>
      </div>
    </div>
    <u-table
      ref="utable"
      :style="{width}"
      :data="data2"
      :height="height"
      :maxHeight="maxHeight2"
      :stripe="stripe"
      :border="border"
      :size="size"
      :fit="fit"
      :showHeader="showHeader"
      :highlightCurrentRow="highlightCurrentRow"
      :inverseCurrentRow="inverseCurrentRow"
      :currentRowKey="currentRowKey"
      :rowClassName="rowClassName"
      :rowStyle="rowStyle"
      :cellClassName="cellClassName"
      :cellStyle="cellStyle"
      :headerRowClassName="headerRowClassName"
      :headerRowStyle="headerRowStyle"
      :headerCellClassName="headerCellClassName"
      :headerCellStyle="headerCellStyle"
      :rowKey="rowKey"
      :emptyText="emptyText"
      :defaultExpandAll="defaultExpandAll"
      :expandRowKeys="expandRowKeys"
      :defaultSort="defaultSort"
      :tooltipEffect="tooltipEffect"
      :showSummary="showSummary"
      :sumText="sumText"
      :summaryMethod="summaryMethod"
      :spanMethod="spanMethod"
      :selectOnIndeterminate="selectOnIndeterminate"
      :indent="indent"
      :lazy="lazy"
      :load="load"
      :treeProps="treeProps"
      :bigDataCheckbox="bigDataCheckbox"
      :headerDragStyle="headerDragStyle"
      :recordTableSelect="recordTableSelect"
      :useVirtual="useVirtual2"
      :rowHeight="rowHeight"
      :treeConfig="treeConfig"
      :excessRows="excessRows"
      :showHeaderOverflow="showHeaderOverflow"
      :showBodyOverflow="showBodyOverflow"
      :fixedColumnsRoll="fixedColumnsRoll"
      :selectTrClass="selectTrClass"
      :dataChangesScrollTop="dataChangesScrollTop"
      :beautifyTable="beautifyTable"
      :dialogData="dialogData2"
      :showAmend="showAmend"
      :fieldTitle="fieldTitle"
      :fieldSort="fieldSort"
      @select="select"
      @select-all="selectAll"
      @selection-change="selectionChange"
      @cell-mouse-enter="cellMouseEnter"
      @cell-mouse-leave="cellMouseLeave"
      @cell-click="cellClick"
      @cell-dblclick="cellDblclick"
      @row-click="rowClick"
      @row-contextmenu="rowContextmenu"
      @row-dblclick="rowDblclick"
      @header-click="headerClick"
      @header-contextmenu="headerContextmenu"
      @sort-change="sortChange"
      @filter-change="filterChange"
      @current-change="currentChange"
      @header-dragend="headerDragend"
      @expand-change="expandChange"
      @amend-field="amendField"
      @show-field="showField"
      @reset="reset"
      >
      <!-- <x-table-column width="40" v-if="treeProps">
      </x-table-column> -->
      <slot name="expand" v-show="showTbody"></slot>
      <slot></slot>

      <template v-if="colKey && cols.length">
        <template v-for="(col, colIndex) in cols">
          <slot v-if="col.slot" :name="col.slot" :col="col">
          </slot>
          <x-table-column :resizable="col.resizable" :key="col.title_en" :type="col.type" width="50" v-else-if="col.type">
            <span slot="header">{{$tt(col, 'title')}}</span>
          </x-table-column>
          <x-table-column :resizable="col.resizable" :key="col.title_en" v-else :width="getWidth(col)" :min-width="getWidth(col, 'min')" :type="'col-'+colIndex">
            <span slot="header">{{$tt(col, 'title')}}</span>
            <template slot-scope="{row}" v-if="!col.type && col.display && col.display.length">
              <template v-for="(item, i) in col.display">
                <div v-if="fieldsMap[item.id]" :key="i" :class="{'text-grey': i%2, ['line-' + item.line]: true, 'a-link': item.link}" :title="fieldsMap[item.id].cn" @click="linkClick(row, item)">
                  {{renderCell(row, item)}}
                </div>
              </template>
            </template>
          </x-table-column>
        </template>
      </template>

      <div slot="empty" v-show="showTbody">
        <no-data v-if="!data.length" wait="0"></no-data>
      </div>
    </u-table>
    <div class="fixed-bottom">
      <div class="table-scrollbar" @scroll="onScroll" ref="scrollbar">
        <div class="table-scrollbar-width" :style="{width: scrollWidth}"></div>
      </div>
      <div class="table-append">
        <slot name="append"></slot>
      </div>
      <div class="flex-b mt10">
        <div class="page-append self-center">
          <slot name="page"></slot>
        </div>
        <el-pagination
          v-if="page"
          class="myPagination"
          @size-change="handlePageSize"
          @current-change="handleCurrentChange"
          :current-page.sync="page.page_index"
          :page-sizes="pageSizes"
          :page-size="page.page_size"
          :layout="layout"
          :total="page.count"
          hide-on-single-page>
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import Sortable from 'sortablejs';
import {getProd} from '@/views/setting/prod-th/setting.js'
import {getTh, getDefault} from '@/views/setting/prod-th/th.js'
import {getExtendApp} from '@/lib/fields/prod-extend.js'
import SearchModel from './search-model';
import { debounce } from "lodash";
export default {
  name: 'x-table',
  mixins: [SearchModel],
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    height: [String, Number],
    maxHeight: [String, Number],
    stripe: {
      type: Boolean,
      default: true
    },
    border: {
      type: Boolean,
      default: false
    },
    size: String,
    fit: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    highlightCurrentRow: {
      type: Boolean,
      default: true
    },
    inverseCurrentRow: {
      type: Boolean,
      default: true
    },
    currentRowKey: [String, Number],
    rowClassName: [String, Function],
    rowStyle: [Object, Function],
    cellClassName: [String, Function],
    cellStyle: [Object, Function],
    headerRowClassName: {
      type: [String, Function],
      default: 'sky'
    },
    headerRowStyle: [Object, Function],
    headerCellClassName: [String, Function],
    headerCellStyle: [Object, Function],
    rowKey: [String, Function],
    emptyText: String,
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    expandRowKeys: Array,
    defaultSort: Object,
    tooltipEffect: String,
    showSummary: {
      type: Boolean,
      default: false
    },
    sumText: String,
    summaryMethod: Function,
    spanMethod: Function,
    selectOnIndeterminate: {
      type: Boolean,
      default: true
    },
    indent: Number,
    lazy: Boolean,
    load: Function,
    treeProps: Object,
    // u-table
    bigDataCheckbox: {
      type: Boolean,
      default: true
    },
    headerDragStyle: {
      type: Boolean,
      default: true
    },
    recordTableSelect: {
      type: Boolean,
      default: false
    },
    useVirtual: {
      type: Boolean,
      default: null
    },
    rowHeight: {
      type: Number,
      default: 60
    },
    treeConfig: Object,
    excessRows: {
      type: Number,
      default: 3
    },
    showHeaderOverflow: [String, Boolean],
    showBodyOverflow: [String, Boolean],
    fixedColumnsRoll: {
      type: Boolean,
      default: false
    },
    selectTrClass: String,
    dataChangesScrollTop: {
      type: Boolean,
      default: true
    },
    beautifyTable: {
      type: Boolean,
      default: true
    },
    // 分页
    // pagination: {
    //   type: Boolean,
    //   default: false
    // },
    page: [Object, String, Boolean],
    pagerCount: {
      type: Number,
      default: 5
    },
    pageSizes: {
      type: Array,
      default () {
        return [10, 15, 30, 50, 100]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    // 自定义
    width: {
      type: String,
      default: '100%'
    },
    limit: {
      type: [String, Number],
      default: 50
    },
    // 侧滑弹窗
    dialogData: Array,
    showAmend: {
      type: Boolean,
      default: false
    },
    fieldTitle: {
      type: String,
      default: '选择显示字段'
    },
    fieldSort: {
      type: Boolean,
      default: true
    },
    // 拖拽排序
    draggable: {
      type: Boolean,
      default: false
    },
    // 自定义列
    colKey: String,
    singleSelect: Boolean,
    filters: Array,
    calcHeight: Boolean,
    fixedHeader: Boolean,
    hasIndex: Boolean,
    defaultSelection: Array
  },
  data() {
    return {
      lazyLoadNum: 1,
      dialogDataDflt: [],
      defaultHeight: 500,
      cols: [],
      fieldsMap: {},
      showTbody: false, // 解决因为列单独配置，加载缓冲期间table没有宽度而造成的显示问题；等列加载完成后再显示
      searchText: '',
      filterData: null,
      isSearching: false,
      showSearch: false,
      haveScrollbar: false,
      scrollWidth: 0
    }
  },
  watch: {
    data () {
      // console.log('lazyLoadlazyLoad', this.data.length, this.data, this.useVirtual2)
      this.lazyLoad()
    },
    draggable (n) {
      // console.log(1111111, n)
      n && this.rowDrop()
    },
    useVirtual2: {
      handler (n) {
        n && (this.onCalcHeight())
        // 虚拟列表和正常列表切换时，可能布局会紊乱，布局更新
        this.$nextTick(() => {
          this.table.doLayout()
        })
      },
      immediate: true
    },
    // maxHeight2 (n) {
    //   this.$nextTick(() => {
    //     // n || (this.table.maxHeight = undefined)
    //   })
    // }
  },
  computed: {
    data2 () {
      if (this.filterData) return this.filterData
      if (this.useVirtual2) return []
      return this.data.slice(0, this.lazyLoadNum)
    },
    utable () {
      return this.$refs.utable
    },
    table () {
      return this.$refs.utable.$refs.singleTable
    },
    useVirtual2 () {
      return this.useVirtual !== false && (this.filterData || this.data).length > this.limit
    },
    maxHeight2 () {
      if (this.useVirtual2) return this.maxHeight || this.defaultHeight
      return this.calcHeight ? this.defaultHeight : this.maxHeight
    },
    dialogData2 () {
      return this.dialogData || this.dialogDataDflt
    },
  },
  methods: {
    onShowSearch () {
      this.showSearch = true
      this.$nextTick(() => {
        this.$refs.searchInput && this.$refs.searchInput.input.focus()
      })
    },
    onFilter () {
      let text = this.searchText
      this.isSearching = true
      if (!text) {
        this.filterData = null
        this.lazyLoad()
      } else {
        let reg = new RegExp(text, 'i')
        this.filterData = this.data.filter((row, $index) => {
          return this.filterCell(row, $index, reg)
        })
      }
      this.isSearching = false
      // this.table.doLayout()
      this.$nextTick(() => {
        this.highloghtSearch(text)
      })
    },
    highloghtSearch (text) {
      let cells = this.table.bodyWrapper.querySelectorAll('.cell')
      // cells.forEach(cell => {
      //   // console.log(cell, 'cellcellcell')
      //   cell.innerHTML = cell.innerHTML.replace(/<span class="remark__search">([^<]*)<\/span>/ig, '$1')
      // });
      this.table.$nextTick(() => {
        const nodeList = [...cells]
        while (nodeList.length) {
          const node = nodeList.shift()
          if (node.childElementCount === 0 || node.children[0].className === 'remark__search') {
            // console.log(node, 'node.className')
            node.innerHTML = node.innerHTML.replace(/<span class="remark__search">([^<]*)<\/span>/ig, '$1')
            if (text) node.innerHTML = node.innerHTML.replace(new RegExp(text, 'ig'), w => `<span class="remark__search">${w}</span>`)
          } else {
            nodeList.unshift(...node.children)
          }
        }
      })
    },
    filterCell (row, $index, reg) {
      let self = this.table
      let findText = (v, text) => {
        if (v.text) text.push(v.text)
        if (v.children) return v.children.forEach((f) => findText(f, text))
        if (v.componentOptions) findText(v.componentOptions, text)
      }
      let findText2 = (v, text) => {
        v.display && text.push(v.display.map(f => this.renderCell(row, f)))
      }
      // console.log(self.$children[2].rowRender(row, $index), 'row, $indexrow, $index')
      return self.columns.find((column) => {
        if (column.type === 'index' || column.type === 'selection') return false
        let text = []
        if (/^col-/.test(column.type) && this.cols.length) {
          let i = column.type.match(/\d/)
          if (!this.cols[i]) return false
          findText2(this.cols[i], text)
        } else {
          let cellNode = column.renderCell.call(self._renderProxy, self.$createElement, {
            row,
            column,
            $index,
            store: self.store,
            _self: self.$vnode.context
          })
          // console.log(cellNode, 'cellNodecellNode')
          findText(cellNode, text)
        }
        text = text.join('~')
        // console.log(text, 'texttexttext')
        return reg.test(text)
      })
    },
    onCalcHeight () {
      this.$nextTick(() => {
        if (!this.$el || this.maxHeight) return
        let tbody = this.$el.querySelector('.el-table__body-wrapper')
        if (!tbody) return
        let rect = tbody.getBoundingClientRect()
        // console.log(rect, 'rectrect')
        if (rect.top >= 0 && rect.top < 300) {
          this.defaultHeight = window.innerHeight - rect.top
          if (this.page) this.defaultHeight -= 45
        }
        if (this.defaultHeight < 400) this.defaultHeight = 400
      })
    },
    renderCell (row, item) {
      const v = this.fieldsMap[item.id]
      if (!v) return '-'
      if (typeof v.value === 'function') {
        return v.value(row) || '-'
      } else {
        return row[v.value] || '-'
      }
    },
    rowDrop() {
      if (!this.rowKey || !this.draggable) return
      const tbody = this.table.$el.querySelector('.el-table__body-wrapper tbody')
      // console.log('rowDrop', tbody)
      const _this = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          if (oldIndex === newIndex) return
          const currRow = _this.data.splice(oldIndex, 1)[0]
          // console.log(newIndex, oldIndex, 'newIndex, oldIndex', currRow)
          _this.data.splice(newIndex, 0, currRow)
          _this.$emit('on-drop', _this.data)
        }
      })
    },
    lazyLoad () {
      if (this.useVirtual2) {
        this.$nextTick(() => {
          this.utable.reloadData(this.data)
          this.utable.$nextTick(this.handlerDefaultSelection)
        })
        // this.doLayout && this.table.doLayout()
        // this.doLayout = true
        return
      }
      window.requestAnimationFrame(this.addShow)
    },
    addShow () {
      if (this.lazyLoadNum >= this.data.length && this.data.length) return this.handlerDefaultSelection()
      this.lazyLoadNum++
      this.lazyLoad()
    },
    handlerDefaultSelection () {
      if (!this.defaultSelection || !this.defaultSelection.length || !this.rowKey) return
      this.$nextTick(() => {
        let dataMap = this.data._object(this.rowKey)
        let rest = this.defaultSelection.filter((k) => {
          let row = dataMap[k]
          if (row) this.table.toggleRowSelection(row, true)
          return row
        })
        rest.forEach(f => {
          this.defaultSelection.splice(this.defaultSelection.indexOf(f), 1)
        })
      })
    },
    select (...args) {
      this.$emit('select', ...args)
    },
    selectAll (...args) {
      this.$emit('select-all', ...args)
    },
    selectionChange (args) {
      if (this.singleSelect && args.length >= 2) {
        this.table.clearSelection()
        this.table.toggleRowSelection(args[args.length - 1])
      } else this.$emit('selection-change', args)
    },
    cellMouseEnter (...args) {
      this.$emit('cell-mouse-enter', ...args)
    },
    cellMouseLeave (...args) {
      this.$emit('cell-mouse-leave', ...args)
    },
    cellClick (...args) {
      this.$emit('cell-click', ...args)
    },
    cellDblclick (...args) {
      this.$emit('cell-dblclick', ...args)
    },
    rowClick (...args) {
      this.$emit('row-click', ...args)
    },
    rowContextmenu (...args) {
      // console.log('rowContextmenu')
      this.$emit('row-contextmenu', ...args)
    },
    rowDblclick (...args) {
      // console.log('rowDblclick')
      this.$emit('row-dblclick', ...args)
    },
    headerClick (...args) {
      // console.log('headerClick')
      this.$emit('header-click', ...args)
    },
    headerContextmenu (row, e) {
      // e.preventDefault()
      // console.log('headerContextmenu', row, e)
      this.$emit('header-contextmenu', row, e)
      // this.showDialog()
    },
    sortChange (...args) {
      this.$emit('sort-change', ...args)
    },
    filterChange (...args) {
      this.$emit('filter-change', ...args)
    },
    currentChange (...args) {
      this.$emit('current-change', ...args)
    },
    headerDragend (...args) {
      this.$emit('header-dragend', ...args)
    },
    expandChange (...args) {
      this.$emit('expand-change', ...args)
    },
    toggleRowExpansion (row, event) {
      this.table.toggleRowExpansion(row)
      if (!event) return
      let findTd = el => {
        if (!el) return
        if (el.nodeName === 'TD') return el
        return findTd(el.parentNode)
      }
      let td = findTd(event.target)
      if (td) {
        td.classList.contains('expanded') ? td.classList.remove('expanded') : td.classList.add('expanded')
      }
    },
    handlePageSize (d) {
      this.page.page_size = d
      this.handleCurrentChange(this.page.page_index)
    },
    handleCurrentChange (...args) {
      this.$emit('page-change', ...args)
    },
    amendField (...args) {
      this.$emit('amend-field', ...args)
    },
    showField (...args) {
      this.$emit('show-field', ...args)
    },
    reset (...args) {
      this.$emit('reset', ...args)
    },
    showDialog () {
      this.getDialogData()
      this.utable.plDialogOpens()
    },
    getDialogData () {
      if (this.dialogData) return
      let ths = this.table.$el.querySelectorAll('.el-table__header thead>tr>th')
      if (!ths) return
      ths = [...ths].map(f => {
        return {
          name: f.innerText,
          state: true
        }
      })
    },
    handleExtend () {
      let extend = getExtendApp('th')
      for (let i = 0; i < extend.length; i++) {
        const m = extend[i];
        m.value = row => {
          let map = row.natureMap || {}
          return this.$tt(map[m.id], 'option_name') || '-'
        }
        this.fieldsMap[m.id] = m
      }
    },
    async getConfig () {
      if (!this.colKey) return this.onShowTbody()
      let f = this.colKey
      let filter = getTh(f).filter
      this.fieldsMap = getProd(filter)._object('id')
      this.handleExtend()
      let id = this.$state('me').partner_com_id || this.$state('me').com_id
      let v = await this.$configure.getValue(f, id, {cache: 2})
      if (!v[f] || !v[f].length) v[f] = getDefault(f)
      this.cols = [...(v[f] || [])]
      if (this.hasIndex) {
        let i = this.cols.findIndex(f => f.type === 'index')
        i >= 0 && this.cols.splice(i, 1)
      }
      this.onShowTbody()
    },
    onShowTbody () {
      this.$nextTick(() => {
        setTimeout(() => {
          this.showTbody = true
        }, 2000)
      })
    },
    addSearchEvent (e) {
      if (e.ctrlKey && e.keyCode === 70) {
        this.showSearch = true
        e.stopPropagation()
        e.preventDefault()
        this.$nextTick(() => {
          this.$refs.searchInput && this.$refs.searchInput.input.focus()
        })
      }
    },
    removeSearchEvent (e) {
      window.removeEventListener('keydown', this.addSearchEvent)
    },
    addEvent () {
      window.addEventListener('keydown', this.addSearchEvent)
    },
    linkClick (row, {link, id}) {
      if (!link) return
      let {action} = this.fieldsMap[id]
      if (typeof action === 'function') return action.call(this, row)
      this.$emit('link-click', row)
    },
    getWidth ({width, type, minWidth}, t) {
      width = width || ''
      if (t && minWidth) return width
      if (type) width = width || 50
      return width || ''
    },
    loadScrollbar: debounce(function () {
      window.addEventListener('resize', this.loadScrollbar)
      this.$nextTick(() => {
        if (!this.$el) return
        let tbody = this.$el.querySelector('.el-table__body-wrapper')
        if (!tbody) return
        tbody.addEventListener('DOMSubtreeModified', this.loadScrollbar, false)
        let sw = tbody.scrollWidth
        let w = tbody.clientWidth
        this.haveScrollbar = sw > w
        this.scrollWidth = sw + 'px'
        if (!this.haveScrollbar) return

        this.handlerScroll = this.$h.debounce(() => {
          if (this.nativeScroll) this.nativeScroll = false
          if (this.selfScroll) this.selfScroll = false
        }, 500)

        tbody.onscroll = () => {
          if (!this.haveScrollbar) return
          if (this.selfScroll) return
          window.requestAnimationFrame(() => {
            this.nativeScroll = true
            this.$refs.scrollbar.scrollLeft = tbody.scrollLeft
            this.handlerScroll()
          })
        }
      })
    }, 500),
    onScroll () {
      if (this.nativeScroll) return
      this.selfScroll = true
      let tbody = this.$el.querySelector('.el-table__body-wrapper')
      tbody.scrollLeft = this.$refs.scrollbar.scrollLeft
      this.handlerScroll()
    },
    toggleRowSelection (...arg) {
      // console.log(...arg, '...arg')
      this.table.toggleRowSelection(...arg)
    },
    scrollToBottom() {
      let tbody = this.$el.querySelector('.el-table__body-wrapper')
      if (!tbody) return
      setTimeout(() => {
        this.$nextTick(() => {
          tbody.scrollTop = tbody.scrollHeight
        })
      }, 0)
    }
  },
  mounted() {
    this.lazyLoad()
    this.rowDrop()
    this.calcHeight && this.onCalcHeight()
    this.calcHeight || this.loadScrollbar()
  },
  created () {
    this.getConfig()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.loadScrollbar)
    // this.removeSearchEvent()
  }
}
</script>

<style lang="scss">
.x-table {
  position: relative;
  // overflow: hidden;
  .open-dialog-btn {
    position: absolute;
    right: 2px;
    top: 0px;
    z-index: 3;
    background: rgba($color: #000000, $alpha: 0.1);
    padding: 2px;
    color: white;
    height: 30px;
    cursor: pointer;
    border-radius: 0 0 0 100%;
    width: 20px;
    height: 20px;
    text-align: right;
    // background: white;
    i {
      vertical-align: super;
    }
  }
  .plTableBox {
  }
  .myPagination {
    // padding-top: 15px;
    background: white;
    text-align: right;
  }
  .el-table__header {
    .sky {
      color: #2b234a;
      background-color: #e9ebfc;
      th {
        background-color: transparent;
      }
    }
  }

  .el-table, .plTableBox .el-table {
    .el-table-column--selection {
      .cell {
        padding-left: 10px !important;
        padding-right: 0 !important;
      }
    }
    .cell {
      line-height: 1.3;
    }
    .lh-20 {
      .cell {
        line-height: 20px;
      }
    }
  }

  // &.virtual-table {
  //   .plTableBox .el-table__expanded-cell[class*=cell] {
  //     position: relative;
  //     .expand-text {
  //       position: absolute;
  //       transform: translateY(-100%);
  //     }
  //   }
  // }

  &.x-fixed-header-table {
    .el-table__header-wrapper {
      position: sticky;
      top: 0;
      z-index: 2;
    }
    .plTableBox .el-table {
      overflow: unset;
    }
  }
  .search-wrap {
    position: sticky;
    top: 0;
    z-index: 3;
  }

  .table-search {
    position: absolute;
    right: 0;
    z-index: 3;
    padding: 10px 20px;
    padding-left: 35px;
    background: grey;
    opacity: 0.9;
    color: white;
    transition: all 0.3s;
    input {
      background: transparent;
      color: white;
    }
    .search-count {}
    .close-btn {
      // color: white;
      font-size: 18px;
      cursor: pointer;
    }
    .hide-input-btn {
      position: absolute;
      height: 100%;
      margin-right: 20px;
      background: black;
      left: 0;
      top: 0;
      padding: 0 2px;
      opacity: 0.2;
      border-radius: 0 30px 30px 0;
      cursor: pointer;
    }
  }
  .remark__search {
    background:yellow;
    color:red;
  }
  .expand-text {
    display: block;
    position: absolute !important;
    left: 0;
    bottom: 0px;
    color: red;
    z-index: 1;
    border: none !important;
    background: transparent !important;
    white-space: nowrap;
  }
  .el-table__indent {
    // &:after {
    //   content: "L";
    //   position: absolute;
    //   left: 0;
    //   width: 100%;
    //   text-align: center;
    //   font-weight: 700;
    // }
  }
  .plTableBox .el-table__placeholder {
    display: none;
  }
  &.have-expand {
    .el-table__row td {
      padding-bottom: 15px !important;
      padding-top: 15px !important;
    }
    .el-table2 td {
      padding-bottom: 15px !important;
      padding-top: 15px !important;
    }
  }
  &.self-expand {
    .el-table__row {
      .el-table__expand-icon {
        display: none;
      }
    }
    .self-expand-icon {
      display: inline-block;
      margin-left: 5px;
      cursor: pointer;
    }
    td.expanded .self-expand-icon {
      transform: rotate(90deg);
      transition: 0.2s all;
    }
  }
  .hidden-expand-icon {
    // display: none;
    &>.cell>.el-table__expand-icon {
      display: none;
    }
  }
  .show-all-text {
    .cell {
      text-overflow: unset;
      white-space: nowrap;
    }
  }
  .expand-td {
    .cell {
      line-height: 23px !important;
      .el-table__expand-icon {
        float: right;
        line-height: inherit;
      }
      .el-table__indent {
        display: none;
      }
      .el-table__placeholder {
        display: none;
        &+* {
          float: right;
        }
      }
    }
  }
  .table-scrollbar {
    display: none;
  }
  &.self-scrollbar {
    .table-scrollbar {
      display: block;
      height: 15px;
      overflow-x: auto;
      .table-scrollbar-width {
        height: 1px;
      }
      &::-webkit-scrollbar {
        height: 10px;
      }
    }
    .el-table__body-wrapper::-webkit-scrollbar {
      height: 0;
    }
  }

  .plTableBox .el-table .umy-table-beyond {
    white-space: inherit !important;
  }
}
</style>
