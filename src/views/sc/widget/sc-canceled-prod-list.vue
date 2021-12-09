<template lang="html">
  <div class="sc-canceled-prod-list">
    <x-table :data="datas" @selection-change="handleSelectionChange" :rowHeight="80" row-key="bill_prod_id" class="have-expand self-expand" :tree-props="treeProps" ref="table" v-if="datas.length">
      <x-table-column type="selection" width="30" :selectable="selectable">
      </x-table-column>
      <!-- <x-table-column type="index" width="50">
      </x-table-column> -->
      <x-table-column width="50" label="#">
        <template slot-scope="{ row }">
          <span>{{row.index}}</span>
          <div class="self-expand-icon" @click="handlerExpand(row, $event)" v-if="row.is_bom==='yes'">
            <i class="el-icon-arrow-right"></i>
          </div>
        </template>
      </x-table-column>
      <x-table-column  width="70">
        <t slot="header" path="product">产品</t>
        <div slot-scope="{row}" @click="viewProd2(row)">
          <x-td-img :src="row.main_pic" width="50px" :tao="row.is_bom === 'yes'" @click-icon="viewProd2(row, 'ScBom')" @click.native="viewProd2(row)"></x-td-img>
        </div>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="prod_spec">描述</t>
        <div slot-scope="{row}">
          <div>{{row.prod_name_en}}</div>
          <div>{{row.prod_no}}</div>
        </div>
      </x-table-column>
      <x-table-column width="100">
        <t slot="header" path="quantity">数量</t>
        <div slot-scope="{row}">
          <x-input :disabled="!row.is_qty_editable" :result="row" field="sell_quantity" width="100%" @blur-change="onEditQuantity(row, datas[row.parent_index])" v-input="{rule: 'integer'}"></x-input>
        </div>
      </x-table-column>
      <x-table-column width="100">
        <t slot="header" path="price" >价格</t>
        <template slot-scope="{row}">
          <x-input :disabled="row.is_st === 'yes' || !edit_auth" :result="row" field="sell_price" width="100%" @save="onSave" v-input="{rule: 'number'}"></x-input>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="purchase">采购</t>
        <template slot-scope="{row}">
          <el-button type="text" @click="viewPu(row)">
            {{ row.purchase_no || '-' }}
          </el-button>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="seller">供应商</t>
        <template slot-scope="{row}">
          <el-button type="text" @click="selectSup(row)" :disabled="row.busi_status === 'cancel'">
            {{ row.x_seller_id || '-' }}
          </el-button>
        </template>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="sc.is_delivery">发货清单</t>
        <div slot-scope="{row}">
          <div>{{row.is_delivery === 'yes' ? 'yes' : 'no'}}</div>
        </div>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="sc.is_order">托单</t>
        <div slot-scope="{row}">
          <div>{{row.is_order === 'yes' ? 'yes' : 'no'}}</div>
        </div>
      </x-table-column>
      <x-table-column>
        <t slot="header" path="sc.is_st">结算</t>
        <div slot-scope="{row}">
          <div>{{row.is_st === 'yes' ? 'yes' : 'no'}}</div>
        </div>
      </x-table-column>
      <x-table-column width="70">
        <t slot="header" path="action">操作</t>
        <div slot-scope="{row, $index}" class="lh-30">
          <div v-if="row.is_order === 'no' && row.is_delivery === 'no'"><t class="d-link" path="delete" @click="onDelete(row, $index)">删除</t></div>
        </div>
      </x-table-column>
      <x-table-column width="1" slot="expand">
        <template slot-scope="{row}">
          <div class="expand-text pl10">{{onValidate(row)}}</div>
        </template>
      </x-table-column>
    </x-table>
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
    treeProps () {
      let v = this.datas.find(f => f.is_bom === 'yes')
      return v ? {children: 'suites', hasChildren: 'hasChildren'} : undefined
    },
  },
  methods: {
    handlerExpand (row, event) {
      this.$refs.table.toggleRowExpansion(row, event)
    },
    async onSave (v, {bill_prod_id}) {
      let para = {
        ...v,
        bill_prod_id
      }
      let res = await this.$post('/api/business/updatePiProd', para, {loading: false})
      this.onSaveCancel(v, bill_prod_id)
      return res
    },
    onSaveCancel (v, bill_prod_id) {
      let para = {
        ...v,
        bill_prod_id
      }
      return this.$post2('/api/business/updateCanceledProd', para, {loading: false})
    },
    handleSelectionChange (val) {
      this.selection = val
    },
    selectable (row, index) {
      return row.is_order === 'no' && row.is_delivery === 'no'
    },
    viewPu (row) {
      if (!row.purchase_id) return
      this.$tab.open({
        title: row.purchase_no,
        tab_id: row.purchase_id,
        path: 'PuEdit',
        query: {
          bill_id: row.purchase_id
        }
      })
    },
    viewProd2 (v, part) {
      let disabledMap = {
        sell_price: v.is_st === 'yes',
        sell_quantity: !v.is_qty_editable,
        prod_source: v.prod_source === 'purchase'
      }
      this.viewProd(v, part, disabledMap)
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
.sc-canceled-prod-list {}
</style>
