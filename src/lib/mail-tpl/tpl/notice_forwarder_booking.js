export default {
  seq_no: 14,
  mail_type: 'send',
  mail_name: '通知货代订舱',
  subject: '订舱通知',
  html: `Hi %forwarder_user_name%，

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
    forwarder_user_name: {
      text: '货代通知人',
      get: v => (v.forwarder_user_name || '').split(' ')[0] || ''
    },
  },
}