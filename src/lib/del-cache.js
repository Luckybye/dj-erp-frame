/* eslint-disable */
import {get} from '@/utils/request'
class Cache {
  constructor(url) {
    this.url = url
  }

  datas = null

  preDatas = null

  fnPretty = null

  async getValue(force, para) {
    if (force || !this.datas) {
      this.preDatas = await get(this.url, para, {loading: false})
      this.fnPretty && this.fnPretty()
    }
    return Promise.resolve([this.datas || this.preDatas, this.preDatas])
  }
}

let sortCache = new Cache('/api/product/sortCache')
let custComCache = new Cache('/api/crm/custComCache?fresh=1')
let countryCache = new Cache('/api/b2b/queryDicCountries')
let staffCache = new Cache('/api/manage/staffCache')
let hsCache = new Cache('/api/support/smartBuffer?cache_type=hs_code')
let myCompanyLegalCache = new Cache('/api/manage/queryMyCompanyLegal')
let portCache = new Cache('/api/support/smartBuffer?cache_type=country_info')

sortCache.fnPretty = function () {
  function sortTree (parents, sortMap) {
    if (!parents || !parents.length) return
    for (let i = 0; i < parents.length; i++) {
      let parent = parents[i]
      let children = sortMap[parent.sort_id]
      children && (parent['children'] = children.sort((a, b) => ((a.seq_no || 0) - (b.seq_no || 0))))
      children && sortTree(parent.children, sortMap)
    }
  }
  let sorts = this.preDatas.prod_sorts || []
  let sortMap = {}
  let arr = []
  for (let i = 0; i < sorts.length; i++) {
    let item = sorts[i]
    Object.assign(item, {children: [], id: item.sort_id})
    item.text = item.sort_name
    item.text_en = item.sort_name_en
    if (item.parent_id) {
      let children = sortMap[item.parent_id] || []
      children.push(item)
      sortMap[item.parent_id] = children
    } else {
      arr.push(item)
    }
  }
  sortTree(arr, sortMap)
  this.datas = {prod_sorts: arr};
}

function getAllSort (type, forced) {
  return sortCache.getValue(forced).then(([v]) => {
    v = v.prod_sorts || []
    if (type === 'all') return v
    if (type === 'other') return v.filter(m => m.sort_type && m.sort_type !== 'product')
    return v.filter(m => !m.sort_type || m.sort_type === 'product')
  })
}

portCache.fnPretty = function () {
  const values = this.preDatas.data || []
  let datas = []
  for (let i = 0; i < values.length; i++) {
    let country = values[i]
    let ports = country.ports || []
    for (let j = 0; j < ports.length; j++) {
      let port = ports[j]
      let v = {
        country_name: country.name,
        country_code: country.code,
        country_name_cn: country.name_cn,
        port_name: port.name + '-' + country.code,
        port_name_cn: port.name_cn + '-' + country.code
      }
      port.fuzzyText = country.name + '~' + country.name_cn + '~' + '~'+ v.port_name + '~' + port.name_cn + '~' + port.port_code
      Object.assign(port, v)
      datas.push(port)
    }
  }
  datas.sort((a, b) => {
    if (b.port_name > a.port_name) return -1
    return 1
  })
  this.datas = datas
}

function getAllHarbour (forced) {
  return countryCache.getValue(forced).then(function ([v]) {
    return v
  })
}

export default function () {
  return function () {
    return {
      getAllSort,
      getMallSortById,
      getPreSort,
      getAllHarbour
    }
  }
}