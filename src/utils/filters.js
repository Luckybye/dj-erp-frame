/* eslint-disable */

import moment from 'dayjs'
import BillStatus from '@/lib/bill-status.js'

import Vue from 'vue'

const quarterOfYear = require('dayjs/plugin/quarterOfYear')
moment.extend(quarterOfYear)

// console.log(moment(202003, 'YYYYMM').add(1, 'month').format('YYYYMM'), 88888888888)

let allStatus
export function billStatus (field, type = 'all') {
  allStatus = allStatus || {
    all: BillStatus()._object('en') || {},
    bk: BillStatus('bk')._object('en') || {},
    sc: BillStatus('sc')._object('en') || {},
    po: BillStatus('po')._object('en') || {}
  }
  if (!field) return 'error'
  field = field.split(',')
  field = field[field.length - 1]
  field = field.toLowerCase()
  let all = allStatus[type] || allStatus.all || {}
  // console.log(all, field, '3333333333')
  return (all[field] || {}).cn || 'error'
}

export function EDIStatus (n) {
  const statusMap = {
    open: '未发送',
    normal: '已发送',
    finish: '处理成功',
    error: '处理失败'
  }
  return statusMap[n] || ''
}

export function timeFormat (time, format, lang) {
  if (time) {
    if (format === 'abbr') {
      let tempTime = new Date(time)
      let year = new Date()
      if (year.getYear() === tempTime.getYear()) {
        format = 'MM-DD'
      } else {
        format = 'YYYY-MM-DD'
      }
    }
    format = format || 'YYYY-MM-DD'
    let mm = moment(time)
    // zh-cn
    if (lang) mm.locale(lang)
    return mm.format(format)
  }
  return ''
}

export function formatTime (time) {
  if (time) {
    let now = new Date()
    let date = new Date(time)
    if (now.setHours(0, 0, 0, 0) === date.setHours(0, 0, 0, 0)) {
      return moment(time).format('HH:mm')
    } else if (date.getYear() === now.getYear()) {
      return moment(time).format('MM-DD')
    } else {
      return moment(time).format('YYYY-MM-DD')
    }
  }
  return ''
}
export function formatChatTime (time) {
  if (time) {
    let now = new Date()
    let date = new Date(time)
    if (now.setHours(0, 0, 0, 0) === date.setHours(0, 0, 0, 0)) {
      return moment(time).format('HH:mm')
    } else if (date.getYear() === now.getYear()) {
      return moment(time).format('MM-DD HH:mm')
    } else {
      return moment(time).format('YYYY-MM-DD HH:mm')
    }
  }
  return ''
}
export function imgFormat (url, params) {
  const defaultImg = ''
  url = url || defaultImg
  if (!params) return url
  if (!Vue.prototype.$h.isImg(url) || !Vue.prototype.$h.isOssFile(url)) return url
  let v = {
    pre: 'resize,m_pad,h_15,w_20',
    min: 'resize,m_pad,h_40,w_40',
    small: 'resize,m_pad,h_80,w_80',
    middle: 'resize,m_pad,h_200,w_200',
    normal: 'resize,m_pad,h_300,w_300',
    large: 'resize,m_pad,h_500,w_500',
    list: 'resize,m_pad,h_140,w_200',
    biglist: 'resize,m_pad,h_280,w_400',
    lfit_100: 'resize,m_lfit,w_100',
    lfit_200: 'resize,m_lfit,w_200',
    lfit_800: 'resize,m_lfit,w_800',
    lfit_1000: 'resize,m_lfit,w_1000',
    pad_100: 'resize,m_pad,h_100,w_100',
  }
  if (Object.keys(v).indexOf(params) >= 0) params = v[params]
  url = ossDirect(url)
  return url + '?x-oss-process=image/' + params
}

export function currencyFormat (field) {
  if (!field) return ''
  let v = {
    CNY: '￥',
    EUR: '€',
    GBP: '￡',
    USD: '$'
  }
  field = field.toUpperCase()
  return v[field] || field
}

/**
 * 数字格式转换成千分位
 */
export function formatCurrency (num) {
  return ('' + num).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export function ossDirect (url) {
  let {protocol} = location
  url = url.replace(/^https:/, protocol)
  if (!url) return ''
  if (/(mldex|mldoc|mlmail|mltmp)\./.test(url)) {
    url = url.replace(/oss-cn-hangzhou.aliyuncs.com/, 'merit-link.com')
  } else url = url.replace(/oss-cn-hangzhou.aliyuncs.com/, 'wokelink.com')
  return url
}

/**
 * 数字格式转换成千分位，同时继承toFixed
 */
export function fthousands (v, n) {
  if (!v) return v
  v = v + ''
  if (n > -1) v = v.toFixed(n) + ''
  let s = v.split('.')
  let d = Number(s[1]) >= 0 ? '.' + s[1] : ''
  return s[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + d
}

export function mailType (f) {
  let obj = {
    send: '发',
    receive: '收'
  }
  return obj[f] || f
}

export function approveStatus (n) {
  const statusMap = {
    normal: '未提交',
    auditing: '审批中',
    pass: '已生效',
    reject: '未通过',
    to_pay: '已审核',
    check_failed: '审核未通过(财务)',
    to_make: '已付款',
    made: '已制证',
    no: "未审批",
    initial: "未审批",
    approval: "审批中",
    agree: "审批通过",
  }
  return statusMap[n] || ''
}

// string,number,boolean,method,regexp,integer,float,array,object,enum,date,url,hex,email,any
const validTip = {
  require: 'Require',
  required: 'Require',
  number: '请输入正确的数字',
  boolean: 'Invalid boolean',
  method: 'Invalid method',
  regexp: 'Invalid regexp',
  integer: '请输入整数',
  float: 'Invalid float',
  array: 'Invalid array',
  object: 'Invalid object',
  enum: 'Invalid enum',
  date: 'Invalid date',
  url: 'Invalid url',
  hex: 'Invalid hex',
  email: '请输入正确的邮箱'
}
export function fRules (n) {
  if (!n) return
  const arr = n.split(',')
  return arr.reduce((pre, k) => {
    const message = validTip[k]
    if (message) {
      pre.push(
        {
          type: k.replace('required', 'string').replace('require', 'string'),
          required: k.indexOf('require') >= 0,
          message,
          trigger: ['blur', 'change']
        }
      )
    }
    return pre
  }, [])
}

export function brandType (f) {
  const map = {
    company: '自营',
    supplier: '代理',
    customer: 'OEM',
  }
  return map[f] || map.company
}

export function tplFmt (f) {
  const statusMap = {
    'cust_prod': '客户商品',
    'bill_quote': '报价',
    'bill_contract': '订单',
    'bill_shipping': '装运通知单',
    'bill_purchase': '采购合同',
    'bill_cipl_contract': '议付处sc单据',
    'bill_bk_sc': '议付处sc单据',
    'bill_approve': 'sc审批单',
    'bill_loading': '装箱明细',
    'bill_cipl': '议付单据模板',
    'ml_bill_cipl': '议付单据模板',
    'bill_booking': '订舱单',
    'bill_inquiry': '询价单',
    'bill_booked_sc': '已出运订单',
    'bill_unbook_sc': '未出运订单',
    'bill_vat': '开票',
    'stats_sup': '供应商统计',
    'new_stats_sup': '供应商统计',
    'stats_sc_prod_quantity': '订单销售量统计',
    'stats_sc_prod_amount': '订单销售额统计',
    'stats_qu': '报价统计',
    'stats_pu': '采购统计',
    'stats_pu_prod': '采购商品统计',
    'stats_pm_prod': '公司商品统计',
    'new_stats_pm_prod': '销售产品统计',
    'stats_par': '年度出货对比',
    'stats_cust_rank': '客户排名统计',
    'stats_cust_prod_sort_rank': '客户商品分类排名统计',
    'stats_cust_prod_rank': '客户商品排名统计',
    'stats_cust_prod_level_rank': '客户商品等级排名统计',
    'stats_area_sc': '区域销售统计',
    'bill_shippingplan_list': '出运计划',
    'bill_shipping_plan': '出运计划',
    'bill_shipping_detail': '出运详情',
    'bill_pn': '销售清单',
    'bill_nonwood': 'nonwood',
    'bill_customs_invoice': '报关',
    'ml_delivery_notice': '出运通知',
    'bill_delivery_notice': '出运通知',
    'bill_customs_export': '客户公司',
    'bill_cust_info': '客户联系人',
    'bill_commission': '佣金',
    'bill_export_goods': '出运',
    'bill_book_ship': '出运',
    'bill_payment': '费用',
    'shop_browse_log': '官网日志',
    'shipping_plan_list': '出运计划',
    'book_trace': '生产跟踪单',
    'purchase_sign': 'PO回签',
    'bookorder_notice': '订舱',
  }
  return statusMap[f] || f || ''
}

export function stockType (n) {
  const statusMap = {
    'manufacture': '生产领料',
    'other_out': '其他出库',
    'sell': '销售出库',
    'purchase': '采购入库',
    'make': '生产入库',
    'other_in': '其他入库',
    'assy': '组装',
    'assy_in': '组装入库',
    'assy_out': '组装出库'
  }
  return statusMap[n] || ''
}

const statusMap = {
  'purchase': '采购',
  'inventory': '入库',
  'undo': '不备货',
}
export function stockType2 (n) {
  return statusMap[n] || '入库'
}

const statusMap2 = {
  'purchase': '采购',
  'inventory': '库存',
  'undo': '不备货',
}
export function stockType3 (n) {
  return statusMap2[n]
}