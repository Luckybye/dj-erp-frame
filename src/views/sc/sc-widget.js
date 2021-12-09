export const billStatus = [
  {
    text: '未提交',
    text_en: 'pending',
    key: 'open',
    extend: {bill_status: 'open'},
  },
  {
    text: '审批中',
    text_en: 'In approval',
    key: 'auditing',
    extend: {audit_status: 'auditing'},
  },
  {
    text: '审批不通过',
    text_en: 'Approval reject',
    key: 'reject',
    extend: {audit_status: 'reject'},
  },
  {
    text: '已撤销',
    text_en: 'Cancel',
    key: 'cancel',
    extend: {bill_status: 'cancel', audit_status: 'normal'},
  },
  {
    text: '已生效',
    text_en: 'Submitted',
    key: 'normal',
    extend: {bill_status: 'normal'},
  },
  {
    text: '未发货',
    text_en: 'Unshipped',
    key: 'unship',
    extend: {bill_status: 'normal', ship_status: 'unship'},
  },
  {
    text: '部分发货',
    text_en: 'Partial shipment',
    key: 'shipping',
    extend: {bill_status: 'normal', ship_status: 'shipping'},
  },
  {
    text: '已发货',
    text_en: 'Shipped',
    key: 'shipped',
    extend: {bill_status: 'normal', ship_status: 'shipped'},
  },
  {
    text: '已删除',
    text_en: 'Delete',
    key: 'delete',
    extend: {status: 'delete'},
  },
  {
    text: '已作废',
    text_en: 'abandon',
    key: 'abandon',
    extend: {status: 'normal', bill_status: 'abandon'},
  },
]

export function getStatus (row) {
  let temp = this.billStatus.findLast(f => {
    return f.extend && Object.keys(f.extend).every(k => row[k] === f.extend[k])
  }) || {}
  this.$set(row, 'x_status', temp.key)
  return this.$tt(temp, 'text')
}