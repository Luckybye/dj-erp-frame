/* eslint-disable */
import Store from '@/store'
export default function (Cache) {
  let dataCache = new Cache('/api/manage/queryCompanyInfo')
  dataCache.fnPretty = function () {
    Store.dispatch('SetComInfo', this.preDatas || {})
  }

  function getComInfo (forced, para) {
    return dataCache.getValue(forced, para).then((v) => {
      return v || {}
    })
  }


  return {
    getComInfo,
    // init: getSysIcons.bind(dataCache)
  }
}