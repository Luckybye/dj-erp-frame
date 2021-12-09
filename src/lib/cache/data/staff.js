/* eslint-disable */
import {cloneDeep, forEach} from 'lodash'
import store from '@/store'
export default function (Cache) {
  let dataCache = new Cache('/api/manage/staffCache')

  // id: item.busi_group_id + user.user_id,
  //       text: user.user_name || user.user_name_en,
  //       text_en: user.user_name_en || user.user_name,
  //       children: [],
  //       node_type: 'cm_busi_group_user',
  //       parent_id: item.busi_group_id

  dataCache.fnPretty = function () {
    let v = this.preDatas
    let userGroups = v.cm_busi_group_users.toGroup('busi_group_id')
    let usersMap = v.cm_users._object('user_id')

    let me = {...window.vglobal.user, ...store.getters.me}
    let meGroups = (me.busi_groups || [])._object()

    v.cm_busi_groups.forEach(m => {
      m.id = m.busi_group_id
      m.text = m.busi_group_name || m.busi_group_name_en
      m.text_en = m.busi_group_name_en || m.busi_group_name 
      m.parent_id = ''
      m.node_type = 'cm_busi_group'
      m.children = []
      m.filter = m.busi_group_name + '~' + m.busi_group_name_en
      m.disabled = !meGroups[m.id]
      let gu = userGroups[m.busi_group_id] || []
      for (let i = 0; i < gu.length; i++) {
        const f = gu[i];
        if (usersMap[f.user_id]) {
          // m.children || (m.children = [])
          if (usersMap[f.user_id]) {
            usersMap[f.user_id].filter = usersMap[f.user_id].user_name + '~' + usersMap[f.user_id].user_name_en
          }
          let user = {...f, ...usersMap[f.user_id]}
          user.id = user.user_id
          user.text = user.user_name || user.user_name_en
          user.text_en =  user.user_name_en || user.user_name
          user.node_type = 'cm_busi_group_user'
          user.parent_id = f.busi_group_id
          user.disabled = !meGroups[m.id]
          m.children.push(user)
        }
      }
    })
    this.datas = v
  }

  function getAllStaff (forced) {
    return dataCache.getValue(forced).then(function (v) {
      return v.cm_users || []
    })
  }

  function getMyGroupTree (forced) {
    return getAllGroupTree(forced).then(function (allGroups) {
      return allGroups.filter(f => !f.disabled)
    })
  }

  function getAllGroupTree (forced) {
    return dataCache.getValue(forced).then(function (v) {
      return v.cm_busi_groups || []
    })
  }


  return {
    getAllStaff,
    getAllGroupTree,
    getMyGroupTree,
    // init: dataCache.getValue.bind(dataCache)
  }
}