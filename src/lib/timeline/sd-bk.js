export default {
  key: 'sd-bk',
  timelines: [
    {
      key: "sd-booking",
      value: "内销发货",
      name: "内销发货",
      name_en: "sd_book",
      isSelected: true,
      part: "SdBkTerms",
      require: true,
      show: v => v.bill_status === 'open' ||
                 v.is_ng === 'yes',
      finish: v => v.bill_status !== 'open'
    },
    {
      key: "loading_confirmation",
      value: "装柜确认",
      name: "装柜确认",
      name_en: "Loading confirmation",
      isSelected: true,
      part: "SdBkLoad",
      require: true,
      show: v => v.bill_status === 'normal' &&
                 v.is_load === 'no',
      finish: v => v.is_load === 'yes'
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
  ]
}
