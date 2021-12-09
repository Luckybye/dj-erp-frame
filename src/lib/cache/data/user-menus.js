/* eslint-disable */
import {menus} from '@/lib/menus';
export default function (Cache) {
  let dataCache = new Cache('/api/crm/queryMenu')
  dataCache.fnPretty = function () {
    let datas = this.preDatas.portal_menu || []
    function sortTree (parents, sortMap) {
      if (!parents || !parents.length) return
      for (let i = 0; i < parents.length; i++) {
        let parent = parents[i]
        let sub = sortMap[parent.menu_id]
        sub && (parent.sub = sub.sort((a, b) => a.seq_no - b.seq_no))
        sub && sortTree(parent.sub, sortMap)
      }
    }
    let sortMap = {}
    let arr = []
    let menusMap = menus._object('id')
    for (let i = 0; i < datas.length; i++) {
      datas[i].menu_id = datas[i].cm_menu_id || datas[i].menu_id
      if (datas[i].icon_code) datas[i].icon_code = 'xcon-' + datas[i].icon_code
      let {menu_name: title, menu_name_en: title_en, menu_id: tab_id, menu_code, parent_id, menu_id, icon_code, seq_no} = datas[i]
      let {path, query} = menusMap[menu_code] || {}
      path = path || menu_code
      let item = {title, title_en, tab_id: menu_code || path || tab_id, parent_id, menu_id, path, query, icon_code, seq_no}
      datas[i].path = path || ''
      datas[i].query = query
      if (item.parent_id) {
        let sub = sortMap[item.parent_id] || []
        sub.push(item)
        sortMap[item.parent_id] = sub
      } else {
        arr.push(item)
      }
    }
    sortTree(arr, sortMap)
    arr.sort((a, b) => a.seq_no - b.seq_no)
    this.datas = {portal_menu: arr}
  }

  function getUserMenus (forced, para) {
    return dataCache.getValue(forced, para).then((v) => {
      v = v.portal_menu || []
      return {data: v, pre: dataCache.preDatas.portal_menu, ...dataCache.preDatas}
    })
  }


  return {
    getUserMenus
    // init: dataCache.getValue.bind(dataCache)
  }
}