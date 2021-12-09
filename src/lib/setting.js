const prodList = [
  {
    en: 'Description_en',
    cn: '品名_en',
    value: row =>
      row.trade_status === 'internal' ? row.prod_name : row.prod_name_en,
    id: 'prod_name_en',
    key: 'prod_name_en',
    component: 'textarea',
    filter: 'catalog,qu,buy_qu,sc,pm,inq,scan,buy,new,pu,web_list,web_detail,buy_new,buy_inq',
  },
  {
    en: 'Description',
    cn: '品名',
    value: row =>
      row.trade_status === 'internal' ? row.prod_name : row.prod_name_en,
    id: 'prod_name',
    key: 'prod_name',
    component: 'textarea',
    filter: 'qu,buy_qu,sc,pm,inq,scan,buy,new,pu',
  },
  {
    en: 'Selling Point_en',
    cn: '卖点_en',
    value: row =>
      row.trade_status === 'internal'
        ? row.selling_point
        : row.selling_point_en,
    id: 'selling_point_en',
    key: 'selling_point_en',
    component: 'textarea',
    filter: 'catalog,pm,scan,web_list,web_detail,qu',
  },
  {
    en: 'Selling Point',
    cn: '卖点',
    value: row =>
      row.trade_status === 'internal'
        ? row.selling_point
        : row.selling_point_en,
    id: 'selling_point',
    key: 'selling_point',
    component: 'textarea',
    filter: 'pm,scan',
  },
  {
    en: 'Sort_en',
    cn: '分类_en',
    value: row =>
      row.trade_status === 'internal' ? row.x_prod_sort : row.x_prod_sort_en,
    id: 'category',
    key: '',
    component: 'category',
    filter: 'catalog,qu,buy_qu,sc,pm,inq,scan,buy,new,pu,web_list,web_detail,buy_new,buy_inq',
  },
  {
    en: 'Sort',
    cn: '分类',
    value: row =>
      row.trade_status === 'internal' ? row.x_prod_sort : row.x_prod_sort_en,
    id: 'category_cn',
    key: '',
    component: 'category_cn',
    filter: 'qu,buy_qu,sc,pm,inq,scan,buy,new,pu',
  },
  {
    en: 'Item No.',
    cn: '货号',
    value: 'prod_no',
    id: 'item_no',
    key: 'prod_no',
    component: 'text',
    filter: 'catalog,sc,pm,scan,buy,new,pu,web_list,web_detail,buy_new',
  },
  {
    en: 'Brand',
    cn: '品牌',
    value: row =>
      row.trade_status === 'internal' ? row.x_brand_id : row.x_brand_id_en,
    id: 'brand_id',
    key: 'brand_id',
    component: 'brand',
    filter: 'catalog,sc,qu,buy_qu,pm,inq,scan,buy,new,pu,web_list,web_detail',
  },
  {
    en: 'Model',
    cn: '型号',
    value: 'model',
    id: 'model',
    key: 'model',
    component: 'text',
    filter: 'catalog,sc,qu,buy_qu,pm,inq,scan,buy,new,pu,web_list,web_detail,buy_new,buy_inq',
  },
  {
    en: 'Item No.',
    cn: '货号',
    value: row => row.sell_prod_no || row.prod_no,
    id: 'sell_item_no',
    key: 'sell_prod_no',
    component: 'text',
    filter: 'qu,buy_qu,inq',
  },
  {
    en: 'Original Item No.',
    cn: '原货号',
    value: 'original_prod_no',
    id: 'original_prod_no',
    key: 'original_prod_no',
    component: 'text',
    filter: 'catalog,qu,buy_qu,sc,inq,pm,scan,pu,web_list,web_detail,buy_new,buy_inq',
  },
  {
    en: 'Specification_en',
    cn: '规格_en',
    value: row =>
      row.trade_status === 'internal' ? row.prod_spec : row.prod_spec_en,
    id: 'prod_spec_en',
    key: 'prod_spec_en',
    component: 'text',
    filter: 'catalog,qu,buy_qu,sc,pm,inq,scan,buy,new,pu,web_list,web_detail,buy_new,buy_inq',
  },
  {
    en: 'Specification',
    cn: '规格',
    value: row => row.trade_status === 'internal' ? row.prod_spec : row.prod_spec_en,
    id: 'prod_spec',
    key: 'prod_spec',
    component: 'text',
    filter: 'qu,buy_qu,sc,pm,inq,scan,buy,new,pu',
  },
  {
    en: 'Price',
    cn: '价格',
    value: row => {
      let pre = ''
      // 前程
      if (row.com_id === '5788f3fb949bc50cf07aff9d') pre = ' FOB NINGBO'
      if (row.trade_status === 'internal') return `${row.sn_currency || 'USD'} ${(row.sn_price * 1 || 0).toFixed(2)}${pre}`
      return `${row.currency || 'USD'} ${(row.fob_price * 1 || 0).toFixed(2)}${pre}`
    },
    id: 'price',
    key: '',
    component: 'price',
    filter: 'catalog,pm,inq,scan,buy,new,web_list,web_detail,buy_new',
  },
  {
    en: 'Price',
    cn: '价格',
    value: '',
    id: 'price2',
    key: '',
    component: 'price',
    filter: 'pm',
    remark: '无成本'
  },
  {
    en: 'Price',
    cn: '价格',
    value: '',
    id: 'price_link',
    key: '',
    component: 'price-link',
    filter: 'scan',
    remark: '链接跳转查看',
  },
  {
    en: 'Price',
    cn: '价格',
    value: row => {
      return `${row.currency || 'USD'} ${(row.price * 1 || 0).toFixed(2)}`
    },
    id: 'price',
    key: '',
    component: 'price',
    filter: 'qu,buy_qu,buy_inq',
  },
  {
    en: 'Price',
    cn: '价格',
    value: row => {
      return `${row.currency || 'USD'} ${(row.sell_price * 1 || 0).toFixed(2)}`
    },
    id: 'price',
    key: '',
    component: 'price',
    filter: 'sc',
  },
  {
    en: 'Purchase Price',
    cn: '采购价',
    value: 'pu_price',
    id: 'pu_price',
    key: '',
    component: 'pu_price',
    filter: 'qu,buy_qu,sc,pm,scan,inq',
  },
  {
    en: 'Price ',
    cn: '价格',
    value: '',
    id: 'purchase_price',
    key: '',
    component: 'purchase_price',
    filter: 'pu',
  },
  {
    en: 'HS Code',
    cn: '海关码',
    value: 'hs_code',
    id: 'hs_code',
    key: '',
    component: 'hs_code',
    filter: 'qu,buy_qu,sc,pm,pu,inq,web_list,web_detail,buy_new,buy_inq',
  },
  {
    en: 'Material_en',
    cn: '材质_en',
    value: row =>
      row.trade_status === 'internal'
        ? row.prod_material
        : row.prod_material_en,
    id: 'material',
    key: '',
    component: 'material',
    filter: 'catalog,qu,buy_qu,inq,sc,pm,inq,scan,buy,new,pu,web_list,web_detail,buy_new,buy_inq',
  },
  {
    en: 'Material',
    cn: '材质',
    value: row =>
      row.trade_status === 'internal'
        ? row.prod_material
        : row.prod_material_en,
    id: 'material_cn',
    key: '',
    component: 'material_cn',
    filter: 'qu,buy_qu,sc,pm,inq,scan,buy,new,pu',
  },
  {
    en: 'Product Size',
    cn: '产品尺寸',
    value: (row, isAnhua) => {
      let size = row.mg_prod_size || {}
      let text = `${size.length || '-'} × ${size.width || '-'} × ${size.height || '-'} cm`
      if (isAnhua || row.com_id === '59f7ec0da623fcb4aa298cb6') {
        text = ''
        let fields = [
          {f: 'height', abbr: 'H'},
          {f: 'top_diam', abbr: 'T'},
          {f: 'diam', abbr: 'D'},
          {f: 'btm_diam', abbr: 'B'}
        ]
        fields.forEach(m => {
          if (size[m.f]) {
            text += `${m.abbr}:${size[m.f]}(${(size[m.f] / 2.54 || 0).toFixed(2) * 1 || 0}") `
          }
        })
        text += 'cm'
      }
      return text
    },
    id: 'product_size',
    key: '',
    component: 'product-size',
    filter: 'catalog,qu,buy_qu,sc,pm,inq,scan,buy,new,pu,web_detail,buy_new,buy_inq',
  },
  {
    en: 'Net Weight',
    cn: '产品净重',
    value: row => `${row.net_weight || '-'} ${row.net_weight_unit || 'g'}`,
    id: 'product_weight',
    key: '',
    component: 'product-weight',
    filter: 'catalog,qu,buy_qu,sc,pm,inq,scan,buy,new,pu,web_list,web_detail,buy_new,buy_inq',
  },
  {
    en: 'Packing_en',
    cn: '包装_en',
    value: row =>
      row.trade_status === 'internal' ? row.sale_pkg : row.sale_pkg_en,
    id: 'packing',
    key: '',
    component: 'packing',
    filter: 'catalog,qu,buy_qu,sc,pm,inq,scan,buy,new,pu,web_list,web_detail,buy_new,buy_inq',
  },
  {
    en: 'Packing',
    cn: '包装方式',
    value: row =>
      row.trade_status === 'internal' ? row.sale_pkg : row.sale_pkg_en,
    id: 'packing_cn',
    key: '',
    component: 'packing_cn',
    filter: 'qu,buy_qu,sc,pm,inq,scan,buy,new,pu',
  },
  {
    en: 'Details_en',
    cn: '详情_en',
    value: row =>
      row.trade_status === 'internal' ? row.mg_detail : row.mg_detail_en,
    id: 'detail',
    key: 'mg_detail_en',
    component: 'textarea',
    filter: 'catalog,qu,buy_qu,sc,pm,inq,scan,buy,new,pu,web_detail,buy_new,buy_inq',
  },
  {
    en: 'Detail',
    cn: '详情',
    value: row =>
      row.trade_status === 'internal' ? row.mg_detail : row.mg_detail_en,
    id: 'detail_cn',
    key: 'mg_detail',
    component: 'textarea',
    filter: 'qu,buy_qu,sc,pm,inq,scan,buy,new,pu',
  },
  {
    en: 'Catalog Description',
    cn: '描述',
    value: 'description',
    id: 'description',
    key: 'description',
    component: '',
    filter: 'catalog',
  },

  // {
  //   en: 'Delivery Date',
  //   cn: '交货日期',
  //   value: row => timeFormat(row.delivery_date),
  //   id: 'delivery',
  //   key: 'delivery_date',
  //   component: 'date',
  //   filter: 'catalog,pm,inq,scan,buy,new'
  // },
  {
    en: 'MOQ',
    cn: '起订量',
    value: row => row.moq,
    id: 'moq',
    key: 'moq',
    component: 'number',
    filter: 'catalog,inq,buy,new,pm,qu,buy_qu,sc,web_list,web_detail,buy_new,buy_inq',
  },
  {
    en: 'Load Port',
    cn: '起运港',
    value: row =>
      row.trade_status === 'internal' ? row.x_load_port : row.x_load_port_en,
    id: 'load_port',
    key: '',
    component: 'load-port',
    filter: 'web_detail,qu',
  },
  {
    en: 'Outer Size',
    cn: '外箱尺寸',
    value: row =>
      `${row.pkg.carton_size_length || '-'} × ${row.pkg.carton_size_width ||
        '-'} × ${row.pkg.carton_size_height || '-'} cm`,
    id: 'outer_size',
    key: '',
    component: 'outer-size',
    filter: 'catalog,qu,buy_qu,sc,pm,inq,scan,buy,new,pu,web_detail,buy_new,buy_inq',
  },
  {
    en: 'Inner Size',
    cn: '内盒尺寸',
    value: row =>
      `${row.pkg.pkg_size_length || '-'} × ${row.pkg.pkg_size_width ||
        '-'} × ${row.pkg.pkg_size_height || '-'} cm`,
    id: 'inner_size',
    key: '',
    component: 'inner-size',
    filter: 'catalog,qu,buy_qu,sc,pm,inq,scan,buy,new,pu,web_detail,buy_new,buy_inq',
  },
  {
    en: 'Ctn Qty',
    cn: '整箱装量',
    value: row => {
      let inner = row.pkg.inner_pkg_pcs * 1 || 1
      let outer = row.pkg.outer_pkg_pcs * 1 || 1
      return `${inner} × ${outer} = ${inner * outer}`
    },
    id: 'carton_qty',
    key: '',
    component: 'carton-qty',
    filter: 'catalog,qu,buy_qu,sc,pm,inq,scan,buy,new,pu,web_detail,buy_new,buy_inq',
  },
  {
    en: 'Ctn N.W.',
    cn: '整箱净重',
    value: row => `${row.pkg.carton_nw || '-'} KGS`,
    id: 'carton_nw',
    key: '',
    component: 'carton-nw',
    filter: 'catalog,qu,buy_qu,sc,pm,inq,scan,buy,new,pu,web_detail,buy_new,buy_inq',
  },
  {
    cn: '整箱毛重',
    en: 'Ctn G.W.',
    value: row => `${row.pkg.carton_gw || '-'} KGS`,
    id: 'carton_gw',
    key: '',
    component: 'carton-gw',
    filter: 'catalog,qu,buy_qu,sc,pm,inq,scan,buy,new,pu,web_detail,buy_new,buy_inq',
  },
  {
    cn: '整箱体积',
    en: 'Ctn CBM',
    value: row => (row.pkg.cbm * 1 || 0).toFixed(3),
    id: 'cbm',
    key: '',
    component: 'cbm',
    filter: 'catalog,qu,buy_qu,sc,pm,inq,scan,buy,new,pu,web_detail,buy_new,buy_inq',
  },
  {
    cn: '装箱量',
    en: 'Loading Qty(20GP/40GP/40HC)',
    value: row =>
      `${row.pkg.gp20 || '-'}/${row.pkg.gp40 || '-'}/${row.pkg.hc40 || '-'}`,
    id: 'loading_qty',
    key: '',
    component: 'loading-qty',
    filter: 'catalog,qu,buy_qu,sc,pm,inq,scan,buy,new,pu,web_detail,buy_new,buy_inq',
  },
  {
    cn: '数量',
    en: 'Quantity',
    value: 'quantity',
    id: 'quantity',
    key: 'quantity',
    component: 'quantity',
    filter: 'qu,buy_qu,sc,inq,buy,pu,buy_inq',
  },
  {
    cn: '备注',
    en: 'Remark',
    value: '',
    id: 'remark',
    key: '',
    component: 'remark',
    filter: 'qu,buy_qu,sc,pm,inq,buy,new,buy_new,buy_inq',
  },
  {
    cn: '出运日期',
    en: 'ETD',
    value: row => (row.etd_date || '').toLocaleDateString(),
    id: 'etd_date',
    key: '',
    component: 'etd-date',
    filter: 'sc',
  },
  {
    cn: '交货期(天)',
    en: 'Leading Time(days)',
    value: 'delivery_day',
    id: 'delivery_day',
    key: 'delivery_day',
    component: 'number',
    filter: 'inq,buy,pm,pu,qu,buy_qu,new,sc,web_detail,buy_new,buy_inq',
  },
  {
    cn: '工厂货号',
    en: 'Supplier Item No.',
    value: 'supplier_no',
    id: 'supplier_no',
    key: 'supplier_no',
    component: 'textarea',
    filter: 'inq,buy,pm,pu,web_detail,buy_inq,scan',
  },
  {
    cn: '工厂',
    en: 'Supplier',
    value: row => row.x_supplier_id,
    id: 'supplier',
    key: '',
    component: 'supplier',
    filter: 'new,pm,pu,web_detail',
  },
  {
    cn: '所有图片',
    en: 'All Pictures',
    value: '',
    id: 'mg_prod_pic',
    key: '',
    component: '',
    filter: 'web_detail',
  },
  {
    cn: '产品参数',
    en: 'Product Attribute',
    value: '',
    id: 'attribute',
    key: '',
    component: '',
    filter: 'web_detail,pm,scan,catalog,qu',
  },
  {
    cn: '原产国',
    en: 'Origin',
    value: row => row.x_origin_en || row.origin,
    id: 'origin',
    key: 'origin',
    component: 'prod-country',
    filter: 'pm,scan,catalog,web_detail',
  },
  {
    cn: '产品类型',
    en: 'Product Type',
    value: row => row.type,
    id: 'type',
    key: 'type',
    component: '',
    filter: 'web_detail',
  },
  {
    cn: '产品等级',
    en: 'Product Level',
    value: row => row.prod_level,
    id: 'prod_level',
    key: 'prod_level',
    component: '',
    filter: 'web_detail',
  },
  {
    cn: '条码',
    en: 'Bar Code',
    value: 'prod_barcode',
    id: 'prod_barcode',
    key: 'prod_barcode',
    component: '',
    filter: 'web_detail',
  },
  {
    cn: '内销价',
    en: 'Domestic Price',
    value: row => `${row.sn_currency} ${row.sn_price}`,
    id: 'sn_price',
    key: '',
    component: '',
    filter: 'web_detail',
  },
  {
    cn: '预估成本',
    en: 'Estimated Cost',
    value: row => `${row.estimate_price_currency} ${row.estimate_price}`,
    id: 'estimate_price',
    key: '',
    component: '',
    filter: 'web_detail',
  },
  // {
  //   cn: '其他尺寸',
  //   en: 'Other Size',
  //   value: 'other_size',
  //   id: 'other_size',
  //   key: 'other_size',
  //   component: '',
  //   filter: 'web_detail'
  // }
]

function newReg(f) {
  return new RegExp('(^|,)' + f + '(,|$)', 'i')
}

export function getProd(filter) {
  if (!filter) return prodList
  return prodList.filter(m => newReg(filter).test(m.filter))
}

export function getProdAsync (f, instance, http) {
  if (!f || !instance || !http) return Promise.resolve(prodList)
  if (!instance || !http) return Promise.resolve(prodList.filter(m => newReg(f).test(m.filter)))
  let field = f + '_fields'
  return http('/api/support/getConfigure', {field, instance}).then(res => {
    let v = res[field]
    if (!v) return prodList.filter(m => newReg(f).test(m.filter))
    v = v.split(',')
    return prodList.filter(m => newReg(f).test(m.filter) && v.indexOf(m.id) >= 0)
  })
}
export const selected = {
  catalog: {main: 'price,item_no,material,cbm', title: 'prod_name_en'},
  qu_prod_info_display: {main: 'price,item_no,material,cbm', title: 'prod_name_en'},
  qu:
    'prod_name_en,category,sell_item_no,material,packing,price,quantity,detail,product_size,product_weight,etd_date,remark,inner_size,outer_size,carton_qty,cbm,carton_nw,carton_gw,loading_qty',
  buy_qu: 'prod_name_en,category,sell_item_no,material,packing,price,quantity,detail,product_size,product_weight,etd_date,remark,inner_size,outer_size,carton_qty,cbm,carton_nw,carton_gw,loading_qty',
  sc:
    'prod_name_en,category,item_no,material,packing,price,quantity,detail,product_size,product_weight,etd_date,remark,inner_size,outer_size,carton_qty,cbm,carton_nw,carton_gw,loading_qty',
  sn:
    'prod_name,category,item_no,material,packing,price,quantity,detail,product_size,product_weight,etd_date,remark,inner_size,outer_size,carton_qty,cbm,carton_nw,carton_gw,loading_qty',
  pm:
    'prod_name_en,category,item_no,material,packing,price,product_size,product_weight,remark,inner_size,outer_size,carton_qty,cbm,carton_nw,carton_gw,loading_qty',
  new: 'prod_name_en,supplier,category,material,price,moq',
  buy_new: 'prod_name_en,category,material,price,moq',
  scan: 'prod_name_en,item_no,material,packing,detail,cbm',
  inq: 'prod_name_en,supplier_no,category,material,price,moq',
  buy_inq: 'prod_name_en,supplier_no,category,material,price,moq',
  buy:
    'prod_name_en,category,item_no,material,packing,price,quantity,moq,detail,delivery_day,supplier_no,product_size,product_weight,remark,inner_size,outer_size,carton_qty,cbm,carton_nw,carton_gw,loading_qty',
  pu:
    'prod_name,purchase_price,quantity,supplier,supplier_no,delivery_day,category_cn,item_no,material_cn,packing_cn,detail_cn,product_size,product_weight,inner_size,outer_size,carton_qty,cbm,carton_nw,carton_gw,loading_qty',
  web_list: 'prod_name_en,item_no,price',
  web_detail: {
    main: 'prod_name_en,item_no,price,product_weight,moq',
    other: 'detail,selling_point_en,mg_prod_pic',
  },
  qc:
    'prod_name,purchase_price,quantity,supplier,supplier_no,delivery_day,category_cn,item_no,material_cn,packing_cn,detail_cn,product_size,product_weight,inner_size,outer_size,carton_qty,cbm,carton_nw,carton_gw,loading_qty',
}
