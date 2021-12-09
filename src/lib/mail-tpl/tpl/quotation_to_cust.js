export default {
  seq_no: 5,
  mail_type: 'send',
  mail_name: '向客户发送报价',
  subject: 'Quotation From %user_com_name%',
  html: `Hi %cust_user_name%，

    Attached please see the quotation
    %link%
    Best Regards
    %busi_user%`.replace(/\n/g, '<br>'),
  variables: {
    user_com_name: {
      text: '集团公司名',
      get: v => v.user_com_name
    },
    cust_user_name: {
      text: '客户名',
      get: v => (v.cust_user_name || '').split(' ')[0] || ''
    },
    busi_user: {
      text: '业务员',
      get: v => v.busi_user
    },
    quote_no: {
      text: '单据号',
      get: v => v.quote_no
    },
    link: {
      text: '链接',
      get: v => `<a href="${v.link}">${v.quote_no}</a>`
    }
  },
}