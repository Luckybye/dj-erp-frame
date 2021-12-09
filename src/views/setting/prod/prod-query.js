const prodList = [
  {
    text: '是否上架',
    text_en: 'Publish',
    key: 'mall_priority',
    desc: '产品上架状态',
    filter: 'web,app',
    component: 'select-priority',
    field: 'mall_priority',
  },
  {
    text: '产品来源',
    text_en: 'Source',
    key: 'source_type',
    desc: '产品来源自公司、客户、供应商',
    filter: 'web,app',
    component: 'select-source-type',
    field: 'source_type',
  },
  {
    text: '产品经理',
    text_en: 'Owner',
    key: 'owner_id',
    desc: '产品经理为某个工作组或具体用户',
    filter: 'web,app',
    component: 'select-group-user',
    field: 'busi_group_id,owner_id',
  },
  {
    text: '创建日期',
    text_en: 'Create Date',
    key: 'create_date',
    desc: '创建的起止日期时间段',
    filter: 'web,app',
    component: 'select-date-range',
    field: 'create_date_start,create_date_end',
  },
  {
    text: '创建日期（时间段）',
    text_en: 'Create Date',
    key: 'quick_create_date',
    desc: '创建的起止日期时间段',
    filter: 'web',
    component: 'select-quick-date',
    field: 'create_date_start,create_date_end',
  },
  {
    text: '更新日期',
    text_en: 'Update Date',
    key: 'update_date',
    desc: '更新的起止日期时间段',
    filter: 'web,app',
    component: 'select-date-range',
    field: 'update_date_start,update_date_end',
  },
  {
    text: '产品分类',
    text_en: 'Category',
    key: 'prod_sorts',
    desc: '所属分类，可多选',
    filter: 'web,app,catalog_share,mall',
    component: 'select-sort',
    field: 'prod_sorts',
  },
  {
    text: '产品品牌',
    text_en: 'Brand',
    key: 'brand_ids',
    desc: '所属品牌，可多选',
    filter: 'web,app,catalog_share,mall',
    component: 'select-brand',
    field: 'brand_ids',
  },
  {
    text: '产品类型',
    text_en: 'Product Type',
    key: 'prod_types',
    desc: '所属类型，可多选',
    filter: 'web,app,catalog_share,mall',
    component: 'select-prod-type',
    field: 'prod_types',
  },
  {
    text: '产品等级',
    text_en: 'Product Level',
    key: 'prod_levels',
    desc: '所属等级，可多选',
    filter: 'web,app,catalog_share,mall',
    component: 'select-prod-level',
    field: 'prod_levels',
  },
  {
    text: '原产国',
    text_en: 'Original Country',
    key: 'prod_countrys',
    desc: '原产国，可多选',
    filter: 'web,app,mall',
    component: 'select-country',
    field: 'prod_countrys',
  },
  {
    text: '供应商',
    text_en: 'Supplier',
    key: 'supplier_ids',
    desc: '供应商，可多选',
    filter: 'web,app',
    component: 'select-cust-com',
    field: 'supplier_ids',
    extend: {custType: '4'}
  },
  {
    text: '产品标签',
    text_en: 'Product Tag',
    key: 'extend_tags',
    desc: '所属标签，可多选',
    filter: 'web,app,catalog_share,mall',
    component: 'select-prod-label',
    field: 'extend_tags',
  },
  {
    text: '产品参数',
    text_en: 'Product Attribute',
    key: 'attribute',
    desc: '选择此项时，根据产品分类列出该分类下全部产品参数，可多选',
    filter: 'web,app,catalog_share,mall',
    component: 'extend-attribute',
    field: 'extend_natures',
  },
  {
    text: '区域',
    text_en: 'Area',
    key: 'area_id',
    desc: '可见区域',
    filter: 'mall',
    component: '',
    field: 'area_id',
  },
  {
    text: '是否有配件',
    text_en: 'Whether there are sparepart',
    key: 'is_spare',
    desc: '是否有配件',
    filter: 'web',
    component: 'select-yes-no',
    field: 'is_spare',
  },
  {
    text: '售价范围',
    text_en: 'Sell price range',
    key: 'price_range',
    desc: '售价范围',
    filter: 'web',
    component: 'select-input-range',
    field: 'price_start,price_end',
  },
  {
    text: '采购价范围',
    text_en: 'Pu price range',
    key: 'pu_price_range',
    desc: '采购价范围',
    filter: 'web',
    component: 'select-input-range',
    field: 'pu_price_start,pu_price_end',
  },
]

export const selected = {
  web_prod_extend_query_config: 'prod_sorts,owner_id,source_type,mall_priority,create_date,update_date,supplier_ids,prod_countrys',
  app_prod_extend_query_config: 'prod_sorts,owner_id,source_type,mall_priority,create_date,update_date,supplier_ids,prod_countrys',
  share_prod_extend_query_config: 'prod_sorts',
  research_share_prod_extend_query_config: 'prod_sorts',
  mall_prod_extend_query_config: '',
}

function newReg(f) {
  return new RegExp('(^|,)' + f + '(,|$)', 'i')
}
export function getQuery (filter) {
  if (!filter) return prodList
  return prodList.filter(m => newReg(filter).test(m.filter))
}

export function getQueryMap () {
  return prodList._object('key')
}

export function getDefault (k) {
  let d = selected[k]
  if (!d) return []
  d = d.split(',')
  let map = getQueryMap()
  return d.reduce((pre, f) => {
    if (map[f]) pre.push(map[f])
    return pre
  }, [])
}
