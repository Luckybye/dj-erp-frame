// 单据号组成，识别码+时间戳+流水号
// 单据类型：mtg, qu, sc, bk(出运计划), mf(生产计划), inq, ar, pu, im_bk, ap, invin, invout

// 识别码
const custCodes = [
  {label: '客户ERP号', value: 'erp_no'},
  {label: '客户代码', value: 'cust_code'},
]
const supCodes = [
  {label: '供应商识别码', value: 'erp_no'},
  {label: '供应商代码', value: 'cust_code'},
]
const serviceCodes = [
  {label: '服务机构代码', value: 'cust_code'},
]
const userCodes = [
  {label: '法人代码', value: 'legal_no'},
  {label: '工作组代码', value: 'group_no'},
]
const firstNO = {
  text: {
    label: '文本',
    value: 'text',
  },
  code: {
    label: '编码组合',
    value: 'code',
  },
  inherit: {
    label: '继承',
    value: 'inherit',
  },
}
// 时间戳
const secondNO = [
  {
    label: '2位年度，如21',
    value: 'YY',
    type: 'check'
  },
  {
    label: '2位年+2位月，如2108',
    value: 'YYMM',
    type: 'check'
  }
]
// 流水号
const threeNO = [
  {
    label: '2位流水号',
    value: 'SS',
    type: 'check'
  },
  {
    label: '3位流水号',
    value: 'SSS',
    type: 'check'
  },
  {
    label: '4位流水号',
    value: 'SSSS',
    type: 'check'
  },
]
// 单据
// first: [firstNO.text, firstNO.erp, firstNO.group_cust, firstNO.group, firstNO.cust],
const firstNOAll = Object.values(firstNO)
const firstNO2 = [firstNO.text, firstNO.code]
export let bill = {
  mtg: {
    filter: 'sc',
    label: 'Meeting',
    codes: [...custCodes, ...userCodes],
    first: firstNO2,
    second: secondNO,
    three: threeNO,
    editable: true,
  },
  qu: {
    filter: 'sc',
    label: '报价',
    codes: [...custCodes, ...userCodes],
    first: firstNO2,
    second: secondNO,
    three: threeNO,
    editable: true,
  },
  sc: {
    filter: 'sc',
    label: '销售订单',
    codes: [...custCodes, ...userCodes],
    first: firstNO2,
    second: secondNO,
    three: threeNO,
    editable: true,
  },
  sd: {
    filter: 'sc',
    label: '内销订单',
    codes: [...custCodes, ...userCodes],
    first: firstNO2,
    second: secondNO,
    three: threeNO,
    editable: true,
  },
  de: {
    filter: 'sc',
    label: '可发货清单',
    codes: [...custCodes, ...userCodes],
    first: firstNOAll,
    second: secondNO,
    three: threeNO,
    editable: true,
  },
  bk: {
    filter: 'sc',
    label: '订舱',
    codes: [...custCodes, ...userCodes],
    first: firstNOAll,
    second: secondNO,
    three: threeNO,
    editable: true,
  },
  ar1: {
    filter: 'sc',
    label: '预收',
    codes: [...custCodes, ...userCodes],
    first: firstNOAll,
    second: secondNO,
    three: threeNO
  },
  ar9: {
    filter: 'sc',
    label: '应收',
    codes: [...custCodes, ...userCodes],
    first: firstNOAll,
    second: secondNO,
    three: threeNO
  },
  forecast: {
    filter: 'sc',
    label: 'Forecast',
    codes: [...custCodes, ...userCodes],
    first: firstNO2,
    second: secondNO,
    three: threeNO,
    editable: true,
  },

  inq: {
    filter: 'pu',
    label: '询价',
    codes: [...supCodes, ...userCodes],
    first: firstNO2,
    second: secondNO,
    three: threeNO,
    editable: true,
  },
  pu: {
    filter: 'pu',
    label: '采购订单',
    codes: [...supCodes, ...userCodes],
    first: firstNOAll,
    second: secondNO,
    three: threeNO,
    editable: true,
  },
  new_pu: {
    filter: 'pu',
    label: '新建采购',
    codes: [...supCodes, ...userCodes],
    first: firstNO2,
    second: secondNO,
    three: threeNO,
    editable: true,
  },
  im_pu: {
    filter: 'pu',
    label: '进口采购',
    codes: [...supCodes, ...userCodes],
    first: firstNO2,
    second: secondNO,
    three: threeNO,
    editable: true,
  },
  im_bk: {
    filter: 'pu',
    label: '进口订舱',
    codes: [...userCodes],
    first: firstNOAll,
    second: secondNO,
    three: threeNO,
    editable: true,
  },
  mf: {
    filter: 'pu',
    label: '生产计划',
    codes: [...userCodes],
    first: firstNOAll,
    second: secondNO,
    three: threeNO,
    editable: false,
  },
  ap1: {
    filter: 'pu',
    label: '预付',
    codes: [...supCodes, ...userCodes],
    first: firstNOAll,
    second: secondNO,
    three: threeNO
  },
  ap9: {
    filter: 'pu',
    label: '应付',
    codes: [...supCodes, ...userCodes],
    first: firstNOAll,
    second: secondNO,
    three: threeNO
  },
  af: {
    filter: 'pu',
    label: '物流',
    codes: [...serviceCodes, ...userCodes],
    first: firstNOAll,
    second: secondNO,
    three: threeNO
  },

  invein: {
    filter: 'inve',
    label: '入库',
    text: 'VI',
    codes: [...userCodes],
    first: firstNO2,
    second: secondNO,
    three: threeNO,
    editable: true,
  },
  inveout: {
    filter: 'inve',
    label: '出库',
    text: 'VO',
    codes: [...userCodes],
    first: firstNO2,
    second: secondNO,
    three: threeNO,
    editable: true,
    desc: '特别说明：以上配置为自主创建出库单时编号规则；根据出运计划生成的出库，取出运计划编号 + N'
  },

}