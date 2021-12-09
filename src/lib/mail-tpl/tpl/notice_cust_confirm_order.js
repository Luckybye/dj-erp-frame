export default {
  seq_no: 9,
  mail_type: 'send',
  mail_name: '通知客户确认订单',
  subject: 'Order confirmation %contract_no% %user_com_name%',
  html: `Hi %cust_user_name%，

    Please login website and confirm the order %contract_no%
    %link%
    Best Regards
    %user_com_name%`.replace(/\n/g, '<br>'),
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
      get: v => (v.cust_user_name || '').split(' ')[0] || ''
    },
    contract_no: {
      text: '订单单号',
      get: v => v.contract_no
    },
    link: {
      text: '链接',
      get: v => v.link
    },
  },
}