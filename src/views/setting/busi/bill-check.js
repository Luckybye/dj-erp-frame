import {cloneDeep} from 'lodash';
let get = window._g.getBillCheckFields
// let pmProd = get('prod', 'pm')
let scProd = get('prod', 'sc')
// let puProd = get('prod', 'pu')
let sc = get('sc', 'sc')
// let pu = get('pu')
let cust = get('cust', 'sc')
let sup = get('sup', 'sc')

export default [
  // {
  //   title: '商品档案',
  //   type: 'pm,check',
  //   events: [
  //     {
  //       event: 'pm_public',
  //       name: '上架',
  //       subjects: [
  //         {
  //           fields: cloneDeep(pmProd),
  //           name: '商品',
  //           type: 'prod',
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   title: '洽谈',
  //   type: 'qu,check',
  //   events: [
  //     {
  //       event: 'qu_quote',
  //       name: '报价',
  //       subjects: [
  //         {
  //           fields: cloneDeep(sc),
  //           name: '洽谈',
  //           type: 'bill',
  //         },
  //         {
  //           fields: cloneDeep(scProd),
  //           name: '洽谈商品',
  //           type: 'prod',
  //         },
  //         {
  //           fields: cloneDeep(cust),
  //           name: '客户',
  //           type: 'cust',
  //         },
  //         {
  //           fields: cloneDeep(sup),
  //           name: '供应商',
  //           type: 'sup',
  //         },
  //       ],
  //     },
  //     {
  //       event: 'qu_submit',
  //       name: '创建订单',
  //       subjects: [
  //         {
  //           fields: cloneDeep(sc),
  //           name: '洽谈',
  //           type: 'bill',
  //         },
  //         {
  //           fields: cloneDeep(scProd),
  //           name: '洽谈商品',
  //           type: 'prod',
  //         },
  //         {
  //           fields: cloneDeep(cust),
  //           name: '客户',
  //           type: 'cust',
  //         },
  //         {
  //           fields: cloneDeep(sup),
  //           name: '供应商',
  //           type: 'sup',
  //         },
  //       ],
  //     },
  //   ],
  // },
  {
    title: '订单',
    type: 'sc,check',
    events: [
      {
        event: 'sc_submit',
        name: '外销订单提交',
        subjects: [
          {
            fields: cloneDeep(sc),
            name: '订单',
            type: 'bill',
            require: ['contract_no', 'seller_id', 'busi_user', 'busi_group_id', 'buyer_id', 'contact', 'trade_term', 'shipment_date', 'currency', 'pu_currency', 'mg_payment'],
          },
          {
            fields: cloneDeep(scProd),
            name: '订单商品',
            type: 'prod',
            require: ['prod_source', 'sell_price', 'sell_quantity', 'prod_name_en'],
          },
          {
            fields: cloneDeep(cust),
            name: '客户',
            type: 'cust',
          },
          {
            fields: cloneDeep(sup),
            name: '供应商',
            type: 'sup',
          },
        ],
      },
      // {
      //   event: 'sn_submit',
      //   name: '内销订单提交',
      //   subjects: [
      //     {
      //       fields: cloneDeep(sc),
      //       name: '订单',
      //       type: 'bill',
      //     },
      //     {
      //       fields: cloneDeep(scProd),
      //       name: '订单商品',
      //       type: 'prod',
      //     },
      //     {
      //       fields: cloneDeep(cust),
      //       name: '客户',
      //       type: 'cust',
      //     },
      //     {
      //       fields: cloneDeep(sup),
      //       name: '供应商',
      //       type: 'sup',
      //     },
      //   ],
      // },
    ],
  },
  // {
  //   title: '采购',
  //   type: 'pu,check',
  //   events: [
  //     {
  //       event: 'pu_submit',
  //       name: '采购提交',
  //       subjects: [
  //         {
  //           fields: cloneDeep(pu),
  //           name: '采购单',
  //           type: 'bill',
  //         },
  //         {
  //           fields: cloneDeep(puProd),
  //           name: '采购商品',
  //           type: 'prod',
  //         },
  //         {
  //           fields: cloneDeep(cust),
  //           name: '客户',
  //           type: 'cust',
  //         },
  //         {
  //           fields: cloneDeep(sup),
  //           name: '供应商',
  //           type: 'sup',
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   title: '订舱',
  //   type: 'bk,check',
  //   events: [
  //     {
  //       event: 'pm_public',
  //       name: '',
  //       fields: {
  //         bill: [],
  //         prod: [],
  //         cust: [],
  //         sup: []
  //       }
  //     }
  //   ]
  // }
]
