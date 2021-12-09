export default {
  seq_no: 21,
  mail_type: 'send',
  mail_name: '向客户发送%type_name%',
  subject: '%catalog_name%',
  html: `Hi %cust_user_name%，

    Please see products we recommend for you as below:
    <a href="%catalog_url%">%catalog_name%</a>
    <a href="%catalog_url%" draggable="true"><img draggable="false" src="%cover_img%" width="300px"></a>

    Best Regards
    %user_name%`.replace(/\n/g, '<br>'),
  variables: {
    type_name: {
      text: '类型名称',
      get: v => v.cata_type === 'research' ? '新品调研' : '电子册'
    },
    user_com_name: {
      text: '集团公司名',
      get: v => v.user_com_name
    },
    user_legal_name: {
      text: '子公司名',
      get: v => v.user_legal_name
    },
    busi_user: {
      text: '业务员',
      get: v => v.busi_user
    },
    cust_user_name: {
      text: '客户名',
      get: v => (v.cust_user_name || '').split(' ')[0] || ''
    },
    user_name: {
      text: '当前登录者',
      get: v => v.user_name
    },
    cover_img: {
      text: '电子册封面',
      get: v => v.cover_img || 'http://dex3.oss-cn-hangzhou.aliyuncs.com/18/9/19/543315_5ba1b541d27de6abda226a75_d4645230e001.png'
    },
    catalog_name: {
      text: '电子册名称',
      get: v => v.catalog_name || '电子册'
    },
    catalog_url: {
      text: '电子册链接',
      get: v => v.catalog_url
    },
  },
}