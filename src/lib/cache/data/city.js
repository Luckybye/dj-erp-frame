/* eslint-disable */
export default function (Cache) {
  let dataCache = new Cache('/api/support/smartBuffer?cache_type=city_info')

  dataCache.fnPretty = function () {
    this.datas = Object.create(null)
    this.datas = this.preDatas.values || []
  }

  function getAllCity (forced) {
    return dataCache.getValue(forced).then((v) => {
      return v
    })
  }

  return {
    getAllCity,
    // init: dataCache.getValue.bind(dataCache)
  }
}