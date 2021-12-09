/* eslint-disable */
// import Store from '@/store'
export default function (Cache) {
  let dataCache = new Cache('/api/manage/queryWareHouse')
  dataCache.fnPretty = function () {
    let datas = this.preDatas.ware_houses || []
    this.datas = datas
  }

  function getAllWareHouse (forced, para) {
    return dataCache.getValue(forced, para).then((v) => {
      return v
    })
  }


  return {
    getAllWareHouse,
    // init: getSysIcons.bind(dataCache)
  }
}