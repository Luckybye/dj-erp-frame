<template>
  <div class="prod-management">
    <more-search
      :parts="searchParts"
      :vm="searchModel"
      confirmChange
      >
      <div class="flex-b pv5">
        <div class="h-left">
          <el-button type="primary" class="more--btn">More</el-button>
        </div>
        <div class="h-right">
          <el-button type="primary" @click="onBatchStop">批量停用</el-button>
        </div>
      </div>
      <select-date
        slot="create-date"
        slot-scope="{vmodel, change}"
        :result="vmodel"
        field="after_create_date"
        @save="change"
      >
        <t slot="label" colon>指定日期:</t>
        <div slot="prefix">从</div>
        <div slot="suffix">至今</div>
      </select-date>
      <x-check-group
        :source="busiTypes"
        width="100%"
        slot="busi-type" slot-scope="{vmodel, change}"
        :result="vmodel"
        field="manage_busi_types"
        @save="change"><t slot="label" colon>无操作:</t></x-check-group>
        <x-select :source="prodStatus" :map="{label: 'text', value: 'key'}" slot="prod-status" slot-scope="{vmodel, change}" :result="vmodel" field="status" @save="change" label="是否启用:" width="100%"></x-select>
    </more-search>
    <x-table :data="datas" @selection-change="handleSelectionChange" :page="searchModel" :getData="refresh" row-key="prod_id" @sort-change="onSort">
      <x-table-column type="selection" width="50"></x-table-column>
      <x-table-column width="70">
        <t slot="header">产品</t>
        <div slot-scope="{row}">
          <x-td-img :src="row.main_pic" :tao="row.is_bom === 'yes'" :spare="row.is_spare==='yes'" @click.native="onOpen(row)"></x-td-img>
        </div>
      </x-table-column>
      <x-table-column>
        <t slot="header">描述</t>
        <div slot-scope="{row}">
          <div>{{row.prod_name_en}}</div>
          <div class="text-grey">{{ row.prod_no }}</div>
        </div>
      </x-table-column>
      <x-table-column>
        <t slot="header">规格</t>
        <div slot-scope="{row}">
          <div>{{row.prod_spec_en}}</div>
          <div class="text-grey">{{ row.model }}</div>
        </div>
      </x-table-column>
      <x-table-column>
        <t slot="header">供应商</t>
        <div slot-scope="{row}">
          <div>{{row.supplier_no}}</div>
          <div class="text-grey">{{ row.x_supplier_id }}</div>
        </div>
      </x-table-column>
      <x-table-column>
        <t slot="header">信息完整度</t>
        <template slot-scope="scope">
          <el-progress :percentage="getIntegrity(scope.row)"></el-progress>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header">信息</t>
        <div slot-scope="{row}">
          <div>{{row.x_owner_id}}</div>
          <div class="text-grey">{{ row.create_date | timeFormat }}</div>
        </div>
      </x-table-column>
      <x-table-column>
        <t slot="header">更新</t>
        <div slot-scope="{row}">
          <div>{{row.x_update_user_en}}</div>
          <div class="text-grey">{{ row.update_date | timeFormat }}</div>
        </div>
      </x-table-column>
      <x-table-column>
        <t slot="header">操作</t>
        <template slot-scope="{row}">
          <template v-if="row.status === 'normal'">
            <el-button type="text" class="text-danger" @click="onStopOrStart(row)">
              <t path="delete">删除</t>
            </el-button>
            <el-button type="text" @click="onCopyProd(row)">
              <t path="copy">复制</t>
            </el-button>
          </template>
        </template>
      </x-table-column>
    </x-table>
  </div>
</template>

<script>
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
  supplier_id: '',
  supplier_ids: [],
  prod_types: ['product'],
  prod_level: '',
  prod_label: '',
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
  is_manage: 'yes',
  after_create_date: '',
  manage_busi_types: []
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
      searchParts: [
        {part: 'select-group', span: 12, field: 'busi_group_id', label: '工作组:', key: 'busi_group_id', multiple: false},
        {part: 'select-staff', span: 12, field: 'owner_id', label: '业务员:', key: 'owner_id', multiple: false},
        {part: 'select-sort', span: 12, multiple: false, field: 'prod_sort', label: '产品分类:', key: 'prod_sort'},
        {part: 'select-brand', span: 12, multiple: false, field: 'brand_id', label: '产品品牌:', key: 'brand'},
        {part: 'select-prod-type', span: 12, multiple: false, field: 'type', label: '产品类型:', key: 'prod_type'},
        {part: 'select-prod-level', span: 12, field: 'prod_level', multiple: false, label: '产品等级:', key: 'prod_level'},
        {part: 'select-source-type', span: 12, field: 'source_type', multiple: false, label: '产品来源:', key: 'source_type'},
        {part: 'select-priority', span: 12, field: 'mall_priority', multiple: false, label: '是否上架:', key: 'mall_priority'},
        {slot: 'create-date', span: 12, field: 'after_create_date', label: '指定日期'},
        {slot: 'busi-type', span: 12, field: 'manage_busi_types', label: '操作'}
        // {part: 'select-checkbox', span: 24, label: '指定日期', field: 'after_create_date', field2: 'manage_busi_type', label2: '之后', check_label: '无操作:', source: types}
      ],
      prodStatus: [
        {key: 'normal', text: '已启用', text_en: 'Normal'},
        {key: 'stopped', text: '已停用', text_en: 'Stopped'},
      ],
      busiTypes: [
        {key: 'quote', text: '报价', text_en: 'Quote'},
        {key: 'order', text: '订单', text_en: 'Order'},
        {key: 'inquiry', text: '询盘', text_en: 'Inquiry'},
        {key: 'browse', text: '浏览', text_en: 'Browse'},
      ],
      exp_pm_prod: []
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
      let search = this.$h.clone2(this.searchModel);
      search.is_manage = search.after_create_date && search.manage_busi_types && search.manage_busi_types.length ? 'yes' : ''
      search = search._trim();
      return this.$post('/api/business/queryProdsByType', search, {loading: true}).then((d) => {
        this.datas = d.prods;
        return d;
      });
    },
    async init() {
      this.prodKeys = window._g.getPmCheckFields('prod')
      // this.searchModel.busi_group_id = this.$state('me').busi_group_id
      // this.searchModel.owner_id = this.$state('me').user_id
      this.onRefresh()
      this.$nextTick(() => {
        this.getExpConfig()
      });
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
      }).then(() => {
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
    exportExcel (type) {
      let {exp_pm_prod: config} = this
      if (!config.length) return this.$message('请添加导出配置')
      config = config._assign({x_checked: true})
      this.$dialog.ExportExcelConfig({config}, (head) => {
        let para = {...this.searchModel}._trim()
        delete para.x_searchLast
        delete para.type
        delete para.prod_type
        let {page_size, page_index} = para
        let pages = [
          {page_size, page_index}
        ]
        if (type === 'all') {
          // let isHaveImg = head.find(f => f.value && f.value.key === 'main_pic')
          pages = []
          let size = 5000
          // if (isHaveImg) size = 200
          let l = Math.ceil(para.count / size)
          for (let i = 0; i < l; i++) {
            pages.push({
              page_size: size,
              page_index: i + 1
            })
          }
        }
        if (type === 'select') para.prod_ids = this.checkboxValue.map(m => m.prod_id)
        let index = 0
        function exported (page, i) {
          let name = '公司商品' + i + '.xlsx'
          this.$post('/x/r.json', {
            para: {...para, page},
            field: 'stats_pm_prod',
            bill_id: 'stats_pm_prod',
            file_name: name,
            head,
          }, {loading: true}).then(d => {
            let url = `/x/${d.render_id}/r.xlsx`
            this.$h.download(url, name).then(() => {
              index++
              if (index < pages.length) exported.call(this, pages[index], index + 1)
            })
            // window.open(url)
          }).catch(() => {
            this.$message('当数量太多的时候，下载可能会超时；请控制下载数量，看看窗口是否拦截文件下载')
          })
        }
        exported.call(this, pages[index], index + 1)
      })
    },
    getExpConfig () {
      let field = 'exp_pm_prod'
      this.$configure.getValue(field, this.$state('me').com_id).then((res) => {
        this[field] = res[field] || []
      })
    },
    onBatchStop() {
      let prod_ids = this.checkboxValue.map(item => item.prod_id)
      this.$post2('/api/product/stopProds', {prod_ids}).then(res => {
        this.onRefresh()
      })
    }
  },
  created() {
    this.init();
  },
  beforeDestroy () {
    window.clearInterval(this.timer)
  }
};
</script>
<style lang="scss">
</style>
