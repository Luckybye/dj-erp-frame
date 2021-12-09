<template>
  <div class="shop-prod">
    <el-menu :default-active="searchModel.shop_status" mode="horizontal" @select="handleSelect" class="fixed-top">
      <el-menu-item v-for="(item) in filterStatus" :key="item.key" :index="item.key">{{$tt(item, 'text')}}</el-menu-item>
    </el-menu>
    <more-search
      class="tab-page-header mt10"
      :vm="searchModel"
      searchKey="web_prod_extend_query_config"
      confirmChange
      :disabledMap="{mall_priority: true}">
      <div class="flex-b">
        <div class="h-left">
          <select-sort v-model="searchModel.prod_sorts" multiple width="120px" collapseTags></select-sort>
          <select-prod-type v-model="searchModel.prod_types" width="170px" multiple collapseTags></select-prod-type>
          <select-brand v-model="searchModel.brand_id" :options-method="filterBrand" width="120px"></select-brand>
          <el-button type="primary" @click="onPublic()" v-if="searchModel.shop_status === 'free' && getAuth">{{$t('batch_public')}}</el-button>
          <el-button type="primary" @click="onNopublic()" v-if="searchModel.shop_status === 'normal' && getAuth">{{$t('batch_no_public')}}</el-button>
          <el-button type="primary" @click="onPublicAgain()" v-if="searchModel.shop_status === 'stop' && getAuth">{{$t('batch_public_again')}}</el-button>
          <el-button type="primary" class="more--btn">More</el-button>
        </div>
        <div class="h-center"></div>
        <div class="h-right">
          <x-input
            v-model="searchModel.fuzzy_value"
            placeholder="输入产品名称"
            :maxlength="100"
            prefix-icon="el-icon-search"
            clearable
            blurChange></x-input>
        </div>
      </div>
    </more-search>
    <x-table :data="datas" @selection-change="handleSelectionChange" :page="searchModel" :getData="refresh" :colKey="colKey">
      <x-table-column type="selection"  width="50" :selectable="getAuth"></x-table-column>
      <x-table-column width="70" slot="th_main_pic" slot-scope="{col}">
        <t slot="header" path="title" :vm="col" tt>产品</t>
        <div slot-scope="{row}">
          <x-td-img :src="row.main_pic" :tao="row.is_bom === 'yes'" :spare="row.is_spare==='yes'" @click.native="onOpen(row)"></x-td-img>
        </div>
      </x-table-column>
      <x-table-column slot="th_info_integrity" slot-scope="{col}">
        <t slot="header" path="title" :vm="col" tt>信息完整度</t>
        <template slot-scope="scope">
          <el-progress :percentage="getIntegrity(scope.row)"></el-progress>
        </template>
      </x-table-column>
      <x-table-column slot="th_action" slot-scope="{col}">
        <t slot="header" path="title" :vm="col" tt>操作</t>
        <template slot-scope="scope" width="80">
          <div v-if="getAuth(scope.row)">
            <el-button
              type="text"
              class="a-link"
              @click="onPublic(scope.row)"
              v-if="searchModel.shop_status === 'nopublic' || searchModel.shop_status == 'free'"
              >{{$t('public')}}</el-button
            >
            <el-button
              type="text"
              class="d-link"
              @click="onNopublic(scope.row)"
              v-if="searchModel.shop_status === 'normal'"
              >{{$t('no_public')}}</el-button
            >
            <el-button
              type="text"
              class="a-link"
              @click="onPublicAgain(scope.row)"
              v-if="searchModel.shop_status === 'stop'"
              >{{$t('public_again')}}</el-button
            >
          </div>
        </template>
      </x-table-column>
    </x-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  components: {},
  data() {
    return {
      datas: [],
      filterStatus: [
        { text: "上架", text_en: "Public", key: "normal" },
        { text: "下架", text_en: "Stop", key: "stop" },
        { text: "未上架", text_en: "No Public", key: "free" },
      ],
      checkboxValue: [],
      filterStatus2: [
        { text: "所有", text_en: "", key: "", prod_type: "company" },
        ...this.$constant("prodType").map((m) => ({
          ...m,
          prod_type: "company",
        })),
        { text: "停用", text_en: null, key: "null", prod_type: "stopped" },
      ],
      searchModel: {
        x_searchLast: 0,
        page_index: 1,
        page_size: 10,
        prod_sort: "",
        fuzzy_value: "",
        include_sub_sort: 1,
        prod_type: "company",
        is_publish: "yes",
        status: "normal",
        is_sell: "yes",
        source_type: "",
        brand_id: "",
        shop_status: "normal",
        need_mg: "mg_pkgs",
        prod_sorts: [],
        brand_ids: [],
        create_date_start: null,
        create_date_end: null,
        owner_id: "",
        is_spare: "",
        supplier_ids: [],
        prod_types: ['product'],
        prod_levels: [],
        prod_labels: [],
        prod_auth: 'public',
        extend_natures: [],
        extend_tags: []
      },
      selectedProds: [],
      public_auth: true,
      colKey: 'shop_prod_table_header'
    };
  },
  methods: {
    onRefresh () {
      this.searchModel.x_searchLast = 1
    },
    async refresh() {
      let search = { ...this.searchModel }._trim();
      search.mall_priority = search.shop_status === 'normal' ? '1' : '0'
      // 调用高级搜索接口
      search.is_extend = 1
      this.selectedProds = []
      return this.$api.queryProdList(search, { loading: true }).then((data) => {
        this.datas = data.prods || [];
        return data;
      });
    },
    handleSelect (key) {
      this.searchModel.shop_status = key
      this.searchModel.page_index = 1
    },
    filterBrand (arr) {
      return arr.filter((m) => m.manage_type === this.payload.source_type && m.busi_status === 'normal')
    },
    async init() {
      this.prodKeys = window._g.getPmCheckFields('prod')
      this.searchModel.source_type = this.payload.source_type
      if (this.searchModel.source_type === 'company') {
        this.colKey = 'self_prod_table_header'
      } else if (this.searchModel.source_type === 'supplier') {
        this.colKey = 'agent_prod_table_header'
      }
      this.onRefresh()
    },
    getIntegrity(row) {
      let num = 0
      this.prodKeys.forEach(item => {
        if (item.check(row)) num++
      })
      return Math.round(num * 100 / this.prodKeys.length);
    },
    onPublic(row) {
      let prod_ids = this.getSelectProds(row)
      if (!prod_ids) return this.$message({ message: "请选择产品", type: "error" });
      this.checkSameModel(prod_ids, 'public')
    },
    checkSameModel(prod_ids, type) {
      this.$post2("/api/b2b/checkProdShelf", {
        prod_ids: prod_ids,
      }).then((res) => {
        console.log(res)
        let prod_infos = res.prod_infos || []
        if (prod_infos.length) {
          this.$dialog.SameModel({datas: prod_infos}, pub_type => {
            if (pub_type === 'all') {
              this.newProdUpperShelf(prod_ids, type)
            } else {
              console.log('prod_ids', prod_ids)
              prod_ids.forEach((items, index) => {
                prod_infos.forEach(item => {
                  if (items === item.prod_id) {
                    console.log('index', index)
                    prod_ids.splice(index, 1)
                  }
                })
              })
              this.newProdUpperShelf(prod_ids, type)
            }
          })
        } else {
          this.newProdUpperShelf(prod_ids, type)
        }
      })
    },
    newProdUpperShelf (prod_ids, type) {
      if (!prod_ids.length) return
      let url = type === 'public' ? '/api/b2b/newProdUpperShelf' : '/api/b2b/downShelfProdUpper'
      this.$post2(url, {
        prod_ids: prod_ids,
      }).then(() => {
        this.$message({ message: "上架成功", type: "success" });
        setTimeout(this.onRefresh, 1000)
      });
    },
    onNopublic(row) {
      let prod_ids = this.getSelectProds(row)
      if (!prod_ids) return this.$message({ message: "请选择产品", type: "error" });
      this.$post2("/api/b2b/upperShelfProdDown", {
        prod_ids: prod_ids,
      }).then(() => {
        this.$message({ message: "下架成功", type: "success" });
        setTimeout(this.onRefresh, 1000)
      });
    },
    onPublicAgain(row) {
      let prod_ids = this.getSelectProds(row)
      if (!prod_ids) return this.$message({ message: "请选择产品", type: "error" });
      this.checkSameModel(prod_ids, 'public_again')
    },
    handleSelectionChange (val) {
      this.selectedProds = val
    },
    getSelectProds (row) {
      let prod_ids = []
      if (row) {
        prod_ids.push(row.prod_id)
      } else {
        this.selectedProds.forEach(item => {
          prod_ids.push(item.prod_id)
        })
      }
      return prod_ids
    },
    getAuth (row) {
      let flag = true
      let {public: pub} = this.prodAuth
      let me = this.$state('me')
      if (row) {
        if ((pub === 'legal' && row.com_legal !== me.com_legal) ||
            (pub === 'group' && (me.busi_groups || []).indexOf(row.busi_group_id) < 0) ||
            (pub === 'self' && row.owner_id !== me.user_id)) {
          flag = false
        }
      } else {
        if (!this.selectedProds.length) return true
        this.this.selectedProds.forEach(row => {
          if ((pub === 'legal' && row.com_legal !== me.com_legal) ||
              (pub === 'group' && (me.busi_groups || []).indexOf(row.busi_group_id) < 0) ||
              (pub === 'this' && row.owner_id !== me.user_id)) {
            flag = false
          }
        })
      }
      return flag
    },
    onOpen (v) {
      let title = v.prod_name_en || v.prod_name || 'Product Info'
      this.$tab.open({
        title,
        tab_id: v.prod_id,
        path: 'PmEdit',
        query: {
          prod_id: v.prod_id,
          status: v.status,
        }
      })
    },
  },
  computed: {
    ...mapGetters(['me']),
    isCanPublic (row) {
      let flag = true
      let {public: pub} = this.prodAuth
      let me = this.$state('me')
      if (row) {
        if ((pub === 'this' && row.owner_id !== me.user_id) ||
              (pub === 'group' && (me.busi_groups || []).indexOf(row.busi_group_id) < 0)) flag = false
      } else {
        if (!this.selectedProds.length) return flag
        this.this.selectedProds.forEach(row => {
          if ((pub === 'this' && row.owner_id !== me.user_id) ||
              (pub === 'group' && (me.busi_groups || []).indexOf(row.busi_group_id) < 0)) flag = false
        })
      }
      return flag
    },
    prodAuth () {
      return ((this.me || {}).user_config || {}).prod_auth || {}
    }
  },
  created() {
    if (this.payload.search) Object.assign(this.searchModel, this.payload.search)
    this.init();
  },
};
</script>
<style lang="scss">
</style>
