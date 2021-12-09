<template>
  <div class="cust-setting-price">
    <div class="tab-page-header flex-b">
      <div class="f-left">
        <x-select
          field="important_rank"
          :result="searchModel"
          :source="important_rank"
          :map="{ label: 'text', value: 'value' }"
          @change="refresh"
          clearable
          placeholder="等级排名"
        ></x-select>
        <x-input
            v-model="searchModel.fuzzy_value"
            placeholder="输入产品名称"
            @blur-change="refresh"
            @enter="refresh"
            :maxlength="100"
            prefix-icon="el-icon-search"
            width="200px"></x-input>
      </div>
      <div class="f-right" v-if="!disabled">
        <el-button
          type="primary"
          @click="queryRepeatCustomProducts()"
          v-if="!checkRepeat"
        ><t path="cust.check_model">型号重复校验</t></el-button>
        <t path="cust.clear_check_rst" v-else class="d-link mr10" @click="refresh">清除校验结果</t>
        <el-button
          @click="onUploadBtn"
        ><t path="cust.update_prod">更新指定产品</t></el-button>
      </div>
    </div>
    <div class="flex-b mb10">
      <div v-if="checkRepeat">
        <span class="text-red text-bold">重复Model：</span>
        <x-select
          v-model="repeatModel"
          @change="selectModel"
          :source="Object.keys(reapeatGroups)"
        ></x-select>
      </div>
      <div></div>
      <div>
        <el-checkbox
          v-model="vm.is_show_price"
          true-label="yes"
          false-label="no"
          @change="updateCustCompany('is_show_price')"
          :disabled="disabled"
        >
          <t path="cust.show_price_tip">官网上，只有专属定价的产品才显示价格</t>
        </el-checkbox>
        <span class="ml20 lh-30">
          <t path="cust.currency_tip" colon>官网价格币种：</t>{{ currency }}
        </span>
      </div>
    </div>
    <x-table :data="datas" :page="!checkRepeat && searchModel" @page-change="refresh" rowKey="cust_prod_id">
      <x-table-column label="产品" width="">
        <x-td-img
          :src="row.main_pic"
          @click.native="onEdit(row)"
          slot-scope="{ row }"
        ></x-td-img>
      </x-table-column>
      <x-table-column label="重要性" width="" prop="important_rank">
      </x-table-column>
      <x-table-column label="货号" width="">
        <template slot-scope="{ row }">
          <div title="货号" class="a-link" :class="{'dd-link': disabled}" @click="onEdit(row)">
            {{ row.prod_no }}
          </div>
          <div title="型号" class="text-grey">{{ row.model }}</div>
        </template>
      </x-table-column>
      <x-table-column label="描述" width="">
        <template slot-scope="{ row }">
          <div class="line-2">{{ row.prod_name_en }}</div>
        </template>
      </x-table-column>
      <x-table-column label="价格类型" width="">
        <template slot-scope="{ row }">
          {{ getPriceType(row.price_type) }}
        </template>
      </x-table-column>
      <x-table-column label="品牌价格" width="">
        <template slot-scope="{ row }">
          {{ row.fob_price }}({{ row.fob_currency }})
        </template>
      </x-table-column>
      <x-table-column label="客户价格" width="">
        <template slot-scope="{ row }">
          {{ row.price }}({{ row.currency }})
        </template>
      </x-table-column>
      <x-table-column label="信息" width="">
        <template slot-scope="{ row }">
          <div>{{ row.update_date | timeFormat }}</div>
          <div>{{ row.x_update_user }}</div>
        </template>
      </x-table-column>
      <x-table-column label="操作" width="" v-if="!disabled">
        <template slot-scope="{ row }">
          <div>
            <t
            class="a-link"
            @click="onChangeStatus(row, 'normal')"
            v-if="row.busi_status === 'stop'"
            path="enable"
            >启用</t>
            <t class="d-link" @click="onChangeStatus(row, 'stop')" path="stop" v-else>停用</t>
          </div>
          <!-- <div><t class="d-link" @click="onDelete(row, $index)" path="delete">删除</t></div> -->
          <div><t class="a-link" @click="onChangeProd(row)" path="change_prod">换货</t></div>
        </template>
      </x-table-column>
      <div slot="nodata">
        No datas
      </div>
    </x-table>
  </div>
</template>

<script>
import {queryCustCompany, updateCustCompany} from '../widget';
import Auth from '../components/auth-mixins';
export default {
  options: {title: '专属定价'},
  data () {
    return {
      datas: [],
      currency: 'USD',
      vm: {is_show_price: 'no'},
      important_rank: [
        {text: 'A', value: 'A'},
        {text: 'B', value: 'B'},
        {text: 'C', value: 'C'},
        {text: 'Null', value: 'Null'}
      ],
      searchModel: {
        fuzzy_value: '',
        important_rank: '',
        cust_com_id: '',
        page_index: 1,
        page_size: 15,
        count: 0
      },
      reapeatGroups: {},
      checkRepeat: false,
      repeatModel: ''
    }
  },
  computed: {
    disabled () {
      return this.isDisableEdit
    },
  },
  methods: {
    queryCustCompany,
    updateCustCompany,
    initialize () {
      this.$configure.getValue('base_curr', this.instance).then((res) => {
        if (res.base_curr) {
          this.currency = res.base_curr.income_curr
        }
      })
      this.refresh()
    },
    refresh () {
      if (!this.searchModel.cust_com_id) return this.$Promise.as({})
      this.checkRepeat = false
      let para = {...this.searchModel}._trim()
      return this.$request2('/api/b2b/queryCustProdPrice', para).then((data) => {
        this.datas = data.cust_prods
        if ('count' in data) this.searchModel.count = data.count
        return data
      })
    },
    async queryRepeatCustomProducts () {
      this.checkRepeat = true
      this.datas = []
      let v = await this.$request2('/api/product/queryRepeatCustomProducts', this.searchModel)
      v = v.cust_prods || []
      this.reapeatGroups = v.toGroup('model')
      this.repeatModel = (v[0] || {}).model
      this.selectModel()
    },
    selectModel () {
      this.datas = this.reapeatGroups[this.repeatModel] || []
    },
    getPriceType (type) {
      if (/quote/i.test(type)) return '报价'
      if (/sc/i.test(type)) return '成交价'
      return '自营'
    },
    onDelete (item, index) {
      let param = {
        cust_prod_id: item.cust_prod_id
      }
      this.$request2('/api/b2b/deleteCustProdPrice', param).then((data) => {
        if (this.checkRepeat) {
          this.datas.splice(index, 1)
        } else this.refresh()
      })
    },
    // getRepaeatClass ({row}) {
    //   let {model, bgClass = ''} = this.lastRepeatModel || {}
    //   if (row.model !== model) bgClass = ['', 'bg-red'].filter(f => f !== bgClass)[0]
    //   this.lastRepeatModel = {model: row.model, bgClass}
    //   return bgClass
    // },
    onUploadBtn () {
      this.$dialog.CustPriceUpload({}, (file) => {
        this.$request2('/api/b2b/impCustProdRank', {
          excel_url: file,
          cust_com_id: this.searchModel.cust_com_id
        }).then((res) => {
          this.refresh()
        })
      })
    },
    onEdit (row) {
      this.$dialog.EditPmCustomer({param: row}, (data) => {
        this.refresh()
      })
    },
    onChangeStatus (row, status) {
      let param = {
        cust_prod_id: row.cust_prod_id,
        busi_status: status
      }
      this.$request2('/api/b2b/updateCustProdBusiStatus', param).then((res) => {
        row.busi_status = status
      })
    },
    onChangeProd (row) {
      this.$dialog.ChangeCustProd({param: row}, (data) => {
        if (data) {
          this.$request2('/api/product/changeCustomProduct', {
            cust_prod_id: row.cust_prod_id,
            prod_id: data.prod_id
          }).then(d => {
            this.refresh()
          })
        }
      })
    }
  },
  created () {
    this.instance = this.payload.instance || this.$state('me').com_id
    this.searchModel.cust_com_id = this.payload.cust_com_id
    this.initialize()
    this.queryCustCompany()
  },
  mixins: [Auth]
}
</script>

<style lang="scss">
</style>
