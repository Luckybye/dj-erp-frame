let all = [
  {en: 'open', cn: '待提交', filter: ['qu', 'sc', 'po']},
  {en: 'cancel', cn: '已撤销', filter: ['sc', 'po']},

  {en: 'quoted', cn: '已报价', filter: ['qu']},
  {en: 'auditing', cn: '审批中', filter: ['qu', 'sc', 'po']},
  {en: 'reject', cn: '审批不通过', filter: []}, // 'sc', 'po'
  {en: 'unchoice', cn: '未备货', filter: ['sc', 'sc_prod']},
  {en: 'normal', cn: '未出运', filter: []},
  {en: 'to_be_shipping', cn: '未出运', filter: ['sc']},
  {en: 'finish', cn: '已出运', filter: ['sc']},
  {en: 'unship', cn: '未发货', filter: ['po']},
  {en: 'shipping', cn: '部分发货', filter: ['po']},
  {en: 'shipped', cn: '已发货', filter: ['po']},

  {en: 'abandon', cn: '已作废', filter: []}, // 'sc', 'po'
  {en: 'pass', cn: '审批通过', filter: []}, // 'sc', 'po'

  { cn: '未计划', en: 'to_be_plan', filter: ['ship_plan'] },
  { cn: '待提交', en: 'pu_to_confirm', filter: [] },
  { cn: '未订舱', en: 'to_be_book', filter: ['ship_plan'] },
  { cn: '出运中', en: 'be_shipping', filter: ['ship_plan'] },
  { cn: '待装箱', en: 'bk_to_load', filter: [] },

  { cn: '未采购', en: 'to_be_purchased', filter: ['sc_prod'] },
  { cn: '未出运', en: 'to_be_shipping', filter: ['sc_prod'] },
  { cn: '已出运', en: 'shipped', filter: ['sc_prod', 'ship_plan'] },

  { cn: '未入库', en: 'un_invein', filter: ['po_prod'] },
  { cn: '未出库', en: 'un_inveout', filter: ['po_prod'] },
  { cn: '已出库', en: 'inveout', filter: ['po_prod'] },

  { cn: '取消出运', en: 'ship_cancelled', filter: ['abnormal'] },
  { cn: '拆分出运', en: 'ship_split', filter: ['abnormal'] },
  { cn: '延期出运', en: 'ship_delayed', filter: ['abnormal'] },
  { cn: '采购作废', en: 'pu_cancelled', filter: ['abnormal'] },

  // { cn: '待装箱', en: 'bk_to_load', filter: [] },
  // { cn: '待报关', en: 'bk_to_decl', filter: [] },
  // { cn: '待提单', en: 'bk_to_bl', filter: [] },
  // { cn: '待结算', en: 'bk_to_st', filter: [] },
  // { cn: '待议付', en: 'bk_to_ng', filter: [] },
  // {en: 'finish', cn: '已完成', filter: []},

  { cn: '未订舱', en: 'no_shipping_space', filter: ['bk'] },
  { cn: '未发货', en: 'no_send_out', filter: ['bksn'] },
  { cn: '未验货', en: 'bk_to_qc', filter: ['bk'] },
  { cn: '未装柜', en: 'no_on_board', filter: ['bk', 'bksn'] },
  { cn: '未结算', en: 'no_settlement', filter: ['bk', 'bksn'] },
  { cn: '未报关', en: 'no_declaration', filter: ['bk'] },
  { cn: '未提单', en: 'no_lading_bill', filter: ['bk'] },
  { cn: '未议付', en: 'no_negotiation', filter: ['bk'] },
  { cn: '已议付', en: 'negotiated', filter: ['bk'] },
  { cn: '未开票', en: 'un_billed', filter: ['bksn'] },
  { cn: '已开票', en: 'in_voiced', filter: ['bksn'] },
  { cn: '已制证', en: 'is_account', filter: ['bk'] }
]
export default function billStatus (filter) {
  if (!filter) return all
  return all.filter(m => m.filter.indexOf(filter) > -1)
}
