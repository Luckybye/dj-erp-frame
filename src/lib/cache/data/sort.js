/* eslint-disable */
export default function (Cache) {
  let dataCache = new Cache('/api/product/sortCache')
  dataCache.fnPretty = function () {
    function sortTree (parents, sortMap, p = {}) {
      if (!parents || !parents.length) return
      for (let i = 0; i < parents.length; i++) {
        let parent = parents[i]
        parent.full_id = [...(p.full_id || []), parent.id]
        let children = sortMap[parent.sort_id]
        children && (parent['children'] = children.sort((a, b) => ((a.seq_no || 0) - (b.seq_no || 0))))
        children && sortTree(parent.children, sortMap, parent)
      }
    }
    let sorts = this.preDatas.prod_sorts || []
    let sortMap = {}
    let arr = []
    for (let i = 0; i < sorts.length; i++) {
      let item = sorts[i]
      item.id = item.sort_id
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
    arr.sort((a, b) => ((a.seq_no || 0) - (b.seq_no || 0)))
    this.datas = {prod_sorts: arr};
  }

  function getAllSort (type, forced) {
    return dataCache.getValue(forced).then((v) => {
      v = v.prod_sorts || []
      if (type === 'all') return v
      if (type === 'other') return v.filter(m => m.sort_type && m.sort_type !== 'product')
      return v.filter(m => !m.sort_type || m.sort_type === 'product')
    })
  }

  function getPreSort (type, forced) {
    return dataCache.getValue(forced).then((v) => {
      v = dataCache.preDatas.prod_sorts || []
      if (type === 'all') return v
      if (type === 'other') return v.filter(m => m.sort_type && m.sort_type !== 'product')
      return v.filter(m => !m.sort_type || m.sort_type === 'product')
    })
  }


  return {
    getAllSort,
    getPreSort,
    // init: dataCache.getValue.bind(dataCache)
  }
}