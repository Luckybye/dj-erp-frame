export default {
  seq_no: 16,
  mail_type: 'send',
  mail_name: '通知供方装柜',
  subject: '装柜通知',
  html: `Hi %sup_user_name%，

    Best Regards
    %user_com_name%`.replace(/\n/g, '<br>'),
  variables: {
    user_com_name: {
      text: '集团公司名',
      get: v => v.user_com_name
    },
    sup_user_name: {
      text: '供应商',
      get: v => (v.sup_user_name || '').split(' ')[0] || ''
    },
    busi_user: {
      text: '业务员',
      get: v => v.busi_user
    },
  },
}