// id不能重复，且一旦存入数据库，最好不要修改，修改也要一起修改数据库数据
export const menus = [
  {
    title: "产品列表",
    id: "pm_normal",
    path: "PmList",
    query: {status: 'company'},
  },
  {
    title: "产品管理",
    id: "prod_management",
    path: "ProdManagement",
    query: {},
  },
  {
    title: "产品上传",
    id: "pm_upload",
    path: "ProdUpload",
    query: {},
  },
  {
    title: "图片上传",
    id: "pm_img_upload",
    path: "ProdImgUpload",
    query: {},
  },
  {
    title: "产品同步",
    id: "pm_sync",
    path: "ProdSync",
    query: {},
  },
  {
    title: "产品上架",
    id: "pm_public",
    path: "ShopProd",
    query: {},
  },
  {
    title: "物料列表",
    id: "pm_material",
    path: "",
    query: {sort_type: 'material', status: 'company'},
  },
  {
    title: "历史交易产品",
    id: "pm_order",
    path: "",
    query: {status: 'ordered'},
  },
  {
    title: "客户产品",
    id: "cust_prod",
    path: "CustProdList",
    query: {},
  },
  {
    title: "产品分类",
    id: "pm_sort",
    path: "ProdSort",
    query: {},
  },
  {
    title: "产品相关设置",
    id: "prod_rela_setting",
    path: "ProdRelaSetting",
    query: {},
  },
  {
    title: "海关码",
    id: "pm_hscode",
    path: "PmHscode",
    query: {},
  },
  {
    title: "品牌",
    id: "pm_brand",
    path: "BrandList",
    query: {},
  },
  {
    title: "产品系统属性",
    id: "pm_sys_nature",
    path: "ProdSysNature",
    query: {},
  },
  {
    title: "产品自由属性",
    id: "pm_free_nature",
    path: "ProdFreeNature",
    query: {},
  },
  {
    title: "商品属性",
    id: "pm_nature",
    path: "DefineProdNature",
    query: {},
  },
  {
    title: "商品参数",
    id: "pm_attribute",
    path: "DefineProdNature",
    query: {nature_kind: 'attribute'},
  },
  {
    title: "商品标签",
    id: "pm_tag",
    path: "ProdTag",
    query: {},
  },
  {
    title: "Web端产品卡",
    id: "web_prod_display",
    path: "WebProdDisplay",
    query: {},
  },
  {
    title: "App端产品卡",
    id: "app_prod_display",
    path: "AppProdDisplay",
    query: {},
  },
  {
    title: "App端配置",
    id: "app_setting",
    path: "AppSetting",
    query: {},
  },
  {
    title: "产品导出",
    id: "pm_export",
    path: "ProdExport",
    query: {},
  },
  {
    title: "产品高级搜索配置",
    id: "pm_advace_search_config",
    path: "ProdSearchConfig",
    query: {},
  },
  {
    title: "客户",
    id: "customer_list",
    path: "CustList",
    query: {cust_type: '2'},
  },
  {
    title: "客户管理",
    id: "customer_management",
    path: "CustManagement",
    query: {cust_type: '2'},
  },
  {
    title: "客户佣金表",
    id: "customer_commission",
    path: "CustomerCommission",
    query: {},
  },
  {
    title: "资金计划表",
    id: "busi_fee_plan",
    path: "BusiFeePlanList",
    query: {},
  },
  {
    title: "客户资金明细表",
    id: "busi_fee_cust_detail",
    path: "BusiFeeCustDetailList",
    query: {},
  },
  {
    title: "客户资金占用表",
    id: "busi_fee_cust_occupy",
    path: "BusiFeeCustOccupyList",
    query: {},
  },
  {
    title: "收汇明细表",
    id: "busi_fee_list",
    path: "BusiFeeList",
    query: {},
  },
  {
    title: "联系人多公司",
    id: "cust_ascription",
    path: "CustAscription",
  },
  {
    title: "供应商",
    id: "supplier_list",
    path: "CustList",
    query: {cust_type: '4'},
  },
  {
    title: "服务商",
    id: "service_list",
    path: "CustList",
    query: {cust_type: '9999'},
  },
  {
    title: "物流公司",
    id: "logistics_service_list",
    path: "CustList",
    query: {cust_type: '256'},
  },
  {
    title: "银行",
    id: "bank_service_list",
    path: "CustList",
    query: {cust_type: '128'},
  },
  {
    title: "保险机构",
    id: "insurance_service_list",
    path: "CustList",
    query: {cust_type: '512'},
  },
  {
    title: "快递公司",
    id: "express_service_list",
    path: "CustList",
    query: {cust_type: '8'},
  },
  {
    title: "检测机构",
    id: "test_service_list",
    path: "CustList",
    query: {cust_type: '16'},
  },
  {
    title: "客户相关配置",
    id: "contact_setting",
    path: "CustRelaSetting",
    query: {},
  },
  {
    title: "客户分级",
    id: "customer_level",
    path: "CustLevel",
    query: {},
  },
  {
    title: "客户类型",
    id: "customer_type",
    path: "CustType",
    query: {},
  },
  {
    title: "客户专属",
    id: "customer_exclusive",
    path: "CustExcl",
    query: {},
  },
  {
    title: "客户价格设置",
    id: "customer_price_setting",
    path: "CustPriceSetting",
    query: {},
  },
  {
    title: "世界区域",
    id: "world_area",
    path: "WorldArea",
    query: {},
  },
  {
    title: "常用档案",
    id: "basic_settings",
    path: "BasicSettings",
    query: {},
  },
  {
    title: "收款方式",
    id: "receive_terms",
    path: "ConstantRemittance",
    query: {},
  },
  {
    title: "付款方式",
    id: "cust_payment_terms",
    path: "ConstantPayment",
    query: {},
  },
  {
    title: "贸易条款",
    id: "cust_trade_terms",
    path: "TradeTerms",
    query: {},
  },
  {
    title: "港口",
    id: "cust_port",
    path: "CustPort",
    query: {},
  },
  {
    title: "系统港口",
    id: "sys_port",
    path: "SysPort",
    query: {},
  },
  {
    title: "币种/汇率",
    id: "currency_rate",
    path: "CurrencyRate",
    query: {},
  },
  {
    title: "电子目录",
    id: "catalog_list",
    path: "CatalogList",
    query: {cata_type: 'catalog'},
  },
  {
    title: "官网目录",
    id: "mall_catalog_list",
    path: "MallCatalogList",
    query: {},
  },
  {
    title: "官网目录设置",
    id: "mall_catalog_sort",
    path: "MallCatalogSort",
    query: {},
  },
  {
    title: "数字提案",
    id: "mall_catalog_preview",
    path: "MallCatalogPreview",
    query: {},
  },
  {
    title: "新品调研",
    id: "new_prod_rearch",
    path: "CatalogList",
    query: {cata_type: 'research'},
  },
  {
    title: "客户联系人",
    id: "customer_contacts",
    path: "MarketingCustomerList",
    query: {cust_type: '2'},
  },
  {
    title: "收到询盘",
    id: "received_inquiries",
    path: "MarketingInquiryList",
    query: {},
  },
  {
    title: "报价列表",
    id: "quotation_list",
    path: "QuList",
    query: {},
  },
  {
    title: "营销相关配置",
    id: "marketing_setting",
    path: "MarketingSetting",
    query: {},
  },
  {
    title: "营销记录",
    id: "marketing_records",
    path: "",
    query: {},
  },
  {
    title: "品牌地图",
    id: "brand_map",
    path: "BrandMap",
    query: {},
  },
  // {
  //   title: "营销统计",
  //   id: "marketing_stats",
  //   path: "",
  //   query: {},
  // },
  {
    title: "营销排名",
    id: "marketing_rank",
    path: "",
    query: {},
  },
  {
    title: "营销概况",
    id: "marketing_overview",
    path: "MarketingOverview",
    query: {},
  },
  {
    title: "客户营销统计",
    id: "customer_marketing_stats",
    path: "MarketingCustomerStats",
    query: {},
  },
  {
    title: "客户营销跟踪",
    id: "customer_marketing_log",
    path: "MarketingCustomerLog",
    query: {},
  },
  {
    title: "产品营销统计",
    id: "product_marketing_stats",
    path: "MarketingProdStats",
    query: {},
  },
  {
    title: "客户浏览日志",
    id: "customer_browse_log",
    path: "CustomerBrowseLog",
    query: {},
  },
  {
    title: "买手资料",
    id: "buyer_information",
    path: "",
    query: {},
  },
  {
    title: "市场状态",
    id: "market_state",
    path: "MarketState",
    query: {},
  },
  {
    title: "海关数据",
    id: "customs_data",
    path: "CustomsData",
    query: {},
  },
  {
    title: "统计区域",
    id: "sales_area",
    path: "StatsArea",
    query: {},
  },
  {
    title: "品牌市场维护",
    id: "brand_market",
    path: "StatsBrand",
    query: {},
  },
  {
    title: "Catalog预置",
    id: "catalog_setting",
    path: "",
    query: {},
  },
  {
    title: "调研预置",
    id: "r_d_setting",
    path: "",
    query: {},
  },
  {
    title: "报价配置",
    id: "qutation_setting",
    path: "",
    query: {},
  },
  {
    title: "客户询价配置",
    id: "customer_inquiry_setting",
    path: "",
    query: {},
  },
  {
    title: "研发产品",
    id: "research_product",
    path: "",
    query: {},
  },
  {
    title: "供应商联系人",
    id: "supplier_contact",
    path: "MarketingCustomerList",
    query: {cust_type: '4'},
  },
  {
    title: "询价",
    id: "cust_inquiry",
    path: "",
    query: {},
  },
  {
    title: "待处理订单",
    id: "pending_orders",
    path: "ScPlanList",
    query: {},
  },
  {
    title: "销售订单",
    id: "pi_list",
    path: "ScList",
    query: {},
  },
  {
    title: "展厅订单",
    id: "sc_showroom_list",
    path: "ScShowroomList",
    query: {},
  },
  {
    title: "订单状态表",
    id: "order_status_list",
    path: "OrderStatusList",
    query: {},
  },
  {
    title: "出运计划",
    id: "shipping_plan",
    path: "ShippingPlanList",
    query: {
      search: {
        is_delivery: 'no',
        is_order: 'no'
      }
    },
  },
  {
    title: "订单回签",
    id: "sign_contract_list",
    path: "SignContractList",
    query: {},
  },
  {
    title: "可发货清单",
    id: "cargo_ready_list",
    path: "DgList",
    query: {},
  },
  {
    title: "发货清单确认",
    id: "cargo_confirm_list",
    path: "SupConfirmCrdList",
    query: {type: "dg"}
  },
  {
    title: "发货通知",
    id: "shipping_notice",
    path: "BookingList",
    query: {},
  },
  {
    title: "单证通知",
    id: "document_notice",
    path: "BookingList",
    query: {type: 'document'},
  },
  {
    title: "内销订单",
    id: "domestic_pi_list",
    path: "SdList",
    query: {},
  },
  {
    title: "内销发货",
    id: "sd_booking",
    path: "SdBkList",
    query: {},
  },
  {
    title: "索赔",
    id: "claim_list",
    path: "ClaimsList",
    query: {},
  },
  {
    title: "订单相关设置",
    id: "pi_setting",
    path: "ScSetting",
    query: {},
  },
  {
    title: "Meeting设置",
    id: "meeting_setting",
    path: "MeetingSetting",
    query: {},
  },
  {
    title: "洽谈列表",
    id: "meeting_list",
    path: "MeetingList",
    query: {},
  },
  // {
  //   title: "订单创建&编辑设置",
  //   id: "",
  //   path: "",
  //   query: {},
  // },
  {
    title: "供方交期确认",
    id: "delivery_confirmation",
    path: "SupConfirmCrdList",
    query: {},
  },
  {
    title: "出运跟单",
    id: "order_executive",
    path: "ShippingPlanList",
    query: {
      type: 'order-executive',
      search: {
        is_delivery: 'no',
        is_order: 'no',
        bill_kind: 'SC'
      }
    },
  },
  {
    title: "包装",
    id: "bk_artwork",
    path: "",
    query: {},
  },
  {
    title: "唛头",
    id: "bk_marks",
    path: "",
    query: {},
  },
  {
    title: "样品",
    id: "bk_samples",
    path: "",
    query: {},
  },
  {
    title: "检测",
    id: "bk_test",
    path: "",
    query: {},
  },
  {
    title: "装柜商品明细表",
    id: "booking_prod_list",
    path: "BookingProdList",
    query: {},
  },
  {
    title: "订舱",
    id: "booking",
    path: "BookingList",
    query: {trade_type: 'foreign'},
  },
  {
    title: "出运配置",
    id: "shipping_setting",
    path: "BkSetting",
    query: {},
  },
  {
    title: "采购计划",
    id: "purchase_plan",
    path: "PuPlan",
    query: {},
  },
  {
    title: "采购订单",
    id: "pu_list",
    path: "PuList",
    query: {
      pu_kind: 'PO'
    },
  },
  {
    title: "PO回签",
    id: "sign_po_list",
    path: "SignPoList",
    query: {
    },
  },
  {
    title: "生产计划",
    id: "pu_make_plan",
    path: "",
    query: {},
  },
  {
    title: "进口采购",
    id: "im_pu_list",
    path: "PuList",
    query: {
      pu_kind: 'IM'
    },
  },
  {
    title: "进口订舱",
    id: "im_bk_list",
    path: "ImBkList",
    query: {
    },
  },
  {
    title: "海外仓订单",
    id: "ec_list",
    path: "EcList",
    query: {
    },
  },
  // {
  //   title: "库存",
  //   id: "pu_stock",
  //   path: "",
  //   query: {},
  // },
  {
    title: "采购入库",
    id: "pu_warehousing",
    path: "",
    query: {},
  },
  {
    title: "生产入库",
    id: "make_warehousing",
    path: "",
    query: {},
  },
  {
    title: "组装入库",
    id: "assembing_warehousing",
    path: "",
    query: {},
  },
  {
    title: "其它入库",
    id: "other_warehousing",
    path: "",
    query: {},
  },
  {
    title: "销售出库",
    id: "sale_warehousing",
    path: "",
    query: {},
  },
  {
    title: "领料出库",
    id: "stock_out_production",
    path: "",
    query: {},
  },
  {
    title: "其它出库",
    id: "other_outbound",
    path: "",
    query: {},
  },
  {
    title: "库存查询",
    id: "stock_query",
    path: "StockQuery",
    query: {},
  },
  {
    title: "验货",
    id: "inspection",
    path: "",
    query: {},
  },
  {
    title: "采购配置",
    id: "pu_setting",
    path: "",
    query: {},
  },
  {
    title: "验货配置",
    id: "inspection_setting",
    path: "",
    query: {},
  },
  {
    title: "预收款",
    id: "ar_pre_payment",
    path: "ReceiptRecord",
    query: {
      search: {subj_code: 'amt_sell1'}
    },
  },
  {
    title: "应收款",
    id: "ar_receivable",
    path: "ReceiptRecord",
    query: {
      search: {subj_code: 'amt_sell9'}
    },
  },
  {
    title: "AR查询",
    id: "ar_record",
    path: "ReceiptRecord",
    query: {},
  },
  {
    title: "收汇水单",
    id: "receipt_list",
    path: "ReceiptList",
    query: {},
  },
  {
    title: "认领明细",
    id: "receipt_detail",
    path: "ReceiptDetail",
    query: {},
  },
  // {
  //   title: "逾期收汇",
  //   id: "ar_overdue",
  //   path: "",
  //   query: {},
  // },
  // {
  //   title: "客户费用",
  //   id: "cust_fee",
  //   path: "",
  //   query: {},
  // },
  // {
  //   title: "客户索赔",
  //   id: "cust_claim",
  //   path: "",
  //   query: {},
  // },
  {
    title: "AP查询",
    id: "ap_record",
    path: "PayRecord",
    query: {},
  },
  // {
  //   title: "预付款",
  //   id: "ap_pre_payment",
  //   path: "",
  //   query: {},
  // },
  // {
  //   title: "应付款",
  //   id: "ap_payment",
  //   path: "",
  //   query: {},
  // },
  // {
  //   title: "寄样费",
  //   id: "sample_courier_fee",
  //   path: "",
  //   query: {},
  // },
  // {
  //   title: "检测费",
  //   id: "test_fee",
  //   path: "",
  //   query: {},
  // },
  // {
  //   title: "其它费用",
  //   id: "other_fee",
  //   path: "",
  //   query: {},
  // },
  // {
  //   title: "供应商赔付",
  //   id: "sup_compensation",
  //   path: "",
  //   query: {},
  // },
  // {
  //   title: "逾期付款",
  //   id: "ap_overdue",
  //   path: "",
  //   query: {},
  // },
  {
    title: "SCM Report",
    id: "vmi_scm_report",
    path: "ScmReport",
    query: {},
  },
  {
    title: "Forecast",
    id: "vmi_forecast",
    path: "ForecastList",
    query: {},
  },
  {
    title: "Vendors Reply",
    id: "vmi_vendor_reply",
    path: "",
    query: {},
  },
  {
    title: "Customer Confirm",
    id: "vmi_customer_confirm",
    path: "",
    query: {},
  },
  {
    title: "Ordered",
    id: "vmi_ordered",
    path: "",
    query: {},
  },
  {
    title: "VMI PO",
    id: "vmi_po",
    path: "",
    query: {},
  },
  {
    title: "Forcast配置",
    id: "forcast_setting",
    path: "",
    query: {},
  },
  {
    title: "产品销售统计",
    id: "prod_sale_stats",
    path: "StatsPm",
    query: {},
  },
  {
    title: "品类销售统计",
    id: "category_sale_stats",
    path: "StatsPmCategory",
    query: {},
  },
  {
    title: "采购年度统计",
    id: "sup_year_stats",
    path: "StatsPuYear",
    query: {},
  },
  {
    title: "销售明细",
    id: "pm_detail_stats",
    path: "ShippingPlanList",
    query: {
      colKey: 'stats_pm_prod_table_header',
      search: {
        bill_kind: 'SC'
      }
    },
  },
  {
    title: "采购明细",
    id: "pu_detail_stats",
    path: "StatsPuDetail",
    query: {},
  },
  {
    title: "报价明细",
    id: "qu_detail_stats",
    path: "StatsQuDetail",
    query: {},
  },
  {
    title: "官网设定",
    id: "mall_general_setting",
    path: "MallSetting",
    query: {},
  },
  {
    title: "官网首页",
    id: "mall_home_page",
    path: "MallHomepageDisplay",
    query: {},
  },
  {
    title: "官网产品展示",
    id: "mall_prod_display",
    path: "MallProdDisplay",
    query: {},
  },
  {
    title: "官网高级搜索",
    id: "mall_advance_search",
    path: "MallAdvanceSearch",
    query: {},
  },
  {
    title: "官网日志",
    id: "mall_browse_log",
    path: "MallBrowseLog",
    query: {},
  },
  {
    title: "自营产品",
    id: "self_operated_product",
    path: "ShopProd",
    query: {source_type: 'company'},
  },
  {
    title: "代理产品",
    id: "agency_product",
    path: "ShopProd",
    query: {source_type: 'supplier'},
  },
  {
    title: "客户注册",
    id: "cust_register",
    path: "CustRegister",
    query: {},
  },
  {
    title: "订货会",
    id: "fair",
    path: "FairList",
    query: {},
  },
  {
    title: "数据大屏",
    id: "data_screen",
    path: "",
    query: {},
  },
  {
    title: "我的公司",
    id: "my_com",
    path: "AboutUs",
    query: {},
  },
  {
    title: "子公司",
    id: "my_sub_com",
    path: "ComLegalList",
    query: {},
  },
  // {
  //   title: "公司专票资料",
  //   id: "com_invoicing_info",
  //   path: "",
  //   query: {},
  // },
  // {
  //   title: "公司银行信息",
  //   id: "com_bank_info",
  //   path: "",
  //   query: {},
  // },
  // {
  //   title: "核价规则",
  //   id: "com_price_calc_rule",
  //   path: "",
  //   query: {},
  // },
  // {
  //   title: "业务规范设置",
  //   id: "busi_rule_setting",
  //   path: "",
  //   query: {},
  // },
  {
    title: "报关配置",
    id: "decl_setting",
    path: "",
    query: {},
  },
  {
    title: "公司通讯录",
    id: "staff_list",
    path: "StaffList",
    query: {},
  },
  {
    title: "工作组",
    id: "staff_group",
    path: "StaffGroup",
    query: {},
  },
  {
    title: "公司仓库",
    id: "com_warehouse",
    path: "Warehouse",
    query: {},
  },
  {
    title: "数据归属",
    id: "data_ownship",
    path: "",
    query: {},
  },
  {
    title: "App功能",
    id: "app_function",
    path: "",
    query: {},
  },
  {
    title: "单据输出配置",
    id: "bill_export_setting",
    path: "",
    query: {},
  },
  {
    title: "单据编号配置",
    id: "bill_no_setting",
    path: "BillNo",
    query: {},
  },
  {
    title: "洽谈/订单配置",
    id: "sc_setting",
    path: "ScSetting",
    query: {},
  },
  {
    title: "业务相关配置",
    id: "business_setting",
    path: "BusinessSetting",
    query: {},
  },
  {
    title: "业务常量配置",
    id: "busi_constant",
    path: "BusiConstant",
    query: {},
  },
  {
    title: "业务规则",
    id: "business_rule",
    path: "ComLegalList",
    query: {},
  },
  {
    title: "业务节点",
    id: "business_timeline",
    path: "TimelineSetting",
    query: {},
  },
  {
    title: "产品列表配置",
    id: "prod_thead_setting",
    path: "ProdTheadSetting",
    query: {},
  },
  {
    title: "模板配置",
    id: "template_setting",
    path: "TemplateSetting",
    query: {},
  },
  {
    title: "邮件模板",
    id: "mail_template",
    path: "MailTplSettingList",
    query: {},
  },
  {
    title: "任务配置",
    id: "timeline_task_setting",
    path: "",
    query: {},
  },
  {
    title: "单据相关配置",
    id: "bill_setting",
    path: "BillSetting",
    query: {},
  },
  {
    title: "审批规则",
    id: "approve_rule",
    path: "ApproveRule",
    query: {},
  },
  {
    title: "审批",
    id: "approve_list",
    path: "ApproveList",
    query: {},
  },
  {
    title: "系统登录日志",
    id: "sys_login_log",
    path: "LoginLog",
    query: {},
  },
  {
    title: "系统数据日志",
    id: "sys_data_log",
    path: "",
    query: {},
  },
  {
    title: "登陆门户相关",
    id: "sys_login_related",
    path: "",
    query: {},
  },
  {
    title: "备货进度配置",
    id: "stock_process_setting",
    path: "StockProcessSetting",
    query: {},
  },
  // {
  //   title: "公司菜单",
  //   id: "com_menus",
  //   path: "",
  //   query: {},
  // },
  // {
  //   title: "提醒事项配置",
  //   id: "workbench_tip_setting",
  //   path: "",
  //   query: {},
  // },
  // {
  //   title: "提示板配置",
  //   id: "tip_board_setting",
  //   path: "",
  //   query: {},
  // },
  // {
  //   title: "Portal配置",
  //   id: "portal_setting",
  //   path: "",
  //   query: {},
  // },
  {
    title: "用户管理",
    id: "user_management",
    path: "",
    query: {},
  },
  {
    title: "应用",
    id: "application_management",
    path: "",
    query: {},
  },
  {
    title: "API",
    id: "api",
    path: "",
    query: {},
  },
  {
    title: "合作伙伴",
    id: "cooperative_partner",
    path: "",
    query: {},
  },
  {
    title: "公告",
    id: "sys_notice",
    path: "",
    query: {},
  },
  {
    title: "数据转换",
    id: "excel_change",
    path: "ExcelChange",
    query: {},
  },
  {
    title: "任务类型",
    id: "task_type",
    path: "TaskType",
    query: {},
  },
  {
    title: "任务管理",
    id: "task_management",
    path: "TaskManagement",
    query: {},
  },
  {
    title: "任务查询",
    id: "task_execution_results",
    path: "TaskExecutionResults",
    query: {},
  },
  {
    title: "代理收付款表",
    id: "task_receipt_payment",
    path: "TaskReceiptPayment",
    query: {},
  },
  {
    title: "Sellercloud Setting",
    id: "sellercloud_setting",
    path: "SellercloudSetting",
    query: {},
  },
  {
    title: "Sellercloud Static",
    id: "sellercloud_static",
    path: "SellercloudStatic",
    query: {},
  },
  // {
  //   title: "开发者中心",
  //   id: "developer_center",
  //   path: "",
  //   query: {},
  // },
  {
    title: "基础数据对照",
    id: "dev_basic_data",
    path: "",
    query: {},
  },
  {
    title: "应用API",
    id: "dev_api",
    path: "",
    query: {},
  },
  {
    title: "技术文档",
    id: "dev_document",
    path: "",
    query: {},
  },
  {
    title: "供应商入驻",
    id: "sup_invite",
    path: "InviteCustList",
    query: {
      search: {cust_type: '4'}
    },
  },
  {
    title: "客户入驻",
    id: "cust_invite",
    path: "InviteCustList",
    query: {
      search: {cust_type: '2'}
    },
  },
  {
    title: "客商产品配置",
    id: "cust_prod_setting",
    path: "CustProdSetting",
    query: {
    },
  },
  {
    title: "数据校验",
    id: "bill_check",
    path: "BillCheck"
  },
  {
    title: "关联交易列表",
    id: "rela_deal_list",
    path: "RelaDealList"
  },
  {
    title: "共享文件",
    id: "cloud_disk",
    path: "CloudList",
    query: {},
  },
  {
    title: "市场调研-文件",
    id: "cloud_market_research",
    path: "CloudMarketResearch",
    query: {},
  },
  {
    title: "样品册-文件",
    id: "cloud_catalog",
    path: "CloudMarketResearch",
    query: {search: {busi_type: 'catalog'}},
  },

  // 客户菜单
  {
    title: "客户菜单-产品列表",
    id: "cust_menu_prod_lsit",
    path: "CustMallProd",
    query: {},
  },
  {
    title: "客户菜单-订货会",
    id: "cust_menu_fair",
    path: "FairList",
    query: {},
  },
  {
    title: "客户菜单-B2b客户",
    id: "cust_menu_b2b_cust",
    path: "FairCust",
    query: {},
  },
  {
    title: "客户菜单-B2b订单",
    id: "cust_menu_b2b_order",
    path: "FairOrder",
    query: {},
  },
  // 小b菜单
  {
    title: "小b菜单-订货会",
    id: "xb_fair",
    path: "XbFairList",
    query: {},
  },
  {
    title: "小b菜单-订单",
    id: "xb_order",
    path: "FairOrder",
    query: {},
  },
  // 供应商菜单
  {
    title: "供应商-商品列表",
    id: "vendor_pm_list",
    path: "VendorPmList",
    query: {},
  },
  {
    title: "供应商-采购列表",
    id: "vendor_pu_list",
    path: "VendorPuList",
    query: {},
  },
  {
    title: "供应商-出运跟单",
    id: "vendor_sp_list",
    path: "VendorShippingList",
    query: {},
  },
  {
    title: "供应商-供方交期确认",
    id: "vendor_cfm_crd_list",
    path: "SupConfirmCrdList",
    query: {},
  },
  {
    title: "供应商-货款",
    id: "vendor_busi_fee",
    path: "VendorFeeList",
    query: {},
  },
  {
    title: "供应商-PO回签",
    id: "vendor_sign_po_list",
    path: "VendorSignPoList",
    query: {},
  },
];

export const prod = {
  pm: {
    dflt: 'pm_info,pm_bom,pm_feature,pm_cust',
    parts: [
      {
        title: "商品信息",
        id: "pm_info",
        path: "PmInfo"
      },
      {
        title: "BOM",
        id: "pm_bom",
        path: "PmBom"
      },
      {
        title: "产品特性",
        id: "pm_feature",
        path: "PmFeature"
      },
      {
        title: "客户专属",
        id: "pm_cust",
        path: "PmCustomer"
      },
      {
        title: "关联商品",
        id: "pm_rela_prod",
        path: "PmRelaProd"
      },
      {
        title: "商品可见",
        id: "pm_can_view",
        path: "PmCanView"
      },
      {
        title: "商品可销",
        id: "pm_can_sell",
        path: "PmCanSell"
      },
      {
        title: "商品价格",
        id: "pm_price",
        path: "PmPrice"
      },
      {
        title: "商品配件",
        id: "pm_parts",
        path: "PmParts"
      },
      {
        title: "海关编码",
        id: "pm_hscode",
        path: "PmHscode"
      },
      {
        title: "历史销售",
        id: "pm_sc",
        path: "HistoryOrders",
      },
      {
        title: "历史采购",
        id: "pm_pu",
        path: "StatsPuDetail"
      },
      {
        title: "历史报价",
        id: "pm_qu",
        path: "StatsQuDetail"
      },
      {
        title: "数据日志",
        id: "pm_data_log",
        path: "PmDataLog",
        query: {},
      },
    ]
  },
  qu: {
    dflt: 'qu_prod_info',
    parts: [
      {
        title: "商品信息",
        id: "qu_prod_info",
        path: "QuProdInfo"
      },
      {
        title: "历史销售",
        id: "pm_sc",
        path: "HistoryOrders",
        query: {
          colKey: 'history_sc_prod_table_header'
        }
      },
      {
        title: "历史采购",
        id: "pm_pu",
        path: "StatsPuDetail"
      },
      {
        title: "BOM",
        id: "qu_bom",
        path: "ScBom"
      },
      {
        title: "历史报价",
        id: "pm_qu",
        path: "StatsQuDetail"
      },
    ]
  },
  sc: {
    dflt: 'sc_prod_info',
    parts: [
      {
        title: "商品信息",
        id: "sc_prod_info",
        path: "ScProdInfo"
      },
      {
        title: "历史销售",
        id: "pm_sc",
        path: "HistoryOrders",
        query: {
          colKey: 'history_sc_prod_table_header'
        }
      },
      {
        title: "历史采购",
        id: "pm_pu",
        path: "StatsPuDetail"
      },
      {
        title: "BOM",
        id: "sc_bom",
        path: "ScBom"
      },
      {
        title: "历史报价",
        id: "pm_qu",
        path: "StatsQuDetail"
      },
    ]
  },
  sd: {
    dflt: 'sd_prod_info',
    parts: [
      {
        title: "商品信息",
        id: "sd_prod_info",
        path: "SdProdInfo"
      },
      {
        title: "历史销售",
        id: "pm_sc",
        path: "HistoryOrders",
        query: {
          colKey: 'history_sc_prod_table_header'
        }
      },
      {
        title: "历史采购",
        id: "pm_pu",
        path: "StatsPuDetail"
      },
      {
        title: "BOM",
        id: "sc_bom",
        path: "ScBom"
      },
      {
        title: "历史报价",
        id: "pm_qu",
        path: "StatsQuDetail"
      },
    ]
  },
  pu: {
    dflt: 'pu_prod_info',
    parts: [
      {
        title: "商品信息",
        id: "pu_prod_info",
        path: "PuProdInfo"
      },
      {
        title: "历史销售",
        id: "pm_sc",
        path: "HistoryOrders",
        query: {
          colKey: 'history_sc_prod_table_header'
        }
      },
      {
        title: "历史采购",
        id: "pm_pu",
        path: "StatsPuDetail"
      },
      {
        title: "历史报价",
        id: "pm_qu",
        path: "StatsQuDetail"
      },
    ]
  },
  ps: {
    dflt: 'pm_info',
    parts: [
      {
        title: "商品信息",
        id: "pm_info",
        path: "PmInfo"
      },
    ]
  },
  meet: {
    dflt: 'meeting_prod_info',
    parts: [
      {
        title: "商品信息",
        id: "meeting_prod_info",
        path: "MeetingProdInfo"
      },
    ]
  }
}
