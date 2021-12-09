/* eslint-disable */
// import Store from '@/store'
export default function (Cache) {
  let dataCache = new Cache('/api/system/querySysNature')
  const sign = '+'
  dataCache.fnPretty = function () {
    let datas = this.preDatas.sys_natures || []
    this.datas = datas.map(m => {
      m.id = m.nature_id
      m.nature_name = sign + m.nature_name
      m.nature_name_en = sign + m.nature_name_en
      m.text = m.nature_name
      m.text_en = m.nature_name_en
      m.filter = m.nature_name + '~' + m.nature_name_en
      return m
    })
  }

  function getAllNatures (forced, para) {
    return dataCache.getValue(forced, para).then((v) => {
      return v
    })
  }

  function getNatures (forced, para) {
    return dataCache.getValue(forced, para).then((v) => {
      return v.filter(f => f.nature_kind === 'prod')
    })
  }

  function getAttrs (forced, para) {
    return dataCache.getValue(forced, para).then((v) => {
      return v.filter(f => f.nature_kind !== 'prod')
    })
  }


  return {
    getAllNatures,
    getNatures,
    getAttrs,
    // init: getSysIcons.bind(dataCache)
  }
}