<template>
 <div class="prod-thead-setting">
  <div v-for="items in datas" :key="items.title">
    <div class="title"> {{ $tt(items, 'title') }}</div>
    <div class="button-list">
        <div class="button" v-for="item in items.sub" :key="item.key">
          <div>{{ $tt(item, 'title') }}</div>
          <el-button type="text" @click="onEdit(item)">{{$t('edit')}}</el-button>
        </div>
    </div>
  </div>
 </div>
</template>

<script>
import { getTh } from "./th";
export default {
  options: {
    icon: 'icon-set',
    title: '产品列表配置'
  },
  data() {
    return {
      show: [
        {
          title: '产品',
          title_en: 'Company Product',
          sub: [
            'pm_prod_table_header',
            'shop_prod_table_header',
            'cust_prod_table_header',
            'history_sc_prod_table_header',
            'history_pu_prod_table_header',
            'history_qu_prod_table_header',
          ],
        },
        { title: '报价', title_en: 'Quotation', sub: ['qu_prod_table_header'] },
        {
          title: '外销订单',
          title_en: 'SC Orders',
          sub: [
            'pre_sc_prod_table_header',
            'sup_prod_table_header',
            'sc_prod_table_header',
            'sc_sp_prod_table_header',
            'sc_pu_prod_table_header',
            'sc_pued_prod_table_header',
          ],
        },
        {
          title: '外销出运', title_en: 'Booking',
          sub: [
            'sp_prod_table_header',
            'dg_prod_table_header',
            'dg_part_prod_table_header',
            'dg_sup_prod_table_header',
            'bk_prod_order_table_header',
            'bk_load_order_table_header',
            'select_order_table_header'
          ]
        },
        {
          title: '内销订单',
          title_en: 'SD Orders',
          sub: [
            'pre_sd_prod_table_header',
            'sd_prod_table_header',
            'sd_sp_prod_table_header',
            'sd_pu_prod_table_header',
            'sd_pued_prod_table_header',
          ],
        },
        {
          title: '内销发货',
          title_en: '内销发货',
          sub: [
            'select_sd_oreder_prod_table_header',
            'sd_bk_prod_order_table_header',
            'sd_bk_load_order_table_header',
          ],
        },
        {
          title: '采购',
          title_en: 'Purchase',
          sub: [
            'pre_im_pu_prod_table_header',
            'im_pu_prod_table_header',
            'pu_prod_table_header',
            'select_pu_prod_table_header',
            'pu_sp_prod_table_header',
          ],
        },
        {
          title: '进口/海外仓',
          title_en: 'Im Booking',
          sub: [
            'im_bk_add_prod_table_header',
            'select_ec_prod_table_header',
            'pre_ec_prod_table_header',
            'ec_prod_table_header',
          ]
        },
        {
          title: '统计', title_en: 'Statistics',
          sub: [
            'stats_pm_prod_table_header',
            'stats_pu_prod_table_header',
          ]
        },
      ]
    };
  },
  methods: {
    init() {
      this.datas = this.show.map(m => {
        m.sub = m.sub.map(f => getTh(f))
        return m
      })
    },
    onEdit(item) {
      this.$tab.open({
        title: item.title,
        title_en: item.title_en,
        tab_id: item.key,
        path: 'ProdTheadSettingDetail',
        query: {
          type: item.key,
          filter: item.filter
        }
      })
    }
  },
  created() {
    this.init();
  },
};
</script>
<style lang="scss">
.prod-thead-setting {
  .title {
    padding-left: 10px;
    border-left: 3px solid #000;
    border-color: #409EFF !important;
    color: #409EFF !important;
    margin-top: 10px;
    margin-bottom: 10px;;
  }
  .button-list {
    width: 100%;
    display: inline-block;
    .button {
      display: inline-block;
      border: 1px solid #c0ccda;
      border-radius: 5px;
      padding: 10px;
      width: 25%;
      margin: 0 0 10px 10px;
      text-align: center;
    }
  }
}
</style>