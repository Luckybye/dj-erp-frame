/* eslint-disable */
// import Store from '@/store'
export default function (Cache) {
  let dataCache = new Cache('/api/system/queryCurrency')
  dataCache.fnPretty = function () {
    let datas = this.preDatas || {}
    this.datas = datas.currency || []
  }

  function getCurrency (forced) {
    let para = {com_id: window.vglobal.user.partner_com_id || window.vglobal.user.com_id}
    return dataCache.getValue(forced, para).then((v) => {
      return v
    })
  }

  return {
    getCurrency,
    // init: getSysIcons.bind(dataCache)
  }
}