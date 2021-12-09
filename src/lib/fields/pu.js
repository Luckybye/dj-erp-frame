/* eslint-disable */
let common = [
  {
    table: 'pu_purchase',
    key: 'seller_id',
    value: '',
    text: '供应商',
    rules: 'require'
  },
  {
    table: 'pu_purchase',
    key: 'buyer_id',
    value: '',
    text: '我方公司',
    rules: 'require'
  },
  {
    table: 'pu_purchase',
    key: 'contact',
    value: '',
    text: '供应商联系人',
    rules: 'require'
  },
  {
    table: 'pu_purchase',
    key: 'pu_currency',
    value: '',
    text: '采购币种',
    rules: 'require'
  },
  {
    table: 'pu_purchase',
    key: 'pack_demand',
    value: '',
    text: '包装要求',
    rules: 'require'
  },
  {
    table: 'pu_purchase',
    key: 'sample_demand',
    value: '',
    text: '出货样要求',
    rules: 'require'
  },
  {
    table: 'pu_purchase',
    key: 'delivery_type',
    value: '供应商厂内',
    text: '交货地点',
    rules: 'require'
  },
  {
    table: 'pi_bills',
    key: 'mg_desc',
    value: '',
    text: '合同备注',
    rules: 'require'
  },
  {
    table: 'pu_purchase',
    key: 'delivery_date',
    value: null,
    text: '交货日期',
    rules: 'require'
  },
  {
    table: 'pi_bills',
    key: 'mg_insp_test',
    value: {insp_type: '', test_stand: ''},
    text: '验货方式/检测标准',
    rules: 'require'
  },
  {
    table: 'pi_bills',
    key: 'mg_payment',
    value: {text: ''},
    text: '付款方式',
    rules: 'require'
  },
  {
    table: 'pu_purchase',
    key: 'load_port',
    value: '',
    text: '起运港',
    rules: 'require'
  },
  {
    table: 'pu_purchase',
    key: '目的港',
    value: '',
    text: '付款方式',
    rules: 'require'
  },
  {
    table: 'pi_bills',
    key: 'mg_export_title',
    value: {},
    text: '导出单据抬头'
  },
  {
    table: 'pi_bills',
    key: 'mg_purchase_terms',
    value: '',
    text: '采购合同交易条款'
  }
]

let special = []  //个别公司定制字段，加上com_id

export default {
  common,
  special
}