/* eslint-disable */
// import Store from '@/store'
export default function (Cache) {
  let dataCache = new Cache('/api/b2b/queryCompanyBrandList')
  dataCache.fnPretty = function () {
    let datas = this.preDatas.company_brands || []
    this.datas = datas.map(m => {
      m.x_disabled = m.busi_status === 'stop'
      m.id = m.brand_id
      m.text = m.brand_name
      m.text_en = m.brand_name_en
      m.filter = m.brand_name + '~' + m.brand_name_en
      return m
    })
  }

  function getAllBrands (forced, para) {
    return dataCache.getValue(forced, para).then((v) => {
      return v
    })
  }

  function getBrands (forced, para) {
    return dataCache.getValue(forced, para).then((v) => {
      return v.filter(f => !f.x_disabled)
    })
  }


  return {
    getAllBrands,
    getBrands,
    // init: getSysIcons.bind(dataCache)
  }
}