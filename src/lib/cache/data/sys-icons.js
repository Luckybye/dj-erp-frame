/* eslint-disable */
import Store from '@/store'
export default function (Cache) {
  let dataCache = new Cache('/api/direct?url=' + window.encodeURIComponent('/api/b2b/querySysIcon'))
  dataCache.fnPretty = function () {
    let datas = this.preDatas.sys_icons || []
    let map = {}
    for (let i = 0; i < datas.length; i++) {
      const m = datas[i];
      map['xcon-' + m.icon_code] = {url: m.icon_url, icon_name: m.icon_name, icon_code: m.icon_code}
      m.text = m.icon_code + '~' + m.icon_name + '~' + m.remark
    }
    this.datas = {sys_icons: datas}
    Store.dispatch('SetIcons', map)
  }

  function getSysIcons (forced, para) {
    return dataCache.getValue(forced, para).then((v) => {
      v = v.sys_icons || []
      return {data: v, pre: dataCache.preDatas.sys_icons}
    })
  }


  return {
    getSysIcons,
    init: getSysIcons.bind(dataCache)
  }
}