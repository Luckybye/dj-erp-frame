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
    title: "数量",
    title_en: "Quantity",
    fixed: false,
    resizable: true,
    type: "",
    slot: "th_quantity",
    display: [{ unit: "", sort: "", id: "edit_quantity" }],
  },
  {
    title: "单价",
    title_en: "Price",
    fixed: false,
    resizable: true,
    type: "",
    slot: "th_price",
    display: [{ unit: "", sort: "", id: "edit_price" }],
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
    slot: "th_delivery_date",
    display: [{ unit: "", sort: "", id: "edit_delivery_date" }],
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