export default {
  seq_no: 17,
  mail_type: 'send',
  mail_name: '通知业务员溢短装处理',
  subject: '%inv_no%溢短装确认',
  html: `Hi %busi_user%，

    Below please find the loading manifest for %inv_no%

    Best Regards
    %user_com_name%`.replace(/\n/g, '<br>'),
  variables: {
    user_com_name: {
      text: '集团公司名',
      get: v => v.user_com_name
    },
    busi_user: {
      text: '业务员',
      get: v => (v.busi_user || '').split(' ')[0] || ''
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