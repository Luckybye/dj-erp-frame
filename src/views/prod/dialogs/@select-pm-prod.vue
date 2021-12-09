<template>
  <el-dialog
    :visible="true"
    :close-on-click-modal="false"
    @close="onClose"
    width="1000px"
    :class="className"
  >
    <div slot="title">
      {{(title || $t('select_prod'))}}({{allSelect.length}})
      <span class="text-danger text-12 ml10" v-if="limit">限制选择{{limit}}个</span>
    </div>
    <div class="d-content">
      <more-search
        class="tab-page-header fixed-top"
        searchKey="web_prod_extend_query_config"
        :vm="searchVm"
        label-width="120px"
        @confirm="getAllProd()"
        @reset="getAllProd()"
        :disabledMap="disabledSearchMap">
        <div class="flex-b">
          <div></div>
          <div>
            <i :class="['a-link iconfont', showCard ? 'icon-list' : 'icon-grid']" @click="showCard=!showCard"></i>
            <el-button type="primary" class="more--btn mh10">More</el-button>
            <x-input
              width="250px"
              :placeholder="$t('name_item_model_supplier_no')"
              v-model="searchVm.fuzzy_value"
              @enter="getAllProd"
              @blur-change="getAllProd"
              clearable
            ></x-input>
          </div>
        </div>
      </more-search>
      <x-table-card
        v-if="showCard"
        :data="allProds"
        @selection-change="handleSelectionProdChange"
        :page="searchVm"
        @page-change="getAllProd"
        row-key="prod_id"
        :singleSelect="Number(limit)===1"
        imgKey="main_pic"
        :fields="['prod_name_en', 'item_no']"
        hasCart
        cardWidth="20%">
        <div slot="price" slot-scope="{row}">{{row.currency | currencyFormat}}{{row.fob_price}}</div>
      </x-table-card>
      <x-table
        v-else
        ref="table"
        :data="allProds"
        tooltip-effect="dark"
        @selection-change="handleSelectionProdChange"
        :page="searchVm"
        @page-change="getAllProd"
        row-key="prod_id"
        :colKey="colKey"
        :singleSelect="Number(limit)===1">
        <x-table-column
          v-if="type !== 'sparepart'"
          type="selection"
          width="55"
          :selectable="selectable"
          reserve-selection
        >
        </x-table-column>
        <x-table-column
          :label="$t('picture')"
          width="120"
        >
          <template slot-scope="{row}">
            <x-td-img :src="row.main_pic" :tao="row.is_bom === 'yes'" :spare="row.is_spare==='yes'"></x-td-img>
          </template>
        </x-table-column>
        <x-table-column :label="$t('desc_item_no')" v-if="!colKey">
          <template slot-scope="scope">
            <div>{{scope.row.prod_name}}</div>
            <div>{{scope.row.prod_no}}</div>
          </template>
        </x-table-column>
        <x-table-column :label="$t('model_supplier_no')" v-if="!colKey">
          <template slot-scope="scope">
            <div>{{scope.row.model}}</div>
            <div>{{scope.row.supplier_no}}</div>
          </template>
        </x-table-column>
        <x-table-column :label="$t('fob_price')" v-if="!colKey">
          <template slot-scope="scope">
            {{scope.row.currency || '-'}}
            {{scope.row.fob_price || '-'}}
          </template>
        </x-table-column>
        <x-table-column :label="$t('action')" v-if="type === 'sparepart' && !colKey">
          <template slot-scope="{row}">
            <t @click="viewParts(row)" class="a-link" path="view_sparepart">查看配件</t>
          </template>
        </x-table-column>
        <x-table-column slot="th_sparepart" slot-scope="{col}" v-if="type === 'sparepart'">
          <t slot="header" path="title" :vm="col" tt>操作</t>
          <template slot-scope="{row}">
            <t @click="viewParts(row)" class="a-link" path="view_sparepart">查看配件</t>
          </template>
        </x-table-column>
      </x-table>
    </div>
    <span
      slot="footer"
      class="dialog-footer">
      <el-button @click="onClose">{{$t('cancel')}}</el-button>
      <el-button
        type="primary"
        @click="onClick"
      >{{$t('confirm')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'select-pm-prod',
  components: {},
  computed: {
    isCn() {
      return this.$i18n.locale === 'cn'
    },
    disabledMap() {
      return this.selected.reduce((pre, val) => {
        let id = val
        if (typeof val === 'object') id = val.sell_prod_id || val.prod_id
        pre[id] = val
        return pre
      }, {})
    },
  },
  data() {
    return {
      type: '',
      title: '',
      colKey: '',
      cust_id: '',
      className: '',
      searchVm: {
        page_index: 1,
        page_size: 15,
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
        className: ''
      },
      allProds: [],
      selected: [],
      allSelect: [],
      limit: '',
      disabledSearchMap: {},
      showCard: false,
    }
  },
  methods: {
    async init() {
      this.handleSearch()
      await this.queryFavorites()
      this.getAllProd()
    },
    async queryFavorites () {
      if (!this.cust_id) return
      await this.$get2('/api/crm/queryFavorites', {cust_id: this.cust_id, busi_type: 'cust'}).then(d => {
        d = d.cust_favorites || []
        this.searchVm.prod_sorts = d.filter(f => f.favo_type === 'prod_sorts').map(f => f.favorite)
      })
    },
    handleSearch () {
      let v = this.searchVm
      if (v.mall_priority === '1' || v.shop_status === 'normal') this.$set(this.disabledSearchMap, 'mall_priority', true)
      if (this.type === 'sparepart') v.is_spare = 'yes'
      if (v.is_spare === 'yes') this.$set(this.disabledSearchMap, 'is_spare', true)
    },
    getAllProd(i) {
      this.searchVm.page_index = typeof i === 'number' ? i : 1
      let para = {...this.searchVm}._trim()
      if (!para.prod_types || para.prod_types.length === 0) delete para.type
      this.$api.queryProdList(para).then(
        res => {
          this.allProds = res.prods || []
          if ('count' in res) this.searchVm.count = res.count
        }
      )
    },
    handleSelectionProdChange(val) {
      if (this.limit) {
        this.allSelect = val.slice(0, this.limit * 1)
      } else this.allSelect = val
    },
    selectable(row, index) {
      return !this.disabledMap[row.prod_id]
    },
    onClick() {
      if (!this.allSelect.length) return
      if (this.limit && this.allSelect.length > this.limit) this.$message.warning('超出限制')
      this.onCallback(this.allSelect).then(() => this.onClose())
    },
    viewParts (row) {
      this.$dialog.SelectSparepart({
        prod_id: row.prod_id,
        selectedProds: this.selected,
        bill_id: this.bill_id,
        bill_type: this.bill_type
      }, data => {
        this.onCallback().then(() => {
          this.onClose()
        })
      })
    }
  },
  created() {
    this.init()
  }
}
</script>

<style lang="scss">
</style>
