<template>
  <div class="cust-list">
    <more-search class="tab-page-header fixed-top" :parts="searchParts"
      :vm="searchModel"
      confirmChange>
      <div class="flex-b">
        <div class="h-left">
          <select-approve-status v-model="searchModel.cust_audit" placeholder="Approval Status" v-if="approve.status === 'normal'"></select-approve-status>
          <!-- <select-group-user :result="searchModel" field="busi_group_id" field2="owner_id" :pm="{range: custAuth.view, addPublic: true}"></select-group-user> -->
          <select-service-type :result="searchModel" field="cust_type" v-if="cust_type!=='2'&&cust_type!=='4'" :clearable="false"></select-service-type>
          <el-button type="primary" class="more--btn" v-if="cust_type!=='9999'">More</el-button>
          <span class="el-icon-download pointer ml10" @click="exportExcel"></span>
        </div>
        <div class="h-center"></div>
        <div class="h-right">
          <x-input
            v-model="searchModel.fuzzy_value"
            placeholder="输入客户名称"
            :maxlength="100"
            prefix-icon="el-icon-search"
            clearable
            width="300px"
            blurChange
          ></x-input>
          <el-button type="primary" @click="onAdd" icon="el-icon-plus" v-if="isCanAdd">
          </el-button>
        </div>
      </div>
      <x-select :result="vmodel" @save="change" slot="cust-register" slot-scope="{vmodel, change, pm}" :source="registerStatus" field="is_register" :map="{label: 'text', value: 'key'}" width="100%" clearable><t :path="pm.key" colon slot="label">{{pm.label}}:</t></x-select>
      <x-select :result="vmodel" @save="change" slot="cust-deal" slot-scope="{vmodel, change, pm}" :source="dealStatus" field="have_deal" :map="{label: 'text', value: 'key'}" width="100%" clearable><t :path="pm.key" colon slot="label">{{pm.label}}:</t></x-select>
    </more-search>
    <x-table :data="datas" tooltip-effect="dark" :page="searchModel" :getData="refresh">
      <x-table-column type="index"></x-table-column>
      <x-table-column>
        <t slot="header" path="cust.com_name">客户</t>
        <template slot-scope="scope">
          <span class="a-link" @click="viewDetail(scope.row)">{{ scope.row.com_name }}</span>
        </template>
      </x-table-column>
      <x-table-column width="100">
        <t slot="header" path="cust_no">编码</t>
        <template slot-scope="scope">
          <span>{{ scope.row.cust_no }}</span>
          <div class="mt5" v-if="approve.status === 'normal'">
            <span class="bill-status" :class="scope.row.cust_audit">{{scope.row.cust_audit | approveStatus}}</span>
          </div>
        </template>
      </x-table-column>
      <x-table-column label="ERP号" width="100" v-if="cust_type === '2'">
        <t slot="header" path="id_code">ERP号</t>
        <template slot-scope="scope"> {{ scope.row.id_code }}</template>
      </x-table-column>
      <x-table-column  v-if="cust_type === '2'">
        <t slot="header" path="country">国家</t>
        <template slot-scope="scope">
          {{ $tt(scope.row, "x_country_id") }}{{ $t("") }}
        </template>
      </x-table-column>
      <x-table-column width="60" v-if="cust_type === '2'">
        <t slot="header" path="cust_level">等级</t>
        <template slot-scope="scope"> {{ getCustLevel(scope.row) }}</template>
      </x-table-column>
      <x-table-column label="联系人">
        <t slot="header" path="cust_user">联系人</t>
        <template slot-scope="scope">
          <div class="line-1" v-for="item in scope.row.cust_users" :key="item.cust_id" :title="item.user_name">
            {{ item.user_name }}</div>
        </template>
      </x-table-column>
      <x-table-column min-width="150">
        <t slot="header" path="mail">邮箱</t>
        <template slot-scope="scope">
          <div class="line-1" v-for="item in scope.row.cust_users" :key="item.cust_id" :title="item.user_mail">
            {{ item.user_mail }}</div>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="owner">客户经理</t>
        <template slot-scope="scope"> {{ scope.row.x_owner_id }}</template>
      </x-table-column>
      <x-table-column width="80">
        <t slot="header" path="group">工作组</t>
        <template slot-scope="scope">
          <span
            class="a-link"
            @click="onEditGroup(scope.row)"
            >{{ getGroupName(scope.row) }}</span>
        </template>
      </x-table-column>
      <x-table-column width="60">
        <t slot="header" path="oprate">操作</t>
        <template slot-scope="scope">
          <el-button
            type="text"
            style="color: red"
            @click="onDelete(scope.row)"
            v-if="/initial|reject/.test(scope.row.cust_audit)"
            >{{ $t("delete") }}</el-button>
        </template>
      </x-table-column>
    </x-table>
  </div>
</template>

<script>
import {queryApprove} from './widget/widget.js';
import Auth from './widget/components/auth-mixins';
export default {
  options: {
    icon_text: 'List'
  },
  mixins: [Auth],
  components: {
  },
  data() {
    let cust_type = this.payload.cust_type || '2'
    return {
      cust_type,
      datas: [],
      timer: null,
      plan_id: "",
      approve: { status: "" },
      searchModel: {
        page_index: 1,
        page_size: 15,
        count: 0,
        busi_group_id: "",
        owner_id: "",
        fuzzy_value: "",
        cust_audit: "",
        x_searchLast: 0,
        cust_type,
        legal_ids: [],
        busi_group_ids: [],
        owner_ids: [],
        area_ids: [],
        country_ids: [],
        cust_natures: [],
        cust_levels: [],
        is_equity: '',
        have_deal: '',
        create_date_start: '',
        create_date_end: '',
        is_register: ''
      },
      levelsMap: [],
      registerStatus: [
        {text: '已注册', text_en: '已注册', key: 'yes'},
        {text: '未注册', text_en: '未注册', key: 'no'},
      ],
      dealStatus: [
        {text: '已交易', text_en: '已交易', key: 'yes'},
        {text: '未交易', text_en: '未交易', key: 'no'},
      ],
      searchParts: [
        {part: 'select-our-com', span: 8, field: 'legal_ids', label: '法人', key: 'cust.legal_id', multiple: true},
        {part: 'select-group', span: 8, field: 'busi_group_ids', label: '工作组', key: 'group', multiple: true},
        {part: 'select-staff', span: 8, field: 'owner_ids', label: '客户经理', key: 'cust.owner_id', multiple: true},
        {part: 'select-area', span: 8, field: 'area_ids', label: '区域', key: 'cust.area_ids', multiple: true},
        {part: 'select-country', span: 8, field: 'country_ids', label: '国家', key: 'cust.country_id', multiple: true},
        {part: 'select-yes-no', span: 8, field: 'is_equity', label: '内部客商', key: 'cust.is_equity'},
        {part: 'select-cust-level', span: 8, field: 'cust_levels', label: '等级', key: 'cust.cust_level', multiple: true, hidden: cust_type !== '2'},
        {part: 'select-cust-type', span: 8, field: 'cust_natures', label: '性质', key: 'cust.cust_nature', hidden: cust_type !== '2'},
        {slot: 'cust-register', span: 8, field: 'is_register', label: '注册', key: 'cust.is_register'},
        {slot: 'cust-deal', span: 8, field: 'have_deal', label: '交易', key: 'cust.have_deal', hidden: cust_type !== '2'},
        {part: 'select-date-range', span: 16, field: 'create_date_start', field2: 'create_date_end', label: '创建时间', key: 'create_date'},
      ],
    };
  },
  computed: {
    isCanAdd() {
      return this.custAuth.add === "yes";
    },
  },
  methods: {
    queryApprove,
    init() {
      if (this.custAuth.view === "self") {
        this.searchModel.owner_id = this.$state("me").user_id;
      }
      this.onRefresh();
      this.queryCustLevels()
      this.queryApprove()
    },
    async queryCustLevels () {
      let v = await this.$get2("/api/b2b/queryCustLevels")
      this.levelsMap = (v.cust_levels || [])._object('level_id')
    },
    onRefresh () {
      this.searchModel.x_searchLast = 1
    },
    handlerSearchModel () {
      let searchModel = {...this.searchModel}
      if (searchModel.owner_id) searchModel.busi_group_id = undefined
      return searchModel._trim()
    },
    refresh() {
      if (this.plan_id) return this.queryVerifyResult();
      let searchModel = this.handlerSearchModel()
      return this.$post("/api/crm/queryCustComList", searchModel, {loading: true})
        .then((data) => {
          this.datas = data.cust_companys;
          return data;
        });
    },
    onAdd () {
      let {cust_type} = this
      this.$dialog.AddCustContact({vm: {cust_type}}, async v => {
        v = {...v.cust_company}
        v.add_cust && (v.show = 'CustContacts')
        this.viewDetail(v)
        this.onRefresh()
      })
    },
    onEditGroup(vm) {
      this.$dialog.CrmGroups({vm}, this.onRefresh);
    },
    async onDelete(row) {
      await this.$confirm(this.$t("delete_tip"), this.$t("dialog_tip"), {
        type: "warning",
      });
      await this.$post2("/api/crm/deletCustCompany", {
        cust_com_id: row.cust_com_id,
      })
      this.onRefresh();
    },
    queryVerifyResult() {
      let search = this.searchModel;
      let params = {
        page_index: search.page_index,
        page_size: search.page_size,
        plan_id: this.plan_id,
        verify_type: "cust",
      };
      return this.$post2("/api/business/queryVerifyResult", params)
        .then((data) => {
          this.datas = data.verify_list || [];
          if (data.finish === "yes") {
            window.clearInterval(this.timer);
            this.timer = null;
          }
          return data;
        })
        .catch(() => {
          window.clearInterval(this.timer);
        });
    },
    verifyCrm() {
      let {
        busi_group_id,
        owner_id,
        have_deal,
        fuzzy_value,
      } = this.searchModel;
      let params = { busi_group_id, owner_id, have_deal, fuzzy_value };
      params.cust_type = this.cust_type;
      this.$dialog.VerifyCrm({ search: params, type: "cust" }, (data) => {
        console.log(data);
        this.plan_id = data.plan_id;
        this.verifyResult = data.verifyResult;
        this.onRefresh();
        this.timer = setInterval(() => {
          this.onRefresh();
        }, 1000);
      });
    },
    clearVerify() {
      this.plan_id = "";
      window.clearInterval(this.timer);
      this.onRefresh();
    },
    isCanDelete(row) {
      let { edit } = this.custAuth;
      let me = this.$state("me");
      return (
        edit === "all" ||
        (edit === "self" && row.owner_id === me.user_id) ||
        (edit === "group" &&
          (me.busi_groups || []).indexOf(row.busi_group_id) >= 0)
      );
    },
    onReset(v) {
      Object.assign(this.searchModel, v);
      this.searchModel.x_searchLast = 1;
    },
    exportExcel() {
      let nameMap = {
        2: '客户.xlsx',
        4: '供应商.xlsx',
        9999: '服务商.xlsx',
      }
      let para = {
        ...this.searchModel,
        field: "bill_cust_info",
        bill_id: "bill_cust_info",
        download: 1,
        file_name: nameMap[this.cust_type]
      }._trim();
      delete para.x_searchLast;
      let params = Object.entries(para)
        .map(([k, v]) => `${k}=${v}`)
        .join("&");
      let url = "/x/r.xlsx?" + params;
      console.log(para.file_name, 'para.file_name')
      this.$h.download(url, para.file_name)
    },
    getCustLevel(row) {
      let item = this.levelsMap[row.cust_level] || {};
      return item.level_name;
    },
    viewDetail (v) {
      this.$tab.open({
        title: v.com_name,
        tab_id: v.cust_com_id,
        path: 'CustEdit',
        query: {
          cust_com_id: v.cust_com_id,
          show: v.show,
          cust_type: this.cust_type
        }
      })
    },
    getGroupName ({busi_group_id, x_busi_group_id}) {
      if (busi_group_id === this.$groupId) return '公共组'
      return x_busi_group_id || '编辑'
    },
  },
  created() {
    if (this.payload.search) Object.assign(this.searchModel, this.payload.search)
    this.init();
  },
};
</script>
<style lang="scss">
</style>
