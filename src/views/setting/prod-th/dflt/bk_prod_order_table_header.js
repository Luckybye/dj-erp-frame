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
    title: '配载/计划',
    title_en: 'Load/Plan Qty',
    fixed: false,
    resizable: true,
    type: '',
    disabled: true,
    display: [
      {
        unit: '',
        sort: '',
        line: '',
        id: 'load_plan_qty',
      },
    ],
  },
  {
    title: '总件数',
    title_en: 'CTN',
    fixed: false,
    resizable: true,
    type: '',
    display: [
      {
        unit: '',
        sort: '',
        line: '',
        id: 'ctn',
      },
    ],
  },
  {
    title: '外箱尺寸',
    title_en: 'Outer Size',
    fixed: false,
    resizable: true,
    type: '',
    slot: 'th_outer_size',
    display: [
      {
        unit: '',
        sort: '',
        line: '',
        id: 'outer_size',
      },
    ],
  },
  {
    title: '单箱毛净体',
    title_en: '单箱毛净体',
    fixed: false,
    resizable: true,
    type: '',
    slot: 'th_single_gw_nw_cbm',
    display: [
      {
        unit: '',
        sort: '',
        line: '',
        id: 'single_gw_nw_cbm',
      },
    ],
  },
  {
    title: '操作',
    title_en: 'Action',
    fixed: false,
    resizable: true,
    type: '',
    slot: 'th_action',
    display: [
      {
        unit: '',
        sort: '',
        line: '',
        id: 'action',
      },
    ],
  },
]
