// pm_th,cust_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,pu_th,de_th,dg_th,load_th
import Vue from 'vue'
import {currencyFormat, timeFormat, stockType3} from '@/utils/filters'
const tt = Vue.prototype.$tt
// const t = Vue.prototype.$t
const prodList = [
  {
    id: 'prod_name_en',
    cn: '品名',
    en: 'Description',
    value: row => (tt ? tt(row, 'prod_name') : row.prod_name_en),
    filter:
      'pm_th,cust_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,de_th,dg_th,pu_th,pu_sp_th',
    extend: {
      line: true,
    },
  },
  {
    id: 'material',
    cn: '材质',
    en: 'Material',
    value: row => (tt ? tt(row, 'prod_material') : row.prod_material_en),
    filter:
      'pm_th,cust_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,de_th,dg_th,pu_th,pu_sp_th',
  },
  {
    id: 'prod_spec_en',
    cn: '规格',
    en: 'Specification',
    value: row => (tt ? tt(row, 'prod_spec') : row.prod_spec_en),
    filter:
      'pm_th,cust_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,de_th,dg_th,pu_th,pu_sp_th',
  },
  {
    id: 'packing',
    cn: '包装',
    en: 'Packing',
    value: row => (tt ? tt(row, 'sale_pkg') : row.sale_pkg_en),
    filter:
      'pm_th,cust_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,de_th,dg_th,pu_th,pu_sp_th',
  },
  {
    id: 'decl_name',
    cn: '报关名',
    en: 'Decl Name',
    value: row => (tt ? tt(row, 'decl_name') : row.decl_name_en),
    filter:
      'pm_th,cust_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,de_th,dg_th,pu_th,pu_sp_th',
  },
  {
    id: 'selling_point_en',
    cn: '卖点',
    en: 'Selling Point',
    value: row => (tt ? tt(row, 'selling_point') : row.selling_point_en),
    filter:
      'pm_th,cust_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,de_th,dg_th,pu_th,pu_sp_th',
  },
  {
    id: 'category',
    cn: '品类',
    en: 'Category',
    value: row => (tt ? tt(row, 'x_prod_sort') : row.x_prod_sort_en),
    filter:
      'pm_th,cust_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,de_th,dg_th,pu_th,pu_sp_th',
  },
  {
    id: 'brand_id',
    cn: '品牌',
    en: 'Brand',
    value: row => (tt ? tt(row, 'x_brand_id') : row.x_brand_id_en),
    filter:
      'pm_th,cust_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,de_th,dg_th,pu_th,pu_sp_th',
  },
  {
    id: 'mg_detail',
    cn: '详情',
    en: 'Detail',
    value: row => (tt ? tt(row, 'mg_detail') : row.mg_detail_en),
    filter:
      'pm_th,cust_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,de_th,dg_th,pu_th,pu_sp_th',
  },
  {
    id: 'main_pic',
    cn: '主图',
    en: 'Main Pic',
    slot: 'th_main_pic',
    filter:
      'pm_th,cust_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,de_th,dg_th,pu_th,pu_sp_th',
    extend: {
      single: true,
    },
  },
  {
    id: 'item_no',
    cn: '货号',
    en: 'Item No.',
    value: row => row.sell_prod_no || row.prod_no,
    filter:
      'pm_th,cust_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,de_th,dg_th,pu_th,pu_sp_th',
  },
  {
    id: 'prod_type',
    cn: '产品类型',
    en: 'Product Type',
    value: 'type',
    filter:
      'pm_th,cust_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,de_th,dg_th,pu_th,pu_sp_th',
  },
  {
    id: 'prod_unit',
    cn: '单位',
    en: 'Uint',
    value: 'prod_unit',
    filter:
      'pm_th,cust_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,de_th,dg_th,pu_th,pu_sp_th',
  },
  {
    id: 'model',
    cn: '型号',
    en: 'Model',
    value: 'model',
    filter:
      'pm_th,cust_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,de_th,dg_th,pu_th,pu_sp_th',
  },
  {
    id: 'prod_level',
    cn: '产品等级',
    en: 'Product Level',
    value: 'prod_level',
    filter:
      'pm_th,cust_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,de_th,dg_th,pu_th,pu_sp_th',
  },
  {
    id: 'prod_origin',
    cn: '原产国',
    en: 'Origin',
    value: row => (tt ? tt(row, 'x_origin') : row.x_origin_en),
    filter: 'pm_th,cust_th',
  },
  {
    id: 'prod_barcode',
    cn: '产品条码',
    en: 'Barcode',
    value: 'prod_barcode',
    filter:
      'pm_th,cust_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,de_th,dg_th,pu_th,pu_sp_th',
  },
  {
    id: 'fob_price',
    cn: '销售价',
    en: 'Price',
    value: row => `${currencyFormat(row.currency)}${row.fob_price || '-'}`,
    filter: 'pm_th,cust_th',
    extend: {
      unit: true,
    },
  },
  {
    id: 'fob_currency',
    cn: '销售币种',
    en: 'Currency',
    value: 'currency',
    filter: 'pm_th,cust_th',
  },
  {
    id: 'hs_code',
    cn: '海关码',
    en: 'HS Code',
    value: 'hs_code',
    filter:
      'pm_th,cust_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,de_th,dg_th,pu_th,pu_sp_th',
  },
  {
    id: 'decl_factor',
    cn: '申报要素',
    en: 'Decl Factor',
    value: 'decl_factor',
    filter:
      'pm_th,cust_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,de_th,dg_th,pu_th,pu_sp_th',
  },
  {
    id: 'moq',
    cn: '起订量',
    en: 'MOQ',
    value: 'moq',
    filter: 'pm_th,cust_th',
  },
  {
    id: 'supplier_id',
    cn: '供应商',
    en: 'Supplier',
    value: 'x_supplier_id',
    filter: 'pm_th,cust_th',
  },
  {
    id: 'supplier_no',
    cn: '工厂货号',
    en: 'Supplier Item No.',
    value: 'supplier_no',
    filter:
      'pm_th,cust_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,pu_th,de_th,dg_th',
  },
  {
    id: 'pu_price',
    cn: '采购价',
    en: 'Purchase Price',
    value: row => `${currencyFormat(row.pu_currency)}${row.pu_price || '-'}`,
    filter:
      'pm_th,cust_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,de_th,dg_th,pu_th,pu_sp_th',
  },
  {
    id: 'edit_price',
    cn: '采购价',
    en: 'Purchase Price',
    value: row => `${currencyFormat(row.pu_currency)}${row.pu_price || '-'}`,
    slot: 'th_price',
    filter: 'pu_th',
    extend: {
      edit: true,
    },
  },
  {
    id: 'pu_currency',
    cn: '采购币种',
    en: 'Purchase Currency',
    value: 'pu_currency',
    filter:
      'pm_th,cust_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,de_th,dg_th,pu_th,pu_sp_th',
  },
  {
    id: 'delivery_day',
    cn: '交货期(天)',
    en: 'Leading Time(days)',
    value: 'delivery_day',
    filter:
      'pm_th,cust_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,de_th,dg_th,pu_th,pu_sp_th',
  },
  {
    id: 'load_port',
    cn: '起运港',
    en: 'POL',
    value: row => row.x_load_port_en,
    filter: 'pm_th,cust_th,sp_th,load_th,de_th',
  },
  {
    id: 'unload_port',
    cn: '目的港',
    en: 'POD',
    value: row => row.x_unload_port_en,
    filter: 'sp_th,load_th,de_th',
  },
  {
    id: 'summary',
    cn: '备注',
    en: 'Summary',
    value: 'summary',
    filter: 'pm_th',
  },
  {
    id: 'original_prod_no',
    cn: '原货号',
    en: 'Original Item No.',
    value: 'original_prod_no',
    filter:
      'pm_th,cust_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,pu_th,de_th,dg_th',
  },
  {
    id: 'product_weight',
    cn: '产品净重',
    en: 'Product Weight',
    value: row => row.net_weight + (row.net_weight_unit || 'g'),
    filter:
      'pm_th,cust_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,pu_th,de_th,dg_th',
    extend: {
      unit: true,
    },
  },
  {
    id: 'net_weight_unit',
    cn: '净重单位',
    en: 'Product Weight Unit',
    value: 'net_weight_unit',
    filter:
      'pm_th,cust_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,pu_th,de_th,dg_th',
  },
  {
    id: 'product_size',
    cn: '产品尺寸',
    en: 'Product Size',
    value: row => {
      let isAnhua = window.isAnhua
      let size = row.mg_prod_size || {}
      let text = `${size.length || '-'} × ${size.width || '-'} × ${
        size.height || '-'
      } cm`
      if (isAnhua) {
        text = ''
        if (size.height) text += `H:${size.height} `
        if (size.top_diam) text += `T:${size.top_diam} `
        if (size.diam) text += `D:${size.diam} `
        if (size.btm_diam) text += `B:${size.btm_diam} `
        text += ' cm'
      }
      return text
    },
    filter:
      'pm_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,pu_th,de_th,dg_th',
  },
  {
    id: 'outer_size',
    cn: '外箱尺寸',
    en: 'Carton Size',
    value: row =>
      `${
        (row.pkg || (row.mg_pkgs || [])[0] || {}).carton_size_length || '-'
      } × ${
        (row.pkg || (row.mg_pkgs || [])[0] || {}).carton_size_width || '-'
      } × ${
        (row.pkg || (row.mg_pkgs || [])[0] || {}).carton_size_height || '-'
      } cm`,
    slot: 'th_outer_size',
    filter:
      'pm_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,pu_th,de_th,dg_th',
    extend: {
      edit: true,
    },
  },
  {
    id: 'inner_size',
    cn: '内盒尺寸',
    en: 'Inner Size',
    value: row =>
      `${(row.pkg || (row.mg_pkgs || [])[0] || {}).pkg_size_length || '-'} × ${
        (row.pkg || (row.mg_pkgs || [])[0] || {}).pkg_size_width || '-'
      } × ${
        (row.pkg || (row.mg_pkgs || [])[0] || {}).pkg_size_height || '-'
      } cm`,
    filter:
      'pm_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,pu_th,de_th,dg_th',
  },
  {
    id: 'carton_qty',
    cn: '整箱装量',
    en: 'Carton Qty',
    value: row => {
      let inner =
        (row.pkg || (row.mg_pkgs || [])[0] || {}).inner_pkg_pcs * 1 || 1
      let outer =
        (row.pkg || (row.mg_pkgs || [])[0] || {}).outer_pkg_pcs * 1 || 1
      return row.carton_qty || inner * outer
    },
    filter:
      'pm_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,pu_th,de_th,dg_th',
  },
  {
    id: 'carton_nw',
    cn: '箱净重',
    en: 'N.W.',
    value: row =>
      `${(row.pkg || (row.mg_pkgs || [])[0] || {}).carton_nw || '-'} KGS`,
    filter: 'pm_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,pu_th,de_th',
  },
  {
    id: 'load_nw',
    cn: '箱净重',
    en: 'N.W.',
    value: 'nw',
    filter: 'load_th',
  },
  {
    id: 'load_gw',
    cn: '箱毛重',
    en: 'G.W.',
    value: 'gw',
    filter: 'load_th',
  },
  {
    id: 'load_cbm',
    cn: '箱体积',
    en: 'CBM',
    value: 'cbm',
    filter: 'load_th',
  },
  {
    id: 'load_ctn',
    cn: '件数',
    en: 'CTN',
    value: 'ctn',
    filter: 'load_th',
  },
  {
    id: 'carton_gw',
    cn: '箱毛重',
    en: 'G.W.',
    value: row =>
      `${(row.pkg || (row.mg_pkgs || [])[0] || {}).carton_gw || '-'} KGS`,
    filter: 'pm_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,pu_th,de_th',
  },
  {
    id: 'cbm',
    cn: '箱体积',
    en: 'CBM',
    value: row =>
      ((row.pkg || (row.mg_pkgs || [])[0] || {}).cbm * 1 || 0).toFixed(3),
    filter: 'pm_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,pu_th,de_th,dg_th',
  },
  {
    id: 'loading_qty',
    cn: '装箱量',
    en: 'Loading Qty(20GP/40GP/40HC)',
    value: row =>
      `${(row.pkg || (row.mg_pkgs || [])[0] || {}).gp20 || '-'}/${
        (row.pkg || (row.mg_pkgs || [])[0] || {}).gp40 || '-'
      }/${(row.pkg || (row.mg_pkgs || [])[0] || {}).hc40 || '-'}`,
    filter: 'pm_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,pu_th,de_th,dg_th',
  },
  {
    id: 'is_spare',
    cn: '是否有配件',
    en: 'With Spare',
    value: row => row.is_spare,
    filter: 'pm_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,pu_th,de_th,dg_th',
  },
  {
    id: 'shop_status',
    cn: '是否上架状态',
    en: 'On the Shelf',
    value: row => row.shop_status,
    filter: 'pm_th',
  },
  {
    id: 'prod_see',
    cn: '产品可见',
    en: 'Visible ',
    value: 'prod_see',
    filter: 'pm_th',
  },
  {
    id: 'prod_sell',
    cn: '产品可销',
    en: 'Sellable ',
    value: 'prod_sell',
    filter: 'pm_th',
  },
  {
    id: 'sn_price',
    cn: '内销价',
    en: 'Price',
    value: row => `${currencyFormat(row.sn_currency)} ${row.sn_price || '-'}`,
    filter: 'pm_th',
  },
  {
    id: 'sn_currency',
    cn: '内销价币种',
    en: 'Currency',
    value: 'sn_currency',
    filter: 'pm_th',
  },
  {
    id: 'create_user',
    cn: '创建人',
    en: 'Creater',
    value: row => tt(row, 'x_create_user'),
    filter: 'pm_th,cust_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,pu_th,de_th,dg_th',
  },
  {
    id: 'create_date',
    cn: '创建时间',
    en: 'Create Date',
    value: row => timeFormat(row.create_date),
    filter: 'pm_th,cust_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,pu_th,de_th,dg_th',
  },
  {
    id: 'update_user',
    cn: '更新人',
    en: 'Updater',
    value: row => tt(row, 'x_update_user'),
    filter: 'pm_th,cust_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,pu_th,de_th,dg_th',
  },
  {
    id: 'update_date',
    cn: '更新时间',
    en: 'Update Date',
    value: row => timeFormat(row.update_date),
    filter: 'pm_th,cust_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,pu_th,de_th,dg_th',
  },
  {
    id: 'owner_id',
    cn: '产品经理',
    en: 'PM',
    value: row => tt(row, 'x_owner_id'),
    filter: 'pm_th,cust_th',
  },
  {
    id: 'sup_info',
    cn: '供应商',
    en: 'Supplier',
    value: '',
    slot: 'th_sup_info',
    filter: 'pm_th',
    extend: {
      single: true,
    },
  },
  {
    id: 'information',
    cn: '信息',
    en: 'Information',
    value: '',
    slot: 'th_info',
    filter: 'pm_th',
    extend: {
      single: true,
    },
  },
  {
    id: 'busi_group_id',
    cn: '部门',
    en: 'Department',
    value: row => tt(row, 'x_busi_group_id'),
    filter: 'pm_th',
  },
  {
    id: 'legal_id',
    cn: '法人公司',
    en: 'Corporations',
    value: row => tt(row, 'x_legal_id'),
    filter: 'pm_th',
  },
  {
    id: 'cust_po_no',
    cn: '客户PO',
    en: 'Cust PO.',
    value: 'cust_po_no',
    filter: 'qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,pu_th,de_th,dg_th',
  },
  {
    id: 'cust_prod_no',
    cn: '客户货号',
    en: 'Cust Item.',
    value: 'cust_prod_no',
    filter: 'qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,pu_th,de_th,dg_th,cust_th',
  },
  {
    id: 'cust_prod_barcode',
    cn: '客户条码',
    en: 'Cust Barcode',
    value: 'cust_prod_barcode',
    filter: 'qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,pu_th,de_th,dg_th,cust_th',
  },
  {
    id: 'qu_price',
    cn: '价格',
    en: 'Price',
    value: row => `${currencyFormat(row.currency)}${row.price || '-'}`,
    filter: 'qu_th,cust_th',
  },
  {
    id: 'currency',
    cn: '销售币种',
    en: 'Currency',
    value: 'currency',
    filter: 'qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,pu_th,de_th,dg_th',
  },
  {
    id: 'amount',
    cn: '金额',
    en: 'Amount',
    value: '',
    slot: 'th_amount',
    filter: 'qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,pu_th,de_th,dg_th',
    extend: {
      single: true,
    },
  },
  {
    id: 'amt_grate',
    cn: '毛利率',
    en: 'Margin',
    value: row => (row.is_bl === 'yes' ? row.amt2_grate : row.amt1_grate),
    filter: 'qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,pu_th,de_th,dg_th',
  },
  {
    id: 'origin_type',
    cn: '产品来源',
    en: 'Product Source',
    value: 'origin_type',
    filter: 'qu_th,pre_sc_th,sc_th',
  },
  {
    id: 'single_gw_cbm',
    cn: '箱体积',
    en: 'CBM',
    value: '',
    slot: 'th_single_gw_cbm',
    filter: 'dg_th',
    extend: {
      single: true,
    },
  },
  {
    id: 'single_gw_nw_cbm',
    cn: '毛净体',
    en: 'G.W./N.W./CBM',
    value: '',
    slot: 'th_single_gw_nw_cbm',
    filter: 'sp_th',
    extend: {
      single: true,
    },
  },
  {
    id: 'gw_ctn_cbm',
    cn: '毛件体',
    en: 'G.W./CTN/CBM',
    value: '',
    slot: 'th_gw_ctn_cbm',
    filter: 'qu_th,pre_sc_th,sc_th,dg_th',
    extend: {
      single: true,
    },
  },
  {
    id: 'ctn',
    cn: '件数',
    en: 'CTN',
    value: 'total_ctn',
    filter: 'sp_th',
  },
  {
    id: 'gw_ctn_cbm',
    cn: '毛件体',
    en: 'G.W./CTN/CBM',
    value: row =>
      `${(row.total_gw || 0).toFixed(2) * 1}/${
        (row.total_ctn || 0).toFixed(2) * 1
      }/${(row.total_cbm || 0).toFixed(2) * 1}`,
    filter: 'sp_th',
  },
  {
    id: 'quote_date',
    cn: '报价日期',
    en: 'Quote Date',
    value: row => timeFormat(row.quote_date),
    filter: 'qu_th',
  },
  {
    id: 'sell_comlegal_id',
    cn: '销售方',
    en: 'Seller',
    value: row =>
      tt ? tt(row, 'x_sell_comlegal_id') : row.x_sell_comlegal_id_en,
    filter: 'qu_th',
  },
  {
    id: 'total_amt',
    cn: '采购总价',
    en: 'Purcahse Amount',
    value: row =>
      currencyFormat(row.currency) +
      (row.sell_price * row.sell_quantity || 0).fthousands(2),
    filter: 'pre_sc_th,sc_th',
  },
  {
    id: 'total_amt',
    cn: '采购总价',
    en: 'Purcahse Amount',
    value: row =>
      currencyFormat(row.pu_currency) +
      (row.pu_price * row.quantity || 0).fthousands(2),
    filter: 'pu_th',
  },
  {
    id: 'edit_sell_price',
    cn: '销售价',
    en: 'Price',
    value: 'sell_price',
    slot: 'th_sell_price',
    filter: 'pre_sc_th',
    extend: {
      edit: true,
    },
  },
  {
    id: 'sell_price',
    cn: '销售价',
    en: 'Price',
    value: row => `${currencyFormat(row.currency)}${row.sell_price || '-'}`,
    filter: 'sc_sup_th,sc_th,sp_th,load_th,pu_th,de_th,dg_th',
  },
  {
    id: 'edit_sell_quantity',
    cn: '数量',
    en: 'Quantity',
    value: 'sell_quantity',
    slot: 'th_sell_quantity',
    filter: 'pre_sc_th',
    extend: {
      edit: true,
    },
  },
  {
    id: 'sell_quantity',
    cn: '数量',
    en: 'Quantity',
    value: 'sell_quantity',
    filter: 'sc_th',
  },
  {
    id: 'sell_quantity',
    cn: '数量',
    en: 'Quantity',
    value: row => row.quantity || row.sell_quantity || '',
    filter: 'sc_sup_th,sp_th',
  },
  {
    id: 'edit_quantity',
    cn: '数量',
    en: 'Quantity',
    value: 'quantity',
    slot: 'th_quantity',
    filter: 'pu_th',
    extend: {
      single: true,
    },
  },
  {
    id: 'plan_qty',
    cn: '计划数量',
    en: 'Plan Quantity',
    value: 'plan_qty',
    filter: 'pu_th',
  },
  {
    id: 'quantity',
    cn: '数量',
    en: 'Quantity',
    value: 'quantity',
    filter: 'qu_th,de_th,dg_th,pu_th,pu_sp_th',
  },
  {
    id: 'load_quantity',
    cn: '装柜数量',
    en: 'Load Quantity',
    value: 'load_quantity',
    filter: 'sp_th,de_th,dg_th',
  },
  {
    id: 'load_quantity',
    cn: '装柜数量',
    en: 'Load Quantity',
    value: 'quantity',
    filter: 'load_th',
  },
  {
    id: 'plan_qty',
    cn: '计划数量',
    en: 'Plan Quantity',
    value: 'plan_qty',
    filter: 'load_th',
  },
  {
    id: 'load_plan_qty',
    cn: '配载/计划',
    en: 'Load/Plan Qty',
    value: row => `${row.load_quantity * 1 || 0}/${row.quantity}`,
    filter: 'sp_th,de_th,dg_th',
  },
  {
    id: 'edit_delivery_date',
    cn: '交货期',
    en: 'Delivery Date',
    value: row => timeFormat(row.delivery_date),
    slot: 'th_delivery_date',
    filter: 'pre_sc_th,pu_th',
    extend: {
      edit: true,
    },
  },
  {
    id: 'delivery_date',
    cn: '交货期',
    en: 'Delivery Date',
    value: row => timeFormat(row.delivery_date),
    filter:
      'qu_th,sc_sup_th,sc_th,sp_th,load_th,pu_th,de_th,dg_th,pu_th,pu_sp_th',
  },
  {
    id: 'valid_date',
    cn: '采购日期',
    en: 'Purchase Date',
    value: row => timeFormat(row.valid_date),
    filter:
      'qu_th,sc_sup_th,sc_th,sp_th,load_th,pu_th,de_th,dg_th,pu_th,pu_sp_th',
  },
  {
    id: 'edit_etd_date',
    cn: '出运日',
    en: 'Shipment Date',
    value: row => timeFormat(row.etd_date),
    slot: 'th_etd_date',
    filter: 'pre_sc_th',
    extend: {
      edit: true,
    },
  },
  {
    id: 'etd_date',
    cn: '出运日',
    en: 'Shipment Date',
    value: row => timeFormat(row.etd_date),
    filter: 'qu_th,sc_sup_th,sc_th,sp_th,load_th,pu_th,de_th,dg_th',
  },
  {
    id: 'seller_id',
    cn: '供应商',
    en: 'Supplier',
    value: 'x_seller_id',
    filter: 'qu_th,sc_sup_th,sc_th,sp_th,load_th,pu_th,de_th,dg_th,',
  },
  {
    id: 'edit_seller_id',
    cn: '供应商',
    en: 'Supplier',
    value: row => row.x_seller_id || '-',
    slot: 'th_sc_supplier',
    filter: 'pre_sc_th,pu_th',
    extend: {
      edit: true,
    },
  },
  {
    id: 'purchase_no',
    cn: '采购订单',
    en: 'PO NO.',
    value: row => row.purchase_no || row.x_purchase_id || '-',
    filter: 'qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,pu_th,de_th,dg_th',
    extend: {
      link: true,
    },
    action: function (v) {
      if (!v.purchase_id) return
      this.$tab.open({
        path: 'PuEdit',
        query: { bill_id: v.purchase_id },
        tab_id: v.purchase_id,
        title: v.purchase_no || v.x_purchase_id || '采购',
      })
    },
  },
  {
    id: 'purchase_no_link',
    cn: '采购订单',
    en: 'PO NO.',
    value: row => row.purchase_no || row.x_purchase_id || '-',
    slot: 'th_sc_pu_link',
    filter: 'pu_th',
    extend: {
      single: true,
    },
  },
  {
    id: 'sc_prod_status',
    cn: '状态',
    en: 'Status',
    value: '',
    slot: 'th_sc_prod_status',
    filter: 'pre_sc_th,sc_sup_th',
    extend: {
      single: true,
    },
  },
  {
    id: 'status',
    cn: '状态',
    en: 'Status',
    value: '',
    slot: 'th_status',
    filter: 'dg_th',
    extend: {
      single: true,
    },
  },
  {
    id: 'delay_desc',
    cn: '变更原因',
    en: 'Reason for change ',
    value: 'delay_desc',
    filter: 'pre_sc_th',
    extend: {
      line: 1,
    },
  },
  {
    id: 'is_replace',
    cn: '换货标志',
    en: 'Exchange',
    value: row => row.is_replace,
    filter: 'pre_sc_th,sc_sup_th,sc_th,sp_th,de_th,dg_th',
  },
  {
    id: 'operator',
    cn: '跟单员',
    en: 'Merchandiser',
    value: row => tt(row, 'x_operator'),
    filter: 'pre_sc_th,sc_sup_th,sc_th,sp_th,de_th,dg_th',
  },
  {
    id: 'important_rank',
    cn: '重要性',
    en: 'Important',
    value: 'important_rank',
    filter: 'pre_sc_th,sc_sup_th,sc_th,sp_th,de_th,dg_th',
  },
  {
    id: 'action',
    cn: '操作',
    en: 'Action',
    value: '',
    slot: 'th_action',
    filter:
      'pm_th,qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,pu_th,de_th,dg_th',
    extend: {
      fixed: true,
      single: true,
    },
  },
  {
    id: 'pu_date',
    cn: '采购日期',
    en: 'Purchase date',
    value: row => timeFormat(row.pu_date),
    filter: 'pre_sc_th,sc_sup_th,sc_th,sp_th,pu_th,de_th,dg_th',
  },
  {
    id: 'cust_contact',
    cn: '客户买手',
    en: 'Contact',
    value: 'x_contact',
    filter: 'qu_th,pre_sc_th,sc_sup_th,sc_th,sp_th,pu_th,de_th,dg_th',
  },
  {
    id: 'buyer_id',
    cn: '客户',
    en: 'Buyer',
    value: 'x_buyer_id',
    filter: 'pre_sc_th,sc_sup_th,sc_th,sp_th,load_th,pu_th,de_th,dg_th',
  },
  {
    id: 'sell_cust_com_id',
    cn: '客户',
    en: 'Buyer',
    value: 'x_sell_cust_com_id',
    filter: 'qu_th',
  },
  {
    id: 'com_legal',
    cn: '销售法人',
    en: 'Seller',
    value: row => tt(row, 'x_com_legal'),
    filter: 'sp_th,de_th,dg_th',
  },
  {
    id: 'busi_user',
    cn: '业务员',
    en: 'Salesman ',
    value: row => tt(row, 'x_busi_user'),
    filter: 'sp_th,de_th,dg_th',
  },
  {
    id: 'trade_term',
    cn: '贸易条款',
    en: 'Trade Term',
    value: 'trade_term',
    filter: 'sp_th,load_th,de_th,cust_th',
  },
  {
    id: 'contract_no',
    cn: '销售订单',
    en: 'SC NO.',
    value: row => row.contract_no || row.x_contract_id || '-',
    filter: 'sp_th,load_th,de_th,sc_th',
    extend: {
      link: true,
    },
    action: function (v) {
      if (!v.contract_id) return
      this.$tab.open({
        path: 'ScEdit',
        query: { bill_id: v.contract_id },
        tab_id: v.contract_id,
        title: v.contract_no || v.x_contract_id || '订单',
      })
    },
  },
  {
    id: 'bookorder_no',
    cn: '订舱托单',
    en: 'Booking NO.',
    value: row => row.bookorder_no || row.x_bookorder_id || '-',
    filter: 'sp_th,load_th,de_th',
  },
  {
    id: 'book_inv_no',
    cn: '订舱发票',
    en: 'Booking Invoic NO.',
    value: 'book_inv_no',
    filter: 'sp_th,load_th,de_th',
  },
  {
    id: 'batch_no',
    cn: '报关单',
    en: 'Customs Declaration NO.',
    value: 'batch_no',
    filter: 'sp_th,de_th',
  },
  {
    id: 'clear_no',
    cn: '海关单',
    en: 'Customs Clearance NO.',
    value: 'clear_no',
    filter: 'sp_th,de_th',
  },
  {
    id: 'bl_no',
    cn: '提单',
    en: 'B/L NO.',
    value: 'bl_no',
    filter: 'sp_th,de_th',
  },
  {
    id: 'vessel',
    cn: '船名航次号',
    en: 'Vessel',
    value: 'vessel',
    filter: 'sp_th,de_th',
  },
  {
    id: 'shipment_date',
    cn: '开船日',
    en: 'Sailing day ',
    value: row => timeFormat(row.shipment_date),
    filter: 'sp_th,de_th',
  },
  {
    id: 'eta_date',
    cn: '预计到港日',
    en: 'ETA',
    value: row => timeFormat(row.eta_date),
    filter: 'sp_th,de_th',
  },
  {
    id: 'diff_type',
    cn: '装箱差异',
    en: 'Loading difference ',
    value: 'diff_type',
    filter: 'sp_th,de_th',
  },
  {
    id: 'reason',
    cn: '变更原因',
    en: 'Reason for change ',
    value: 'reason',
    filter: 'sp_th,de_th',
  },
  {
    id: 'booking_date',
    cn: '订舱日期',
    en: 'Booking Date',
    value: row => timeFormat(row.booking_date),
    filter: 'sp_th,de_th',
  },
  {
    id: 'loading_date',
    cn: '装柜完成日期',
    en: 'Loading Date',
    value: row => timeFormat(row.loading_date),
    filter: 'sp_th,de_th',
  },
  {
    id: 'is_split',
    cn: '出运分批标志',
    en: 'Shipment in batches',
    value: 'is_split',
    filter: 'sp_th,de_th',
  },
  {
    id: 'is_delay',
    cn: '出运延期标志',
    en: 'Shipment delay',
    value: 'is_delay',
    filter: 'sp_th,de_th',
  },
  {
    id: 'is_load',
    cn: '装柜标志',
    en: 'Loading',
    value: 'is_load',
    filter: 'sp_th,de_th',
  },
  {
    id: 'is_qc',
    cn: '验货标志',
    en: 'Inspection ',
    value: 'is_qc',
    filter: 'sp_th,de_th',
  },
  {
    id: 'is_stock',
    cn: '订舱标志',
    en: 'Booking',
    value: 'is_stock',
    filter: 'sp_th,de_th',
  },
  {
    id: 'is_order',
    cn: '托单标志',
    en: 'Add to Booking',
    value: 'is_order',
    filter: 'sp_th,de_th',
  },
  {
    id: 'is_decl',
    cn: '报关标志',
    en: 'Declaration',
    value: 'is_decl',
    filter: 'sp_th,de_th',
  },
  {
    id: 'is_bl',
    cn: '提单标志',
    en: 'Receive B/L',
    value: 'is_bl',
    filter: 'sp_th,de_th',
  },
  {
    id: 'ori_quantity',
    cn: '分批前数量',
    en: 'Original Quantity',
    value: 'ori_quantity',
    filter: 'sp_th,de_th',
  },
  {
    id: 'crd_date',
    cn: '供方实际交期日期',
    en: 'CRD',
    value: row => timeFormat(row.crd_date || row.delivery_date),
    filter: 'sp_th,load_th,de_th,sc_sup_th,dg_th',
  },
  {
    id: 'crd_update_date',
    cn: '供方实际交货更新日期',
    en: 'CRD Update Date',
    value: row => timeFormat(row.crd_update_date),
    filter: 'sp_th,de_th',
  },
  {
    id: 'stock_id',
    cn: '仓库',
    en: 'Warehouse',
    value: 'x_stock_id',
    filter: 'sp_th,de_th',
    slot: 'th_warehouse',
    extend: {
      edit: true,
    },
  },
  {
    id: 'inve_quantity',
    cn: '库存数量',
    en: 'Inventory',
    value: 'inve_quantity',
    filter: 'pu_th',
  },
  {
    id: 'prod_source',
    cn: '备货方式',
    en: 'Stocking method ',
    value: row => stockType3(row.prod_source),
    filter: 'pu_th,sc_th',
  },
  {
    id: 'prod_source',
    cn: '备货方式',
    en: 'Stocking method ',
    value: row => stockType3(row.prod_source),
    slot: 'th_prod_source',
    filter: 'pre_sc_th',
    extend: {
      edit: true,
    },
  },
  {
    id: 'is_pu_split',
    cn: '交货分批标志',
    en: 'Supply in batches',
    value: 'is_pu_split',
    filter: 'sp_th,de_th',
  },
  {
    id: 'is_pu_delay',
    cn: '交货延期标志',
    en: 'Supply delay',
    value: 'is_pu_delay',
    filter: 'sp_th,de_th',
  },
  {
    id: 'is_delivery',
    cn: '发货清单标志',
    en: 'Delivery List',
    value: 'is_delivery',
    filter: 'sp_th,de_th',
  },
  {
    id: 'process_id',
    cn: '备货进度',
    en: 'Progress',
    value: row => tt(row, 'x_process_id'),
    filter: 'sp_th,de_th,dg_th,sc_sup_th',
  },
  {
    id: 'prod_ctn',
    cn: '件数',
    en: 'CTN',
    value: 'prod_ctn',
    filter: 'dg_th',
  },
  {
    id: 'dg_carton_cbm',
    cn: '箱体积',
    en: 'CBM',
    value: 'carton_cbm',
    filter: 'dg_th',
  },
  {
    id: 'dg_carton_nw',
    cn: '箱净重',
    en: 'N.W.',
    value: 'carton_nw',
    filter: 'dg_th',
  },
  {
    id: 'dg_carton_gw',
    cn: '箱毛重',
    en: 'G.W.',
    value: 'carton_gw',
    filter: 'dg_th',
  },
  {
    id: 'adjust_fee',
    cn: '调整费',
    en: 'Adjust Fee',
    value: 'adjust_fee',
    filter: 'pre_sc_th,sc_th,sp_th,de_th',
  },
  {
    id: 'info_integrity',
    cn: '信息完整度',
    en: 'Information integrity',
    value: '',
    slot: 'th_info_integrity',
    filter: 'pm_th',
    extend: {
      single: true,
    },
  },
  {
    id: 'sc_etd',
    cn: '销售订单/计划出运',
    en: 'SC/ETD',
    value: '',
    slot: 'th_sc_etd',
    filter: 'sp_th',
    extend: {
      single: true,
    },
  },
  {
    id: 'sup_dd',
    cn: '供应商/承诺交货',
    en: 'Supplier/Delivery D.',
    value: '',
    slot: 'th_sup_dd',
    filter: 'sp_th',
    extend: {
      single: true,
    },
  },
  {
    id: 'qty_crd',
    cn: '数量/实际交货',
    en: 'Quantity/CRD',
    value: '',
    slot: 'th_qty_crd',
    filter: 'sp_th',
    extend: {
      single: true,
    },
  },
  {
    id: 'exploded_no',
    cn: '爆炸图号',
    en: 'Exploded',
    value: 'exploded_no',
    filter: 'dg_th',
  },
  {
    id: 'cust_com_id',
    cn: '客户',
    en: 'Customer',
    value: 'x_cust_com_id',
    filter: 'cust_th',
  },
  {
    id: 'cust_hs_code',
    cn: '客户海关编码',
    en: 'Cust HS Code',
    value: 'cust_hs_code',
    filter: 'cust_th',
  },
  {
    id: 'tariff',
    cn: '关税',
    en: 'Tariff',
    value: 'tariff',
    filter: 'cust_th',
  },
  {
    id: 'group_cust_prod_no',
    cn: '大国货号',
    en: 'Mex No.',
    value: 'group_cust_prod_no',
    filter: 'dg_th',
  },
  {
    id: 'factory_id',
    cn: '生产商',
    en: 'Vendor',
    value: 'x_factory_id',
    filter: 'dg_th',
  },
]

// export function getProd (filter) {
//   if (!filter) return prodList
//   return prodList.filter(m => m.filter.indexOf(filter) >= 0)
// }

function newReg(f) {
  return new RegExp('(^|,)' + f + '(,|$)', 'i')
}

export function getProd(filter) {
  if (!filter) return prodList
  return prodList.filter(m => newReg(filter).test(m.filter))
}
