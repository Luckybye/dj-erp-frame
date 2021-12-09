/* eslint-disable */
import Store from '@/store'
export default function (Cache) {
  let dataCache = new Cache('/api/system/currentUserAll')
  let loginCom = {
    isAnHua: '59f7ec0da623fcb4aa298cb6',
    isGHT: '5788f3fb949bc50cf07aff9d',
    isQianCheng: '60025fbafabe8d51f496247d',
    isJandJ: '5965bfa74649945e9098dfc5',
    isSaleswin: '5b33636aa3b13042f85a9d10', //赛捷,
    isMl: '5b9218d26630b1dcf3c4d9ab,5d064fc56eb7c844cfdc2310,5d06500c76ce550363dc2319,5d063388e7e082320b408c0a', //脉链,
    isJxsilk: '5c876a41368205735ba45cba', //嘉兴丝绸
    isJd: '5ea13fcbcfe82880d11c4dca'
  }
  dataCache.fnPretty = function () {
    let datas = this.preDatas || {}
    this.datas = datas

    Object.keys(loginCom).forEach(v => {
      datas[v] = loginCom[v].indexOf(datas.com_id) >= 0
    })
    datas.avatar = ((datas.mg_avatar || [])[0] || {}).url
    Store.dispatch('UserLogin', datas)
  }

  function getUserInfo (forced, para) {
    return dataCache.getValue(forced, para).then((v) => {
      return v
    })
  }

  return {
    getUserInfo,
    // init: getSysIcons.bind(dataCache)
  }
}