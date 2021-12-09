/* eslint-disable */
import {get2} from '@/utils/request';
export default function (Cache) {
  let dataCache = new Cache('/api/support/getConfigures')
  let portalId = ''
  dataCache.fnPretty = function ({type}) {
    let field = 'aside_menus'
    this.datas = (this.preDatas || {})[field] || {}
  }

  async function queryPortalId () {
    if (portalId) return portalId
    let v = await get2('/api/crm/queryPortal', null, {cache: 10})
    let sys = v.sys_portal || {}
    let cm = v.cm_portal || {}
    portalId = [cm.cm_portal_id, sys.sys_portal_id].filter(f => f)
    if (window.vglobal.user.role === '1') portalId = [sys.sys_portal_id]
    return portalId
  }

  async function getAsideMenu (forced) {
    await queryPortalId()
    let field = 'aside_menus'
    let para = {
      instance: portalId,
      field,
    }
    return await dataCache.getValue(forced, para)
  }

  return {
    getAsideMenu,
    queryPortalId
    // init: getSysIcons.bind(dataCache)
  }
}