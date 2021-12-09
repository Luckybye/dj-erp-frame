export default {
  seq_no: 15,
  mail_type: 'send',
  mail_name: '通知客户订舱',
  subject: '订舱通知',
  html: `Hi %cust_user_name%，

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