export default [
  {
    title: "序号",
    title_en: "NO.",
    fixed: false,
    resizable: true,
    type: "index",
    slot: "",
    display: [{ unit: "", sort: "", id: "index" }],
  },
  {
    title: "产品",
    title_en: "Product",
    fixed: false,
    resizable: true,
    type: "",
    slot: "th_main_pic",
    display: [{ unit: "", sort: "", id: "main_pic" }],
  },
  {
    title: "描述",
    title_en: "Description",
    fixed: false,
    resizable: true,
    type: "",
    slot: "",
    display: [
      { unit: "", sort: "", id: "prod_name_en", line: '2' },
      { unit: "", sort: "", id: "item_no" },
    ],
  },
  {
    title: "型号",
    title_en: "Model",
    fixed: false,
    resizable: true,
    type: "",
    slot: "",
    display: [
      { unit: "", sort: "", id: "model" },
      { unit: "", sort: "", id: "original_prod_no" },
    ],
  },
  {
    title: "销售数量",
    title_en: "Quantity",
    fixed: false,
    resizable: true,
    type: "",
    slot: "th_sell_quantity",
    display: [{ unit: "", sort: "", id: "edit_sell_quantity" }],
  },
  {
    title: "销售单价",
    title_en: "Price",
    fixed: false,
    resizable: true,
    type: "",
    slot: "th_sell_price",
    display: [{ unit: "", sort: "", id: "edit_sell_price" }],
  },
  {
    title: "出运日",
    title_en: "Shipment Date",
    fixed: false,
    resizable: true,
    type: "",
    slot: "th_etd_date",
    display: [{ unit: "", sort: "", id: "edit_etd_date" }],
  },
  {
    title: "交货期",
    title_en: "Delivery Date",
    fixed: false,
    resizable: true,
    type: "",
    slot: "th_delivery_date",
    display: [{ unit: "", sort: "", id: "edit_delivery_date" }],
  },
  {
    title: "状态",
    title_en: "Status",
    fixed: false,
    resizable: true,
    type: "",
    slot: "th_sc_prod_status",
    display: [{ unit: "", sort: "", id: "sc_prod_status" }],
  },
  {
    title: "供应商",
    title_en: "Supplier",
    fixed: false,
    resizable: true,
    type: "",
    slot: "th_sc_supplier",
    display: [{ unit: "", sort: "", id: "edit_seller_id" }],
  },
  {
    title: "操作",
    title_en: "Action",
    fixed: false,
    resizable: true,
    type: "",
    slot: "th_action",
    display: [{ unit: "", sort: "", id: "action" }],
  },
]