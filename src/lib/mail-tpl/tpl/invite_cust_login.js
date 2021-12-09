export default {
  seq_no: 1,
  mail_type: 'send',
  mail_name: '邀请客户注册',
  subject: 'Invitation From %user_com_name%',
  html: `Hi %cust_user_name%，

    To improve our service quality, we’ve create your account to login in Merit-link official business website, where you’re able to :
    1. View latest products
    2. Send inquiry or place order online
    3. Review your order history and check delivery status


    Website：%com_mall_website%
    Account：%cust_user_mail%
    Before login, please set the login password through the following link：%cust_user_password%
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
      get (v) {
        return v.com_mall_website
      }
    },
    cust_user_mail: {
      text: '客户账号',
      get: v => v.cust_user_mail
    },
    cust_user_password: {
      text: '设置密码链接',
      get: v => v.cust_user_password
    },
    mall_help_manual: {
      text: '官网帮助手册',
      get: v => v.cust_mall_help_manual
    },
  },
}