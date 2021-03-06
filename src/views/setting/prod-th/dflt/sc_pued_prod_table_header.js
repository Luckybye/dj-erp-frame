export default [
  {
    title: "产品",
    title_en: "Product",
    fixed: false,
    resizable: true,
    type: "",
    slot: "th_main_pic",
    display: [{ unit: "", sort: "", line: "", id: "main_pic" }],
  },
  {
    title: "描述",
    title_en: "Description",
    fixed: false,
    resizable: true,
    type: "",
    display: [
      { unit: "", sort: "", line: "2", id: "prod_name_en" },
      { unit: "", sort: "", line: "", id: "item_no" },
    ],
  },
  {
    title: "型号",
    title_en: "Model",
    fixed: false,
    resizable: true,
    type: "",
    display: [
      { unit: "", sort: "", line: "", id: "model" },
      { unit: "", sort: "", line: "", id: "original_prod_no" },
    ],
  },
  {
    title: "客户信息",
    title_en: "Cust information",
    fixed: false,
    resizable: true,
    type: "",
    display: [
      { unit: "", sort: "", line: "", id: "cust_prod_no" },
      { unit: "", sort: "", line: "", id: "cust_po_no" },
    ],
  },
  {
    title: "计划量",
    title_en: "Plan Quantity",
    fixed: false,
    resizable: true,
    type: "",
    display: [{ unit: "", sort: "", line: "", id: "plan_qty" }],
  },
  {
    title: "备货方式",
    title_en: "Product Source",
    fixed: false,
    resizable: true,
    type: "",
    display: [{ unit: "", sort: "", line: "", id: "prod_source" }],
  },
  {
    title: "采购量",
    title_en: "Purchase QTY",
    fixed: false,
    resizable: true,
    type: "",
    slot: "th_pu_quantity",
    display: [{ unit: "", sort: "", line: "", id: "pu_quantity" }],
  },
  {
    title: "采购价",
    title_en: "Purchase Price",
    fixed: false,
    resizable: true,
    type: "",
    display: [{ unit: "", sort: "", line: "", id: "pu_price" }],
  },
  {
    title: "供应商",
    title_en: "Supplier",
    fixed: false,
    resizable: true,
    type: "",
    display: [{ unit: "", sort: "", line: "", id: "seller_id" }],
  },
  {
    title: "日期",
    title_en: "Date",
    fixed: false,
    resizable: true,
    type: "",
    display: [
      { unit: "", sort: "", line: "", id: "create_date" },
      { unit: "", sort: "", line: "", id: "delivery_date" },
    ],
  },
  {
    title: "采购订单号",
    title_en: "Purchase NO.",
    fixed: false,
    resizable: true,
    type: "",
    display: [{ unit: "", sort: "", line: "", id: "purchase_no_link" }],
    slot: "th_sc_pu_link",
  },
];
