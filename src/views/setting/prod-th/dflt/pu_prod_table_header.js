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
    title: "客户货号",
    title_en: "客户货号",
    fixed: false,
    resizable: true,
    type: "",
    slot: "",
    display: [
      { unit: "", sort: "", id: "cust_prod_no"},
      { unit: "", sort: "", id: "cust_prod_barcode"},
      { unit: "", sort: "", id: "cust_po_no" },
    ],
  },
  {
    title: "中文品名",
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
    title: "计划量",
    title_en: "Plan Quantity",
    fixed: false,
    resizable: true,
    type: "",
    slot: "",
    display: [{ unit: "", sort: "", id: "plan_qty" }],
  },
  {
    title: "数量",
    title_en: "Quantity",
    fixed: false,
    resizable: true,
    type: "",
    display: [{ unit: "", sort: "", id: "quantity" }],
  },
  {
    title: "单价",
    title_en: "Price",
    fixed: false,
    resizable: true,
    type: "",
    display: [{ unit: "", sort: "", id: "pu_price" }],
  },
  {
    title: "总价",
    title_en: "Total price",
    fixed: false,
    resizable: true,
    type: "",
    display: [
      { unit: "", sort: "", id: "total_amt" },
    ],
  },
  {
    title: "交货期",
    title_en: "Delivery Date",
    fixed: false,
    resizable: true,
    type: "",
    display: [{ unit: "", sort: "", id: "delivery_date" }],
  },
]