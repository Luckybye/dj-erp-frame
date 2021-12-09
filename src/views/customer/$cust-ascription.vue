<template>
  <div class="cust-ascription">
    <div class="flex-b pv5">
      <div class="h-left">
        <x-select
          :source="custTypes"
          :map="{ value: 'key', label: $i18n.locale === 'cn' ? 'text' : 'text_en', }"
          :result="searchModel"
          field="cust_type"
          width="100px"
          @on-change="refresh"
        ></x-select>
      </div>
      <div class="h-right">
        <x-input
          v-model="searchModel.fuzzy_value"
          :placeholder="$t('cust_comm.pls_input')"
          @blur-change="refresh"
          @enter="refresh"
          maxlength="100"
          prefix-icon="el-icon-search"
          clearable></x-input>
      </div>
    </div>
    <div class="cust-ascription">
      <div class="mt20">
        <table class="sample-table">
          <thead>
            <th>序号</th>
            <th>联系人</th>
            <th>邮箱</th>
            <th>电话</th>
            <th>客商公司</th>
            <th>ERP号</th>
            <th>客商编码</th>
            <th>用户</th>
            <th>操作</th>
          </thead>
          <tbody>
            <template v-for="(cust, i1) in datas">
              <tr v-for="(company, i2) in cust.cust_company_list" :key="cust.cust_id + (company || {}).cust_com_id">
                <td :rowspan="cust.cust_company_list.length" v-if="i2 === 0">{{i1 + 1}}</td>
                <td :rowspan="cust.cust_company_list.length" v-if="i2 === 0">{{cust.user_name}}</td>
                <td :rowspan="cust.cust_company_list.length" v-if="i2 === 0">{{cust.user_mail}}</td>
                <td :rowspan="cust.cust_company_list.length" v-if="i2 === 0">{{cust.user_phone}}</td>
                <td>{{company.com_name}}</td>
                <td>{{company.id_code}}</td>
                <td>{{company.cust_no}}</td>
                <td>
                  {{company.x_create_user}} {{company.create_date | timeFormat}}
                </td>
                <td>
                  <div v-if="i2 !== 0">
                    <el-button type="text" @click="onDelete(cust, company)" class="text-red"><t path="delete"></t></el-button>
                  </div>
                  <div v-if="i2 === cust.cust_company_list.length-1">
                    <el-button type="text" @click="onAdd(cust)"><t path="add"></t></el-button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
        <el-pagination
          class="myPagination"
          @size-change="handleSizeChange"
          @current-change="refresh"
          :current-page.sync="searchModel.page_index"
          :page-size="searchModel.page_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="searchModel.count"
          hide-on-single-page>
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
let search = {
  page_index: 1,
  page_size: 10,
  cust_type: '2',
  fuzzy_value: ''
}
export default {
  components: {},
  data() {
    return {
      datas: [],
      searchModel: this.$h.clone(search),
      custTypes: [
        {text: '客户', text_en: 'Customer', key: '2'},
        {text: '供应商', text_en: 'Supplier', key: '4'},
      ]
    };
  },
  computed: {
    isSaas () {
      return this.$root.login_domain === 'saas'
    },
    searchParts () {
      return this.parts.filter(m => m.filter.indexOf(this.$root.login_domain) >= 0)
    }
  },
  methods: {
    async refresh (i) {
      this.searchModel.page_index = typeof i === 'number' ? i : 1
      let search = this.$h.clone2(this.searchModel);
      search = search._trim();
      console.log(search)
      return this.$get('/api/crm/queryCustAscription', search).then((d) => {
        this.datas = d.cust_users;
        if ('count' in d) this.searchModel.count = d.count
        return d;
      });
    },
    async init() {
      this.refresh()
    },
    onAdd (cust) {
      this.$dialog.AddCustAscription({cust_type: this.searchModel.cust_type}, data => {
        console.log(data)
        this.$post2('/api/crm/addCustAscription', {cust_id: cust.cust_id, cust_com_id: data.cust_com_id}).then(res => {
          this.refresh()
        })
      })
    },
    onDelete (cust, company) {
      this.$post2('/api/crm/deleteCustAscription', {ascription_id: company.ascription_id}).then(res => {
        this.refresh()
      })
    },
    handleSizeChange (d) {
      this.searchModel.page_size = d
      this.refresh()
    }
  },
  created() {
    this.init();
  }
};
</script>
<style lang="scss">
.cust-ascription {
  table {
    font-size: 14px;
    color: #606266;
    thead {
      color: #909399;
      font-weight: 500;
      text-align: left;
    }
    th, td {
      border-color: #EBEEF5;
      padding: 5px 10px;
    }
  }
}
</style>
