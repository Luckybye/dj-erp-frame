export default {
  seq_no: 9,
  mail_type: 'receive',
  mail_name: '客户确认订单通知',
  subject: '产品交期确认--订单号%contract_no%',
  html: `客户%cust_user_name%已确认订单%contract_no%，请及时处理`,
  variables: {
    user_com_name: {
      text: '集团公司名',
      get: v => v.user_com_name
    },
    busi_user: {
      text: '业务员',
      get: v => v.busi_user
    },
    cust_user_name: {
      text: '客户名',
      get: v => v.cust_user_name
    },
    contract_no: {
      text: '订单单号',
      get: v => v.contract_no
    }
  },
}