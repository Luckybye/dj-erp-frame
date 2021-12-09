<template lang="html">
  <div class="sc-cancel-prods">
    <div class="tab-page-header clearfix mb0" v-tr-dom>

      <el-button type="primary" @click="onSort">
        <t path="sort">排序</t>
      </el-button>
      <el-button type="primary" @click="onBatchDelete">
        <t path="batch_delete">批量删除</t>
      </el-button>
      <el-dropdown placement="bottom" @command="handleCommand" class="ml10">
        <el-button type="primary">
          <i class="el-icon-plus"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown" class="text-center">
          <el-dropdown-item command="addProd" v-if="!disabled">
            <el-button type="text">
              <t path="sc.catalog">Catalog</t>
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item command="selectOrder">
            <el-button type="text">
              <t path="qu.ordered">Shipping Plan</t>
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item command="selectQuProd">
            <el-button type="text">
              <t path="qu.quotation">Quotation</t>
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item command="selectCustProd">
            <el-button type="text">
              <t path="qu.customer">Customer</t>
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item command="uploadExcel" v-if="!disabled">
            <el-button type="text">
              <t path="sc.excel">Excel</t>
            </el-button>
          </el-dropdown-item>
          <el-dropdown-item command="addSpareProd" v-if="!disabled">
            <el-button type="text">
              <t path="sc.sparepart">Spare Part</t>
            </el-button>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <sc-canceled-prod-list :datas="datas" :payload="payload" :scConfig="scConfig" ref="prodTables"  @refresh="getDatas({loading: false})"></sc-canceled-prod-list>

  </div>
</template>
<script>
import prodMixins from './sc-prods-mixins'
export default {
  mixins: [prodMixins],
  data() {
    return {
      datas: [],
      scConfig: {},
      disabled: false
    }
  },
  components: {
    ScCanceledProdList: require('./sc-canceled-prod-list.vue').default
  },
  computed: {
  },
  watch: {
  },
  methods: {
    async initialize () {
      this.getDatas()
      this.getScConfig()
    },
    async getDatas (opt) {
      let [v, v2] = await Promise.all([
        this.queryOrderList(opt),
        this.queryBillProdList(opt),
      ])
      let ordersGroup = v.pi_orders.toGroup('pi_prod_id')
      let handlerProd = (m, parent) => {
        m.sell_quantity = m.sell_quantity || ''
        if (parent) {
          m.is_order = parent.is_order
          m.is_delivery = parent.is_order
          m.is_qty_editable = parent.is_qty_editable
          m.is_st = parent.is_st
        } else {
          let orders = ordersGroup[m.bill_prod_id] || []
          m.is_order = orders.find(item => item.is_order === 'yes') ? 'yes' : 'no'
          m.is_delivery = orders.find(item => item.is_delivery === 'yes') ? 'yes' : 'no'
          m.is_qty_editable = orders.length === 0 || (orders.every(item => item.is_delivery === 'no' && item.is_order === 'no'))
          m.is_st = orders.find(item => item.is_st === 'yes') ? 'yes' : 'no'
        }
      }
      this.datas = v2.pi_prods.map((m, index) => {
        m.index = index + 1
        handlerProd(m)
        if (m.suites) {
          m.suites.forEach(f => {
            f.parent_index = index
            handlerProd(f, m)
          })
        }
        return m
      })
    },
    async queryBillProdList (opt) {
      let para = {
        bill_type: 'PI',
        bill_id: this.payload.bill_id,
        need_mg: 1,
        need_nature: 'yes',
        need_suite: 'yes'
      }
      let v = await this.$get('/api/business/queryBillProdList', para._trim(), {...opt})
      return v
    },
    async queryOrderList (opt) {
      let para = {
        contract_id: this.payload.bill_id, page_index: 1, page_size: 1000
      }
      let v = await this.$get('/api/business/queryShippingPlanProds', para._trim(), {...opt})
      return v
    },
    async onBatchDelete () {
      let selectArr = [this.$refs.prodTables]
      let ids = selectArr.flatMap(m => m.selection).map(m => m.bill_prod_id)
      if (!ids.length) return this.$message(this.$t('pls_select_prod'))
      await this.$confirm(this.$t('delete_tip'), this.$t('dialog_tip'), {type: 'warning'})
      await this.$post2('/api/business/deletePiProds', {bill_prod_ids: ids}, {loading: false})
      this.getDatas({loading: false})
    },
  },
  created() {
    this.$tab.on('refresh-prod', this.getDatas)
    this.initialize()
  },
  beforeDestroy() {
    this.$tab.remove('refresh-prod', this.getDatas)
  }
}
</script>
<style lang="scss">
.sc-cancel-prods {
  .el-collapse {
    .el-collapse-item__header {
      height: 65px;
      background:rgba(241,243,248,1);
      padding-left: 20px;
      padding-right: 10px;
      .sup-info {
        line-height: 20px;
        flex: 1;
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        margin-right: 30px;
        &>span{
          display: inline-block;
          height: auto;
          margin-right: 20px;
        }
      }
    }
  }
}
</style>
