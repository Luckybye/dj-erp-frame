export default {
  seq_no: 3,
  mail_type: 'receive',
  mail_name: '客户注册通知',
  subject: '你收到一条收官网注册信息,请及时登陆系统处理',
  html: `%cust_user_name%，

    %cust_user_mail% 刚刚在官网注册了账号,请登陆后台查看。

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
    cust_com_name: {
      text: '客户名',
      get: v => v.cust_com_name
    },
    cust_user_mail: {
      text: '客户账号',
      get: v => v.cust_user_mail
    }
  },
}