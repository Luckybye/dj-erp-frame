<template lang="html">
  <div class="sc-shipping-plan">
    <x-table :data="datas" default-expand-all row-key="bill_prod_id"
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}" colKey="sc_sp_prod_table_header" :useVirtual="false" fixedHeader>
      <x-table-column width="70">
        <t slot="header" path="no">序号</t>
        <template slot-scope="{row}">
          <span v-if="row.index">{{row.index}}</span>
          <span v-else class="pr5">L</span>
        </template>
      </x-table-column>
      <x-table-column  width="80" slot="th_main_pic" slot-scope="{col}">
        <t slot="header" path="title" :vm="col" tt>产品</t>
        <template slot-scope="{row}">
          <x-td-img :src="row.main_pic" :tao="row.is_bom==='yes'" :zi="row.is_sub_prod === 'yes'" width="50px" @click.native="viewProd(row)"></x-td-img>
        </template>
      </x-table-column>
      <!-- <x-table-column min-width="120">
        <t slot="header" path="sc.desc">描述</t>
        <template slot-scope="{row}">
          <div class="line-2">{{$tt(row, 'prod_name')}}</div>
          <div class="text-grey">{{row.prod_no}}</div>
        </template>
      </x-table-column> -->
      <!-- <x-table-column width="100">
        <t slot="header" path="sc.model">型号</t>
        <template slot-scope="{row}">
          <div>{{row.model || '-'}}</div>
          <div class="text-grey">{{row.original_prod_no}}</div>
        </template>
      </x-table-column> -->
      <x-table-column sortable="custom" prop="etd_date" slot="th_sc_etd" slot-scope="{col}" width="120">
        <t slot="header" path="title" :vm="col" tt>销售订单/计划出运</t>
        <template slot-scope="scope">
          <div title="销售订单">{{ scope.row.contract_no }}</div>
          <div title="计划出运" :class="{'text-bold': scope.row.is_delay==='delay', 'text-danger': scope.row.is_delay==='forward'}">{{ scope.row.etd_date | timeFormat }}</div>
        </template>
      </x-table-column>
      <x-table-column sortable="custom" prop="delivery_date" slot="th_sup_dd" slot-scope="{col}" width="120">
        <t slot="header" path="title" :vm="col" tt>供应商/承诺交货</t>
        <template slot-scope="scope">
          <div title="供应商名称">{{ scope.row.x_seller_id }}</div>
          <div title="承诺交货" :class="{'text-danger': scope.row.is_pu_delay==='delay', 'text-bold': scope.row.is_pu_delay==='forward'}">{{ (scope.row.delivery_date) | timeFormat }}</div>
        </template>
      </x-table-column>
      <x-table-column sortable="custom" prop="crd_date" slot="th_qty_crd" slot-scope="{col}" width="120">
        <t slot="header" path="title" :vm="col" tt>数量/实际交货</t>
        <template slot-scope="{row}">
          <div>
            <span title="数量">{{(row.is_load === 'yes' ? row.load_quantity : row.quantity) || row.sell_quantity}}</span>
            {{row.prod_unit}}
          </div>
          <div>
            <span title="实际交货" :class="'text-'+getStatus(row, 'crd_date')">{{row.crd_date | timeFormat }}</span>
          </div>
        </template>
      </x-table-column>
      <!-- <x-table-column width="100">
        <t slot="header" path="sc.load_unload_port">起运港/目的港</t>
        <template slot-scope="{row}">
          <div>{{row.x_load_port_en}}</div>
          <div class="text-grey">{{row.x_unload_port_en}}</div>
        </template>
      </x-table-column> -->
      <!-- <x-table-column width="100">
        <t slot="header" path="sc.gw_ctn_cbm">毛件体</t>
        <div slot-scope="{row}">
          <div>{{row.total_gw | fthousands(2)}}</div>
          <div class="text-grey">{{row.total_ctn | fthousands(2)}}</div>
          <div>{{row.total_cbm | fthousands(2)}}</div>
        </div>
      </x-table-column> -->
      <!-- <x-table-column width="100">
        <t slot="header" path="sc.sale_trace_user">销售员/跟单员</t>
        <template slot-scope="{row}">
          <div>{{$tt(row, 'x_create_user')}}</div>
          <div class="text-grey">{{$tt(row, 'x_operator')}}</div>
        </template>
      </x-table-column> -->
      <x-table-column width="80" slot="th_action" slot-scope="{col}">
        <t slot="header" path="title" :vm="col" tt>操作</t>
        <template slot-scope="{row}" class="lh-20" v-if="!row.isMain && row.is_order !== 'yes'">
          <div v-if="row.busi_status === 'cancel'" class="lh-30">
            <div><t class="text-danger" path="sc.canceled_ship">已取消出运</t></div>
            <!-- <div><t class="a-link" path="sc.recall_cancel_ship" @click="recallCancel(row)">撤回</t></div> -->
          </div>
          <div v-else class="lh-20">
            <!-- <div><t class="a-link" path="sc.delay_ship" @click="updateProdEtd(row)">延期出运</t></div>
            <div><t class="a-link" path="sc.split_ship" @click="inBatch(row)">分批出运</t></div>
            <div><t class="a-link" path="sc.cancel_ship" @click="cancelShip(row)">取消出运</t></div> -->
            <div><t class="a-link" path="sc.change" @click="shippingPlanChange(row)">变更</t></div>
          </div>
          <div v-if="row.is_order==='no' && row.is_delivery==='no' && (row.is_split==='yes' || row.is_pu_split==='yes') && row.busi_status==='normal'">
            <div><t class="a-link" path="sc.combine" @click="onCombineOrders(row)">合并</t></div>
          </div>
        </template>
      </x-table-column>
    </x-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      datas: []
    }
  },
  computed: {
  },
  methods: {
    async initialize () {
      this.getDatas()
      // this.queryContract()
    },
    async queryBillProdList (opt) {
      let para = {
        bill_type: 'PI',
        bill_id: this.payload.bill_id,
        need_mg: 1,
        need_nature: 'yes'
      }
      let v = await this.$get('/api/business/queryBillProdList', para._trim(), {...opt})
      return v
    },
    async queryOrderList (opt) {
      let para = {
        contract_id: this.payload.bill_id, page_index: 1, page_size: 1000, need_cancel: 'yes'
      }
      let v = await this.$get('/api/business/queryShippingPlanProds', para._trim(), {...opt})
      return v
    },
    async getDatas (opt) {
      let [v, v2] = await Promise.all([
        this.queryOrderList(opt),
        this.queryBillProdList(opt),
      ])
      let ordersGroup = v.pi_orders.toGroup('pi_prod_id')
      this.datas = v2.pi_prods.map((m, index) => {
        m.natureMap = (m.natures || [])._object('nature_id')
        delete m.natures
        m.index = index + 1
        m.children = ordersGroup[m.bill_prod_id] || []
        if (m.children.length === 1) {
          return {...m.children[0], index: index + 1}
        } else m.isMain = true
        // m.children.forEach(child => {
        //   child.index = 1 +
        // })
        return m
      })
    },
    viewProd (row) {
      this.$tab.open({
        title: row.prod_no,
        tab_id: row.pi_prod_id,
        path: 'OrderEdit',
        query: {
          bill_prod_id: row.pi_prod_id,
          show: 'OrderShippingPlan'
        }
      })
    },
    shippingPlanChange (v) {
      this.$dialog.ShippingPlanChange({order: v}, async d => {
        await this.$post2('/api/business/divideOrders', {
          type: 'sell',
          ...d,
          bill_prod_id: v.bill_prod_id,
        }, {loading: true})
        this.getDatas({loading: false})
      })
    },
    getStatus(row, key) {
      if (row.is_delay === 'delay' && key === 'etd_date') return 'bold'
      if (row.is_delay === 'forward' && key === 'etd_date') return 'red'
      if (row.is_pu_delay === 'delay' && key === 'crd_date') return 'red'
      if (row.is_pu_delay === 'forward' && key === 'crd_date') return 'bold'
      return ''
    },
    inBatch (v) {
      this.$dialog.ScInBatchProd({order: v}, async d => {
        await this.$post2('/api/business/divideOrders', {
          type: 'sell',
          ...d,
          bill_prod_id: v.bill_prod_id,
        })
        this.getDatas({loading: false})
      })
    },
    updateProdEtd (v) {
      this.$dialog.UpdateProdEtd({vm: {etd_date: v.etd_date, reason: v.delay_desc}}, async d => {
        await this.$post2('/api/business/updateEtdDate', {
          pi_orders: [{
            bill_prod_id: v.bill_prod_id,
            reason: d.reason
          }],
          etd_date: d.etd_date
        })
        this.getDatas({loading: false})
      })
    },
    async cancelShip (v) {
      this.$dialog.CancelShip({vm: {reason: v.reason}}, async d => {
        await this.$post2('/api/business/cancelOrder', {
          bill_prod_id: v.bill_prod_id,
          reason: d.reason
        })
        this.getDatas({loading: false})
      })
    },
    recallCancel () {},
    onCombineOrders (row) {
      console.log('data: 111', row)
      this.$dialog.ScCombineOrder({order: row}, async d => {
        await this.$post2('/api/business/combineOrders', {
          bill_prod_ids: d,
        }, {loading: true})
        this.getDatas({loading: false})
      })
    }
  },
  created() {
    this.initialize()
  },
  beforeDestroy() {}
}
</script>
<style lang="scss">
.sc-shipping-plan {}
</style>
