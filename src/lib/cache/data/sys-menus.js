/* eslint-disable */
export default function (Cache) {
  let dataCache = new Cache('/api/direct?url=' + window.encodeURIComponent('/api/b2b/querySysMenu'))
  dataCache.fnPretty = function () {
    let datas = this.preDatas.sys_menus || []
    function sortTree (parents, sortMap) {
      if (!parents || !parents.length) return
      for (let i = 0; i < parents.length; i++) {
        let parent = parents[i]
        let children = sortMap[parent.menu_id]
        children && (parent.children = children.sort((a, b) => a.seq_no - b.seq_no))
        children && sortTree(parent.children, sortMap)
      }
    }
    let sortMap = {}
    let arr = []
    for (let i = 0; i < datas.length; i++) {
      let item = datas[i]
      Object.assign(item, {children: [], menu_id: item.menu_id})
      if (item.parent_id) {
        let children = sortMap[item.parent_id] || []
        children.push(item)
        sortMap[item.parent_id] = children
      } else {
        arr.push(item)
      }
    }
    sortTree(arr, sortMap)
    arr.sort((a, b) => a.seq_no - b.seq_no)
    this.datas = {sys_menus: arr}
  }

  function getSysMenus (forced, para) {
    return dataCache.getValue(forced, para).then((v) => {
      v = v.sys_menus || []
      return {data: v, pre: dataCache.preDatas.sys_menus}
    })
  }


  return {
    getSysMenus
    // init: dataCache.getValue.bind(dataCache)
  }
}