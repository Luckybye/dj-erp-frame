<template lang="html">
  <ideal-form v-ref:ideal-form>
    <ideal-table :datas="inquiry" v-ref:datatable>
      <ideal-table-col label="供应商" width="20%">
        <span @click="_self.onEditSupplier(_row)" class="a-link cursor">
          {{_row.x_supplier_id || _row.supplier_name || '——'}}
        </span>
      </ideal-table-col>
      <ideal-table-col label="工厂货号" width="10%" prop="supplier_no">
      </ideal-table-col>
      <ideal-table-col label="价格" width="20%">
        <div v-if="_row.pu_price">
          <!-- {{_row.at_stock==='no' ? '出厂价' : '入仓价'}} -->
          {{_row.pu_currency}} {{_row.pu_price}}</div>
      </ideal-table-col>
      <ideal-table-col label="moq" width="10%">
        <div v-if="_row.pu_quantity">{{_row.pu_quantity}} {{_self.viewModel.prod_unit}}</div>
      </ideal-table-col>
      <ideal-table-col label="交货期" width="10%">
        <div>{{_row.delivery_day || '-'}} 天</div>
      </ideal-table-col>
      <ideal-table-col label="状态" width="10%">
        询价
      </ideal-table-col>
      <ideal-table-col label="日期" width="10%">
        <div>{{_row.update_date | timeFormat 'YYYY-MM-DD'}}</div>
      </ideal-table-col>
      <ideal-table-col label="操作" width="10%">
        <ideal-icon-btn skin="red" icon="shanchu" @click="_self.onDeleteSupplier(_row)" v-if="_row.is_default !== 'yes'"></ideal-icon-btn>
        <ideal-icon-btn icon="default" @click="_self.onSetDefault(_row)" :class="[_row.is_default === 'yes' ? 'text-blue' : 'text-grey']"></ideal-icon-btn>
      </ideal-table-col>
      <div slot="nodata">
        暂无询价
      </div>
    </ideal-table>
  </ideal-form>
</template>

<script>
  import Vue from 'vue'
  function initialize () {
    let params = {prod_id: this.payload.prod_id}
    this.$pull.queryProdFactoryByProdId(params).then(data => {
      this.inquiry = data.prod_factorys || []
    })
  }
  function onSaveInner () {
    this.$emit('on-save')
  }

  export default {
    options: {title: 'Products Factory'},
    props: {
      viewModel: {
        type: Object,
        default () {
          return {}
        }
      },
      payload: {
        type: Object,
        default () {
          return {}
        }
      },
      readonly: {
        type: Boolean,
        default: false
      },
      isCn: {
        type: Boolean,
        default: true
      },
      billType: {
        type: String,
        default: 'pm'
      }
    },
    data () {
      return {
        inquiry: []
      }
    },
    methods: {
      onSaveInner,
      initialize,
      onEditSupplier (row) {
        row.prod_id = row.prod_id || this.payload.prod_id
        let params = {
          supplier: row,
          unit: this.viewModel.prod_unit
        }
        this.$dialog.EditSupplier(params, (data) => {
          let p
          if (!this.inquiry.length) {
            p = this.onSetDefault(data)
          } else {
            p = this.onSaveFactory(data)
            if (data.is_default === 'yes') this.onSaveProd(data)
          }
          p.then(() => {
            initialize.call(this)
          })
        })
      },
      onDeleteSupplier (row) {
        this.$request2('/api/product/deleteProdFactory', {factory_id: row.factory_id}).then(() => {
          initialize.call(this)
        })
      },
      onSetDefault (item) {
        if (!item) return
        Vue.set(item, 'is_default', 'yes')
        let ps = [
          this.onSaveProd(item),
          this.onSaveFactory(item)
        ]
        let other = this.inquiry.find(m => m.is_default === 'yes' && m.factory_id !== item.factory_id)
        if (other && other.factory_id) {
          other.is_default = 'no'
          ps.push(this.onSaveFactory(other))
        }
        return this.$Promise.when(ps)
      },
      onSaveProd (item) {
        let v = {}
        if (this.viewModel.is_bom !== 'yes') {
          v.pu_price = item.pu_price
          v.pu_currency = item.pu_currency
        }
        v.moq = item.pu_quantity
        v.supplier_id = item.supplier_id || ''
        v.supplier_no = item.supplier_no || ''
        v.delivery_day = item.delivery_day || ''
        v.at_stock = item.at_stock || 'yes'
        v.prod_id = this.payload.prod_id
        return this.$pull.upsertProduct(v).then(() => {
          this._context.pageEventer.emit('refresh-prod')
        })
      },
      onSaveFactory (data) {
        let url = data.factory_id ? '/api/product/upsertProdFactory' : '/api/product/addProdFactory'
        return this.$request2(url, data).then(data => {})
      }
    },
    created () {
      initialize.call(this)
    }
  }
</script>
