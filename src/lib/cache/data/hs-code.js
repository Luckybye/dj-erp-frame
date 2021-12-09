/* eslint-disable */
export default function (Cache) {
  // t更改时，会刷新缓存；后台更改的港口数据，浏览器不会自动刷新，加上时间后缀才会刷新
  let t = window.localStorage.getItem('cache_time')
  let url = '/api/support/smartBuffer?cache_type=hs_code'
  if (t) url += `&t=${t}`
  let dataCache = new Cache(url)
  dataCache.fnPretty = function (){
    this.datas = Object.create(null)
    this.datas.values = (this.preDatas.values || []).map(item => {
      item.filter = item.hs_code + '~' + item.hs_name
      return item
    })
    this.datas.values.sort(compareCharCode)
  }

  function compareCharCode (val1, val2) {
    val1 = val1.name || ''
    val2 = val2.name || ''
    val1 = val1.toLowerCase()
    val2 = val2.toLowerCase()
    let length = val1.length > val2.length ? val1.length : val2.length
    for (let i = 0; i < length; i++) {
      let differ = val1.charCodeAt(i) - val2.charCodeAt(i)
      if (differ === 0) {
        continue
      } else {
        if (val1.charAt(i) === '_') {
          return -1
        }
        return differ
      }
    }
  }

  async function getAllHsCode (forced) {
    let {values = []} = await dataCache.getValue(forced)
    return values
  }


  return {
    getAllHsCode,
    init: dataCache.getValue.bind(dataCache)
  }
}