export default {
  seq_no: 6,
  mail_type: 'receive',
  mail_name: '客户下单通知',
  subject: '您收到一个线上订单,请及时登陆系统处理',
  html: `%order_busi_user%，

    %cust_user_name% 刚刚在官网提交了订单%contract_no%, 请登陆后台查看

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
    order_busi_user: {
      text: '订单业务员',
      get: v => v.order_busi_user
    },
    contract_no: {
      text: '订单单号',
      get: v => v.contract_no
    }
  },
}