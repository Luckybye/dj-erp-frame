/* eslint-disable */
let common = [
  {
    table: 'pi_contract',
    key: 'contract_no',
    value: '',
    text: '订单号',
    rules: 'require',
    bill_check: 'sc',
  },
  {
    table: 'pi_contract',
    key: 'seller_id',
    value: '',
    text: '我方公司',
    rules: 'require',
    bill_check: 'sc',
  },
  {
    table: 'pi_contract',
    key: 'busi_user',
    value: '',
    text: '业务员',
    rules: 'require',
    bill_check: 'sc',
  },
  {
    table: 'pi_contract',
    key: 'busi_group_id',
    value: '',
    text: '工作组',
    rules: 'require',
    bill_check: 'sc',
  },
  {
    table: 'pi_contract',
    key: 'buyer_id',
    value: '',
    text: '客户',
    rules: 'require',
    bill_check: 'sc',
  },
  {
    table: 'pi_contract',
    key: 'contact',
    value: '',
    text: '客户联系人',
    rules: 'require',
    bill_check: 'sc',
  },
  {
    table: 'pi_contract',
    key: 'currency',
    value: '',
    text: '销售币种',
    bill_check: 'sc',
  },
  {
    table: 'pi_contract',
    key: 'pu_currency',
    value: '',
    text: '采购币种',
    rules: 'require',
    bill_check: 'sc',
  },
  {
    table: 'pi_contract',
    key: 'trade_term',
    value: '',
    text: '贸易方式',
    rules: 'require',
    bill_check: 'sc',
  },
  {
    table: 'pi_contract',
    key: 'tran_type',
    value: '',
    text: '运输方式',
    rules: 'require',
    bill_check: 'sc',
  },
  {
    table: 'pi_contract',
    key: 'shipment_date',
    value: null,
    text: '出运日期',
    rules: 'require',
    bill_check: 'sc',
  },
  {
    table: 'pi_contract',
    key: 'load_port',
    value: '',
    text: '起运港',
    rules: 'require',
    bill_check: 'sc',
  },
  {
    table: 'pi_contract',
    key: 'unload_port',
    value: '',
    text: '目的港',
    rules: 'require',
    bill_check: 'sc',
  },
  {
    table: 'pi_contract',
    key: 'cust_po_no',
    value: '',
    text: '客户PO号',
    rules: 'require',
    bill_check: 'sc',
  },
  {
    table: 'pi_contract',
    key: 'shipment_desc',
    value: '',
    text: '出运日期描述',
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
    key: 'mg_charge',
    value: {
      discount_rate: '',
      commission_rate: ''
    },
    text: '明佣暗佣',
    rules: 'require'
  },
  {
    table: 'pi_bills',
    key: 'mg_payment',
    value: {text: ''},
    text: '付款方式',
    rules: 'require',
    bill_check: 'sc',
  },
  {
    table: 'pi_bills',
    key: 'mg_main_mark',
    value: {text: '', upload: []},
    text: '正唛',
    rules: '',
    bill_check: 'sc',
  },
  {
    table: 'pi_bills',
    key: 'mg_side_mark',
    value: {text: '', upload: []},
    text: '侧唛',
    rules: ''
  },
  {
    table: 'pi_contract',
    key: 'delivery_addr',
    value: '',
    text: '送货地址',
    rules: 'require'
  },
  {
    table: 'pi_bills',
    key: 'mg_sc_terms',
    value: '',
    text: '订单销售条款',
    rules: 'require'
  },
  {
    table: 'pi_contract',
    key: 'account_no',
    value: '',
    text: '我方银行',
    rules: '',
    bill_check: 'sc',
  },
  {
    table: 'pi_contract',
    key: 'forwarder',
    value: '',
    text: '指定货代',
    rules: '',
    bill_check: 'sc',
  },
  {
    table: 'pi_contract',
    key: 'forwarder_contact',
    value: '',
    text: '指定货代联系人',
    rules: '',
    bill_check: 'sc',
  },
  {
    table: 'pi_contract',
    key: 'remark',
    value: '',
    text: '备注',
    rules: '',
    bill_check: 'sc',
  },
]

let special = []  //个别公司定制字段，加上com_id

export default {
  common,
  special
}