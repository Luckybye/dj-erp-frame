import { currencyFormat } from "../utils/filters";
import moment from 'dayjs'
export const notes = [
  {
    note_code: "all_normal_prod",
    note_name: "全部产品",
    note_name_en: "All Products",
    req_url: "/api/b2b/queryPortalProduct",
    remark: "所有有效的产品数量",
    source: 'PT',
    path: 'PmList',
    getData(v) {
      return v.prod_all_count;
    },
  },
  {
    note_code: "new_prod_this_year",
    note_name: "本年新增",
    note_name_en: "New Products",
    req_url: "/api/b2b/queryPortalProduct",
    remark: "当前自然年度新创建的产品数量",
    source: 'PT',
    path: 'PmList',
    query: {
      search: {create_date_start: new Date(moment().startOf('year'))}
    },
    getData(v) {
      return v.prod_new_count;
    },
  },
  {
    note_code: "public_prod",
    note_name: "已上架",
    note_name_en: "Published Products",
    req_url: "/api/b2b/queryPortalProduct",
    remark: "已在公司官网上架的产品数量",
    source: 'PT',
    path: 'ShopProd',
    query: {
      search: {shop_status: 'normal'}
    },
    getData(v) {
      return v.prod_onshop_count;
    },
  },
  {
    note_code: "removed_prod",
    note_name: "已下架",
    note_name_en: "Products removed from website",
    req_url: "/api/b2b/queryPortalProduct",
    remark: "曾经在公司官网上架的产品数量",
    source: 'PT',
    path: 'ShopProd',
    query: {
      search: {shop_status: 'stop'}
    },
    getData(v) {
      return v.prod_downshop_count;
    },
  },
  {
    note_code: "unpublic_prod",
    note_name: "未上架",
    note_name_en: "Unpublished Products",
    req_url: "/api/b2b/queryPortalProduct",
    remark: "未在公司官网上架的产品数量",
    source: 'PT',
    path: 'ShopProd',
    query: {
      search: {shop_status: 'free'}
    },
    getData(v) {
      return v.prod_noshop_count;
    },
  },
  {
    note_code: "all_cust",
    note_name: "全部客户",
    note_name_en: "All Customers",
    req_url: "/api/b2b/queryPortalCustomer",
    remark: "公司所有的客户数量",
    source: 'CU',
    path: 'CustList',
    getData(v) {
      return v.cust_all_count;
    },
  },
  {
    note_code: "ordered_cust",
    note_name: "成交客户",
    note_name_en: "Contract Customers",
    req_url: "/api/b2b/queryPortalCustomer",
    remark: "所有下过订单的客户数量",
    source: 'CU',
    path: 'CustList',
    query: {
      search: {have_deal: 'yes'}
    },
    getData(v) {
      return v.cust_deal_count;
    },
  },
  {
    note_code: "new_cust_this_year",
    note_name: "本年新增",
    note_name_en: "New Customers This Year",
    req_url: "/api/b2b/queryPortalCustomer",
    remark: "当前自然年度新创建的客户数量",
    source: 'CU',
    path: 'CustList',
    query: {
      search: {create_date_start: new Date(moment().startOf('year'))}
    },
    getData(v) {
      return v.cust_year_new_count;
    },
  },
  {
    note_code: "new_cust_this_month",
    note_name: "本月新增",
    note_name_en: "New Customers This Month",
    req_url: "/api/b2b/queryPortalCustomer",
    remark: "当前自然月度新创建的客户数量",
    source: 'CU',
    path: 'CustList',
    query: {
      search: {create_date_start: new Date(moment().startOf('month'))}
    },
    getData(v) {
      return v.cust_month_new_count;
    },
  },
  {
    note_code: "cust_register",
    note_name: "注册申请",
    note_name_en: "Application for registration",
    req_url: "/api/b2b/queryPortalCustomer",
    remark: "注册申请中未处理的数量",
    source: 'CU',
    path: 'CustList',
    query: {
      search: {is_register: 'yes'}
    },
    getData(v) {
      return v.cust_register_count;
    },
  },
  {
    note_code: "pend_inq",
    note_name: "待处理询盘",
    note_name_en: "Pending Inquiries",
    req_url: "/api/b2b/queryPortalQuote",
    remark: "收到的未做处理的客户询盘数量",
    source: 'QU',
    path: 'MarketingInquiryList',
    query: {
      search: {sell_busi_status: 'free'}
    },
    getData(v) {
      return v.quote_undeal_count;
    },
  },
  {
    note_code: "quoted_inq",
    note_name: "已报价",
    note_name_en: "Quotations",
    req_url: "/api/b2b/queryPortalQuote",
    remark: "收到客户询盘并报价的数量",
    source: 'QU',
    path: 'MarketingInquiryList',
    query: {
      search: {sell_busi_status: 'confirmed'}
    },
    getData(v) {
      return v.quote_deal_count;
    },
  },
  {
    note_code: "inq_this_year",
    note_name: "本年询盘",
    note_name_en: "Inquiries This Year",
    req_url: "/api/b2b/queryPortalQuote",
    remark: "当前自然年度收到的客户询盘数量",
    source: 'QU',
    path: 'MarketingInquiryList',
    query: {
      search: {begin_buy_valid_date: new Date(moment().startOf('year'))}
    },
    getData(v) {
      return v.quote_year_count;
    },
  },
  {
    note_code: "inq_this_month",
    note_name: "本月询盘",
    note_name_en: "Inquiries This Month",
    req_url: "/api/b2b/queryPortalQuote",
    remark: "当前自然月度收到的客户询盘数量",
    source: 'QU',
    path: 'MarketingInquiryList',
    query: {
      search: {begin_buy_valid_date: new Date(moment().startOf('month'))}
    },
    getData(v) {
      return v.quote_month_count;
    },
  },
  {
    note_code: "pend_sc",
    note_name: "待处理订单",
    note_name_en: "Pending SC",
    req_url: "/api/b2b/queryPortalContract",
    remark: "新创建的、未做供方交期确认或客户交期确认的订单，\n包含线上订单和线下订单的数量总和",
    source: 'SC',
    path: 'ScPlanList',
    query: {
      search: {query_type: 'free'}
    },
    getData(v) {
      return v.free_count;
    },
  },
  {
    note_code: "unconfirmed_sc_by_supplier",
    note_name: "待供方确认",
    note_name_en: "Unconfirmed SC by Supplier",
    req_url: "/api/b2b/queryPortalContract",
    remark: "已经发给所有供方要求确认交期，但还未收到\n\n全部回复的销售订单数量",
    source: 'SC',
    path: 'ScPlanList',
    query: {
      search: {query_type: 'vend_pending'}
    },
    getData(v) {
      return v.vendor_pending_count;
    },
  },
  {
    note_code: "unconfirmed_sc_by_customer",
    note_name: "待客户确认",
    note_name_en: "Unconfirmed SC by Customer",
    req_url: "/api/b2b/queryPortalContract",
    remark: "已经发给客户，等待客户最终确认，但还未收到\n\n客户回复的销售订单数量",
    source: 'SC',
    path: 'ScPlanList',
    query: {
      search: {query_type: 'buy_pending'}
    },
    getData(v) {
      return v.buyer_pending_count;
    },
  },
  {
    note_code: "confirmed_sc_by_customer",
    note_name: "客户已确认",
    note_name_en: "Confirmed by Customer",
    req_url: "/api/b2b/queryPortalContract",
    remark: "客户最终确认，但业务员还未提交生效的订单数量",
    source: 'SC',
    path: 'ScPlanList',
    query: {
      search: {query_type: 'confirmed'}
    },
    getData(v) {
      return v.buyer_confirm_count;
    },
  },
  {
    note_code: "unshipped_sc",
    note_name: "未发货",
    note_name_en: "Unshipped-SC",
    req_url: "/api/b2b/queryPortalContract",
    remark: "已经生效，但还没有发货的订单数量（发货以议付完成为标志",
    source: 'SC',
    path: 'ScList',
    query: {
      search: {x_status: 'unship'}
    },
    getData(v) {
      return v.unship_count;
    },
  },
  {
    note_code: "partial_shipped_sc",
    note_name: "部分发货",
    note_name_en: "Partial shipped-SC",
    req_url: "/api/b2b/queryPortalContract",
    remark: "已经生效，但该订单下至少还有一个批次还没有发货的\n\n订单数量（发货以议付完成为标志",
    source: 'SC',
    path: 'ScList',
    query: {
      search: {x_status: 'shipping'}
    },
    getData(v) {
      return v.shipping_count;
    },
  },
  {
    note_code: "shipped_sc",
    note_name: "已发货",
    note_name_en: "Shipped",
    req_url: "/api/b2b/queryPortalContract",
    remark: "已经生效，且该订单下所有批次都已经完成发货的订单\n\n数量（发货以议付完成为标志）",
    source: 'SC',
    path: 'ScList',
    query: {
      search: {x_status: 'shipped'}
    },
    getData(v) {
      return v.shipped_count;
    },
  },
  {
    note_code: "new_sc_this_year",
    note_name: "本年订单",
    note_name_en: "SC (Year)",
    req_url: "/api/b2b/queryPortalContract",
    remark: "已经生效，且生效日期为当前自然年度的订单数量",
    source: 'SC',
    path: 'ScList',
    query: {
      search: {
        valid_date_start: new Date(moment().startOf('year')),
        x_status: 'normal'
      },
    },
    getData(v) {
      return v.contract_year_count;
    },
  },
  {
    note_code: "online_order",
    note_name: "在线订单",
    note_name_en: "Online Order",
    req_url: "/api/b2b/queryPortalContract",
    remark: "未生效的在线订单数据",
    source: 'SC',
    path: 'ScList',
    query: {
      search: {founder: 'buy'}
    },
    getData(v) {
      return v.online_count;
    },
  },
  {
    note_code: "booking_in_30_days",
    note_name: "30天内订舱",
    note_name_en: "Booking in 30days",
    req_url: "/api/b2b/queryPortalTransPlan",
    remark: "在30天内需要出运的销售订单",
    source: 'SC',
    path: 'ScList',
    query: {
      search: {
        shipment_date_start: new Date(),
        shipment_date_end: new Date(moment().add(1, 'month')),
      },
    },
    getData(v) {
      return [
        v.no_order_30days_count,
        `${currencyFormat(v.cm_currency)}${v.no_order_30days_amount.fthousands(0)}`
      ]
    },
  },
  {
    note_code: "meeting_order",
    note_name: "洽谈订单",
    note_name_en: "Meeting Order",
    req_url: "/api/b2b/queryPortalTransPlan",
    remark: "洽谈订单",
    source: 'SC',
    path: 'ScList',
    query: {
    },
    getData(v) {
      return ''
    },
  },
  {
    note_code: "un_delivery",
    note_name: "未出运",
    note_name_en: "Partial shipped -Shipping Plan",
    req_url: "/api/b2b/queryPortalTransPlan",
    remark: "所有未出运的产品批次",
    source: 'DE',
    path: 'ShippingPlanList',
    query: {
      search: {is_bl: 'no'}
    },
    getData(v) {
      return [
        v.order_unload_count,
        `${currencyFormat(v.cm_currency)}${v.order_unload_amount.fthousands(0)}`
      ]
    },
  },
  {
    note_code: "shipment_delayed",
    note_name: "出运延期",
    note_name_en: "Shipment Delayed",
    req_url: "/api/b2b/queryPortalTransPlan",
    remark: "以生效的订单产品批次为单位，在未生成发货通知的批次中，客户计划出运日期小于等于当前日期的批次数量",
    source: 'DE',
    path: 'ShippingPlanList',
    query: {
      search: {is_delay: "delay"}
    },
    getData(v) {
      return [
        v.order_delay_load_count,
        `${currencyFormat(v.cm_currency)}${v.order_delay_load_amount.fthousands(0)}`
      ]
    },
  },
  {
    note_code: "supplier_delivery_delayed",
    note_name: "供方交货延期",
    note_name_en: "Supplier Delivery Delayed",
    req_url: "/api/b2b/queryPortalTransPlan",
    remark: "以生效的订单产品批次为单位，在未生成发货通知的批次中，供方的实际交货日期大于计划交货日期的批次数量",
    source: 'DE',
    path: 'ShippingPlanList',
    query: {
      search: {is_pu_delay: "delay"}
    },
    getData(v) {
      return [
        v.order_delay_offer_count,
        `${currencyFormat(v.cm_currency)}${v.order_delay_offer_amount.fthousands(0)}`
      ]
    },
  },
  {
    note_code: "etd_in_30_days",
    note_name: "30天内出运",
    note_name_en: "ETD in 30days",
    req_url: "/api/b2b/queryPortalTransPlan",
    remark: "以生效的订单产品批次为单位，在未生成发货通知的批次中，客户计划出运日期小于等于当前日期+30的批次数量",
    source: 'DE',
    path: 'ShippingPlanList',
    query: {
      search: {
        etd_date_start: new Date(),
        etd_date_end: new Date(moment().add(1, 'month')),
      },
    },
    getData(v) {
      return [
        v.order_30days_count,
        `${currencyFormat(v.cm_currency)}${v.order_30days_amount.fthousands(0)}`
      ]
    },
  },
  {
    note_code: "un_updated_above_7_days",
    note_name: "7天未更新交期",
    note_name_en: "Un-updated above 7 days",
    req_url: "/api/b2b/queryPortalTransPlan",
    remark: "以生效的订单产品批次为单位，在未生成发货通知的批次中，供方实际交期日期更新<当前日期-7的批次数量",
    source: 'DE',
    path: 'ShippingPlanList',
    query: {
      search: {crd_date_time: "in7"}
    },
    getData(v) {
      return v.order_7days_count;
    },
  },
  {
    note_code: "pend_sl",
    note_name: "待处理",
    note_name_en: "Pending Cargo-ready List",
    req_url: "/api/b2b/queryPortalDelivery",
    remark: "新创建、未做供方交期确认或客户交期确认的可发货清单数量",
    source: 'SL',
    path: 'DgList',
    query: {
      search: {query_type: "free"}
    },
    getData(v) {
      return v.free_count;
    },
  },
  {
    note_code: "unconfirmed_sl_by_supplier",
    note_name: "待供方确认",
    note_name_en: "Unconfirmed Cargo-ready list by Supplier",
    req_url: "/api/b2b/queryPortalDelivery",
    remark: "已经发给所有供方要求确认交期，但还未收到\n全部回复的可发货清单数量",
    source: 'SL',
    path: 'DgList',
    query: {
      search: {query_type: "vend_pending"}
    },
    getData(v) {
      return v.vendor_pending_count;
    },
  },
  {
    note_code: "unconfirmed_sl_by_customer",
    note_name: "待客户确认",
    note_name_en: "Unconfirmed Cargo-ready list by Customer",
    req_url: "/api/b2b/queryPortalDelivery",
    remark: "已经发给客户，等待客户最终确认，但还未收到客户回复的可发货清单数量",
    source: 'SL',
    path: 'DgList',
    query: {
      search: {query_type: "buy_pending"}
    },
    getData(v) {
      return v.buyer_confirm_count;
    },
  },
  {
    note_code: "confirmed_sl_by_customer",
    note_name: "客户已确认",
    note_name_en: "Confirmed Cargo-ready list by Customer",
    req_url: "/api/b2b/queryPortalDelivery",
    remark: "客户最终确认，但业务员还未创建发货通知的可发货清单数量",
    source: 'SL',
    path: 'DgList',
    query: {
      search: {query_type: "confirmed"}
    },
    getData(v) {
      return v.buyer_submit_count;
    },
  },
  {
    note_code: "un_booking",
    note_name: "订舱",
    note_name_en: "Un-submitted Booking Confirmation",
    req_url: "/api/b2b/queryPortalBookOrder",
    remark: "未订舱的托单（发货通知）数量",
    source: 'BK',
    path: 'BookingList',
    query: {
      searchModel: {
        x_status: 'un_booking'
      }
    },
    getData(v) {
      return v.un_book_count;
    },
  },
  {
    note_code: "to_be_loaded",
    note_name: "装柜",
    note_name_en: "To be loaded",
    req_url: "/api/b2b/queryPortalBookOrder",
    remark: "已经订舱但未做装柜确认的托单数量",
    source: 'BK',
    path: 'BookingList',
    query: {
      searchModel: {
        x_status: 'no_on_board'
      }
    },
    getData(v) {
      return v.un_load_count;
    },
  },
  {
    note_code: "to_be_settled",
    note_name: "销售结算",
    note_name_en: "To be settled",
    req_url: "/api/b2b/queryPortalBookOrder",
    remark: "已经装柜确认但未做出运结算的托单数量",
    source: 'BK',
    query: {
      searchModel: {
        x_status: 'no_settlement'
      }
    },
    path: 'BookingList',
    getData(v) {
      return v.un_st_count;
    },
  },
  {
    note_code: "to_be_custom_declared",
    note_name: "报关",
    note_name_en: "To be custom declared",
    req_url: "/api/b2b/queryPortalBookOrder",
    remark: "已经出运结算但未做报关的托单数量",
    source: 'BK',
    path: 'BookingList',
    query: {
      searchModel: {
        x_status: 'no_declaration'
      }
    },
    getData(v) {
      return v.un_decl_count;
    },
  },
  {
    note_code: "bl_to_be_issued",
    note_name: "提单",
    note_name_en: "B/L to be issued",
    req_url: "/api/b2b/queryPortalBookOrder",
    remark: "已经报关但未收回提单的托单数量",
    source: 'BK',
    path: 'BookingList',
    query: {
      searchModel: {
        x_status: 'no_lading_bill'
      }
    },
    getData(v) {
      return v.un_bl_count;
    },
  },
  {
    note_code: "shipping_docs_unsubmited",
    note_name: "议付",
    note_name_en: "Shipping docs unsubmited",
    req_url: "/api/b2b/queryPortalBookOrder",
    remark: "已经提单完成但未做议付的托单数量",
    source: 'BK',
    path: 'BookingList',
    query: {
      searchModel: {
        x_status: 'no_negotiation'
      }
    },
    getData(v) {
      return v.un_ng_count;
    },
  },
  {
    note_code: "shipping_docs_unrelease",
    note_name: "放单",
    note_name_en: "Shipping docs unrelease",
    req_url: "/api/b2b/queryPortalBookOrder",
    remark: "已经议付但业务员未授权客户官网可见单证的托单数量",
    source: 'BK',
    path: 'BookingList',
    query: {type: 'document'},
    getData(v) {
      return v.un_agree_count;
    },
  },
  {
    note_code: "negotiated",
    note_name: "已议付",
    note_name_en: "Negotiated",
    req_url: "/api/b2b/queryPortalBookOrder",
    remark: "已经议付但未制证的托单数量",
    source: 'BK',
    path: 'BookingList',
    query: {
      searchModel: {
        x_status: 'negotiated'
      }
    },
    getData(v) {
      return v.un_account_count;
    },
  },
  {
    note_code: "is_account",
    note_name: "已制证",
    note_name_en: "Account",
    req_url: "/api/b2b/queryPortalBookOrder",
    remark: "已经制证的托单数量",
    source: 'BK',
    path: 'BookingList',
    query: {
      searchModel: {
        x_status: 'is_account'
      }
    },
    getData(v) {
      return v.account_count;
    },
  },
  {
    note_code: "pu_st_count",
    note_name: "采购结算",
    note_name_en: "Pu settle",
    req_url: "/api/b2b/queryPortalBookOrder",
    remark: "已经制证的托单数量",
    source: 'BK',
    path: 'BookingList',
    query: {
      searchModel: {
        x_status: 'no_pu_settle'
      }
    },
    getData(v) {
      return v.un_pu_st_count;
    },
  },
  {
    note_code: "forw_count",
    note_name: "费用结算",
    note_name_en: "Fee settle",
    req_url: "/api/b2b/queryPortalBookOrder",
    remark: "已经制证的托单数量",
    source: 'BK',
    path: 'BookingList',
    query: {
      searchModel: {
        x_status: 'no_forw_settle'
      }
    },
    getData(v) {
      return v.un_forw_st_count;
    },
  },
  {
    note_code: "onsale_fair_prod",
    note_name: "可售产品",
    note_name_en: "On Sale Product",
    req_url: "/api/b2b/queryPortalProxyProd",
    remark: "上架至官网，海外代理商可以销售的产品数量",
    source: 'AG',
    path: 'CustMallProd',
    getData(v) {
      return v.sell_count;
    },
  },
  {
    note_code: "unsale_fair_prod",
    note_name: "未售产品",
    note_name_en: "Un-sale Product",
    req_url: "/api/b2b/queryPortalProxyProd",
    remark: "海外代理商可以销售的产品中，未通过订货会向小b客户销售的产品数量",
    source: 'AG',
    path: 'CustMallProd',
    getData(v) {
      return v.unsell_count;
    },
  },
  {
    note_code: "all_fair_cust",
    note_name: "所有门店",
    note_name_en: "All Dealers",
    req_url: "/api/b2b/queryPortalProxyCust",
    remark: "海外代理商下属所有的小b客户数量",
    source: 'AG',
    path: 'FairCust',
    getData(v) {
      return v.all_cust_count;
    },
  },
  {
    note_code: "fair_cust_regist_apply",
    note_name: "注册申请",
    note_name_en: "Local Customer applying for registration",
    req_url: "/api/b2b/queryPortalProxyCust",
    remark: "海外代理商下正在申请注册的小b客户数量",
    source: 'AG',
    path: 'FairCust',
    query: {
      search: {busi_status: 'free'}
    },
    getData(v) {
      return v.active_cust_count;
    },
  },
  {
    note_code: "latest_fair_order",
    note_name: "最新订单",
    note_name_en: "New Order",
    req_url: "/api/b2b/queryPortalProxyRecentOrder",
    remark: "海外代理商下最近一个订货会中，订单数量和金额",
    source: 'AG',
    path: 'FairOrder',
    getData(v) {
      return v.recent_order.order_count;
    },
  },
  {
    note_code: "all_fair_order",
    note_name: "所有订单",
    note_name_en: "Fair - All Orders",
    req_url: "/api/b2b/queryPortalProxyOrders",
    remark: "海外代理商所有订货会的订单数量和金额",
    source: 'AG',
    path: 'FairOrder',
    getData(v) {
      return v.total_orders.order_count;
    },
  },
  {
    note_code: "opening_fair",
    note_name: "当前订货会",
    note_name_en: "Fairs Online",
    req_url: "/api/b2b/queryPortalProxyFair",
    remark: "海外代理商下当前正在进行的订货会数量",
    source: 'AG',
    path: 'FairList',
    getData(v) {
      return v.current_fair;
    },
  },
  {
    note_code: "history_fair",
    note_name: "历史订货会",
    note_name_en: "Fairs Offline",
    req_url: "/api/b2b/queryPortalProxyFair",
    remark: "海外代理商下未在营业期间的订货会数量",
    source: 'AG',
    path: 'FairList',
    getData(v) {
      return v.history_fair;
    },
  },
  {
    note_code: "crd_pending",
    note_name: "交期待确认",
    note_name_en: "Pending CRD",
    req_url: "/api/b2b/queryPortalPurchase",
    remark: "等待交期确认的采购订单（未生效）",
    source: 'PU',
    path: 'PuList',
    query: {
      pu_kind: 'PO',
      search: {vend_busi_status: 'free'}
    },
    getData(v) {
      return v.pending_count;
    },
  },
  {
    note_code: "crd_confirmed",
    note_name: "交期已确认",
    note_name_en: "Confirmed CRD",
    req_url: "/api/b2b/queryPortalPurchase",
    remark: "已经完成交期确认的采购订单",
    source: 'PU',
    path: 'PuList',
    query: {
      pu_kind: 'PO',
      search: {vend_busi_status: 'confirmed'}
    },
    getData(v) {
      return v.confirmed_count;
    },
  },
  {
    note_code: "dg_pending",
    note_name: "发货待确认",
    note_name_en: "发货待确认",
    req_url: "/api/b2b/queryPortalPurchase",
    remark: "",
    source: 'PU',
    path: 'PuList',
    query: {
      pu_kind: 'PO',
      search: {show_status: 'normal,unship'}
    },
    getData(v) {
      return v.pu_pending_count;
    },
  },
  {
    note_code: "dg_confirmed",
    note_name: "发货已确认",
    note_name_en: "发货已确认",
    req_url: "/api/b2b/queryPortalPurchase",
    remark: "",
    source: 'PU',
    path: 'PuList',
    query: {
      pu_kind: 'PO',
      search: {show_status: 'normal,shipped'}
    },
    getData(v) {
      return v.pu_confirmed_count;
    },
  },
  {
    note_code: "po_sign",
    note_name: "PO回签",
    note_name_en: "PO回签",
    req_url: "/api/b2b/queryPortalPurchase",
    remark: "",
    source: 'PU',
    path: 'SignPoList',
    query: {
      search: {is_sign: 'no', sign_day: 5}
    },
    getData(v) {
      return v.sign_count;
    },
  },
  {
    note_code: "meeting_purchase",
    note_name: "洽谈采购",
    note_name_en: "Meeting Purchase",
    req_url: "/api/b2b/queryPortalPurchase",
    remark: "洽谈采购",
    source: 'PU',
    path: 'PuList',
    query: {
      pu_kind: 'PO',
    },
    getData(v) {
      return ''
    },
  },
  {
    note_code: "marketing_share",
    note_name: "营销次数",
    note_name_en: "营销次数",
    req_url: "/api/b2b/queryPortalShare",
    remark: "",
    source: 'Marketing',
    path: 'MarketingOverview',
    getData(v) {
      return v.share_count;
    },
  },
  {
    note_code: "marketing_cust_edm",
    note_name: "营销客户",
    note_name_en: "营销客户",
    req_url: "/api/b2b/queryPortalShare",
    remark: "",
    source: 'Marketing',
    path: 'MarketingCustomerStats',
    getData(v) {
      return v.cust_edm_count;
    },
  },
  {
    note_code: "marketing_cust_inquiry",
    note_name: "询盘客户",
    note_name_en: "询盘客户",
    req_url: "/api/b2b/queryPortalShare",
    remark: "",
    source: 'Marketing',
    path: 'MarketingCustomerStats',
    getData(v) {
      return v.cust_inquiry_count;
    },
  },
  {
    note_code: "marketing_cust_quote",
    note_name: "报价客户",
    note_name_en: "报价客户",
    req_url: "/api/b2b/queryPortalShare",
    remark: "",
    source: 'Marketing',
    path: 'MarketingCustomerStats',
    getData(v) {
      return v.cust_quote_count;
    },
  },
  {
    note_code: "marketing_cust_record",
    note_name: "记录客户",
    note_name_en: "记录客户",
    req_url: "/api/b2b/queryPortalShare",
    remark: "",
    source: 'Marketing',
    path: 'MarketingCustomerStats',
    getData(v) {
      return v.cust_record_count;
    },
  },
  {
    note_code: "marketing_cust_order",
    note_name: "下单客户",
    note_name_en: "下单客户",
    req_url: "/api/b2b/queryPortalShare",
    remark: "",
    source: 'Marketing',
    path: 'MarketingCustomerStats',
    getData(v) {
      return v.cust_order_count;
    },
  },
  {
    note_code: "marketing_prod_inquiry",
    note_name: "询盘产品",
    note_name_en: "询盘产品",
    req_url: "/api/b2b/queryPortalShare",
    remark: "",
    source: 'Marketing',
    path: 'MarketingProdStats',
    getData(v) {
      return v.prod_inquiry_count;
    },
  },
  {
    note_code: "marketing_prod_quote",
    note_name: "报价产品",
    note_name_en: "报价产品",
    req_url: "/api/b2b/queryPortalShare",
    remark: "",
    source: 'Marketing',
    path: 'MarketingProdStats',
    getData(v) {
      return v.prod_quote_count;
    },
  },
  {
    note_code: "marketing_prod_order",
    note_name: "成交产品",
    note_name_en: "成交产品",
    req_url: "/api/b2b/queryPortalShare",
    remark: "",
    source: 'Marketing',
    path: 'MarketingProdStats',
    getData(v) {
      return v.prod_order_count;
    },
  },
];

export const source = [
  { key: "PT", text: "公司产品" },
  { key: "CU", text: "客商档案" },
  { key: "QU", text: "询盘报价" },
  { key: "SC", text: "销售订单" },
  { key: "DE", text: "出运计划" },
  { key: "SL", text: "可发货清单" },
  { key: "BK", text: "托单" },
  { key: "AG", text: "海外代理" },
  { key: "PU", text: "采购订单" },
  { key: "Marketing", text: "营销" },
]

export function registerFilter (Vue) {
  let obj = source._object('key')
  let obj2 = notes._object('note_code')
  Vue.filter('noteFmt', function (f) {
    let v = obj2[f]
    if (!v) return f
    return v.source + '-' + Vue.prototype.$tt(obj[v.source], 'text')
  })
}