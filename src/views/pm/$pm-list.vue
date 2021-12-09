<template>
  <div class="pm-list">
    <more-search
      class="tab-page-header fixed-top"
      :extend="extendParts"
      searchKey="web_prod_extend_query_config"
      :vm="searchModel"
      confirmChange
      >
      <div class="flex-b pv5">
        <div class="h-left">
          <span class="prod-selection text-grey mr10 text-12" v-if="checkboxValue.length">
            <span class="prod-selected">选中{{checkboxValue.length}}</span>
            <span class="prod-unselect text-red" @click="clearSelection">清除</span>
          </span>
          <select-sort v-model="searchModel.prod_sorts" multiple width="120px" collapseTags></select-sort>
          <select-prod-type v-model="searchModel.prod_types" multiple width="170px" collapseTags></select-prod-type>
          <select-group-user width="120px" :result="searchModel" field="busi_group_id" field2="owner_id" :pm="{addCom: true}" collapseTags></select-group-user>
          <el-button type="primary" class="more--btn">More</el-button>
          <el-dropdown @command="handleCommand" class="ml10">
            <el-button
              type="primary"
              width="100px"
              >批量操作
              <i class="el-icon-arrow-down el-icon--right"></i></el-button
            >
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="onBatchEditLabel">添加标签</el-dropdown-item>
              <el-dropdown-item command="onBatchDelLabel" divided>删除标签</el-dropdown-item>
              <el-dropdown-item command="onBatchDelete" divided>删除产品</el-dropdown-item>
              <el-dropdown-item command="onBatchOperate" divided>打印二维码</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown @command="handleCommand" class="ml10">
            <el-button
              type="primary"
              icon="el-icon-more"
              ></el-button
            >
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="verifyProd">数据校验</el-dropdown-item>
              <el-dropdown-item command="exportExcelAll" divided>导出所有</el-dropdown-item>
              <el-dropdown-item command="exportExcelNow" divided>导出当前页</el-dropdown-item>
              <el-dropdown-item command="exportExcelSelect" divided>导出当前勾选({{checkboxValue.length}})</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <i :class="['a-link iconfont ml10', showCard ? 'icon-list' : 'icon-grid']" @click="changeTableType"></i>
        </div>
        <div class="h-center flex-center">
          <span v-if="plan_id" class="a-link" style="border: 1px solid #c5caf0;padding: 3px">
            <span v-if="timer">校验中...</span>
            <span v-else>
              校验完成
            </span>
            <i class="el-icon-delete text-17 text-red ml50" @click="clearVerify()"></i>
          </span>
        </div>
        <div class="h-right">
          <x-input
            v-model="searchModel.fuzzy_value"
            placeholder="输入产品名称"
            :maxlength="100"
            prefix-icon="el-icon-search"
            width="200px"
            blurChange
            clearable
            ></x-input>
          <el-button type="primary" @click="onOpen()" icon="el-icon-plus" v-if="isCanAdd">
          </el-button>
        </div>
      </div>
      <x-select :source="prodStatus" :map="{label: 'text', value: 'key'}" slot="prod-status" slot-scope="{vmodel, change}" :result="vmodel" field="status" @save="change" label="是否启用:" width="100%"></x-select>
    </more-search>

    <div class="text-red line-1 mb10" v-if="plan_id" :title="verifyResult">空值：{{verifyResult}}</div>

    <x-table v-if="!showCard" :data="datas" tooltip-effect="dark" @selection-change="handleSelectionChange" :page="searchModel" :getData="refresh" :colKey="tableColKey" row-key="prod_id" @sort-change="onSort" ref="listTable">
      <x-table-column type="selection" width="50" reserve-selection></x-table-column>
      <x-table-column width="70" slot="th_main_pic" slot-scope="{col}">
        <t slot="header" path="title" :vm="col" tt>产品</t>
        <div slot-scope="{row}">
          <x-td-img :src="row.main_pic" :tao="row.is_bom === 'yes'" :spare="row.is_spare==='yes'" @click.native="onOpen(row)"></x-td-img>
        </div>
      </x-table-column>
      <x-table-column slot="th_info" slot-scope="{col}" sortable="custom" prop="create_date">
        <t slot="header" path="title" :vm="col" tt>产品经理</t>
        <template slot-scope="{row}">
          <div title="产品经理">Pm:
            <span v-if="row.busi_group_id === '-1' || !row.busi_group_id">Company</span>
            <span v-else>{{row.x_owner_id_en || row.x_owner_id || 'Company'}}</span>
          </div>
          <div title="创建者" class="text-grey">Cr: {{row.x_create_user_en || row.x_create_user}}</div>
          <div title="创建时间">{{row.create_date | timeFormat}}</div>
        </template>
      </x-table-column>
      <x-table-column slot="th_info_integrity" slot-scope="{col}">
        <t slot="header" path="title" :vm="col" tt>信息完整度</t>
        <template slot-scope="scope">
          <el-progress :percentage="getIntegrity(scope.row)"></el-progress>
        </template>
      </x-table-column>
      <x-table-column slot="th_action" slot-scope="{col}">
        <t slot="header" path="title" :vm="col" tt>操作</t>
        <template slot-scope="{row}">
          <template v-if="row.status === 'normal'">
            <el-button type="text" class="text-danger" @click="onStopOrStart(row)">
              <t path="delete">删除</t>
            </el-button>
            <el-button type="text" @click="onCopyProd(row)">
              <t path="copy">复制</t>
            </el-button>
          </template>
          <el-button type="text" v-else @click="onStopOrStart(row)">
            <t path="prod.start">启用</t>
          </el-button>
        </template>
      </x-table-column>
    </x-table>
    <x-table-card
      v-if="showCard"
      :data="datas"
      @selection-change="handleSelectionChange"
      :page="searchModel"
      @page-change="refresh"
      row-key="prod_id"
      imgKey="main_pic"
      :fields="['prod_name_en', 'item_no']"
      @card-click="onOpen"
      cardWidth="20%"
      :cardStyle="{'max-width':'250px'}">
    </x-table-card>
  </div>
</template>

<script>
import {exportExcel} from './widget/widget'
let search = {
  prod_sort: "",
  fuzzy_value: "",
  include_sub_sort: 1,
  prod_type: "company",
  type: "product",
  status: "normal",
  need_mg: "mg_pkgs",
  is_sell: "",
  brand_id: "",
  busi_group_id: '',
  owner_id: "",
  order_by: '',
  supplier_ids: [],
  prod_types: ['product'],
  prod_levels: [],
  extend_tags: [],
  prod_sorts: [],
  brand_ids: [],
  prod_countrys: [],
  extend_natures: [],
  create_date_start: null,
  create_date_end: null,
  update_date_start: null,
  update_date_end: null,
  is_spare: "",
  source_type: "",
  mall_priority: "",
}
export default {
  options: {
    desc: 'PmInfo;PmBom;PmFeature;PmCustomer;PmRelaProd;PmCanView;PmCanSell;PmPrice;PmParts',
    icon_text: 'List'
  },
  components: {},
  data() {
    return {
      datas: [],
      checkboxValue: [],
      searchModel: this.$h.clone(search),
      plan_id: '',
      verifyResult: '',
      timer: null,
      extendParts: [
        {slot: 'prod-status', field: 'status', span: 12, label: '是否启用'}
      ],
      prodStatus: [
        {key: 'normal', text: '已启用', text_en: 'Normal'},
        {key: 'stopped', text: '已停用', text_en: 'Stopped'},
      ],
      showCard: false,
    };
  },
  computed: {
    isCanAdd () {
      let {prod_type: type} = this.searchModel
      return (type === 'company' || type === 'research') && this.prodAuth.add === 'yes'
    },
    prodAuth () {
      return this.$store.getters.user_auth.prod_auth || {}
    },
    tableColKey () {
      return 'pm_prod_table_header' + (this.$root.cust_type || '')
    }
  },
  methods: {
    async refresh () {
      if (this.plan_id) return this.queryVerifyResult()
      let search = this.$h.cloneDeep(this.searchModel);
      search = search._trim();
      if (!search.prod_types || search.prod_types.length === 0) delete search.type
      return this.$api.queryProdList(search).then((d) => {
        this.datas = d.prods;
        return d;
      });
    },
    async init() {
      this.prodKeys = window._g.getPmCheckFields('prod')
      // this.searchModel.busi_group_id = this.$state('me').busi_group_id
      // this.searchModel.owner_id = this.$state('me').user_id
      this.onRefresh()
    },
    getIntegrity(row) {
      let num = 0
      this.prodKeys.forEach(item => {
        if (item.check(row)) num++
      })
      return Math.round(num * 100 / this.prodKeys.length);
    },
    handleSelectionChange (val) {
      this.checkboxValue = val
    },
    async onStopOrStart (prod) {
      prod = this.$h.clone(prod)
      let text, action
      if (prod.status !== 'normal' && prod.status !== 'research') {
        text = '确定启用该商品？启用后该商品只能通过筛选查找'
        action = 'normalize'
      } else {
        text = '确定删除该商品？删除后该商品只能通过筛选查找'
        action = 'stop'
      }
      await this.$confirm(text, this.$t('dialog_tip'), {type: 'warning'})
      let val = {
        prod_id: prod.prod_id,
        prod_action: action
      }
      this.$pull.upsertProduct2(val).then((data) => {
        this.onRefresh()
      })
    },
    onCopyProd (row) {
      this.onOpen(row, {copy: 1})
    },
    onOpen (prod, ext) {
      if (prod && prod.status === 'stopped') return
      let p = this.$Promise.as(prod)
      if (!prod) p = this.$pull.preProd(ext).then((v) => v.prod_info)
      if (ext) {
        p = this.$get('/api/product/copyProd', { prod_id: prod.prod_id }).then((v) => v.prod_info)
      }
      if (this.searchModel.prod_type === 'research') {
        p = p.then(v => {
          let para = {
            status: 'research',
            source_type: 'research',
            prod_id: v.prod_id
          }
          return this.$post2('/api/product/upsertProduct', para, {method: 'post'}).then(res => {
            return {prod_id: v.prod_id, status: 'research', prod_type: 'research'}
          })
        })
      }
      p = p.then((v) => {
        let title = v.prod_name_en || v.prod_name || 'Product Info'
        this.$tab.open({
          title,
          tab_id: v.prod_id,
          path: 'PmEdit',
          query: {
            prod_id: v.prod_id,
            status: v.status,
            sort_type: this.payload.sort_type,
            prod_type: this.searchModel.prod_type
          }
        })
      })
      return p
    },
    onSort (v) {
      this.searchModel.order_by = `order by ${v.prop} ${v.order.replace('ending', '')}`
    },
    handleCommand (f) {
      this[f] && this[f]()
    },
    clearSelection () {
      this.$refs.listTable.table.clearSelection()
    },
    onBatchEditLabel (action) {
      let prods = this.checkboxValue
      if (!prods.length) return this.$message('没有选择批量操作的商品')
      let url = '/api/product/addProdTag'
      let message = '添加成功'
      if (action === 'delete') {
        url = '/api/product/deleteProdTagBatch'
        message = '删除成功'
      }
      this.$dialog.SelectTag({}, data => {
        this.$post2(url, {
          prod_infos: prods.map(m => ({prod_id: m.prod_id})),
          sys_tags: data.map(m => ({tag_id: m.tag_id}))
        }).then(d => {
          this.$message({message, type: 'success'})
          this.clearSelection()
        })
      })
    },
    onBatchDelLabel (action) {
      this.onBatchEditLabel('delete')
    },
    onBatchDelete () {
      let prods = this.checkboxValue
      if (!prods.length) return this.$message('没有选择批量操作的商品')
      this.$post2('/api/product/deleteProducts', {
        prod_infos: prods.map(m => ({prod_id: m.prod_id}))
      }, {loading: true}).then(() => {
        this.clearSelection()
        this.onRefresh()
      })
    },
    onBatchOperate () {
      let prods = this.checkboxValue.map(m => m.prod_id)
      if (!prods.length) return this.$message('没有选择批量操作的商品')
      if (prods.length > 60) this.$message('打印较多时，浏览器加载较慢，请看看是否全部载完再打印，以防出现空白页')
      prods = JSON.stringify(prods)
      let qrcode = `/api/support/getQrcode.pdf?domain=${encodeURIComponent(this.$getHost)}&field=qrcode_prod&prods=${encodeURIComponent(prods)}&com_id=${this.$state('me').com_id}`
      window.open(qrcode)
      this.clearSelection()
    },
    verifyProd () {
      let { busi_group_id, owner_id, include_sub_sort, prod_sort, fuzzy_value } = this.searchModel
      let params = { busi_group_id, owner_id, include_sub_sort, prod_sort, fuzzy_value }
      this.$dialog.VerifyProd({ search: params }, data => {
        this.plan_id = data.plan_id
        this.verifyResult = data.verifyResult
        this.onRefresh()
        this.timer = setInterval(() => {
          this.onRefresh()
        }, 1000)
      })
    },
    queryVerifyResult () {
      let search = this.searchModel
      let params = {
        page_index: search.page_index,
        page_size: search.page_size,
        plan_id: this.plan_id,
        verify_type: 'prod'
      }
      return this.$pull.queryVerifyResult(params).then(data => {
        this.datas = data.verify_list || []
        if ('count' in search) search.count = 0
        if (data.finish === 'yes') {
          window.clearInterval(this.timer)
          this.timer = null
        }
        return data
      }).catch(() => {
        window.clearInterval(this.timer)
      })
    },
    clearVerify () {
      this.plan_id = ''
      window.clearInterval(this.timer)
      this.searchModel.page_index = 1
      this.onRefresh()
    },
    onRefresh () {
      this.$set(this.searchModel, 'x_searchLast', 1)
    },
    exportExcelNow () {
      this.exportExcel('now')
    },
    exportExcelAll () {
      this.exportExcel('all')
    },
    exportExcelSelect () {
      this.exportExcel('select')
    },
    exportExcel,
    changeTableType() {
      this.showCard = !this.showCard
    }
  },
  created() {
    if (this.payload.search) Object.assign(this.searchModel, this.payload.search)
    this.init();
  },
  beforeDestroy () {
    window.clearInterval(this.timer)
  }
};
</script>
<style lang="scss">
.pm-list {
  .prod-unselect {
    display: inline-block;
    position: absolute;
    left: 0;
    top: 100%;
    width: 100%;
    height: 100%;
    background-color: white;
    transition: all 0.3s;
    opacity: 0;
  }
  .prod-selection {
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover {
      .prod-unselect {
        top: 0;
        opacity: 1;
        // display: inline-block;
      }
    }
  }
}
</style>
