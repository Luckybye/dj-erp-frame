<template>
  <div>
    <more-search
      class="tab-page-header"
      :parts="searchParts"
      :vm="searchModel"
      confirmChange>
      <div class="flex-b">
        <div></div>
        <div>
          <el-button type="primary" class="more--btn">More</el-button>
          <x-input
            v-model="searchModel.fuzzy_value"
            placeholder="输入产品名称"
            :maxlength="100"
            prefix-icon="el-icon-search"
            width="200px"
            blurChange
            clearable
            class="ml10"
            ></x-input>
          <el-button type="primary" @click.stop="onExport">生成Excel</el-button>
        </div>
      </div>
      <x-select :source="priceTypes" :map="{label: 'text', value: 'key'}" slot="price-type" slot-scope="{vmodel, change}" :result="vmodel" field="price_types" @save="change" label="创建方式:" width="100%" multiple clearable></x-select>
    </more-search>
    <x-table :data="datas" :page="searchModel" :getData="refresh" colKey="cust_prod_table_header">
      <x-table-column type="index" width="40"></x-table-column>
      <x-table-column slot="th_main_pic" slot-scope="{col}">
        <t slot="header" path="title" :vm="col" tt>Picture</t>
        <template slot-scope="{ row }">
          <x-td-img :src="row.main_pic" @click="onOpenProd(row)"></x-td-img>
        </template>
      </x-table-column>
      <x-table-column slot="th_prod_desc" slot-scope="{col}">
        <t slot="header" path="title" :vm="col" tt>Description</t>
        <template slot-scope="{ row }">
          <span
            @click="onOpenProd(row)"
            class="a-link cursor line-2"
            title="品名"
          >
            {{ row.prod_name_en || '—' }}
          </span>
          <div class="text-grey" title="货号">{{ row.prod_no }}</div>
        </template>
      </x-table-column>
      <x-table-column slot="th_s_price" slot-scope="{col}">
        <t slot="header" path="title" :vm="col" tt>S.Price</t>
        <template slot-scope="{ row }">
          <div title="客户">{{ row.x_cust_com_id || '—' }}</div>
          <div title="销售价格" class="text-grey">
            {{ row.price || '—' }} ({{ row.currency || '—' }})
          </div>
        </template>
      </x-table-column>
      <x-table-column slot="th_c_item_barcode" slot-scope="{col}">
        <t slot="header" path="title" :vm="col" tt>C.Item/Barcode</t>
        <template slot-scope="{ row }">
          <div title="客户货号">{{ row.cust_prod_no || '—' }}</div>
          <div class="text-grey" title="客户条形码">
            {{ row.cust_prod_barcode || '—' }}
          </div>
        </template>
      </x-table-column>
      <x-table-column slot="th_c_hscode_tariff" slot-scope="{col}">
        <t slot="header" path="title" :vm="col" tt>C.Hscode/Tariff</t>
        <template slot-scope="{ row }">
          <div title="进口海关编码">{{ row.cust_hs_code || '—' }}</div>
          <div class="text-grey" title="进口关税率">
            {{ row.tariff || '—' }}
          </div>
        </template>
      </x-table-column>
      <x-table-column slot="th_supplier" slot-scope="{col}">
        <t slot="header" path="title" :vm="col" tt>Supplier</t>
        <template slot-scope="{ row }">
          <div title="供应商">{{ row.x_supplier_id || '—' }}</div>
          <div class="text-grey" title="采购价格">
            {{ row.pu_price || '—' }} ({{ row.pu_currency || '—' }})
          </div>
        </template>
      </x-table-column>
      <x-table-column slot="th_term_pol" slot-scope="{col}">
        <t slot="header" path="title" :vm="col" tt>Term/POL</t>
        <template slot-scope="{ row }">
          <div title="条款">{{ row.trade_term || '—' }}</div>
          <div title="起运港" class="text-grey">{{ row.x_load_port_en || '—' }}</div>
        </template>
      </x-table-column>
      <x-table-column slot="th_info" slot-scope="{col}">
        <t slot="header" path="title" :vm="col" tt>Info</t>
        <template slot-scope="{ row }">
          <div title="">{{ row.x_update_user_en || row.x_update_user || '—' }}</div>
          <div title="" class="text-grey">
            {{ row.update_date | timeFormat }}
          </div>
          <div class="创建方式">{{ (priceTypesMap[row.price_type] || {}).text}}</div>
        </template>
      </x-table-column>
    </x-table>
  </div>
</template>

<script>
export default {
  data () {
    let priceTypes = [
      {text: '手动新增', text_en: '手动新增', key: 'edit'},
      {text: '订单', text_en: '订单', key: 'sc'},
      {text: '报价', text_en: '报价', key: 'quote'},
    ]
    return {
      datas: [],
      searchModel: {
        date_start: '',
        date_end: '',
        supplier_ids: [],
        cust_com_ids: [],
        price_types: [],
        fuzzy_value: ''
      },
      priceTypes,
      priceTypesMap: priceTypes._object('key'),
      searchParts: [
        {part: 'select-cust-com', span: 12, field: 'cust_com_ids', label: '客户', key: 'customer', multiple: true, custType: '2'},
        {part: 'select-cust-com', span: 12, field: 'supplier_ids', label: '供应商', key: 'supplier', custType: '4', multiple: true},
        {slot: 'price-type', span: 12, field: 'price_types', label: '创建方式', multiple: true},
        {part: 'select-date-range', span: 12, field: 'date_start', field2: 'date_end', label: '下单时间', key: 'order_date'},
      ],
    }
  },
  methods: {
    initialize () {
      this.searchModel.x_searchLast = 1
    },
    refresh () {
      let para = {...this.searchModel}._trim()
      this.exp_id = ''
      return this.$request('/api/product/queryCustomProducts', para, {loading: true}).then((res) => {
        this.datas = res.cust_prods
        return res
      })
    },
    async onExport () {
      let param = {...this.searchModel}._trim()
      param.ext_type = 'cust_prod'
      if (!this.exp_id) {
        let d = await this.$request2('/api/manage/createExpCustProd', param)
        this.exp_id = (d.exp_file || {}).exp_id
      }
      this.openExportList(this.exp_id)
    },
    openExportList () {
      this.$message('正在生成excel，请稍候点击刷新按钮查看')
      this.$tab.open({
        path: 'ExportList',
        tab_id: this.exp_id || 'export_list',
        title: '下载列表'
      })
    },
    onOpenProd (bill) {
      let title = bill.prod_name || bill.prod_name_en || 'Product Info'
      let opts = {
        title,
        path: 'PmEdit',
        tab_id: bill.prod_id,
        query: {
          prod_id: bill.prod_id,
          bill_prod_id: bill.bill_prod_id,
          bill_id: bill.contract_id,
          show: 'PmCustomer'
        },
      }
      this.$tab.open(opts)
    }
  },
  created () {
    if (this.payload.params) {
      Object.assign(this.searchModel, this.payload.params)
    }
    this.initialize()
  }
}
</script>

<style lang="scss"></style>
