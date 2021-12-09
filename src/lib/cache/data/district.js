/* eslint-disable */
export default function (Cache) {
  let dataCache = new Cache('/api/system/queryDistrict')

  dataCache.fnPretty = function () {
    this.datas = Object.create(null)
    this.datas.sys_districts = this.preDatas.sys_districts || []
  }

  function getDistrict (forced) {
    return dataCache.getValue(forced).then((v) => {
      return v.sys_districts
    })
  }

  return {
    getDistrict,
    // init: dataCache.getValue.bind(dataCache)
  }
}