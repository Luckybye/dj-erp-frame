/* eslint-disable */
export default function (Cache) {
  let dataCache = new Cache('/api/b2b/queryDicCountries')

  dataCache.fnPretty = function () {
    this.datas = Object.create(null)
    this.datas.countries = this.preDatas.countries.map(m => {
      return {
        ...m,
        filter: m.name + '~' + m.name_en + '~' + m.code
      }
    })
  }

  function getAllCountry (forced) {
    return dataCache.getValue(forced).then((v) => {
      return v.countries
    })
  }

  return {
    getAllCountry,
    // init: dataCache.getValue.bind(dataCache)
  }
}