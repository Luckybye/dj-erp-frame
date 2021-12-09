/* eslint-disable */
let common = [
  {
    table: 'cust_company',
    value: '',
    rules: 'require',
    key: 'com_name',
    text: '公司名称'
  },
  {
    table: 'cm_companys',
    value: {mg_rating: '主页'},
    rules: 'require',
    key: 'mg_credit',
    text: ''
  },
  {
    table: 'cm_companys',
    value: '',
    rules: 'require',
    key: 'mg_main_mark',
    text: '公司文件'
  },
  {
    table: 'cust_company',
    value: '',
    rules: 'require',
    key: 'com_nick',
    text: '公司地址'
  },
  {
    table: 'cm_companys',
    value: {
      credit_line: '联系电话',
      insurance_amount: '员工规模'
    },
    rules: 'require',
    key: 'mg_assess',
    text: ''
  },
  {
    table: 'cm_companys',
    value: '',
    rules: 'require',
    key: 'mg_side_mark',
    text: '支付方式'
  },
  {
    table: 'cust_company',
    value: '',
    rules: 'require',
    key: 'address',
    text: '税号'
  },
  {
    table: 'cm_companys',
    value: '',
    rules: 'require',
    key: 'mg_package_drop_test',
    text: '付款方式'
  },
  {
    table: 'cm_companys',
    value: '',
    rules: 'require',
    key: 'mg_inner_account',
    text: '公司简介'
  },
  {
    table: 'cm_companys',
    value: {commission_cust_id: '明佣支付对象'},
    rules: 'require',
    key: 'mg_charge',
    text: ''
  },
  {
    table: 'cm_companys',
    value: '',
    rules: 'require',
    key: 'mg_inspection_request',
    text: '银行信息'
  },
  {
    table: 'cust_company',
    value: '',
    rules: 'require',
    key: 'audit_status',
    text: '审批'
  },
  {
    table: 'cust_company',
    value: '',
    rules: 'require',
    key: 'payment_id',
    text: '付款方式'
  },
]

let special = []  //个别公司定制字段，加上com_id

export default {
  common,
  special
}