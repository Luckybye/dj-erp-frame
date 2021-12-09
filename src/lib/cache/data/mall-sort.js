/* eslint-disable */
// import Store from '@/store'
export default function (Cache) {
  let dataCache = new Cache('/api/b2b/mallSort')
  dataCache.fnPretty = function () {
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
      Object.assign(item, {id: item.sort_id})
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

  function getMallSort (type, forced) {
    return dataCache.getValue(forced, {com_id: window.sell_com_id}).then((v) => {
      v = v.prod_sorts || []
      if (type === 'all') return v
      if (type === 'other') return v.filter(m => m.sort_type && m.sort_type !== 'product')
      return v.filter(m => !m.sort_type || m.sort_type === 'product')
    })
  }
  function getPreMallSort (type, forced) {
    return dataCache.getValue(forced, {com_id: window.sell_com_id}).then(v => {
      return dataCache.preDatas.prod_sorts
    })
  }
  
  function getMallSortById (id, forced) {
    return dataCache.getValue(forced, {com_id: window.sell_com_id}).then(v => {
      v = v.prod_sorts || []
      let pre = dataCache.preDatas.prod_sorts || []
      let result = []
      let children = []
  
      let findSelf = (id) => {
        let m = pre.find(f => f.sort_id === id)
        m && result.push(m)
        if (m && m.parent_id) findSelf(m.parent_id)
      }
  
      let findChildren = (p) => {
        let arr = p.children
        if (!arr || !arr.length) return
        let m = arr.find(f => f.sort_id === id)
        if (m) {
          children = m.children || []
          return
        }
        for (let i = 0; i < arr.length; i++) {
          findChildren(arr[i] || {})
          if (children.length) break
        }
      }
  
      if (id) findSelf(id)
  
      let l = result.length
      if (l && result[l - 1]) {
        let m = result[l - 1]
        result[l - 1] = v.find(f => f.sort_id === m.sort_id) || m
        findChildren({children: v})
      }
      return {
        data: {...result[0], children},
        parent: result.reverse(),
        all: v
      }
    })
  }

  return {
    getMallSort,
    getMallSortById,
    getPreMallSort,
    // init: dataCache.getValue.bind(dataCache)
  }
}