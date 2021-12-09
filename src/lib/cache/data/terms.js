/* eslint-disable */
// import Store from '@/store'
import Vue from 'vue';
export default function (Cache) {
  let dataCache = new Cache('/api/support/getConfigure')
  dataCache.fnPretty = function () {
    let datas = this.preDatas || {}
    this.datas = (datas.trade_term_setting || Vue.prototype.$constant('tradeTerm')).map(m => {
      m.key = m.key || m.value
      return m
    })
  }

  function getTerms (forced) {
    let para = {
      instance: window.vglobal.user.com_id,
      field: 'trade_term_setting'
    }
    return dataCache.getValue(forced, para).then((v) => {
      return v
    })
  }

  return {
    getTerms,
    // init: getSysIcons.bind(dataCache)
  }
}