export default {
  key: 'bk',
  timelines: [
    {
      key: "booking",
      value: "托单",
      name: "托单",
      name_en: "Booking",
      isSelected: true,
      part: "BkTerms",
      require: true,
      show: v => v.bill_status === 'open' ||
                 v.is_ng === 'yes',
      finish: v => v.bill_status !== 'open'
    },
    {
      key: "inspection",
      value: "验货",
      name: "验货",
      name_en: "Inspection",
      isSelected: true,
      part: "BkQcList",
      finish: v => v.is_qc === 'yes'
    },
    // {
    //   key: "warehousing_loading",
    //   value: "进仓/装柜通知",
    //   name: "进仓/装柜通知",
    //   name_en: "Warehousing / loading",
    //   isSelected: true,
    //   part: "",
    // },
    {
      key: "loading_confirmation",
      value: "装柜确认",
      name: "装柜确认",
      name_en: "Loading confirmation",
      isSelected: true,
      part: "BkLoad",
      require: true,
      show: v => v.bill_status === 'normal' &&
                 v.is_load === 'no',
      finish: v => v.is_load === 'yes'
    },
    {
      key: "delivery_details",
      value: "出库明细",
      name: "出库明细",
      name_en: "Delivery details",
      isSelected: true,
      part: "BkInveOut",
    },
    {
      key: "shipping_settlement",
      value: "销售结算",
      name: "销售结算",
      name_en: "Sales settlement",
      isSelected: true,
      part: "BkScSettle",
      show: v => v.bill_status === 'normal' &&
                 v.is_load === 'yes' &&
                 v.is_st === 'no',
      finish: v => v.is_st === 'yes'
    },
    {
      key: "customs_clearance",
      value: "报关",
      name: "报关",
      name_en: "Customs clearance",
      isSelected: true,
      part: "BkDeclList",
      require: true,
      show: v => v.bill_status === 'normal' &&
                 v.is_load === 'yes' &&
                 v.is_st === 'yes' &&
                 v.is_decl === 'no',
      finish: v => v.is_decl === 'yes'
    },
    {
      key: "bill_of_lading",
      value: "提单",
      name: "提单",
      name_en: "Bill of lading",
      isSelected: true,
      part: "BkBl",
      require: true,
      show: v => v.bill_status === 'normal' &&
                 v.is_load === 'yes' &&
                 v.is_st === 'yes' &&
                 v.is_decl === 'yes' &&
                 v.is_bl === 'no',
      finish: v => v.is_bl === 'yes'
    },
    {
      key: "pu_settlement",
      value: "采购结算",
      name: "采购结算",
      name_en: "Purchase settlement",
      isSelected: true,
      part: "BkPuSettle",
      show: v => v.bill_status === 'normal' &&
                 v.is_load === 'yes' &&
                 v.is_st === 'yes' &&
                 v.is_decl === 'yes' &&
                 v.is_bl === 'yes' &&
                 v.is_pu_st === 'no',
      finish: v => v.is_pu_st === 'yes'
    },
    {
      key: "fee_settlement",
      value: "费用结算",
      name: "费用结算",
      name_en: "Fee settlement",
      isSelected: true,
      part: "BkFeeSettle",
      show: v => v.bill_status === 'normal' &&
                 v.is_load === 'yes' &&
                 v.is_st === 'yes' &&
                 v.is_decl === 'yes' &&
                 v.is_bl === 'yes' &&
                 v.is_forw_st === 'no',
      finish: v => v.is_forw_st === 'yes'
    },
    {
      key: "invoice",
      value: "议付",
      name: "议付",
      name_en: "Invoice",
      isSelected: true,
      part: "BkCiplList",
      require: true,
      show: v => v.bill_status === 'normal' &&
                 v.is_load === 'yes' &&
                 v.is_st === 'yes' &&
                 v.is_decl === 'yes' &&
                 v.is_bl === 'yes' &&
                 v.is_pu_st === 'yes' &&
                 v.is_ng === 'no',
      finish: v => v.is_ng === 'yes'
    },
    {
      key: "ar",
      value: "收款",
      name: "收款",
      name_en: "AR",
      isSelected: true,
      part: "ArList",
    },
    {
      key: "payment",
      value: "费用",
      name: "费用",
      name_en: "Payment",
      isSelected: true,
      part: "BkFeeList",
    },
    {
      key: "pu_vat",
      value: "开票通知",
      name: "开票通知",
      name_en: "开票通知",
      isSelected: false,
      part: "PuBillingNotice",
    },
    {
      key: "claim",
      value: "索赔",
      name: "索赔",
      name_en: "Claim",
      isSelected: true,
      part: "BkClaimList",
    },
    {
      key: "document",
      value: "文档",
      name: "文档",
      name_en: "Document",
      isSelected: true,
      part: "BkFiles",
    },
  ]
}
