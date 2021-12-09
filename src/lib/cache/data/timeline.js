/* eslint-disable */
// import Store from '@/store'
// import Vue from 'vue';
import linesMap from '@/lib/timeline'
import {i18n} from '@/lang';
export default function (Cache) {
  let dataCache = new Cache('/api/support/getConfigure')
  dataCache.fnPretty = function ({type}) {
    let map = linesMap[type]
    if (!map || !map.line_key) return []
    let field = map.line_key

    let datas = (this.preDatas || {})[field] || []
    let obj = datas._object('key')
    if (!this.datas) this.datas = {}
    let langs = {en: {}, cn: {}}
    this.datas[field] = map.timelines.map(m => {
      let v = obj[m.key] || {}
      let rst = {
        ...m,
        ...v,
        path: m.part,
        disabled: false,
        disabled_text: '',
        visible: false,
      }
      langs.en[m.part] = rst.name_en
      langs.cn[m.part] = rst.name
      return rst
    }).filter(f => f.isSelected)
    i18n.mergeLocaleMessage('en', {cmpt: langs.en})
    i18n.mergeLocaleMessage('cn', {cmpt: langs.cn})
  }

  async function getTimeline (type, forced) {
    let map = linesMap[type]
    if (!map || !map.line_key) return []
    let field = map.line_key
    let para = {
      instance: window.vglobal.user.com_id,
      field,
      type
    }
    if (dataCache.datas && dataCache.datas[field]) {
      return dataCache.datas[field]
    } else forced = true
    return (await dataCache.getValue(forced, para))[field]
  }

  return {
    getTimeline,
    // init: getSysIcons.bind(dataCache)
  }
}