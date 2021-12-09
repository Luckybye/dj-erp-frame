export default {
  seq_no: 19,
  mail_type: 'send',
  mail_name: '通知客户下载单证',
  subject: 'Shipping docs for %inv_no%',
  html: `Hi %cust_user_name%，

    Shipping docs for %inv_no% is completed. You can login and download.

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
    bk_no: {
      text: '订舱号',
      get: v => v.bk_no
    },
    inv_no: {
      text: '订舱发票号',
      get: v => v.inv_no
    },
  },
}