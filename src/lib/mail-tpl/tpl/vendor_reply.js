export default {
  seq_no: 16,
  mail_type: 'send',
  mail_name: 'Vendor Reply',
  subject: 'Vendor Reply',
  html: `<div>
          <div>Dear,</div>
          <div>Please see this link as below:</div>
          <div><a href="%SELF_LINK1%">%fore_no%</a></div>
          <div>If any question, feel free to let me know.</div>
          <div>Best Regards</div>
          <div>%busi_user%</div></div>`.replace(/\n/g, '<br>'),
  variables: {
    url: {
      text: '链接',
      get: v => v.url
    },
    fore_no: {
      text: '编号',
      get: v => v.fore_no
    },
    busi_user: {
      text: '业务员',
      get: v => v.busi_user
    },
  },
}