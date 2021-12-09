/*eslint-disable */
import {common} from '@/lib/fields/prod';
export let filename = {
  cn: '商品',
  en: 'Product',
}
let pCn = {}
let pEn = {}
let handlerProdFields = () => {
  for (let i = 0; i < common.length; i++) {
    const m = common[i];
    pCn[m.key] = m.text
    pEn[m.key] = m.text_en
  }
}
handlerProdFields()

export let cn = {
  ...pCn,
  brand: '品牌',
  decl_factor_fmt: '申报要素格式',
  photo: '商品图片',
  prod_type: '产品类型',
  prod_size: '产品尺寸',
  pu_quantity: '采购数量',
  supplier: '工厂',
  exploded_no: '爆炸图号',
  pos_no: 'Pos NO.',
  spare_parts: 'Spare Parts',
  item_erp_no: 'Item/ERP',
  description2: 'Description',
  qty: 'QTY',
  is_sell: '可销售',
  is_buy: '可采购',
  is_service: '劳务',
  is_bom: 'BOM',
  is_spare: 'Spare Parts',
  attr_name: '参数名称',
  impt_attr: '重要参数',
  attr_val: '参数值',
  change: '变更',
  company: '公司',
  country: '国家',
  tariff: '关税率',
  start: '启用',
  prod_nature: '商品属性',
}

export let en = {
  ...pEn,
  brand: 'Brand',
  decl_factor_fmt: '申报要素格式',
  photo: 'Photo',
  prod_type: 'Type',
  prod_size: 'Product Size',
  pu_price: 'Pur. Price',
  pu_quantity: 'Pur. Quantity',
  quantity: 'Quantity',
  seller_id: 'Supplier',
  supplier: 'Supplier',
  exploded_no: 'Exploded No',
  pos_no: 'Pos NO.',
  spare_parts: 'Spare Parts',
  item_erp_no: 'Item/ERP',
  description2: 'Description',
  qty: 'QTY',
  is_sell: 'Marketable',
  is_buy: 'Purchased',
  is_service: '劳务',
  is_bom: 'BOM',
  is_spare: 'Spare Parts',
  attr_name: 'Attribute Name',
  impt_attr: 'Important Attribute',
  attr_val: 'Attribute Val',
  change: 'Change',
  company: 'Company',
  country: '国家',
  tariff: '关税率',
  start: 'Enable',
  prod_nature: 'Prod Nature',
}