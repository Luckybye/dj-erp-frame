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
    title: "总价",
    title_en: "Total amount",
    fixed: false,
    resizable: true,
    type: "",
    display: [{ unit: "", sort: "", id: "total_amt" }],
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