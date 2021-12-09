export default {
  seq_no: 4,
  mail_type: 'receive',
  mail_name: '客户询盘通知',
  subject: '您收到一个线上询盘,请及时登陆系统处理',
  html: `%cust_owner%，

    %cust_user_name% 刚刚在官网提交了询价%quote_no%，请登陆后台查看。

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
      get: v => v.cust_user_name
    },
    cust_owner: {
      text: '客户经理',
      get: v => v.cust_owner
    },
    quote_no: {
      text: '报价单号',
      get: v => v.quote_no
    }
  },
}