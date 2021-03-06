export default [
  {
    title: '序号',
    title_en: 'NO',
    fixed: false,
    resizable: true,
    type: 'index',
    display: [
      {
        unit: '',
        sort: '',
        line: '',
        id: 'index',
      },
    ],
  },
  {
    title: '产品',
    title_en: 'Product',
    fixed: false,
    resizable: true,
    type: '',
    slot: 'th_main_pic',
    display: [
      {
        unit: '',
        sort: '',
        line: '',
        id: 'main_pic',
      },
    ],
  },
  {
    title: '描述',
    title_en: 'Description',
    fixed: false,
    resizable: true,
    type: '',
    display: [
      {
        unit: '',
        sort: '',
        line: '2',
        id: 'prod_name_en',
      },
      {
        unit: '',
        sort: '',
        line: '',
        id: 'item_no',
      },
    ],
  },
  {
    title: '订单号/客户PO',
    title_en: 'SC/Cust PO NO.',
    fixed: false,
    resizable: true,
    type: '',
    display: [
      {
        unit: '',
        sort: '',
        line: '',
        id: 'contract_no',
        link: true,
      },
      {
        unit: '',
        sort: '',
        line: '',
        id: 'cust_po_no',
      },
    ],
  },
  {
    title: '型号/ERP品号',
    title_en: 'Model/ERP NO.',
    fixed: false,
    resizable: true,
    type: '',
    display: [
      {
        unit: '',
        sort: '',
        line: '',
        id: 'model',
      },
      {
        unit: '',
        sort: '',
        line: '',
        id: 'supplier_no',
      },
    ],
  },
  {
    title: '客户货号',
    title_en: 'Cust Prod NO.',
    fixed: false,
    resizable: true,
    type: '',
    display: [
      {
        unit: '',
        sort: '',
        line: '',
        id: 'cust_prod_no',
      },
    ],
    width: '',
    minWidth: '',
  },
  {
    title: '发货/计划数量',
    title_en: 'Load/Plan Qty',
    fixed: false,
    resizable: true,
    type: '',
    display: [
      {
        unit: '',
        sort: '',
        line: '',
        id: 'load_quantity',
      },
      {
        unit: '',
        sort: '',
        line: '',
        id: 'plan_qty',
      },
    ],
    width: '',
    minWidth: '',
  },
  {
    title: '毛重',
    title_en: 'G.W.',
    fixed: false,
    resizable: true,
    type: '',
    display: [
      {
        unit: '',
        sort: '',
        line: '',
        id: 'load_gw',
      },
    ],
    width: '',
    minWidth: '',
  },
  {
    title: '件数',
    title_en: 'CTN',
    fixed: false,
    resizable: true,
    type: '',
    display: [
      {
        unit: '',
        sort: '',
        line: '',
        id: 'load_ctn',
      },
    ],
    width: '',
    minWidth: '',
  },
  {
    title: '体积',
    title_en: 'CBM',
    fixed: false,
    resizable: true,
    type: '',
    display: [
      {
        unit: '',
        sort: '',
        line: '',
        id: 'load_cbm',
      },
    ],
    width: '',
    minWidth: '',
  },
  {
    title: '金额',
    title_en: 'Amount',
    fixed: false,
    resizable: true,
    type: '',
    slot: 'th_amount',
    display: [
      {
        unit: '',
        sort: '',
        line: '',
        id: 'amount',
      },
    ],
    width: '',
    minWidth: '',
  },
]
