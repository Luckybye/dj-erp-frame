<template lang="html">
  <div class="sc-prod-list">
    <x-table :data="datas" @selection-change="handleSelectionChange"
    :row-style="getStyle" :rowHeight="80" row-key="bill_prod_id" colKey="pre_sc_prod_table_header" class="have-expand" :cell-class-name="handlerExpand">
      <x-table-column resizable type="selection" width="30">
      </x-table-column>
      <x-table-column resizable  width="100" slot="th_main_pic" slot-scope="{col}">
        <t slot="header" path="title" :vm="col" tt>产品</t>
        <template slot-scope="{row}">
          <x-td-img :src="row.main_pic" width="50px" :tao="row.is_bom==='yes'" @click.native="viewProd(row)" @click-icon="viewProd(row, 'ScBom')"></x-td-img>
        </template>
      </x-table-column>
      <x-table-column resizable width="100" slot="th_sell_quantity" slot-scope="{col}">
        <t slot="header" path="title" :vm="col" tt>数量</t>
        <template slot-scope="{row}">
          <x-input :disabledMap="disabledMap" :result="row" field="sell_quantity" width="100%" @blur-change="onEditQuantity(row)" v-input="{rule: 'integer'}" :disabled="disabled"></x-input>
        </template>
      </x-table-column>
      <x-table-column resizable width="100" slot="th_sell_price" slot-scope="{col}">
        <t slot="header" path="title" :vm="col" tt>价格</t>
        <template slot-scope="{row}">
          <x-input :disabledMap="disabledMap" :result="row" field="sell_price" width="100%" @save="onSave" v-input="{rule: 'number'}" :disabled="disabled || !edit_auth"></x-input>
        </template>
      </x-table-column>
      <x-table-column resizable width="160" sortable :sort-by="v => onSort(v, 'etd_date')" slot="th_etd_date" slot-scope="{col}">
        <t slot="header" path="title" :vm="col" tt>出运日</t>
        <template slot-scope="{row}">
          <select-date :result="row" field="etd_date" width="100%" @save="onEditEtd" :disabled="disabled"></select-date>
        </template>
      </x-table-column>
      <x-table-column resizable width="160" sortable  :sort-by="v => onSort(v, 'delivery_date')" slot="th_delivery_date" slot-scope="{col}">
        <t slot="header" path="title" :vm="col" tt>交货日</t>
        <template slot-scope="{row}">
          <select-date :result="row" field="delivery_date" width="100%" @save="onSave" :disabled="disabled"></select-date>
        </template>
      </x-table-column>
      <x-table-column resizable width="100" slot="th_sc_prod_status" slot-scope="{col}">
        <t slot="header" path="title" :vm="col" tt>状态</t>
        <span slot-scope="{row}" :title="row.delay_desc">
          <t :path="getStatus(row).key">{{getStatus(row).dflt}}</t>
          <div class="line-1 text-grey">{{row.delay_desc}}</div>
        </span>
      </x-table-column>
      <x-table-column resizable slot="th_sc_supplier" slot-scope="{col}">
        <t slot="header" path="title" :vm="col" tt>供应商</t>
        <template slot-scope="{row}" v-if="row.is_bom !== 'yes'">
          <div class="a-link" @click="selectSup(row)" :class="{'dd-link':disabled || row.purchase_id || row.prod_source!=='purchase'}">{{ row.x_seller_id || '-' }}</div>
        </template>
      </x-table-column>
      <x-table-column resizable slot="th_prod_source" slot-scope="{col}" width="120">
        <t slot="header" path="title" :vm="col" tt>备货</t>
        <template slot-scope="{row}" v-if="row.is_bom !== 'yes'">
          <select-stock-type :result="row" field="prod_source" width="100px" @change="selectStockType(row)" :disabled="disabled"></select-stock-type>
        </template>
      </x-table-column>
      <x-table-column resizable width="70" v-if="!disabled" slot="th_action" slot-scope="{col}">
        <t slot="header" path="title" :vm="col" tt>操作</t>
        <div slot-scope="{row, $index}" class="lh-30">
          <div class="lh-n"><t class="a-link" path="change_prod" @click="changeProd(row)">换货</t></div>
          <div><t class="d-link" path="delete" @click="onDelete(row, $index)">删除</t></div>
        </div>
      </x-table-column>
      <x-table-column width="1" slot="expand">
        <template slot-scope="{row}">
          <div class="expand-text pl10">{{onValidate(row)}}</div>
        </template>
      </x-table-column>
      <x-table-column width="20" type="expand">
        <div slot-scope="{ row }" class="pb10" v-if="row.suites && row.suites.length">
          <table class="el-table2 small underline">
            <thead>
              <th class="expand-icon"></th>
              <th>序号</th>
              <th>产品</th>
              <th>描述</th>
              <th>型号</th>
              <th>比例</th>
              <th>数量</th>
              <th>备货</th>
              <th>采购价</th>
              <th>供应商</th>
              <th>操作</th>
            </thead>
            <tbody>
              <tr v-for="(item, i) in row.suites" :key="item.bill_prod_id">
                <td class="expand-icon text-left">
                  <el-checkbox @change="onSelectBom(item)"></el-checkbox>
                  <span class="ml15">L</span>
                </td>
                <td>
                  {{i + 1}}
                  <div class="expand-text pl10">{{onValidate(item, 'suite')}}</div>
                </td>
                <td>
                  <x-td-img :src="item.main_pic" :zi="true" @click.native="viewProd(item)"></x-td-img>
                </td>
                <td>
                  <div class="line-2">{{item.prod_name_en || item.prod_name}}</div>
                  <div class="text-grey">{{item.prod_no}}</div>
                </td>
                <td>
                  <div>{{item.model}}</div>
                  <div class="text-grey">{{item.original_prod_no}}</div>
                </td>
                <td>{{item.sub_rate}}</td>
                <td>
                  <x-input :disabledMap="disabledMap" :result="item" field="sell_quantity" width="100px" @blur-change="onEditQuantity(item, row)" v-input="{rule: 'integer'}" :disabled="disabled"></x-input>
                </td>
                <td>
                  <select-stock-type :result="item" field="prod_source" width="100px" :disabled="disabled" @change="selectStockType(item)"></select-stock-type>
                </td>
                <td>
                  <x-input :disabledMap="disabledMap" :result="item" field="pu_price" width="100px" @save="onSave" v-input="{rule: 'number'}" :disabled="disabled"></x-input>
                </td>
                <td>
                  <div class="a-link" @click="selectSup(item)" :class="{'dd-link':disabled || item.purchase_id || item.prod_source==='undo'}">{{ item.x_seller_id || '-' }}</div>
                </td>
                <td>
                  <div><t class="d-link" path="delete" @click="onDelete(item)">删除</t></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </x-table-column>
    </x-table>
    <div class="text-right lh-30">
      <span class="load-info mr20">
        <t slot="header" path="estimated_capacity" colon class="mr5">预估装柜量:</t>
        <span>{{loadInfo}}</span>
      </span>
      <span class="mr15" v-if="prodTotal.rate > 0">
        <span class="text-main">C{{prodTotal.rate}}: </span>
        <span class="underline">{{payload.currency | currencyFormat}} {{prodTotal.discount.fthousands(2)}}</span>
      </span>
      <span class="mr15" v-if="prodTotal.adjust_fee > 0">
        <t class="text-main" path="sc.adjust" colon>Adjust: </t>
        <span class="underline">{{currency | currencyFormat}} {{prodTotal.adjust_fee.fthousands(2)}}</span>
      </span>
      <t class="text-main" path="sc.total" colon>Total: </t>
      <span>
        <span class="underline mr10">{{prodTotal.qty}} UNITS</span>
        <span class="underline mr10">{{prodTotal.ctn}} CTNS</span>
        <span class="underline mr10">{{prodTotal.cbm.toFixed(3)}} CBM</span>
        <span class="underline mr10">{{payload.currency | currencyFormat}} {{prodTotal.amount.fthousands(2)}}</span>
      </span>
    </div>
  </div>
</template>
<script>
import Mixins from './prod-list-mixins';
export default {
  mixins: [Mixins],
  props: {
  },
  data() {
    return {
      selection: [],
      edit_auth: true,
    }
  },
  computed: {
  },
  methods: {
    onSave (v, {bill_prod_id}) {
      let para = {
        ...v,
        bill_prod_id
      }
      return this.$post('/api/business/updatePiProd', para, {loading: false})
    },
    getStatus ({vend_busi_status: vend, is_plan_delay: delay, is_plan_split: split, busi_status: busi}) {
      if (busi === 'delete') return {key: 'sc.stop_sell', dflt: '淘汰'}
      if (vend === 'free') return {key: 'sc.prod_status_unnotice', dflt: '未通知'}
      if (vend === 'pending') return {key: 'sc.prod_status_unreply', dflt: '未回复'}
      if (split === 'yes') return {key: 'sc.prod_status_split', dflt: '分批'}
      if (delay === 'delay') return {key: 'sc.prod_status_delay', dflt: '延期'}
      if (delay === 'normal' || delay === 'forward') return {key: 'sc.prod_status_normal', dflt: '正常'}
      if (vend === 'confirmed') return {key: 'sc.prod_status_normal', dflt: '正常'}
      return {}
    },
    getStyle ({row: {vend_busi_status: vend, is_plan_delay: delay, is_plan_split: split, busi_status: busi}}) {
      if (vend === 'free') return {}
      if (busi === 'delete') return {background: 'rgba(24,139,141,.1)'}
      if (split === 'yes' || delay === 'delay') return {background: 'rgba(245,34,45,0.15)'}
      return {}
    },
    changeProd (v) {
      this.$dialog.ChangeProd({prod: v}, async d => {
        await this.$post2('/api/business/replacePiProduct', {...d, bill_prod_id: v.bill_prod_id})
        this.$emit('refresh')
      })
    },
    handleSelectionChange (val) {
      this.selection = val
    },
    onSelectBom (val) {
      let i = this.selection.findIndex(f => f.bill_prod_id === val.bill_prod_id)
      if (i >= 0) {
        this.selection.splice(i, 1)
      } else this.selection.push(val)
    },
    handlerExpand ({row}) {
      if (row.is_bom === 'yes' && row.suites && row.suites.length) return ''
      return 'hidden-expand-icon'
    },
    selectStockType({prod_source, ...item}) {
      item.seller_id = ''
      item.x_seller_id = ''
      this.onSave({prod_source, seller_id: item.seller_id}, item)
    },
    getConfig(field) {
      this.$cache.getUserAuth(this.$state('me').user_id, true).then(config => {
        this.edit_auth = (config[field] || {}).edit_prod_price === 'yes'
      })
    }
  },
  created() {
    this.getConfig('order_auth')
  },
  beforeDestroy() {}
}
</script>
<style lang="scss">
.sc-prod-list {}
</style>
