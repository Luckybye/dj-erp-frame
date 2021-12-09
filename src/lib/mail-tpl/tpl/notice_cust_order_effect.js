export default {
  seq_no: 10,
  mail_type: 'send',
  mail_name: '通知客户订单生效',
  subject: 'Your order %contract_no% is effective',
  html: `Hi %cust_user_name%，

    Your order %contract_no%is effective. 

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
  },
}