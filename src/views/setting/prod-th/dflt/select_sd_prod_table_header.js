export default [
  {
    title: "描述",
    title_en: "Description",
    fixed: false,
    type: "",
    slot: "",
    display: [
      { unit: "", sort: "", id: "prod_name_en", line: '2' },
      { unit: "", sort: "", id: "item_no" },
    ],
  },
  {
    title: "型号/工厂货号",
    title_en: "Model/Supplier No.",
    fixed: false,
    type: "",
    display: [
      { unit: "", sort: "", id: "model" },
      { unit: "", sort: "", id: "supplier_no" }
    ],
  },
  {
    title: "FOB价格",
    title_en: "FOB Price",
    fixed: false,
    type: "",
    display: [{ unit: "", sort: "", id: "fob_price" }],
  },
  {
    title: "操作",
    title_en: "Action",
    fixed: false,
    type: "",
    slot: 'th_sparepart',
    display: [{ unit: "", sort: "", id: "sparepart" }],
  },
]