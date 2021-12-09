export default {
  seq_no: 2,
  mail_type: 'send',
  mail_name: '通知客户注册成功',
  subject: 'Registration completed',
  html: `Hi %cust_user_name%，

    Your registration on %user_com_name% is completed. You can login now with the below account:


    Website：%com_mall_website%
    Account：%cust_user_mail%
    Password：%cust_user_password%
    User Guide for reference: %mall_help_manual%

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
    com_mall_website: {
      text: '公司官网网址',
      get: v => v.com_mall_website
    },
    cust_user_mail: {
      text: '客户账号',
      get: v => v.cust_user_mail
    },
    cust_user_password: {
      text: '客户密码',
      get: v => v.cust_user_password
    },
    mall_help_manual: {
      text: '官网帮助手册',
      get: v => v.cust_mall_help_manual
    },
  },
}