export default {
  seq_no: 7,
  mail_type: 'send',
  mail_name: '通知供方确认交期',
  subject: '产品交期确认--订单号%pu_no%',
  html: `%sup_user_name%，

    %link%

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
    sup_user_name: {
      text: '供应商',
      get: v => (v.sup_user_name || '').split(' ')[0] || ''
    },
    link: {
      text: '链接',
      get: v => v.link
    },
    pu_no: {
      text: '采购订单号',
      get: v => v.pu_no
    },
  },
}